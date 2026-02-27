import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function CalorieHistoryModal({ onClose, history = {} }) {
  const historyArray = Object.entries(history || {})
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const todayKey = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 h-full">
      <div className="w-full max-w-2xl flex flex-col">
        <h1 className="text-4xl font-bold text-center text-white mb-8">Calorie Tracker History</h1>
        
        <button onClick={onClose} className="flex items-center gap-2 text-white mb-4 self-start ml-4">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="bg-[#D9D9D9] rounded-[3rem] p-10 flex flex-col min-h-[650px] max-h-[85vh]">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold uppercase tracking-widest">History</h2>
            <div className="w-full border-t-2 border-dotted border-gray-400 mt-4"></div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-8 pr-2">
            {historyArray.length > 0 ? (
              historyArray.map((day) => (
                <div key={day.date}>
                  <h3 className="text-lg font-bold mb-3">
                    {day.date === todayKey ? "Today" : day.date.split('-').reverse().join('/')}
                  </h3>

                  <div className="space-y-2 mb-4">
                    {day.items.map((item, idx) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <span className="font-medium">{String(idx + 1).padStart(2, '0')}. {item.name}</span>
                        <span className="text-[#5B8C5A] font-bold">{item.calories} kcal</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-end mt-2">
                    <div className="flex gap-3 text-gray-500 text-[13px] font-bold">
                      <span>Protein {day.macros.protein}g</span>
                      <span>Carbs {day.macros.carbs}g</span>
                      <span>Fat {day.macros.fat}g</span>
                      <span>Fiber {day.macros.fiber}g</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black mr-2">TOTAL CALORIES</span>
                      <span className="text-xl font-bold text-[#5B8C5A]">{day.totalCalories}</span>
                    </div>
                  </div>
                  <div className="w-full border-t-2 border-dotted border-gray-400 mt-6"></div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-20">No history logged yet.</p>
            )}
          </div>

          <div className="mt-auto pt-6">
             <div className="w-full border-t-2 border-dotted border-gray-400 mb-4"></div>
             <p className="text-center text-sm text-gray-600 italic">Thank you for tracking!</p>
          </div>
        </div>
      </div>
    </div>
  );
}