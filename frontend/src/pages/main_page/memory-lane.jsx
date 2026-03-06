import React, { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, Inbox, Loader2, Trash2, CheckCircle2, SquarePen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../feature/navbar';
import EditMemoryModal from '../../feature/EditMemoryModal';
import axios from 'axios';
import useInactivityTimeout from '@/hooks/useInactivityTimeout';

export default function MemoryLane() {
  const API_BASE = '/memory/';
   useInactivityTimeout();
  const navigate = useNavigate();

  const [memories, setMemories] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const [selectedMemory, setSelectedMemory] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const fetchMemories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE, getAuthHeader());
      const sorted = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setMemories(sorted);
    } catch (error) {
      console.error("Fetch error:", error);
      if (error.response?.status === 401) navigate('/login');
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

  const toggleComplete = async (id, currentStatus) => {
    try {
      const response = await axios.patch(`${API_BASE}${id}/complete`,
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
      await axios.delete(`${API_BASE}${id}`, getAuthHeader());
      setMemories(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const openEditModal = (memory) => {
    setSelectedMemory(memory);
    setIsEditOpen(true);
  };

  const handleUpdateSuccess = (updatedMemory) => {
    setMemories(prev => prev.map(m => (m.id === updatedMemory.id ? updatedMemory : m)));
  };

  const filteredMemories = memories.filter(m => {
    if (filter === 'pending') return !m.is_completed;
    if (filter === 'done') return m.is_completed;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-white font-sans text-gray-800">
      <Navbar />

      <main className="flex-1 ml-0 lg:ml-48 p-5 md:p-8 transition-all duration-300 max-w-auto">

        <header className="text-center mb-10 mt-12 lg:mt-0">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 uppercase tracking-tight text-gray-900">Memory Lane</h1>
          <p className="text-gray-500 text-sm md:text-lg font-medium">Photo-triggered reminders for the things you always forget</p>
        </header>

        <div className="flex justify-between items-center mb-10">
          <div className="flex gap-2">
            {['all', 'pending', 'done'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-bold capitalize transition-all ${
                  filter === f ? 'bg-gray-800 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate('/add-memory')}
            className="hidden sm:flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2.5 rounded-2xl font-bold transition-all active:scale-95"
          >
            <Plus size={18} strokeWidth={3} />
            <span className="text-sm">Add Memory</span>
          </button>
        </div>

        <button
          onClick={() => navigate('/add-memory')}
          id="mobile-add-btn"
          className="sm:hidden fixed bottom-6 left-6 z-50 w-14 h-14 bg-gray-800 text-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all border-4 border-white"
        >
          <Plus size={32} strokeWidth={3} />
        </button>

        <section>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-gray-400" size={40} />
              <p className="text-gray-400 font-medium">Walking down memory lane...</p>
            </div>
          ) : filteredMemories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMemories.map((memory) => (
                <div key={memory.id} className="group relative border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all bg-white flex flex-col border-gray-100">
                  <div className="aspect-video bg-gray-50 flex items-center justify-center border-b border-gray-100 overflow-hidden" style={{ maxHeight: '140px' }}>
                    {memory.image_url ? (
                      <img
                        src={memory.image_url}
                        alt="memory"
                        className={`w-full h-full object-cover transition-opacity duration-300 ${memory.is_completed ? 'opacity-50 grayscale' : 'opacity-100'}`}
                      />
                    ) : (
                      <ImageIcon className="text-gray-300" size={32} />
                    )}
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      {memory.is_completed && (
                        <span className="inline-block mb-2 bg-gray-100 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 border border-gray-200">
                          Completed
                        </span>
                      )}
                      <h3 className={`font-bold text-sm leading-tight break-words mb-1.5 ${
                        memory.is_completed ? 'text-gray-400 line-through' : 'text-gray-800'
                      }`}>
                        {memory.description || "Untitled Memory"}
                      </h3>

                      <div className="space-y-0.5">
                        {memory.location && (
                          <p className="text-[10px] text-gray-500 flex items-center gap-1">
                            <span className="font-bold uppercase text-[9px] text-gray-400">Where: </span> {memory.location}
                          </p>
                        )}
                        {memory.person && (
                          <p className="text-[10px] text-gray-500 flex items-center gap-1">
                            <span className="font-bold uppercase text-[9px] text-gray-400">Who: </span> {memory.person}
                          </p>
                        )}
                      </div>

                      {memory.tags && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {memory.tags.split(',').map((tag, i) => {
                            const colors = [
                              'bg-blue-100 text-blue-700 border-blue-200',
                              'bg-purple-100 text-purple-700 border-purple-200',
                              'bg-green-100 text-green-700 border-green-200',
                              'bg-orange-100 text-orange-700 border-orange-200',
                              'bg-pink-100 text-pink-700 border-pink-200',
                              'bg-yellow-100 text-yellow-700 border-yellow-200',
                              'bg-teal-100 text-teal-700 border-teal-200',
                            ];
                            const trimmed = tag.trim();
                            return trimmed ? (
                              <span key={i} className={`${colors[i % colors.length]} border text-[10px] font-black uppercase px-2 py-0.5 rounded-full`}>
                                #{trimmed}
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 px-6">
                    <div className="flex gap-3 w-full">
                      <button
                        onClick={() => deleteMemory(memory.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                      <button
                        onClick={() => toggleComplete(memory.id, memory.is_completed)}
                        className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-50 hover:text-green-600 transition-colors"
                      >
                        <CheckCircle2 size={16} /> {memory.is_completed ? 'Mark Pending' : 'Complete'}
                      </button>
                    </div>
                    <button
                      onClick={() => openEditModal(memory)}
                      className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <SquarePen size={16} /> Edit Memory
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 border-4 border-dotted border-gray-100 rounded-[40px] bg-gray-50/50 text-center px-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                <Inbox size={40} className="text-gray-200" />
              </div>
              <h3 className="text-gray-800 font-bold text-xl mb-2">Nothing here yet</h3>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">
                No {filter === 'all' ? '' : filter} memories found. Capture a photo!
              </p>
            </div>
          )}
        </section>
      </main>

      <EditMemoryModal
        isOpen={isEditOpen}
        memory={selectedMemory}
        onClose={() => setIsEditOpen(false)}
        onUpdate={handleUpdateSuccess}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        body:has(.translate-x-0) #mobile-add-btn {
          opacity: 0;
          pointer-events: none;
          transform: scale(0.5) translateY(20px);
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .scale-up-center {
          animation: scaleUp 0.15s ease-out;
        }
      `}} />
    </div>
  );
}
