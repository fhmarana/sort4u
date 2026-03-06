import React, { useState, useEffect } from 'react';
import { X, Flame, ChevronDown, ChevronUp } from 'lucide-react';

const authHeader = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

function DayCard({ day }) {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(day.date + 'T00:00:00');
  const label = date.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  const macros = [
    { label: 'Protein', value: day.total_protein },
    { label: 'Carbs',   value: day.total_carbs   },
    { label: 'Fat',     value: day.total_fat      },
    { label: 'Fiber',   value: day.total_fiber    },
  ];

  return (
    <div className="bg-gray-100 rounded-2xl overflow-hidden">
      {/* Day header row */}
      <button
        onClick={() => setExpanded(prev => !prev)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-200 transition-colors"
      >
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-2xl font-bold">{Math.round(day.total_calories)}</span>
            <span className="text-sm text-gray-500 ml-0.5">kcal</span>
          </div>
        </div>
        {expanded
          ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
          : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
        }
      </button>

      {/* Macro totals — always visible */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-5 pb-4 mt-2">
        {macros.map(({ label, value }) => (
          <div key={label} className="bg-gray-200 rounded-xl py-2 flex flex-col items-center">
            <span className="text-sm font-bold">{Math.round(value)}g</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">{label}</span>
          </div>
        ))}
      </div>

      {/* Expandable food items list */}
      {expanded && day.entries.length > 0 && (
        <div className="border-t border-gray-200 px-5 py-3 space-y-1">
          {day.entries.map((entry, i) => (
            <div key={entry.id} className="flex justify-between items-center text-sm py-0.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] text-gray-400 shrink-0">{String(i + 1).padStart(2, '0')}.</span>
                <span className="text-gray-700 truncate">{entry.food_name}</span>
              </div>
              <span className="text-gray-500 shrink-0 ml-2">{Math.round(entry.calories)} kcal</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CalorieHistoryModal({ onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/calorie-tracker/history?days=30', { headers: authHeader() })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load history');
        return res.json();
      })
      .then(data => setHistory(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-6 lg:p-8 w-full max-w-2xl max-h-[85vh] flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center mb-6 shrink-0">
          <div>
            <h2 className="text-2xl font-bold">Calorie History</h2>
            <p className="text-xs text-gray-400 mt-0.5">Last 30 days — tap a day to see items</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 space-y-3 pr-1">
          {loading && (
            <div className="text-center text-gray-400 py-12">Loading history...</div>
          )}

          {error && (
            <div className="text-center text-red-500 py-12">{error}</div>
          )}

          {!loading && !error && history.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              <p className="text-lg mb-1">No history yet</p>
              <p className="text-sm">Start tracking food and your history will appear here.</p>
            </div>
          )}

          {!loading && !error && history.map(day => (
            <DayCard key={day.date} day={day} />
          ))}
        </div>
      </div>
    </div>
  );
}
