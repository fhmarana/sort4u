from google import genai
import os
import json
import re
import asyncio
from fastapi import HTTPException
from dotenv import load_dotenv


# Load the environment
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

client = genai.Client(api_key=api_key)

MODEL_NAME = "models/gemini-2.5-flash"


def parse_json_response(response_text: str) -> dict:
    """
    Extract and parse JSON from Gemini response
    Handles markdown code blocks and malformed responses
    
    Args:
        response_text: Raw response from Gemini
    
    Returns:
        dict: Parsed JSON data
    
    Raises:
        HTTPException: If JSON cannot be parsed
    """
    try:
        # Try direct JSON parse
        return json.loads(response_text)
        
    except json.JSONDecodeError:
        # Try to extract JSON from markdown code blocks
        # Pattern 1: ```json ... ```
        json_match = re.search(r'```json\s*(\{.*?\})\s*```', response_text, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group(1))
            except json.JSONDecodeError:
                pass
        
        # Pattern 2: ``` ... ```
        json_match = re.search(r'```\s*(\{.*?\})\s*```', response_text, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group(1))
            except json.JSONDecodeError:
                pass
        
        # Pattern 3: Find any JSON object in text
        json_match = re.search(r'\{.*?\}', response_text, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group(0))
            except json.JSONDecodeError:
                pass
        
        # Give up
        raise HTTPException(
            status_code=500,
            detail="Unable to parse nutritional data. Please try again."
        )


def validate_nutrition_data(data: dict) -> None:
    """
    Ensure all required fields exist and are valid
    
    Args:
        data: Nutrition data to validate
    
    Raises:
        HTTPException: If validation fails
    """
    required_fields = ["food_name", "calories", "protein", "carbs", "fat", "fiber"]
    
    # Check all fields exist
    for field in required_fields:
        if field not in data or data[field] is None:
            raise HTTPException(
                status_code=500,
                detail=f"Incomplete nutritional data received. Missing: {field}"
            )
    
    # Ensure numeric values are actually numbers
    try:
        data["calories"] = float(data["calories"])
        data["protein"] = float(data["protein"])
        data["carbs"] = float(data["carbs"])
        data["fat"] = float(data["fat"])
        data["fiber"] = float(data["fiber"])
    except (ValueError, TypeError) as e:
        raise HTTPException(
            status_code=500,
            detail="Invalid nutritional data format. Please try again."
        )
    
    # Ensure food_name is a string
    if not isinstance(data["food_name"], str) or not data["food_name"].strip():
        raise HTTPException(
            status_code=500,
            detail="Invalid food name received. Please try again."
        )


async def call_gemini_api(food_input: str) -> dict:
    prompt = f"""
        You are a nutrition expert. Analyze this food item and return ONLY a JSON response.

        Food: "{food_input}"

        Instructions:
        1. If no portion/quantity specified, use average serving size
        2. If general food (e.g., "chicken"), assume most common preparation (e.g., "grilled chicken breast")
        3. Be specific in food_name (e.g., "2 Large Eggs (Boiled or Poached)")
        4. If food is not recognized or invalid, return: {{"error": "Food not recognized"}}

        Required JSON format (return ONLY this, no other text, no markdown):
        {{
        "food_name": "2 Large Eggs (Boiled or Poached)",
        "calories": 143,
        "protein": 13,
        "carbs": 1,
        "fat": 10,
        "fiber": 0
        }}

        All numeric values should be numbers (not strings).
        Return ONLY the JSON, no markdown code blocks, no explanation.
    """

    try:
        response = await asyncio.wait_for(
            asyncio.to_thread(
                client.models.generate_content,
                model=MODEL_NAME,
                contents=prompt
            ),
            timeout=10.0
        )

        response_text = response.text.strip()

        data = parse_json_response(response_text)

        # Check if food was recognized
        if "error" in data:
            raise HTTPException(
                status_code=400,
                detail="Food not recognized. Please try a different description (e.g., 'grilled chicken', '2 boiled eggs')."
            )

        # Validate required fields
        validate_nutrition_data(data)

        return data

    except asyncio.TimeoutError:
        raise HTTPException(
            status_code=503,
            detail="Service temporarily unavailable. Please try again in a moment."
        )

    except HTTPException:
        # Re-raise HTTP exceptions
        raise

    except Exception as e:
        # Log error (you can add proper logging here)
        print(f"Gemini API error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process food item. Please try again."
        )
