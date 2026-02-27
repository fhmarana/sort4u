import React, { useState, useEffect } from 'react';
import Navbar from '../../feature/navbar';
import CalorieStatsContainer from '../../feature/calorie-tracker/CalorieStatsContainer';
import TodaysListContainer from '../../feature/calorie-tracker/TodaysListContainer';
import AddFoodContainer from '../../feature/calorie-tracker/AddFoodContainer';

export default function CalorieTracker() {
  const [baseGoal, setBaseGoal] = useState(2890);
  
  // Helper to get date key (YYYY-MM-DD)
  const getTodayKey = () => new Date().toISOString().split('T')[0];
  const todayKey = getTodayKey();

  // History state: Initializes from localStorage
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('calorie_history');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

/* TO TEST WITH MOCK DATA, UNCOMMENT THIS BLOCK AND COMMENT OUT THE ABOVE RETURN
export default function CalorieTracker() {
  const [baseGoal, setBaseGoal] = useState(2890);
  
  const getTodayKey = () => new Date().toISOString().split('T')[0];
  const todayKey = getTodayKey();

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('calorie_history');
      const parsed = saved ? JSON.parse(saved) : {};

      // If localStorage is empty OR today has no data, inject mock data
      if (!parsed[todayKey] || parsed[todayKey].items.length === 0) {
        return {
          ...parsed,
          [todayKey]: {
            items: [
              { id: 1, name: "Grilled Chicken & Rice", calories: 550, protein: 45, carbs: 60, fat: 12, fiber: 4 },
              { id: 2, name: "Whey Protein Shake", calories: 150, protein: 30, carbs: 3, fat: 2, fiber: 0 },
              { id: 3, name: "Almonds (1oz)", calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 4 }
            ],
            totalCalories: 864,
            macros: { protein: 81, carbs: 69, fat: 28, fiber: 8 }
          }
        };
      }
      return parsed;
    } catch (e) {
      console.error("Error loading history:", e);
      return {};
    }
  });
*/

  // Save to localStorage whenever history changes
  useEffect(() => {
    localStorage.setItem('calorie_history', JSON.stringify(history));
  }, [history]);

  // Derive today's specific data
  const todayData = history[todayKey] || {
    items: [],
    totalCalories: 0,
    macros: { protein: 0, carbs: 0, fat: 0, fiber: 0 }
  };

  const handleAddFood = (foodData) => {
    const newItem = {
      id: Date.now(),
      name: foodData.name || foodData,
      calories: foodData.calories || 0,
      protein: foodData.protein || 0,
      carbs: foodData.carbs || 0,
      fat: foodData.fat || 0,
      fiber: foodData.fiber || 0,
    };

    setHistory(prev => {
      const currentDay = prev[todayKey] || { 
        items: [], totalCalories: 0, macros: { protein: 0, carbs: 0, fat: 0, fiber: 0 } 
      };
      
      return {
        ...prev,
        [todayKey]: {
          items: [...currentDay.items, newItem],
          totalCalories: currentDay.totalCalories + newItem.calories,
          macros: {
            protein: currentDay.macros.protein + (newItem.protein || 0),
            carbs: currentDay.macros.carbs + (newItem.carbs || 0),
            fat: currentDay.macros.fat + (newItem.fat || 0),
            fiber: currentDay.macros.fiber + (newItem.fiber || 0),
          }
        }
      };
    });
  };

  const handleRemoveItem = (id) => {
    setHistory(prev => {
      const currentDay = prev[todayKey];
      if (!currentDay) return prev;

      const itemToRemove = currentDay.items.find(item => item.id === id);
      if (!itemToRemove) return prev;

      return {
        ...prev,
        [todayKey]: {
          items: currentDay.items.filter(item => item.id !== id),
          totalCalories: Math.max(0, currentDay.totalCalories - itemToRemove.calories),
          macros: {
            protein: Math.max(0, currentDay.macros.protein - itemToRemove.protein),
            carbs: Math.max(0, currentDay.macros.carbs - itemToRemove.carbs),
            fat: Math.max(0, currentDay.macros.fat - itemToRemove.fat),
            fiber: Math.max(0, currentDay.macros.fiber - itemToRemove.fiber),
          }
        }
      };
    });
  };

  return (
    <div className="flex min-h-screen bg-[#f5f5f5] text-gray-800">
      <Navbar />

      <main className="flex-1 ml-0 lg:ml-64 p-6 md:p-10 transition-all duration-300">
        <header className="mb-8">
          <h1 className="text-2xl font-bold uppercase text-black">Calorie Tracker</h1>
        </header>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
            
            <div className="space-y-6 order-1">
              <div className="bg-white rounded-3xl shadow-md overflow-hidden">
                <CalorieStatsContainer
                  baseGoal={baseGoal}
                  foodCount={todayData.items.length}
                  totalCalories={todayData.totalCalories}
                  macros={todayData.macros}
                  onUpdateBaseGoal={setBaseGoal}
                  history={history}
                />
              </div>
              
              <div className="bg-white rounded-3xl shadow-md p-2">
                <AddFoodContainer onAddFood={handleAddFood} />
              </div>
            </div>

            {/* Right Column: Today's List */}
            {/* We use order-2 to ensure it stays below on mobile if needed */}
            <div className="order-2">
              <div className="bg-white rounded-3xl shadow-md min-h-[400px]">
                <TodaysListContainer
                  items={todayData.items}
                  onRemoveItem={handleRemoveItem}
                />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}