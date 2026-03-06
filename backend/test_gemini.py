from google import genai
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Get API key
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ ERROR: GEMINI_API_KEY not found in .env file!")
    exit(1)

print(f"✅ API Key loaded: {api_key[:20]}...")

# Create client
client = genai.Client(api_key=api_key)

print("\n🧪 Testing Gemini API...")
print("─" * 50)

# Test 1: Simple question
print("\nTest 1: Simple Question")
print("Question: What is 2+2?")

response = client.models.generate_content(
    model='models/gemini-2.5-flash',
    contents='What is 2+2?'
)
print(f"Response: {response.text}")

# Test 2: Food nutrition lookup (what we'll use)
print("\n" + "─" * 50)
print("\nTest 2: Food Nutrition Lookup")
print("Food: 2 boiled eggs")

prompt = """
You are a nutrition expert. Analyze this food item and return ONLY a JSON response.

Food: "2 boiled eggs"

Required JSON format (return ONLY this, no other text):
{
  "food_name": "2 Large Eggs (Boiled)",
  "calories": 143,
  "protein": 13,
  "carbs": 1,
  "fat": 10,
  "fiber": 0
}
"""

response = client.models.generate_content(
    model='models/gemini-2.5-flash',
    contents=prompt
)
print(f"Raw Response:\n{response.text}")

try:
    # Try to parse as JSON
    response_text = response.text.strip()
    
    # Remove markdown code blocks if present
    if response_text.startswith('```'):
        lines = response_text.split('\n')
        response_text = '\n'.join(lines[1:-1])  # Remove first and last line
        if response_text.startswith('json'):
            response_text = response_text[4:].strip()
    
    data = json.loads(response_text)
    print(f"\n✅ Parsed JSON successfully:")
    print(f"   Food: {data['food_name']}")
    print(f"   Calories: {data['calories']}")
    print(f"   Protein: {data['protein']}g")
    print(f"   Carbs: {data['carbs']}g")
    print(f"   Fat: {data['fat']}g")
    print(f"   Fiber: {data['fiber']}g")
except json.JSONDecodeError as e:
    print(f"⚠️  Could not parse JSON: {e}")
    print("But API is working! We'll handle this in the actual code.")

print("\n" + "─" * 50)
print("✅ All tests completed!")
print("🎉 Gemini API is working correctly!")
print(f"📝 Using model: models/gemini-2.5-flash")