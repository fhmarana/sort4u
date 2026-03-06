import React, { useEffect, useState, useRef } from 'react';
import { X, LogOut, Camera, User, Loader2 } from 'lucide-react';

export default function Profile({ onClose, onLogoutTrigger }) {
  const fileInputRef = useRef(null);

  const storedUser = JSON.parse(localStorage.getItem('user')); 
  const userId = storedUser?.id;
  const userFullName = storedUser?.full_name || ''; 

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: userFullName, 
    age: '',
    about: '',
    image: null
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/profile/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setProfileData({
            name: userFullName,
            age: data.age || '',
            about: data.about || '',
            image: data.image || null
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchProfile();
  }, [userId, userFullName]);

  const saveProfile = async (dataToSave) => {
    setSaving(true);
    try {
      const response = await fetch(`http://localhost:8000/api/profile/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });
      return response.ok;
    } catch (error) {
      console.error("Error connecting to backend:", error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleManualSave = async () => {
    const success = await saveProfile(profileData);
    if (success) {
      const currentStored = JSON.parse(localStorage.getItem('user')) || {};
      const updatedUser = { ...currentStored, image: profileData.image };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      onClose(); 
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    if (window.confirm("Remove profile photo?")) {
      setProfileData(prev => ({ ...prev, image: null }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileData(prev => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  if (loading) return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="text-white font-bold animate-pulse tracking-widest uppercase">Loading Profile...</div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      
      {/* SIGN OUT BUTTON: Restored to Floating Upper Right */}
      <button 
        className="fixed top-6 right-6 lg:top-10 lg:right-10 w-14 h-14 lg:w-16 lg:h-16 bg-[#F87171] rounded-full flex items-center justify-center hover:bg-red-500 transition-all shadow-2xl hover:scale-110 z-[110]"
        onClick={(e) => { e.stopPropagation(); onLogoutTrigger(); }}
      >
        <LogOut className="text-white w-7 h-7 lg:w-8 lg:h-8 ml-1" />
      </button>

      {/* ID CARD CONTAINER */}
      <div 
        className="bg-[#D1D5DB] w-full max-w-[550px] h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl relative border-[6px] border-[#4B5563] animate-in fade-in zoom-in duration-200 flex flex-col cursor-default" 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="bg-[#4B5563] h-9 shrink-0 flex items-center justify-between px-6 text-white">
          <div className="text-[10px] font-black tracking-[0.3em] opacity-80"/>
          <button onClick={onClose} className="hover:text-gray-300 transition-colors">
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        {/* Decorative Divider */}
        <div className="h-2 w-full bg-[#4B5563] opacity-40 shrink-0" />

        {/* SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 scrollbar-thin scrollbar-thumb-gray-600">
          <div className="flex flex-col sm:flex-row gap-8">
            
            {/* PHOTO SECTION: Restored to Vertical Rectangular */}
            <div className="flex flex-col items-center shrink-0">
              <div 
                className="w-36 h-48 lg:w-44 lg:h-56 bg-white rounded-xl shadow-inner border-4 border-white overflow-hidden cursor-pointer relative group"
                onClick={() => fileInputRef.current.click()}
              >
                {profileData.image ? (
                  <>
                    <img src={profileData.image} alt="Profile" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                       <Camera className="text-white w-8 h-8 mb-2" />
                       <button onClick={handleRemoveImage} className="text-[9px] bg-red-500 text-white font-bold px-3 py-1 rounded-full hover:bg-red-600 transition-colors">REMOVE</button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-200">
                    <User size={64} strokeWidth={1} />
                    <span className="text-[10px] font-black uppercase mt-2 tracking-widest text-gray-400">Upload</span>
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>

            {/* FORM FIELDS SECTION */}
            <div className="flex-1 flex flex-col space-y-1">
              <div className="space-y-1">
                <label className="font-black text-xs text-[#374151] tracking-wider">FULL NAME</label>
                <input 
                  type="text" 
                  value={profileData.name} 
                  readOnly 
                  className="w-full h-9 bg-[#9CA3AF]/20 rounded-xl px-4 text-sm font-bold text-[#374151] border border-[#4B5563]/10 cursor-not-allowed outline-none" 
                />
              </div>

              <div className="space-y-1">
                <label className="font-black text-xs text-[#374151] tracking-wider">AGE</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="number" 
                    name="age" 
                    value={profileData.age} 
                    onChange={handleChange} 
                    className="w-20 h-9 bg-[#9CA3AF]/40 rounded-xl px-3 text-sm font-bold text-[#374151] focus:ring-4 focus:ring-[#4B5563]/20 outline-none transition-all" 
                  />
                  <span className="text-[10px] font-black text-[#374151]/70">YEARS OLD</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-black text-xs text-[#374151] tracking-wider">BIO: </label>
                <textarea 
                  name="about" 
                  placeholder="Tell us about yourself..."
                  value={profileData.about} 
                  onChange={handleChange} 
                  className="w-full h-20 bg-[#9CA3AF]/40 rounded-2xl p-4 text-xs font-medium text-[#374151] resize-none focus:ring-4 focus:ring-[#4B5563]/20 outline-none transition-all placeholder:text-[#374151]/30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FIXED FOOTER with Save Button */}
        <div className="px-8 py-4 bg-[#D1D5DB] border-t border-[#4B5563]/10 flex justify-end shrink-0">
          <button 
            onClick={handleManualSave} 
            disabled={saving} 
            className="bg-[#4B5563] text-white text-xs font-black px-10 py-2.5 rounded-full hover:bg-[#374151] active:scale-95 transition-all shadow-lg flex items-center gap-3 tracking-[0.1em]"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {saving ? "SAVING..." : "UPDATE PROFILE"}
          </button>
        </div>
      </div>
    </div>
  );
}