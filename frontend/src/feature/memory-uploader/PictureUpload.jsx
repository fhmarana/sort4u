import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';

const PictureUpload = ({ onFileSelect, uploadedImage }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onFileSelect(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onFileSelect(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-18" >
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Take or Upload Photo
      </label>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative w-full h-56  bg-gray-400 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-gray-500 ${
          isDragging ? 'border-4 border-gray-600 bg-gray-500' : ''
        }`}
      >
        {uploadedImage ? (
          <img
            src={uploadedImage}
            alt="Uploaded preview"
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <>
            <Camera className="w-16 h-16 text-gray-700 mb-2" />
            <p className="text-sm text-gray-800">Click to take photo or upload</p>
          </>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default PictureUpload;