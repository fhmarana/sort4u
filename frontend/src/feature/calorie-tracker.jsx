import React, { useState } from 'react';
import Navbar from './navbar'; 

export default function CalorieTracker() {

  return (
    <div className="flex min-h-screen bg-white font-sans text-gray-800 relative">
          <Navbar/> 
    <div className="min-h-screen bg-white ml-64 p-8"> {/* ml-64 to offset your fixed navbar */}
      </div>
    </div>
  );
}