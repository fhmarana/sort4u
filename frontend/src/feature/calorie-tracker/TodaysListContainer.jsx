import React from 'react';
import { Trash2 } from 'lucide-react';

export default function TodaysListContainer({ items, onRemoveItem }) {
  const now = new Date();
  const currentDate = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const totalCalories = items.reduce((sum, i) => sum + i.calories, 0);

  return (
    <div className="bg-gray-100 rounded-3xl flex flex-col font-mono" style={{ minHeight: '750px' }}>

      {/* Receipt body */}
      <div className="px-6 py-4 flex-1 flex flex-col">

        {/* Store name / header */}
        <div className="text-center mb-4">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Daily Food Log</p>
          <h2 className="text-xl font-bold tracking-widest uppercase">TODAY'S RECEIPT</h2>
          <p className="text-xs text-gray-500 mt-1">{currentDate}</p>
          <p className="text-xs text-gray-400">{currentTime}</p>
        </div>

        {/* Dashed divider */}
        <div className="border-t border-dashed border-gray-400 mb-4" />

        {/* Column headers */}
        <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-400 mb-2 px-1">
          <span>Item</span>
          <span className='mr-5.5'>Cal</span>
        </div>

        {/* Items */}
        <div className="flex-1">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <p className="text-sm">— no items yet —</p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={item.id} className="group flex items-start justify-between gap-2 px-1 py-0.5 hover:bg-gray-200 rounded transition-colors">
                  <div className="flex items-start gap-2 flex-1 min-w-0 text-sm">
                    <span className=" text-gray-400 mt-0.5 shrink-0">{String(index + 1).padStart(2, '0')}.</span>
                    <span className=" text-gray-800 leading-snug wrap-break-word">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-semibold text-gray-700">{item.calories} </span>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dashed divider */}
        <div className="border-t border-dashed border-gray-400 mt-4 mb-3" />

        {/* Total */}
        <div className="flex justify-between items-center px-1 mb-1">
          <span className="text-sm font-bold uppercase tracking-wider">Total</span>
          <span className="text-sm font-bold">{totalCalories} kcal</span>
        </div>
        <div className="flex justify-between items-center px-1 text-[10px] text-gray-400">
          <span>{items.length} item{items.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Dashed divider */}
        <div className="border-t border-dashed border-gray-400 mt-3 mb-4" />

        {/* Footer */}
        <div className="text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">Thank you for tracking!</p>
          <p className="text-[10px] text-gray-300 mt-1">* * * * * * * * * *</p>
        </div>
      </div>

    </div>
  );
}
