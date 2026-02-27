import React, { useState } from 'react';

export default function AddFoodContainer({ onAddFood }) {
  const [foodInput, setFoodInput] = useState('');

  const handleSubmit = () => {
    if (foodInput.trim()) {
      onAddFood(foodInput);
      setFoodInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="w-full mx-auto bg-[#E5E7EB] rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={foodInput}
          onChange={(e) => setFoodInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="What did you eat?(e.g., grilled chicken breast)"
          className="w-full px-6 py-4 bg-[#D1D5DB] rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-600 text-base"
        />
        
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-[#4B5563] hover:bg-[#374151] text-white rounded-2xl font-semibold text-lg transition-all active:scale-[0.98] shadow-md"
        >
          Add
        </button>
      </div>
    </div>
  );
}