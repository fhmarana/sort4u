import React from 'react';
import { Utensils, X } from 'lucide-react'; // Added X icon for a cleaner mobile UI

export default function TodaysListContainer({ items, onRemoveItem }) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-gray-200 rounded-2xl sm:rounded-3xl p-4 sm:p-8 flex flex-col min-h-[500px] lg:min-h-[750px] w-full max-w-2xl mx-auto shadow-sm">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 flex-shrink-0">
        <h2 className="text-xl sm:text-2xl font-bold mb-1 tracking-tight">TODAY'S LIST</h2>
        <p className="text-sm sm:text-base text-gray-600">{currentDate}</p>
        <div className="w-full border-t-2 border-dotted border-gray-400 mt-4"></div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 py-10">
            <Utensils className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-lg sm:text-xl font-medium mb-1">No items yet</p>
            <p className="text-sm">Add some food to start tracking</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 sm:p-3 bg-gray-300 rounded-xl sm:rounded-lg hover:bg-gray-400/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-200 rounded-full sm:bg-transparent sm:p-0">
                    <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="font-medium text-gray-800">{item.name}</span>
                    {item.calories > 0 && (
                      <span className="text-xs sm:text-sm text-gray-500 sm:ml-2">
                        {item.calories} kcal
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 -mr-2 text-gray-500 hover:text-red-600 transition-colors"
                  aria-label="Remove item"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Text */}
      <div className="mt-6 pt-4 border-t-2 border-dotted border-gray-400 flex-shrink-0">
        <p className="text-center text-xs sm:text-sm text-gray-500 italic">
          "Thank you for tracking your calories today!"
        </p>
      </div>
    </div>
  );
}