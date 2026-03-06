import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import axios from 'axios';

export default function EditMemoryModal({ isOpen, memory, onClose, onUpdate }) {
  const [editForm, setEditForm] = useState({
    description: '',
    location: '',
    person: '',
    tags: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (memory) {
      setEditForm({
        description: memory.description || '',
        location: memory.location || '',
        person: memory.person || '',
        tags: memory.tags || '',
      });
      setImagePreview(memory.image_url || null);
      setImageFile(null);
    }
  }, [memory]);

  const handleEditSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('description', editForm.description);
      if (editForm.location) formData.append('location', editForm.location);
      if (editForm.person) formData.append('person', editForm.person);
      if (editForm.tags) formData.append('tags', editForm.tags);
      if (imageFile) formData.append('image', imageFile);

      const response = await axios.put(`/memory/${memory.id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error('Failed to update memory:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !memory) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* Camera / Image Preview */}
        <div className="flex justify-center -mx-8 -mt-8 mb-6">
          <label className="cursor-pointer w-full">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="preview"
                className="w-full h-45 object-cover rounded-t-xl border-2 border-gray-200 hover:opacity-80 transition-opacity"
              />
            ) : (
              <div className="flex justify-center py-6">
                <div className="bg-gray-100 hover:bg-gray-200 transition-colors rounded-full p-4">
                  <Camera size={32} className="text-gray-600" />
                </div>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
            />
          </label>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="What do you want to remember?"
            value={editForm.description}
            onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <input
            type="text"
            placeholder="Where is this? (Optional)"
            value={editForm.location}
            onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <input
            type="text"
            placeholder="Who is this about? (Optional)"
            value={editForm.person}
            onChange={(e) => setEditForm(prev => ({ ...prev, person: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <input
            type="text"
            placeholder="Tags, separated by commas (Optional)"
            value={editForm.tags}
            onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />

          {/* Tag Preview */}
          {editForm.tags && (
            <div className="max-h-24 overflow-y-auto flex flex-wrap gap-1.5 pt-1 pr-1">
              {editForm.tags.split(',').map((tag, index) => {
                const colors = [
                  'bg-blue-100 text-blue-700 border-blue-200',
                  'bg-purple-100 text-purple-700 border-purple-200',
                  'bg-green-100 text-green-700 border-green-200',
                  'bg-orange-100 text-orange-700 border-orange-200',
                  'bg-pink-100 text-pink-700 border-pink-200',
                  'bg-yellow-100 text-yellow-700 border-yellow-200',
                  'bg-teal-100 text-teal-700 border-teal-200',
                ];
                const color = colors[index % colors.length];
                return tag.trim() ? (
                  <span
                    key={index}
                    className={`${color} border text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full whitespace-nowrap`}
                  >
                    #{tag.trim()}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleEditSubmit}
            disabled={loading}
            className="flex-1 bg-gray-800 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Memory Reminder'}
          </button>
        </div>
      </div>
    </div>
  );
}
