import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Apple, Camera, Wallet, User, Menu, X } from "lucide-react"; // Added Menu and X icons
import LogoImg from "../assets/Logo.png";
import Profile from "./Profile"; 
import Logout from "./Logout";

export default function Navbar() {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu toggle

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
        name: storedUser.full_name || storedUser.name || "User",
        avatar: storedUser.image || null 
      });
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleProfileClose = () => {
    setIsProfileOpen(false);
    loadUser();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Toggle Button (Fixed Upper Right) */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-gray-900 text-white rounded-md border border-gray-700"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay (Darkens background when menu is open) */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed left-0 top-0 h-screen w-48 bg-gray-900 text-white flex flex-col border-r border-gray-800 z-40
        transition-transform duration-300 ease-in-out
        overflow-y-auto  {/* <-- ADD THIS TO ENABLE SCROLLING */}
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>

        <nav className="flex flex-col h-full">
          
          {/* Logo Section */}
          <div className="p-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-12 h-10 flex items-center justify-center overflow-hidden">
                <img src={LogoImg} alt="S4 Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-lg tracking-tight text-gray-100">SORT4U</span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 px-3 py-4 space-y-1">
            {NavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    active
                      ? "bg-gray-700 text-white shadow-md border border-gray-600"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-white" : "text-gray-500"}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Profile Section */}
          <div className="p-4 border-t border-gray-800 bg-gray-900/50 mt-auto shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsProfileOpen(true)}
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-700"
              >
                <User className="w-4 h-4 text-gray-400" />
              </button>
              <div className="flex-1">
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Hello!</p>
                <p className="text-xs font-semibold text-gray-200 truncate">{userData.name}</p>
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
            localStorage.clear(); 
            window.location.href = "/"; 
          }}
        />
      )}
    </>
  );
}