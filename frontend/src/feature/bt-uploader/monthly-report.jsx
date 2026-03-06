import React, { useState, useEffect } from 'react';

export default function MonthlyReportModal({ isOpen, onClose, summary }) {
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const token = localStorage.getItem('token');
        const r = await fetch('/budget/history', { headers: { Authorization: `Bearer ${token}` } });
        setHistory(r.ok ? await r.json() : []);
      } catch {
        setHistory([]);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
  const formatPeso = (v) => `₱${Number(v || 0).toLocaleString()}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md max-h-[90vh] flex flex-col rounded-[40px] bg-[#9ca3af] p-6 md:p-8 shadow-2xl border border-white/10">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 shrink-0">Budget Report</h2>

        <div className="overflow-y-auto flex-1 space-y-4 custom-scrollbar pr-1">

          {/* Current Cycle */}
          <div className="bg-gray-500/30 rounded-[24px] p-5 text-white">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Current Cycle #{summary.cycle_number}</p>
            <p className="text-xs opacity-50 mb-4">
              {formatDate(summary.cycle_start_date)} — {formatDate(summary.cycle_end_date)}
              {summary.days_remaining >= 0 && (
                <span className="ml-2 text-yellow-300 font-bold">{summary.days_remaining}d left</span>
              )}
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="opacity-70">Budget</span>
                <span className="font-bold">{formatPeso(summary.budget_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Income</span>
                <span className="font-bold text-green-300">{formatPeso(summary.total_income)}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Expense</span>
                <span className="font-bold text-red-300">{formatPeso(summary.total_expense)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-white/10 text-base">
                <span className="font-bold">Savings</span>
                <span className={`font-black ${summary.total_savings >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                  {formatPeso(summary.total_savings)}
                </span>
              </div>
            </div>
          </div>

          {/* Past Cycles */}
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-800/60 px-1">Past Cycles</p>

          {loadingHistory ? (
            <p className="text-center text-white/60 text-sm py-4">Loading history...</p>
          ) : history.length === 0 ? (
            <p className="text-center text-white/40 italic text-sm py-4">No past cycles yet</p>
          ) : (
            history.map((h) => (
              <div key={h.cycle_number} className="bg-gray-500/20 rounded-[20px] p-4 text-white">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Cycle #{h.cycle_number}</p>
                <p className="text-xs opacity-40 mb-3">
                  {formatDate(h.start_date)} — {formatDate(h.end_date)}
                  <span className="ml-2 opacity-60">({h.cycle_duration}d)</span>
                </p>

                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="opacity-60">Budget</span>
                    <span className="font-semibold">{formatPeso(h.budget_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-60">Income</span>
                    <span className="font-semibold text-green-300">{formatPeso(h.total_income)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-60">Expense</span>
                    <span className="font-semibold text-red-300">{formatPeso(h.total_expense)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/10">
                    <span className="font-bold">Savings</span>
                    <span className={`font-black ${h.total_savings >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                      {formatPeso(h.total_savings)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 shrink-0 w-full py-4 bg-white text-gray-800 rounded-2xl font-black shadow-lg hover:bg-gray-100 transition-transform active:scale-95 text-sm md:text-base"
        >
          BACK
        </button>
      </div>
    </div>
  );
}
