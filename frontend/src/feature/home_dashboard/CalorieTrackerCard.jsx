import { Flame, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CalorieTrackerCard({ data }) {
    const navigate = useNavigate();

    const totalCalories = Math.round(data?.total_calories ?? 0);
    const goal = data?.calorie_goal ?? null;
    const foodCount = data?.food_count ?? 0;
    const protein = Math.round(data?.total_protein ?? 0);
    const carbs = Math.round(data?.total_carbs ?? 0);
    const fat = Math.round(data?.total_fat ?? 0);
    const fiber = Math.round(data?.total_fiber ?? 0);

    const progressPct = goal ? Math.min((totalCalories / goal) * 100, 100) : 0;
    const remaining = goal ? Math.max(0, Math.round(goal - totalCalories)) : null;

    const macros = [
        { label: 'Protein', value: protein },
        { label: 'Carbs',   value: carbs   },
        { label: 'Fat',     value: fat     },
        { label: 'Fiber',   value: fiber   },
    ];

    return (
        <div className="bg-gray-300 rounded-3xl shadow-md p-6 min-h-80 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Calorie Tracker</h2>
                <button
                    onClick={() => navigate('/calorie-tracker')}
                    className="text-xs text-gray-500 hover:text-gray-800 transition-colors underline underline-offset-2"
                >
                    View Details
                </button>
            </div>

            {/* Calories consumed */}
            <div className="flex items-end gap-2 mb-1">
                <Flame className="w-5 h-5 text-orange-500 mb-0.5" />
                <span className="text-4xl font-bold leading-none">{totalCalories.toLocaleString()}</span>
                {goal && (
                    <span className="text-sm text-gray-500 mb-0.5">
                        / {Math.round(goal).toLocaleString()} kcal
                    </span>
                )}
            </div>

            {/* Progress bar */}
            {goal ? (
                <div className="mb-1">
                    <div className="w-full h-2.5 bg-gray-400 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gray-700 rounded-full transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {remaining?.toLocaleString()} kcal remaining
                    </p>
                </div>
            ) : (
                <p className="text-xs text-gray-500 mb-2">No goal set — go to Calorie Tracker to set one.</p>
            )}

            {/* Food count */}
            <div className="flex items-center gap-1.5 mb-4 mt-1">
                <Utensils className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs text-gray-500">{foodCount} item{foodCount !== 1 ? 's' : ''} today</span>
            </div>

            {/* Macro grid */}
            <div className="grid grid-cols-2 gap-2 mt-auto">
                {macros.map(({ label, value }) => (
                    <div key={label} className="bg-gray-400 rounded-xl py-2 px-3 flex flex-col items-center">
                        <span className="text-sm font-bold">{value}g</span>
                        <span className="text-[10px] text-gray-600 uppercase tracking-widest">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
