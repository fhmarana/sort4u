import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flag } from 'lucide-react';
import Navbar from '../../feature/navbar';
import CalorieStatsContainer from '../../feature/calorie-tracker/CalorieStatsContainer';
import TodaysListContainer from '../../feature/calorie-tracker/TodaysListContainer';
import AddFoodContainer from '../../feature/calorie-tracker/AddFoodContainer';

const authHeader = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export default function CalorieTracker() {
  const navigate = useNavigate();
  const [baseGoal, setBaseGoal] = useState(null);
  const [goalLoaded, setGoalLoaded] = useState(false);
  const [initialGoalInput, setInitialGoalInput] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);
  const [foodCount, setFoodCount] = useState(0);
  const [todaysList, setTodaysList] = useState([]);
  const [macros, setMacros] = useState({ protein: 0, carbs: 0, fat: 0, fiber: 0 });

  // Load today's entries and goal from DB on mount (independent fetches so one failure can't block the other)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    // Fetch today's food entries
    fetch('/calorie-tracker/today', { headers: authHeader() })
      .then(res => {
        if (res.status === 401) { navigate('/login'); return null; }
        if (!res.ok) return null;
        return res.json();
      })
      .then(data => {
        if (!data) return;
        setTodaysList(data.entries.map(e => ({
          id: e.id,
          name: e.food_name,
          calories: e.calories,
          protein: e.protein,
          carbs: e.carbs,
          fat: e.fat,
          fiber: e.fiber,
        })));
        setFoodCount(data.entries.length);
        setTotalCalories(data.total_calories);
        setMacros({
          protein: data.total_protein,
          carbs: data.total_carbs,
          fat: data.total_fat,
          fiber: data.total_fiber,
        });
      })
      .catch(err => console.error("Failed to load today's entries:", err));

    // Fetch calorie goal — always resolves so goalLoaded is always set
    fetch('/calorie-tracker/goal', { headers: authHeader() })
      .then(res => res.ok ? res.json() : { calorie_goal: null })
      .then(data => setBaseGoal(data.calorie_goal))
      .catch(() => setBaseGoal(null))
      .finally(() => setGoalLoaded(true));
  }, [navigate]);

  // Save goal to backend and update local state
  const handleUpdateBaseGoal = async (newGoal) => {
    try {
      const res = await fetch('/calorie-tracker/goal', {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify({ calorie_goal: newGoal }),
      });
      if (res.ok) setBaseGoal(newGoal);
    } catch (err) {
      console.error('Failed to update goal:', err);
    }
  };

  // Add food item (called after DB save in AddFoodContainer)
  const handleAddFood = (savedEntry) => {
    const newItem = {
      id: savedEntry.id,
      name: savedEntry.food_name,
      calories: savedEntry.calories,
      protein: savedEntry.protein,
      carbs: savedEntry.carbs,
      fat: savedEntry.fat,
      fiber: savedEntry.fiber,
    };
    setTodaysList(prev => [...prev, newItem]);
    setFoodCount(prev => prev + 1);
    setTotalCalories(prev => prev + newItem.calories);
    setMacros(prev => ({
      protein: prev.protein + newItem.protein,
      carbs: prev.carbs + newItem.carbs,
      fat: prev.fat + newItem.fat,
      fiber: prev.fiber + newItem.fiber,
    }));
  };

  // Remove food item from DB and local state
  const handleRemoveItem = async (id) => {
    const itemToRemove = todaysList.find(item => item.id === id);
    if (!itemToRemove) return;
    try {
      await fetch(`/calorie-tracker/${id}`, { method: 'DELETE', headers: authHeader() });
      setTodaysList(prev => prev.filter(item => item.id !== id));
      setFoodCount(prev => Math.max(0, prev - 1));
      setTotalCalories(prev => Math.max(0, prev - itemToRemove.calories));
      setMacros(prev => ({
        protein: Math.max(0, prev.protein - itemToRemove.protein),
        carbs: Math.max(0, prev.carbs - itemToRemove.carbs),
        fat: Math.max(0, prev.fat - itemToRemove.fat),
        fiber: Math.max(0, prev.fiber - itemToRemove.fiber),
      }));
    } catch (err) {
      console.error('Failed to delete entry:', err);
    }
  };

  // First-time setup screen — shown before tracker if no goal is set
  if (goalLoaded && baseGoal === null) {
    return (
      <div className="flex min-h-screen bg-white font-sans text-gray-800 relative">
        <Navbar />
        <div className="flex-1 ml-0 lg:ml-48 flex items-center justify-center pt-16 lg:pt-0 px-4">
          <div className="bg-gray-200 rounded-3xl p-6 lg:p-10 w-full max-w-md text-center">
            <Flag className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <h2 className="text-2xl font-bold mb-1">Set Your Daily Calorie Goal</h2>
            <p className="text-gray-500 text-sm mb-6">You can always change this later.</p>
            <input
              type="number"
              value={initialGoalInput}
              onChange={(e) => setInitialGoalInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && initialGoalInput) {
                  handleUpdateBaseGoal(parseInt(initialGoalInput));
                }
              }}
              placeholder="e.g. 2000"
              className="w-full px-4 py-3 bg-gray-300 rounded-lg mb-4 text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-500"
              autoFocus
            />
            <button
              onClick={() => initialGoalInput && handleUpdateBaseGoal(parseInt(initialGoalInput))}
              disabled={!initialGoalInput}
              className="w-full py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white font-sans text-gray-800 relative">
      <Navbar />

      {/* Main Content Area */}
      <div className="min-h-screen bg-white ml-0 lg:ml-48 p-4 lg:p-6 pt-16 lg:pt-6 flex-1">
        <div className="max-w-auto mx-auto ">
          {/* Header */}
          <h1 className="text-4xl font-bold mb-8">Calorie Tracker</h1>

          {/* Main Grid Layout - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-7 items-start">

            {/* LEFT COLUMN */}
            <div className="space-y-6 lg:col-span-3">
              {/* Container 1: Calorie Stats (Top-Left) */}
              <CalorieStatsContainer
                baseGoal={baseGoal}
                foodCount={foodCount}
                totalCalories={totalCalories}
                macros={macros}
                onUpdateBaseGoal={handleUpdateBaseGoal}
              />

              {/* Container 2: Add Food Input (Bottom-Left) */}
              <AddFoodContainer onAddFood={handleAddFood} />
            </div>

            {/* RIGHT COLUMN */}
            {/* Container 3: Today's List (Right Side) */}
            <div className="lg:col-span-2">
              <TodaysListContainer
                items={todaysList}
                onRemoveItem={handleRemoveItem}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
