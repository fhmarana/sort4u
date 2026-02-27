import React, { useState } from 'react';
import { Flame, Flag, Utensils } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import CalorieHistoryModal from './CalorieHistoryModal';

export default function CalorieStatsContainer({ 
  baseGoal, 
  foodCount, 
  totalCalories, 
  macros, 
  onUpdateBaseGoal,
  history 
}) {
  const [showHistory, setShowHistory] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [editGoalValue, setEditGoalValue] = useState(baseGoal);

  const handleGoalSave = () => {
    onUpdateBaseGoal(parseInt(editGoalValue) || 2890);
    setIsEditingGoal(false);
  };

  // --- RECHARTS DATA ---
  // If calories exceed goal, we cap the progress bar at 100% 
  // but keep the text showing the real number.
  const chartData = [
    { name: 'Consumed', value: Math.min(totalCalories, baseGoal) },
    { name: 'Remaining', value: Math.max(0, baseGoal - totalCalories) }
  ];

  const COLORS = ['#c1eac0', 'rgba(255, 255, 255, 0.2)'];

  return (
    <>
      <div className="bg-gray-400 p-6 rounded-3xl shadow-md text-white">
        {/* Top Header Stats */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Flag className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase opacity-80">Base Goal</p>
              {isEditingGoal ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    value={editGoalValue}
                    onChange={(e) => setEditGoalValue(e.target.value)}
                    className="w-20 px-2 py-0.5 bg-white text-gray-800 rounded text-sm font-bold outline-none"
                    autoFocus
                  />
                  <button onClick={handleGoalSave} className="text-xs font-bold underline">Save</button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsEditingGoal(true)} 
                  className="text-lg font-black hover:opacity-70 transition-opacity"
                >
                  {baseGoal.toLocaleString()}
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase opacity-80">Food Count</p>
              <p className="text-lg font-black">{foodCount}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col xl:grid xl:grid-cols-2 gap-8 items-center">
          
          {/* RECHARTS PIE CHART CONTAINER */}
          <div className="relative w-full aspect-square max-w-[260px] md:max-w-[300px] mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="75%"
                  outerRadius="90%"
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={10}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Absolute Centered Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <Flame className="w-8 h-8 mb-1 text-white opacity-90" />
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Calories</p>
              <p className="text-5xl md:text-6xl font-black leading-none">{totalCalories}</p>
            </div>
          </div>

          {/* Macro Grid */}
          <div className="w-full space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 gap-3">
              {['protein', 'carbs', 'fat', 'fiber'].map((macro) => (
                <div 
                  key={macro} 
                  className="bg-white p-3 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center"
                >
                  <p className="text-[10px] font-bold text-gray-400 uppercase leading-tight">{macro}</p>
                  <p className="text-base lg:text-lg font-black text-gray-800 leading-tight">
                    {macros?.[macro] || 0}g
                  </p>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setShowHistory(true)}
              className="w-full py-3 bg-white/20 hover:bg-white/40 text-white rounded-full transition-all font-bold text-xs uppercase tracking-widest border border-white/10"
            >
              View History
            </button>
          </div>
        </div>
      </div>

      {showHistory && (
        <CalorieHistoryModal 
          onClose={() => setShowHistory(false)} 
          history={history} 
        />
      )}
    </>
  );
}