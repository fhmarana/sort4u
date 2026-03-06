import React, { useState, useEffect } from 'react';
import { Flame, Flag, Utensils, Pencil } from 'lucide-react';
import CalorieHistoryModal from './CalorieHistoryModal';

export default function CalorieStatsContainer({
  baseGoal,
  foodCount,
  totalCalories,
  macros,
  onUpdateBaseGoal
}) {
  const [showHistory, setShowHistory] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [editGoalValue, setEditGoalValue] = useState(baseGoal);

  // Sync edit value when baseGoal loads from backend
  useEffect(() => {
    setEditGoalValue(baseGoal);
  }, [baseGoal]);

  const handleGoalSave = () => {
    const newGoal = parseInt(editGoalValue) || 2000;
    onUpdateBaseGoal(newGoal);
    setIsEditingGoal(false);
  };

  const handleGoalCancel = () => {
    setEditGoalValue(baseGoal);
    setIsEditingGoal(false);
  };

  // Circle calculations
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const progress = (totalCalories / baseGoal) * circumference;

  return (
    <>
      <div className="bg-gray-200 rounded-4xl p-4">
        {/* Top Section - Base Goal & Food */}
        <div className="flex justify-between items-start mb-4 lg:mb-8">
          {/* Base Goal */}
          <div className="flex items-start gap-3">
            <Flag className="w-5 h-5 lg:w-6 lg:h-6 mt-1" />
            <div>
              <p className="text-sm lg:text-base font-medium text-gray-800">Base Goal</p>
              {isEditingGoal ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    value={editGoalValue}
                    onChange={(e) => setEditGoalValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGoalSave()}
                    className="w-20 lg:w-24 px-2 py-1 bg-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 text-lg lg:text-xl font-semibold"
                    autoFocus
                  />
                  <button
                    onClick={handleGoalSave}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleGoalCancel}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingGoal(true)}
                  className="flex items-center gap-1.5 text-xl lg:text-2xl font-semibold hover:text-gray-600 transition-colors"
                >
                  {baseGoal?.toLocaleString()}
                  <Pencil className="w-3.5 h-3.5 lg:w-4 lg:h-4 opacity-50" />
                </button>
              )}
            </div>
          </div>

          {/* Food Count */}
          <div className="flex items-start gap-3">
            <Utensils className="w-5 h-5 lg:w-6 lg:h-6 mt-1" />
            <div>
              <p className="text-sm lg:text-base font-medium text-gray-800">Food</p>
              <p className="text-xl lg:text-2xl font-semibold">{foodCount}</p>
            </div>
          </div>
        </div>

        {/* Main Layout: stacked on mobile, side-by-side on desktop */}
        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-1">

          {/* Circle Display */}
          <div className="relative w-52 h-52 sm:w-64 sm:h-64 lg:w-80 lg:h-80 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 320 320">
              {/* Background Circle */}
              <circle
                cx="160"
                cy="160"
                r={radius}
                stroke="#d1d5db"
                strokeWidth="20"
                fill="none"
              />
              {/* Progress Circle */}
              <circle
                cx="160"
                cy="160"
                r={radius}
                stroke="#4b5563"
                strokeWidth="20"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - Math.min(progress, circumference)}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Flame className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mb-1 lg:mb-3 text-gray-700" />
              <p className="text-xs sm:text-sm lg:text-base font-semibold text-gray-700 uppercase tracking-wider mb-1 lg:mb-2">
                Total Calories
              </p>
              <p className="text-4xl sm:text-5xl lg:text-7xl font-bold">{totalCalories}</p>
            </div>
          </div>

          {/* Macro Display + History Button */}
          <div className="w-full lg:flex-1 space-y-3 lg:space-y-4">
            {/* Macro Boxes — 4 columns on tablet, 2x2 on phone/desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
              <div className="px-2 py-3 bg-gray-400 rounded-xl flex flex-col items-center justify-center">
                <p className="text-sm lg:text-base font-bold">{macros.protein}g Protein</p>
              </div>
              <div className="px-2 py-3 bg-gray-400 rounded-xl flex flex-col items-center justify-center">
                <p className="text-sm lg:text-base font-bold">{macros.carbs}g Carbs</p>
              </div>
              <div className="px-2 py-3 bg-gray-400 rounded-xl flex flex-col items-center justify-center">
                <p className="text-sm lg:text-base font-bold">{macros.fat}g Fat</p>
              </div>
              <div className="px-2 py-3 bg-gray-400 rounded-xl flex flex-col items-center justify-center">
                <p className="text-sm lg:text-base font-bold">{macros.fiber}g Fiber</p>
              </div>
            </div>

            {/* Calorie History Button */}
            <button
              onClick={() => setShowHistory(true)}
              className="w-full px-3 py-3 bg-gray-400 hover:bg-gray-500 rounded-xl transition-colors font-semibold text-sm lg:text-base"
            >
              Calorie History
            </button>
          </div>
        </div>
      </div>

      {/* History Modal */}
      {showHistory && (
        <CalorieHistoryModal onClose={() => setShowHistory(false)} />
      )}
    </>
  );
}
