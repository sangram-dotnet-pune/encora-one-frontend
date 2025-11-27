import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { FileText, TrendingUp, Users, CheckCircle, AlertCircle, Loader2, Download, Activity, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-800 text-white p-3 rounded-lg shadow-xl border border-slate-700 z-50">
                <p className="text-sm font-bold mb-2 border-b border-slate-600 pb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-xs flex items-center gap-2 mb-1">
                        <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.color }}></span>
                        <span className="opacity-80">{entry.name}:</span> 
                        <span className="font-mono font-bold ml-auto">{entry.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const Reports = () => {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    const isManager = user?.role === 'Manager';
    const isAdmin = user?.role === 'Admin';

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                let endpoint = '/Complaint/my-complaints';
                if (isAdmin) endpoint = '/Complaint/all';
                else if (isManager) endpoint = `/Complaint/department/${user.deptId || 0}`;

                const res = await api.get(endpoint);
                setComplaints(res.data);
            } catch (error) {
                console.error("Failed to fetch report data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    // --- DATA PROCESSING ---

    const stats = useMemo(() => {
        const total = complaints.length;
        const pending = complaints.filter(c => c.status === 'Pending').length;
        const resolved = complaints.filter(c => c.status === 'Resolved').length;
        const inProgress = complaints.filter(c => c.status === 'In Progress' || c.status === 'InProgress').length;
        const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

        return { total, pending, resolved, inProgress, resolutionRate };
    }, [complaints]);

    const statusData = useMemo(() => [
        { name: 'Pending', value: stats.pending, color: '#F97316' }, 
        { name: 'In Progress', value: stats.inProgress, color: '#3B82F6' },
        { name: 'Resolved', value: stats.resolved, color: '#10B981' }, 
        { name: 'Returned', value: complaints.filter(c => c.status === 'Returned').length, color: '#8B5CF6' } 
    ].filter(d => d.value > 0), [stats, complaints]);

    const monthlyTrend = useMemo(() => {
        const data = {};
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        complaints.forEach(c => {
            const date = new Date(c.createdAt);
            const monthKey = `${months[date.getMonth()]} ${date.getFullYear().toString().substr(-2)}`;
            if (!data[monthKey]) data[monthKey] = { name: monthKey, received: 0, resolved: 0 };
            data[monthKey].received += 1;
            if (c.status === 'Resolved') data[monthKey].resolved += 1;
        });
        return Object.values(data);
    }, [complaints]);

    // NEW: Department Performance Stacked Data
    const deptPerformance = useMemo(() => {
        const data = {};
        complaints.forEach(c => {
            const dept = c.departmentName || 'Unknown';
            if (!data[dept]) data[dept] = { name: dept, Pending: 0, Resolved: 0, InProgress: 0 };
            
            const status = c.status?.replace(/\s/g, '') || 'Pending';
            if (status === 'Resolved') data[dept].Resolved++;
            else if (status === 'Pending') data[dept].Pending++;
            else data[dept].InProgress++;
        });
        return Object.values(data);
    }, [complaints]);

    // NEW: Weekly Pattern Radar Data
    const weeklyPattern = useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const data = days.map(day => ({ subject: day, count: 0, fullMark: 0 }));
        
        let maxCount = 0;
        complaints.forEach(c => {
            const dayIndex = new Date(c.createdAt).getDay();
            data[dayIndex].count++;
            if(data[dayIndex].count > maxCount) maxCount = data[dayIndex].count;
        });
        
        return data.map(d => ({ ...d, fullMark: maxCount }));
    }, [complaints]);

    const employeeData = useMemo(() => {
        const counts = {};
        complaints.forEach(c => {
            const name = c.employeeName || 'Unknown';
            counts[name] = (counts[name] || 0) + 1;
        });
        return Object.keys(counts)
            .map(key => ({ name: key, complaints: counts[key] }))
            .sort((a, b) => b.complaints - a.complaints)
            .slice(0, 5);
    }, [complaints]);

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-violet-600" /></div>;

    return (
        <div className="space-y-8 pb-10">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Analytics & Reports</h2>
                    <p className="text-slate-500">Insights for {isAdmin ? "System-Wide Operations" : "Department Performance"}</p>
                </div>
                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors">
                    <Download className="w-4 h-4" /> Export PDF
                </button>
            </motion.div>

            {/* 1. HERO METRICS */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
                <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-6 rounded-2xl text-white shadow-lg shadow-violet-200 transform hover:scale-[1.02] transition-transform">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-white/20 rounded-lg"><FileText className="w-6 h-6" /></div>
                        <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded">Total</span>
                    </div>
                    <h3 className="text-4xl font-bold mb-1">{stats.total}</h3>
                    <p className="text-violet-100 text-sm">Grievances Recorded</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><CheckCircle className="w-6 h-6" /></div>
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{stats.resolutionRate}% Rate</span>
                    </div>
                    <h3 className="text-4xl font-bold text-slate-800 mb-1">{stats.resolved}</h3>
                    <p className="text-slate-500 text-sm">Issues Resolved</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><AlertCircle className="w-6 h-6" /></div>
                    </div>
                    <h3 className="text-4xl font-bold text-slate-800 mb-1">{stats.pending}</h3>
                    <p className="text-slate-500 text-sm">Pending Action</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><TrendingUp className="w-6 h-6" /></div>
                    </div>
                    <h3 className="text-4xl font-bold text-slate-800 mb-1">{stats.inProgress}</h3>
                    <p className="text-slate-500 text-sm">Work In Progress</p>
                </div>
            </motion.div>

            {/* 2. MAIN VISUALIZATIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Trend Chart */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-violet-500" />
                            Grievance Trends
                        </h3>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="4 4" />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                <Legend iconType="circle" />
                                <Area type="monotone" dataKey="received" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorReceived)" strokeWidth={3} name="Received" />
                                <Area type="monotone" dataKey="resolved" stroke="#10B981" fillOpacity={1} fill="url(#colorResolved)" strokeWidth={3} name="Resolved" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Status Breakdown */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col"
                >
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Status Breakdown</h3>
                    <div className="flex-1 min-h-[300px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                            <span className="text-3xl font-bold text-slate-800">{stats.total}</span>
                            <span className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Total</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* 3. ADVANCED METRICS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Department Performance Stacked Bar */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                >
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-500" />
                        Department Efficiency
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={deptPerformance} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
                                <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                                <Legend iconType="circle" />
                                <Bar dataKey="Pending" stackId="a" fill="#f97316" radius={[0, 0, 0, 0]} barSize={20} />
                                <Bar dataKey="InProgress" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} barSize={20} name="In Progress" />
                                <Bar dataKey="Resolved" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Weekly Pattern Radar Chart */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                >
                    <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-pink-500" />
                        Submission Intensity (Weekly)
                    </h3>
                    <div className="h-72 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={weeklyPattern}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                                <Radar name="Complaints" dataKey="count" stroke="#ec4899" strokeWidth={3} fill="#ec4899" fillOpacity={0.2} />
                                <Tooltip content={<CustomTooltip />} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* 4. LEADERBOARD */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
            >
                <h3 className="text-lg font-bold text-slate-800 mb-6">Most Active Reporters (Top 5)</h3>
                <div className="space-y-4">
                    {employeeData.map((emp, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs group-hover:bg-violet-100 group-hover:text-violet-600 transition-colors">
                                {i + 1}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-slate-700">{emp.name}</span>
                                    <span className="text-sm font-bold text-slate-900">{emp.complaints}</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${(emp.complaints / Math.max(...employeeData.map(e => e.complaints))) * 100}%` }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                        className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" 
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    {employeeData.length === 0 && <p className="text-center text-slate-400 py-10">No data available</p>}
                </div>
            </motion.div>
        </div>
    );
};

export default Reports;