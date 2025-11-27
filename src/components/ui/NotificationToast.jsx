import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

const NotificationToast = () => {
    const { notifications, removeNotification } = useNotification();

    return (
        <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {notifications.map((notif) => (
                    <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                        className="pointer-events-auto bg-white border border-slate-100 shadow-xl rounded-xl p-4 w-80 flex items-start gap-3 backdrop-blur-sm"
                    >
                        <div className="p-2 bg-violet-100 rounded-full shrink-0">
                            <Bell className="w-4 h-4 text-violet-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-slate-800 mb-0.5">Notification</h4>
                            <p className="text-sm text-slate-600 leading-tight">{notif.message}</p>
                            <span className="text-xs text-slate-400 mt-1 block">{notif.time}</span>
                        </div>
                        <button 
                            onClick={() => removeNotification(notif.id)}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default NotificationToast;