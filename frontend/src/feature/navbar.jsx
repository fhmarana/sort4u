import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Apple, Camera, Wallet, User } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  // User data (hardcoded for now - replace with real data later)
  const user = {
    name: "John Doe",
    avatar: null // Can add image URL later
  };

  const NavItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/calorie-tracker", label: "Calorie Tracker", icon: Apple },
    { path: "/memory-lane", label: "Memory Lane", icon: Camera },
    { path: "/budget-tracker", label: "Budget Tracker", icon: Wallet }
  ];

  // Check if current path matches the nav item
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white flex flex-col">
      <nav className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-700">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S4</span>
            </div>
            <span className="font-bold text-2xl">SORT4U</span>
          </Link>
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
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Profile Section at Bottom */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 bg-linear-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>

            {/* Welcome and Name */}
            <div className="flex-1">
              <p className="text-xs text-gray-400">Welcome back</p>
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}