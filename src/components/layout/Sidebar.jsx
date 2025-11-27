import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, LayoutDashboard, User, LogOut, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ProfileModal from '../modals/ProfileModal';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    const isManager = user?.role === 'Manager' || user?.role === 'Admin';

    // Common Styles for Links
    const linkClass = ({ isActive }) => 
        `w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
            isActive 
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`;

    return (
        <>
            <div className="w-72 bg-slate-900 text-white p-6 flex flex-col hidden lg:flex shadow-xl z-20 h-screen sticky top-0">
                {/* Logo Area */}
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-900/50">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl tracking-tight">EncoraOne</h1>
                        <p className="text-xs text-slate-400 font-medium">
                            {isManager ? "Manager Portal" : "Employee Portal"}
                        </p>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 space-y-2">
                    <NavLink to="/dashboard" className={linkClass}>
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </NavLink>
                    
                    {/* Only Manager/Admin can see Reports */}
                    {isManager && (
                        <NavLink to="/reports" className={linkClass}>
                            <BarChart3 className="w-5 h-5" />
                            <span className="font-medium">Reports & Analytics</span>
                        </NavLink>
                    )}
                </nav>

                {/* User Footer (Clickable for Profile) */}
                <div className="pt-6 border-t border-slate-800">
                    <div 
                        onClick={() => setIsProfileOpen(true)}
                        className="flex items-center gap-3 mb-4 px-2 p-3 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600 shadow-sm group-hover:border-slate-500 transition-colors">
                            <User className="w-5 h-5 text-slate-300 group-hover:text-white" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold truncate text-slate-200 group-hover:text-white">{user?.fullName}</p>
                            <p className="text-xs text-slate-400 truncate">{user?.role}</p>
                        </div>
                    </div>
                    <button 
                        onClick={logout} 
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors text-sm font-medium border border-transparent hover:border-red-500/20"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </div>

            {/* Profile Modal Component */}
            <ProfileModal 
                isOpen={isProfileOpen} 
                onClose={() => setIsProfileOpen(false)} 
                user={user} 
            />
        </>
    );
};

export default Sidebar;