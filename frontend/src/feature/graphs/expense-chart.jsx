import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function ExpenseChart({ transactions = [] }) {
  const expenseTransactions = transactions.filter(t => t.type?.toLowerCase() === 'expense');
  const totalExpenseAmount = expenseTransactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const groupedData = expenseTransactions.reduce((acc, t) => {
    const cat = t.category?.name || 'Other';
    acc[cat] = (acc[cat] || 0) + parseFloat(t.amount || 0);
    return acc;
  }, {});

  const colorMap = {
    "Food & Dining": "#FF5E8E",
    "Transportation": "#caf6ff",
    "Entertainment": "#69009e",
    "Utilities": "#d1ae00",
    "Health & Fitness": "#32D74B",
    "Education": "#FF9F0A",
    "Shopping": "#FF375F",
    "Travel": "#5AC8FA",
    "Personal Care": "#AF52DE",
    "Other": "#8E8E93"
  };

  const categories = Object.keys(groupedData).map(label => {
    const amount = groupedData[label];
    return {
      label,
      amount,
      percent: totalExpenseAmount > 0 ? (amount / totalExpenseAmount) * 100 : 0,
      color: colorMap[label] || colorMap['Other']
    };
  }).sort((a, b) => b.amount - a.amount);

  const pieData = categories.length > 0
    ? categories.map(cat => ({ name: cat.label, value: cat.amount, color: cat.color }))
    : [{ name: 'Empty', value: 1, color: 'rgba(255,255,255,0.05)' }];

  return (
    <section className="bg-slate-900 p-7 rounded-[40px] text-white shadow-2xl h-full flex flex-col">
      <h2 className="text-xl font-bold mb-8">Expenses</h2>

      <div className="relative flex justify-center mb-10 shrink-0" style={{ height: 176 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={56}
              outerRadius={74}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              paddingAngle={categories.length > 1 ? 2 : 0}
              cornerRadius={4}
              strokeWidth={0}
            >
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] uppercase opacity-60">Total spent</span>
          <span className="text-2xl font-black">₱{totalExpenseAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-3">
        {categories.length > 0 ? categories.map((cat, idx) => (
          <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-2xl mr-1">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
              <div>
                <p className="text-sm font-bold">{cat.label}</p>
                <p className="text-[10px] opacity-50">{Math.round(cat.percent)}%</p>
              </div>
            </div>
            <p className="font-bold text-md">₱{cat.amount.toLocaleString()}</p>
          </div>
        )) : (
          <p className="text-center opacity-40 italic py-4">No expenses yet</p>
        )}
      </div>
    </section>
  );
}
