import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, AlertCircle, CheckCircle, Plus, CheckSquare, MessageSquare, LogOut, Search, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Sidebar from '../components/layout/Sidebar';
import StatusBadge from '../components/ui/StatusBadge';
import CreateComplaintModal from '../components/modals/CreateComplaintModal';
import UpdateStatusModal from '../components/modals/UpdateStatusModal';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // NEW: State for Status Filter
    const [statusFilter, setStatusFilter] = useState('All');

    const isManager = user?.role === 'Manager';
    const isAdmin = user?.role === 'Admin';
    const canManage = isManager || isAdmin;

    const fetchComplaints = async () => {
        if (!user) return;
        
        try {
            let endpoint = '/Complaint/my-complaints';

            // Admin sees ALL, Manager sees Department, Employee sees Own
            if (isAdmin) {
                endpoint = '/Complaint/all';
            } else if (isManager) {
                const deptId = user.deptId || 0;
                endpoint = `/Complaint/department/${deptId}`;
            }

            const res = await api.get(endpoint);
            setComplaints(res.data);
        } catch (error) {
            console.error("Failed to load complaints", error);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, [user]);

    const handleAction = () => {
        fetchComplaints(); // Refresh data
    };

    const openUpdateModal = (c) => {
        setSelectedComplaint(c);
        setIsUpdateModalOpen(true);
    };

    // UPDATED: Filter Logic (Search + Status)
    const filteredComplaints = complaints.filter(c => {
        // 1. Search Filter
        const matchesSearch = 
            c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.complaintId.toString().includes(searchTerm);

        // 2. Status Filter
        // Normalize strings to handle "In Progress" vs "InProgress" discrepancies
        const normalize = (str) => str?.replace(/\s/g, '').toLowerCase() || '';
        const matchesStatus = statusFilter === 'All' || normalize(c.status) === normalize(statusFilter);

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} complaintCount={complaints.length} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm z-10">
                    <div className="font-bold text-lg text-slate-800">EncoraOne</div>
                    <button onClick={logout}><LogOut className="w-5 h-5 text-slate-600" /></button>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-10 bg-slate-50/50">
                    <div className="max-w-6xl mx-auto">
                        <AnimatePresence mode="wait">
                            {activeTab === 'overview' ? (
                                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                                    <header className="mb-8">
                                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Dashboard Overview</h2>
                                        <p className="text-slate-500">Hello {user?.fullName}. Here is the summary for {isAdmin ? "the entire system" : "your account"}.</p>
                                    </header>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        {[
                                            { label: 'Total Complaints', val: complaints.length, color: 'blue', icon: FileText },
                                            { label: 'Pending Action', val: complaints.filter(c => c.status === 'Pending').length, color: 'orange', icon: AlertCircle },
                                            { label: 'Resolved Issues', val: complaints.filter(c => c.status === 'Resolved').length, color: 'emerald', icon: CheckCircle }
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                                                        <h3 className="text-4xl font-bold text-slate-800 tracking-tight">{stat.val}</h3>
                                                    </div>
                                                    <div className={`p-3 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl`}><stat.icon className="w-6 h-6" /></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {!canManage && (
                                        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl shadow-violet-500/20 relative overflow-hidden">
                                            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                                <div>
                                                    <h3 className="text-xl font-bold mb-2">Facing an issue at work?</h3>
                                                    <p className="text-violet-100 max-w-md">Raise a grievance directly to the concerned department.</p>
                                                </div>
                                                <button onClick={() => { setActiveTab('complaints'); setTimeout(() => setIsCreateModalOpen(true), 300); }} className="px-6 py-3 bg-white text-violet-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all flex items-center gap-2">
                                                    <Plus className="w-5 h-5" /> Raise Complaint
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div key="complaints" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                        <div>
                                            <h2 className="text-3xl font-bold text-slate-800 mb-2">
                                                {isAdmin ? "System-Wide Grievances" : isManager ? "Department Grievances" : "My Complaints"}
                                            </h2>
                                            <p className="text-slate-500">Manage and track the status of reported issues.</p>
                                        </div>
                                        {!canManage && (
                                            <button onClick={() => setIsCreateModalOpen(true)} className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl shadow-lg shadow-violet-500/25 transition-all flex items-center gap-2">
                                                <Plus className="w-5 h-5" /> New Complaint
                                            </button>
                                        )}
                                    </header>

                                    {/* UPDATED: Filter & Search Bar */}
                                    <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-2">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Search by title, ID or description..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                                            />
                                        </div>
                                        <div className="flex items-center border-t md:border-t-0 md:border-l border-slate-100 pt-2 md:pt-0 md:pl-2">
                                            <Filter className="w-4 h-4 text-slate-400 ml-2" />
                                            <select 
                                                value={statusFilter}
                                                onChange={(e) => setStatusFilter(e.target.value)}
                                                className="bg-transparent outline-none text-slate-600 text-sm font-medium py-2 pl-2 pr-4 cursor-pointer hover:text-violet-600 transition-colors"
                                            >
                                                <option value="All">All Status</option>
                                                <option value="Pending">Pending</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Resolved">Resolved</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {filteredComplaints.length === 0 ? (
                                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"><FileText className="w-8 h-8 text-slate-400" /></div>
                                                <h3 className="text-lg font-medium text-slate-900">No complaints found</h3>
                                                <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filters.</p>
                                            </div>
                                        ) : (
                                            filteredComplaints.map((c) => (
                                                <motion.div key={c.complaintId} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">#{c.complaintId}</div>
                                                            <div>
                                                                <h4 className="font-bold text-slate-800 group-hover:text-violet-600 transition-colors">{c.title}</h4>
                                                                <p className="text-xs text-slate-500">
                                                                    {canManage ? `By ${c.employeeName || 'Employee'}` : c.departmentName} • {new Date(c.createdAt).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <StatusBadge status={c.status} />
                                                            {canManage && (
                                                                <button onClick={() => openUpdateModal(c)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
                                                                    <CheckSquare className="w-4 h-4" /> Review
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-slate-600 line-clamp-2 pl-[3.25rem]">{c.description}</p>
                                                    {c.managerRemarks && (
                                                        <div className="mt-3 ml-[3.25rem] bg-slate-50 p-3 rounded-lg border border-slate-100 flex gap-2">
                                                            <MessageSquare className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="text-xs font-semibold text-slate-700">Manager Remarks:</p>
                                                                <p className="text-sm text-slate-600">{c.managerRemarks}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>
            </div>
            
            <CreateComplaintModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onComplaintCreated={handleAction} />
            <UpdateStatusModal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} complaint={selectedComplaint} onUpdate={handleAction} />
        </div>
    );
};

export default Dashboard;