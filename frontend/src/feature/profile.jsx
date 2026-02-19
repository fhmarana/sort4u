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
            name: userFullName, // Keep this locked to the localStorage value
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
    // Sync the new image/data back to localStorage
    const storedUser = JSON.parse(localStorage.getItem('user')) || {};
    const updatedUser = { 
      ...storedUser, 
      image: profileData.image // Ensure the Navbar can see the new photo
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    alert("Profile saved successfully!");
    onClose(); // This triggers handleProfileClose in Navbar
  }
};

  const handleRemoveImage = async (e) => {
    e.stopPropagation();
    if (window.confirm("Remove profile photo?")) {
      const updatedData = { ...profileData, image: null };
      setProfileData(updatedData);
      await saveProfile(updatedData);
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
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="text-white font-bold animate-pulse">LOADING PROFILE...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 cursor-default" onClick={onClose}>
      <button 
        className="absolute top-10 right-10 w-16 h-16 bg-[#F87171] rounded-full flex items-center justify-center hover:bg-red-500 transition-all shadow-2xl hover:scale-110 z-[110]"
        onClick={(e) => { e.stopPropagation(); onLogoutTrigger(); }}
      >
        <LogOut className="text-white w-8 h-8 ml-1" />
      </button>

      <div className="bg-[#D1D5DB] w-[650px] h-[420px] rounded-[2.5rem] overflow-hidden shadow-2xl relative border-[6px] border-[#4B5563] animate-in fade-in zoom-in duration-200 cursor-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#4B5563] h-9 flex items-center justify-end px-6 text-white">
          <button onClick={onClose} className="hover:text-gray-300 transition-colors">
            <X size={30} strokeWidth={3} />
          </button>
        </div>

        <div className="mt-2"><div className="h-2.5 w-full bg-[#4B5563] opacity-90" /></div>

        <div className="p-8 flex gap-10 h-[calc(100%-70px)]">
          <div className="relative group w-52 h-full shrink-0">
            <div className="w-full h-full bg-white rounded-2xl shadow-inner border-4 border-white overflow-hidden cursor-pointer hover:ring-4 hover:ring-[#4B5563]/20 transition-all flex items-center justify-center relative" onClick={() => fileInputRef.current.click()}>
              {profileData.image ? (
                <>
                  <img src={profileData.image} alt="Profile" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                    <div className="flex flex-col items-center text-white">
                      <Camera className="w-8 h-8 mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Change Photo</span>
                    </div>
                    <button onClick={handleRemoveImage} disabled={saving} className="mt-2 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black py-1 px-3 rounded-full transition-transform active:scale-90 disabled:opacity-50">REMOVE</button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-gray-300">
                  <User size={80} strokeWidth={1.5} />
                  <span className="text-[10px] font-bold uppercase tracking-tighter mt-2 text-gray-400">Click to upload</span>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="flex-1 flex flex-col">
            <div className="space-y-4 mb-4">
              <div className="flex items-center gap-3">
                <label className="font-black text-xl text-[#374151] w-20">NAME:</label>
                {/* NAME INPUT: Added readOnly and disabled cursor style */}
                <input 
                  type="text"
                  name="name"
                  value={profileData.name}
                  readOnly
                  className="h-9 bg-[#9CA3AF]/20 rounded-xl flex-1 px-4 text-[#374151] font-bold cursor-not-allowed outline-none border border-[#4B5563]/10"
                  title="Name is linked to your account and cannot be changed here."
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="font-black text-xl text-[#374151] w-20">AGE:</label>
                <div className="flex items-center gap-3">
                  <input type="number" name="age" value={profileData.age} onChange={handleChange} className="h-9 bg-[#9CA3AF]/40 rounded-xl w-20 px-3 text-[#374151] font-bold focus:outline-none focus:ring-4 focus:ring-[#4B5563]/30 transition-all" />
                  <span className="text-xs font-black text-[#374151]">YEARS OLD</span>
                </div>
              </div>
            </div>

            <div className="space-y-1 flex-1">
              <label className="font-black text-xl text-[#374151] block">BIO:</label>
              <textarea name="about" placeholder='Tell us something about yourself...' value={profileData.about} onChange={handleChange} className="h-24 bg-[#9CA3AF]/40 rounded-[1.5rem] w-full p-4 text-[#374151] font-medium resize-none text-sm focus:outline-none focus:ring-4 focus:ring-[#4B5563]/30 transition-all placeholder:text-[#374151]/40" />
            </div>

            <div className="mt-4 flex justify-end">
              <button onClick={handleManualSave} disabled={saving} className="bg-[#4B5563] text-white font-black px-8 py-2 rounded-full hover:bg-[#374151] active:scale-95 transition-all shadow-lg text-sm tracking-widest flex items-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? "SAVING..." : "SAVE PROFILE"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}