import React, { useState, useEffect } from "react"; // Combined here
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Apple, Camera, Wallet, User } from "lucide-react";
import LogoImg from "../assets/Logo.png";
import Profile from "./Profile"; 
import Logout from "./Logout";

export default function Navbar() {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const [userData, setUserData] = useState({
    name: "Guest",
    avatar: null
  });

  const NavItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/calorie-tracker", label: "Calorie Tracker", icon: Apple },
    { path: "/memory-lane", label: "Memory Lane", icon: Camera },
    { path: "/budget-tracker", label: "Budget Tracker", icon: Wallet }
  ];

    const loadUser = () => {
    const data = localStorage.getItem('user');
    if (data) {
      const storedUser = JSON.parse(data);
      setUserData({
        // This checks for 'full_name' first, then 'name' as a fallback
        name: storedUser.full_name || storedUser.name || "User",
        avatar: storedUser.image || null 
      });
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleProfileClose = () => {
    setIsProfileOpen(false);
    loadUser(); // Refresh the name/image in the navbar
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white flex flex-col border-r border-gray-800 z-40">
        <nav className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-3 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-18 h-15 flex items-center justify-center overflow-hidden">
                <img src={LogoImg} alt="S4 Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-gray-100">SORT4U</span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 px-4 py-6 space-y-2">
            {NavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    active
                      ? "bg-gray-700 text-white shadow-md border border-gray-600"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? "text-white" : "text-gray-500"}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Profile Section */}
          <div className="p-6 border-t border-gray-800 bg-gray-900/50 mt-auto">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsProfileOpen(true)}
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden cursor-pointer"
              >
                {userData.avatar ? (
                  <img 
                    src={userData.avatar} 
                    alt={userData.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-400" />
                )}
              </button>
              <div className="flex-1">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Hello!</p>
                <p className="text-sm font-semibold text-gray-200 truncate">{userData.name}</p>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* --- MODALS RENDERED HERE --- */}
      {isProfileOpen && (
        <Profile 
          onClose={handleProfileClose} 
          onLogoutTrigger={() => {
            setIsProfileOpen(false);
            setIsLogoutOpen(true);   
          }}
        />
      )}

      {isLogoutOpen && (
        <Logout 
          onClose={() => {
            setIsLogoutOpen(false);
            setIsProfileOpen(true); 
          }} 
          onConfirm={() => {
          // 1. THIS IS THE KEY: Wipe the storage
          localStorage.removeItem('user'); // Clear user session
          localStorage.removeItem('token'); // Clear auth token
          localStorage.clear(); 
          
          // 2. Force a hard redirect to the login page
          window.location.href = "/"; 
        }}
        />
      )}
    </>
  );
}