import React, { useState } from 'react';
import PictureUpload from './PictureUpload';
import { createMemory } from '../../services/memoryApi';

const MemoryUploadContainer = ({ onSave }) => {
  const [formData, setFormData] = useState({
    image: null,
    whatToRemember: '',
    location: '',
    person: '',
    tags: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (imageData) => {
    setFormData(prev => ({
      ...prev,
      image: imageData
    }));
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.image) {
      newErrors.image = 'Please upload a photo';
    }

    if (!formData.whatToRemember.trim()) {
      newErrors.whatToRemember = 'This field is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        // Call API to save memory
        const savedMemory = await createMemory(formData);
        
        console.log('Memory Reminder Saved:', savedMemory);
        
        // Call parent callback if provided
        if (onSave) {
          onSave(savedMemory);
        }
        
        // Show success message
        alert('Memory Reminder saved successfully!');
        
        // Reset form after successful save
        setFormData({
          image: null,
          whatToRemember: '',
          location: '',
          person: '',
          tags: ''
        });
      } catch (error) {
        console.error('Failed to save memory:', error);
        alert(`Failed to save memory: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="bg-gray-300 rounded-3xl p-9" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
      <h2 className="text-2xl font-semibold mb-9">Create Memory Reminder</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* File Upload Component */}
        <PictureUpload 
          onFileSelect={handleImageUpload} 
          uploadedImage={formData.image}
        />
        {errors.image && (
          <p className="text-sm text-red-600 -mt-4">{errors.image}</p>
        )}

        {/* What do you want to remember? */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What do you want to remember?
          </label>
          <input
            type="text"
            name="whatToRemember"
            value={formData.whatToRemember}
            onChange={handleInputChange}
            placeholder="e.g., Ate alone the book reccomendation"
            disabled={isLoading}
            className={`w-full px-4 py-2 bg-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-600 disabled:opacity-50 ${
              errors.whatToRemember ? 'border-2 border-red-500' : ''
            }`}
          />
          {errors.whatToRemember && (
            <p className="mt-1 text-sm text-red-600">{errors.whatToRemember}</p>
          )}
        </div>

        {/* Where is this? (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Where is this? (Optional)
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., Familia Apartment, Dilao"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-600 disabled:opacity-50"
          />
        </div>

        {/* Who this is about? (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Who this is about? (Optional)
          </label>
          <input
            type="text"
            name="person"
            value={formData.person}
            onChange={handleInputChange}
            placeholder="e.g., Mom, Coworker"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-600 disabled:opacity-50"
          />
        </div>

        {/* Tags (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (Optional)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="e.g., family, work, hobby"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-600 disabled:opacity-50"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save Memory Reminder'}
        </button>
      </form>
    </div>
  );
};

export default MemoryUploadContainer;