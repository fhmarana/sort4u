import {useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from './../../feature/navbar';
import useInactivityTimeout from '@/hooks/useInactivityTimeout';
import CalorieTrackerCard from '@/feature/home_dashboard/CalorieTrackerCard';
import BudgetTrackerCard from '@/feature/home_dashboard/BudgetTrackerCard';
import MemoryLaneCard from '@/feature/home_dashboard/MemoryLaneCard';


export default function HomeDashboard() {
  const navigate = useNavigate();
  useInactivityTimeout();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);


  const authHeader = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-type': 'application/json'
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const response = await fetch('/dashboard/overview', {
          headers: authHeader()
        })

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        setDashboard(data);
      } catch(error){
        console.error('Error fetching dashboard:', error);
        setError('Unable to load dashboard data. Please try again later.');
      } finally {
        setLoading (false);
      }
    };

    fetchDashboard();
  }, [navigate]);


if(loading){
  return (
    <div className = "flex, min-h-screen bg-gray-50 items-center justify-center">
      <div className = "text-center">
        <div className = "animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>

        <p className='mt-4 text-xl'> Loading Dashboard...</p>
      </div>
    </div>
  )
}

if (error) {
  return(
    <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Retry
          </button>
        </div>
      </div>
  );
}

return (
  <div className="flex min-h-screen bg-white">
    <Navbar />

    <main className="flex-1 ml-0 lg:ml-48 p-5 md:p-8 transition-all duration-300 max-w-auto ">
      <h1 className="text-2xl font-bold mb-6">Your Dashboard</h1>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>

      <CalorieTrackerCard data={dashboard?.calorie_tracker} />

      <MemoryLaneCard 
        data = {dashboard?.memory_lane}
        onViewAll = {() => navigate('/memory-lane')}
      />
      </div>

      {dashboard?.budget_tracker && (
        <BudgetTrackerCard 
          data={dashboard.budget_tracker}
          onViewDetails={() => navigate('/budget-tracker')}
        />
      )}
    </main>
  </div>
)





}
