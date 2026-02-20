import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import MemoryUploadContainer from './MemoryUploadContainer';
import { getAllMemories } from '../../services/memoryApi';

const MemoryLaneUpload = () => {
  const [savedReminders, setSavedReminders] = useState([]);
  const [isLoadingMemories, setIsLoadingMemories] = useState(false);

  // Load existing memories when component mounts
  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    setIsLoadingMemories(true);
    try {
      const memories = await getAllMemories();
      setSavedReminders(memories);
    } catch (error) {
      console.error('Failed to load memories:', error);
    } finally {
      setIsLoadingMemories(false);
    }
  };

  const handleSaveReminder = (reminderData) => {
    // Add new memory to the list
    setSavedReminders(prev => [reminderData, ...prev]);
  };

  const handleBack = () => {
    console.log('Navigate back');
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Memory Lane</h1>
          <p className="text-xl text-gray-600 mb-10">
            Photo-triggered reminders for the things you always forget
          </p>
        </div>

        {/* Back Button + Form Container Wrapper */}
        <div className="max-w-3xl mx-auto mb-12">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 mb-6 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          {/* Upload Container */}
          <MemoryUploadContainer onSave={handleSaveReminder} />
        </div>

        {/* How it Works Section */}
        <div className="mt-12 bg-gray-200 rounded-3xl p-8 max-w-7xl mx-auto">
          <h3 className="text-xl font-semibold mb-6">How it Works</h3>
          <div className="space-y-4 text-gray-800">
            <div>
              <p className="mb-2">
                <span className="font-semibold">1. Snap a photo:</span> When you're somewhere and think "I should remember to..."
              </p>
            </div>
            <div>
              <p className="mb-2">
                <span className="font-semibold">2. Add your reminder:</span> Quick note about what you want to remember
              </p>
            </div>
            <div>
              <p className="mb-2">
                <span className="font-semibold">3. Context triggers it:</span> Next time you see that person, visit that place, or review your photos, you'll see the reminder
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-400">
              <p className="italic text-gray-700 leading-relaxed">
                <span className="font-semibold not-italic">Example:</span> Take a photo of your friend's bookshelf → Add reminder "recommend 'Project Hail Mary'" → Next time you meet up or see their photo, boom! You remember to tell them.
              </p>
            </div>
          </div>
        </div>

        {/* Show saved reminders count */}
        {savedReminders.length > 0 && (
          <div className="mt-6 text-center text-gray-600">
            <p>
              {isLoadingMemories 
                ? 'Loading memories...' 
                : `Total saved reminders: ${savedReminders.length}`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryLaneUpload;