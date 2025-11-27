import React from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Shield, Building2, Hash } from 'lucide-react';

const ProfileModal = ({ isOpen, onClose, user }) => {
    if (!user) return null;

    // Get initials for avatar
    const initials = user.fullName
        ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
        : 'U';

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]" 
                        onClick={onClose} 
                    />
                    
                    {/* Modal Content */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                        className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none"
                    >
                        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden pointer-events-auto relative">
                            
                            {/* Header Background Pattern */}
                            <div className="h-24  relative">
                                <button 
                                    onClick={onClose} 
                                    className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/20 text-white rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Profile Content */}
                            <div className="px-6 pb-8 -mt-12 text-center">
                                {/* Avatar */}
                                <div className="w-24 h-24 mx-auto bg-white p-1.5 rounded-full shadow-lg mb-4">
                                    <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-slate-500 text-2xl font-bold border border-slate-200">
                                        {initials}
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-slate-800 mb-1">{user.fullName}</h2>
                                <p className="text-slate-500 text-sm mb-6">{user.email}</p>

                                {/* Details Grid */}
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-4 text-left">
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Shield className="w-4 h-4 text-violet-500" />
                                            <span className="text-sm font-medium">Role</span>
                                        </div>
                                        <span className="px-2.5 py-1 bg-violet-100 text-violet-700 text-xs font-bold rounded-lg uppercase tracking-wide">
                                            {user.role}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Hash className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm font-medium">User ID</span>
                                        </div>
                                        <span className="text-sm font-mono text-slate-800">
                                            {user.id}
                                        </span>
                                    </div>

                                    {/* Only show Department if available (Managers/Admins often have this) */}
                                    {user.deptId && (
                                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-3 text-slate-600">
                                                <Building2 className="w-4 h-4 text-emerald-500" />
                                                <span className="text-sm font-medium">Department ID</span>
                                            </div>
                                            <span className="text-sm font-bold text-slate-800">
                                                {user.deptId}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default ProfileModal;