import React, { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, Inbox, CheckCircle, Clock, Loader2 } from 'lucide-react'; 
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './navbar'; 
import axios from 'axios';

export default function MemoryLane() {
  const API_BASE = 'http://localhost:8000/memory';
  const navigate = useNavigate();
  const [memories, setMemories] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Helper to get auth headers
  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const fetchMemories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      // Sort by newest first so the grid feels alive
      const sorted = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setMemories(sorted);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login');
    return;
  }
  fetchMemories();
}, [navigate]);
 
  // Still not finalized
  const toggleComplete = async (id, currentStatus) => {
    try {
      const response = await axios.patch(`${API_BASE}/${id}/complete`, 
        { is_completed: !currentStatus },
        getAuthHeader()
      );
      setMemories(prev => prev.map(m => (m.id === id ? response.data : m)));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const deleteMemory = async (id) => {
    if (!window.confirm("Delete this memory?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`, getAuthHeader());
      setMemories(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const filteredMemories = memories.filter(m => {
    if (filter === 'pending') return !m.is_completed;
    if (filter === 'done') return m.is_completed;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-white font-sans text-gray-800">
      <Navbar /> 
      <main className="flex-1 ml-64 p-10">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2 uppercase tracking-tight">Memory Lane</h1>
          <p className="text-gray-600 text-lg">Photo-triggered reminders for the things you always forget</p>
        </header>

        <div className="flex justify-between items-center mb-10">
          <div className="flex gap-3">
            {['all', 'pending', 'done'].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-1.5 rounded-md text-sm font-semibold capitalize transition-all ${
                  filter === f ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
           
          <button 
            onClick={() => navigate('/add-memory')}
            className="flex items-center gap-2 bg-[#D1D5DB] hover:bg-gray-300 text-gray-800 px-5 py-2.5 rounded-2xl font-bold transition-all shadow-sm active:scale-95"
          >
          <div className="bg-[#4B5563] text-white rounded-full p-0.5">
            <Plus size={16} strokeWidth={4} />
          </div>
          <span className="text-sm">Add Memory</span>
        </button>
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-8">Your Memory Lane</h2>
          
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gray-400" size={40} /></div>
          ) : filteredMemories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMemories.map((memory) => (
                <div key={memory.id} className="border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                  <div className="h-40 bg-gray-50 flex items-center justify-center border-b">
                    {memory.image_url ? (
                      <img src={memory.image_url} alt="memory" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-gray-300" size={40} />
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className={`font-semibold leading-tight ${memory.is_completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                        {memory.description || "Untitled Memory"}
                      </h3>
                      <button onClick={() => toggleComplete(memory.id, memory.is_completed)}>
                        <CheckCircle 
                          size={24} 
                          className={memory.is_completed ? "text-green-500" : "text-gray-200 hover:text-gray-300"} 
                          fill={memory.is_completed ? "currentColor" : "none"} 
                        />
                      </button>
                    </div>
                    
                    <div className="mt-6 flex justify-between items-center text-xs font-medium text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock size={14}/> 
                        {memory.created_at ? new Date(memory.created_at).toLocaleDateString() : 'Recently'}
                      </span>
                      <button onClick={() => deleteMemory(memory.id)} className="hover:text-red-500 uppercase tracking-wider font-bold">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50">
              <Inbox size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium text-lg">No {filter} memories found.</p>
              <p className="text-gray-400 text-sm">Tap the + button to add your first check-in!</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}