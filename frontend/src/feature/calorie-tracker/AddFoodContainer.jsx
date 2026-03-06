import React, { useState } from 'react';
import { Flame, Loader2 } from 'lucide-react';

export default function AddFoodContainer({ onAddFood }) {
  const [foodInput, setFoodInput] = useState('');
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLookup = async () => {
    if (!foodInput.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/calorie-tracker/lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ food_input: foodInput.trim() })
      });
      if (!res.ok) {
        let detail = 'Failed to fetch nutrition info';
        try { const err = await res.json(); detail = err.detail || detail; } catch (e) { void e; }
        throw new Error(detail);
      }
      setNutritionData(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetch('/calorie-tracker/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(nutritionData)
      });
      if (!res.ok) {
        let detail = 'Failed to save food entry';
        try { const err = await res.json(); detail = err.detail || detail; } catch (e) { void e; }
        throw new Error(detail);
      }
      const savedEntry = await res.json();
      onAddFood(savedEntry);
      setNutritionData(null);
      setFoodInput('');
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNutritionData(null);
    setError('');
  };

  return (
    <div className="bg-gray-200 rounded-3xl p-8">

      {/* Input field */}
      <input
        type="text"
        value={foodInput}
        onChange={(e) => setFoodInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && !nutritionData && !loading && handleLookup()}
        disabled={!!nutritionData || loading}
        placeholder="What did you eat? (e.g., grilled chicken breast)"
        className="w-full px-4 py-3 bg-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-600 disabled:opacity-60 disabled:cursor-default"
      />

      {/* Error */}
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      {/* State 1: Search button */}
      {!nutritionData && (
        <button
          onClick={handleLookup}
          disabled={loading || !foodInput.trim()}
          className="w-full px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Looking up nutrition...
            </>
          ) : 'Add Food'}
        </button>
      )}

      {/* State 2: Nutrition preview */}
      {nutritionData && (
        <div className='text-center'>
          <hr className="border-t-2 border-dashed border-gray-400 my-4" />

          {/* Food name */}
          <p className="font-bold text-gray-800 text-2xl mb-3">{nutritionData.food_name}</p>

          {/* Calorie badge */}
          <div className="flex justify-center mb-3 mt-6">
            <span className="inline-flex items-center justify-center gap-1 bg-orange-100 text-orange-700 border border-orange-200 w-28.5 h-9.25 rounded-lg text-sm font-semibold">
              <Flame className="w-3.5 h-3.5" />
              {nutritionData.calories} kcal
            </span>
          </div>

          {/* Nutrient badges */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center items-center ">
            {[
              { label: 'Protein', value: nutritionData.protein },
              { label: 'Carbs',   value: nutritionData.carbs   },
              { label: 'Fiber',   value: nutritionData.fiber   },
              { label: 'Fat',     value: nutritionData.fat     },
            ].map(({ label, value }) => (
              <span key={label} className="bg-gray-300 text-black w-28.5 h-9.25 rounded-lg text-lg flex items-center justify-center gap-1">
                <span className="font-bold">{value}g</span> {label}
              </span>
            ))}
          </div>

          {/* Cancel / Confirm */}
          <div className="flex gap-3 mt-8.5">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-4 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Add Food
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
