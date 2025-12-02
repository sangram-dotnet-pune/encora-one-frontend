import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    User,
    LogOut,
    List,
    Building2
} from 'lucide-react'; // Removed FileText from here since we are using an image now
import { useAuth } from '../../context/AuthContext.jsx';
import ProfileModal from '../modals/ProfileModal.jsx';
import NotificationPanel from '../ui/NotificationPanel.jsx';

// IMPACT: Import your saved logo image here
import logo from '../../assets/logo.png'; // <--- Make sure this path points to your saved image

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // State for controlling the Profile Modal
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    // Determine user roles for conditional rendering
    const isManagerOrAdmin = user?.role === 'Manager' || user?.role === 'Admin';
    const isAdmin = user?.role === 'Admin';

    // Function to determine the portal text based on role
    const getPortalText = (role) => {
        switch (role) {
            case 'Admin':
                return 'Admin Portal';
            case 'Manager':
                return 'Manager Portal';
            case 'Employee':
            default:
                return 'Employee Portal';
        }
    };
    
    const portalText = getPortalText(user?.role);

    // Common Styles for Links
    const linkClass = ({ isActive }) => {
        const baseClasses = 'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group';
        const activeClasses = 'bg-violet-600 text-white shadow-lg shadow-violet-900/20';
        const inactiveClasses = 'text-slate-400 hover:bg-slate-800 hover:text-white';
        
        return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <div className="w-72 bg-slate-900 text-white p-6 flex flex-col hidden lg:flex shadow-xl z-20 h-screen sticky top-0 border-r border-slate-800">
                
                {/* Logo Area */}
                <div className="flex items-center mb-12">
                    <div className="flex items-center gap-3">
                        {/* ✅ REPLACED: Old icon removed, new Image added here */}
                        <img 
                            src={logo} 
                            alt="EncoraOne Logo" 
                            className="w-12 h-12 object-contain" // Adjusted size to fit well
                        />
                        
                        <div>
                            <h1 className="font-bold text-xl tracking-tight">EncoraOne</h1>
                            <p className="text-xs text-slate-400 font-medium">{portalText}</p>
                        </div>
                    </div>
                    
                    {/* Notification Bell */}
                    <div className="ml-auto">
                        <NotificationPanel />
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 space-y-2">
                    {/* Overview Link */}
                    <NavLink to="/dashboard" className={linkClass}>
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Overview</span>
                    </NavLink>
                    
                    {/* Reports/Analytics Link (Visible to Manager/Admin) */}
                    {isManagerOrAdmin && (
                        <NavLink to="/reports" className={linkClass}>
                            <List className="w-5 h-5" />
                            <span className="font-medium">Reports</span>
                        </NavLink>
                    )}

                    {isAdmin && (
                        <>
                            <NavLink to="/admin" className={linkClass}>
                                <User className="w-5 h-5" />
                                <span className="font-medium">User Management</span>
                            </NavLink>
                            {/* Departments Link */}
                            <NavLink to="/departments" className={linkClass}>
                                <Building2 className="w-5 h-5" />
                                <span className="font-medium">Departments</span>
                            </NavLink>
                        </>
                    )}
                </nav>

                {/* User Footer */}
                <div className="pt-6 border-t border-slate-800">
                    
                    {/* User Profile Trigger */}
                    <div
                        className="flex items-center gap-3 mb-4 px-2 p-3 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-700/50 transition-colors border border-transparent hover:border-slate-700"
                        onClick={() => setIsProfileOpen(true)}
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600 shadow-sm relative">
                            <User className="w-5 h-5 text-slate-300" />
                            {/* Online indicator dot */}
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-800 rounded-full"></span>
                        </div>
                        <div className="overflow-hidden text-left">
                            <p className="text-sm font-semibold truncate text-slate-200">{user?.fullName}</p>
                            <p className="text-xs text-slate-400 truncate">{user?.role}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors text-sm font-medium border border-transparent hover:border-red-500/20"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </div>

            {/* The Profile Modal component */}
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                user={user}
            />
        </>
    );
};

export default Sidebar;