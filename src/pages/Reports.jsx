import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell, BarChart, Bar, ComposedChart, Line
} from 'recharts';
import { 
    FileText, TrendingUp, CheckCircle, AlertCircle, Loader2, Download, 
    Clock, ChevronDown, Users, BarChart3, ArrowUpRight, ArrowDownRight,
    Medal, Briefcase, Zap, AlertTriangle, Trophy, Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

// 👇 NEW LIBRARY IMPORT
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

// --- THEME ---
const THEME = {
    primary: '#6366f1',   // Indigo
    success: '#10b981',   // Emerald
    warning: '#f59e0b',   // Amber
    danger:  '#ef4444',   // Red
    info:    '#3b82f6',   // Blue
    slate:   '#64748b',   // Slate
    line:    '#8b5cf6',   // Purple
    grid:    '#f1f5f9'    // Grid
};

// --- HELPER: Get Local Date Key ---
const getLocalDateKey = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// --- CUSTOM TOOLTIP ---
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-white/20 min-w-[180px] z-50">
                <p className="text-sm font-bold text-slate-800 mb-2 border-b pb-2">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between gap-4 mb-1">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.stroke }} />
                            <span className="text-xs font-medium text-slate-500 capitalize">{entry.name}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-800">
                            {entry.value}
                            {entry.name.includes('Efficiency') ? '%' : ''}
                        </span>
                    </div>
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
    const [isExporting, setIsExporting] = useState(false);
    
    // --- FILTERS ---
    const [trendFilter, setTrendFilter] = useState('7D'); 
    const [selectedDept, setSelectedDept] = useState('All');

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
                setComplaints(res.data || []);
            } catch (error) {
                console.error("Failed to fetch report data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, isAdmin, isManager]);

    // --- PDF EXPORT FUNCTION (FIXED FOR TAILWIND / OKLAB) ---
    const handleExportPDF = async () => {
        setIsExporting(true);
        const element = document.getElementById('report-dashboard');

        try {
            // 1. Generate Image using html-to-image (Supports modern CSS like oklab)
            const dataUrl = await toPng(element, { 
                cacheBust: true,
                backgroundColor: '#f8fafc', // Force light background
                quality: 0.95,
                // This filter automatically hides anything with 'no-print' class
                filter: (node) => {
                    if (node.classList && node.classList.contains('no-print')) {
                        return false;
                    }
                    return true;
                }
            });

            // 2. Generate PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const imgProps = pdf.getImageProperties(dataUrl);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, imgHeight);
            
            const dateStr = new Date().toISOString().split('T')[0];
            pdf.save(`EncoraOne_Report_${dateStr}.pdf`);

        } catch (err) {
            console.error("Export Error:", err);
            alert("PDF Generation Failed. Check console.");
        } finally {
            setIsExporting(false);
        }
    };

    // --- ENGINES ---

    // 1. HERO STATS
    const heroStats = useMemo(() => {
        const total = complaints.length;
        const resolved = complaints.filter(c => (c.status || '').toLowerCase() === 'resolved').length;
        const pending = complaints.filter(c => (c.status || '').toLowerCase() === 'pending').length;
        const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;
        
        return [
            { label: 'Total Queries', value: total, icon: FileText, color: 'text-indigo-600', gradient: 'from-indigo-500/10 to-indigo-500/5', border: 'border-indigo-100', trend: 'Lifetime' },
            { label: 'Resolved', value: resolved, icon: CheckCircle, color: 'text-emerald-600', gradient: 'from-emerald-500/10 to-emerald-500/5', border: 'border-emerald-100', trend: 'Completed' },
            { label: 'Pending Action', value: pending, icon: Clock, color: 'text-amber-600', gradient: 'from-amber-500/10 to-amber-500/5', border: 'border-amber-100', trend: 'Active' },
            { label: 'Resolution Rate', value: `${rate}%`, icon: Activity, color: 'text-blue-600', gradient: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-100', trend: 'Efficiency' }
        ];
    }, [complaints]);

    // 2. TREND DATA
    const trendData = useMemo(() => {
        const now = new Date();
        let dataPoints = [];

        const addDays = (days) => {
            const arr = [];
            for (let i = days - 1; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                arr.push({ 
                    dateObj: d,
                    key: getLocalDateKey(d),
                    label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                });
            }
            return arr;
        };

        const addMonths = (months) => {
            const arr = [];
            for (let i = months - 1; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                arr.push({ 
                    dateObj: d,
                    key: `${year}-${month}`, 
                    label: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
                });
            }
            return arr;
        };

        if (trendFilter === '7D') dataPoints = addDays(7);
        else if (trendFilter === '30D') dataPoints = addDays(30);
        else if (trendFilter === '6M') dataPoints = addMonths(6);
        else if (trendFilter === 'YTD') {
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            const monthsDiff = now.getMonth() - startOfYear.getMonth() + 1;
            dataPoints = addMonths(monthsDiff);
        }

        return dataPoints.map(point => {
            const match = complaints.filter(c => {
                const cDate = new Date(c.createdAt);
                if (trendFilter === '6M' || trendFilter === 'YTD') {
                    const cKey = `${cDate.getFullYear()}-${String(cDate.getMonth() + 1).padStart(2, '0')}`;
                    return cKey === point.key;
                } else {
                    const cKey = getLocalDateKey(c.createdAt);
                    return cKey === point.key;
                }
            });

            return {
                name: point.label,
                Received: match.length,
                Resolved: match.filter(c => (c.status || '').toLowerCase() === 'resolved').length
            };
        });
    }, [complaints, trendFilter]);

    // 3. DEPT EFFICIENCY (STACKED)
    const { deptEfficiencyData, kpiStats } = useMemo(() => {
        const data = {};
        
        complaints.forEach(c => {
            const dept = c.departmentName || 'General';
            if (!data[dept]) data[dept] = { name: dept, Total: 0, Resolved: 0, Pending: 0, InProgress: 0 };
            
            data[dept].Total++;
            const status = (c.status || '').toLowerCase();
            
            if (status === 'resolved') data[dept].Resolved++;
            else if (status === 'pending') data[dept].Pending++;
            else data[dept].InProgress++; 
        });

        let result = Object.values(data).map(d => ({
            ...d,
            Efficiency: d.Total > 0 ? Math.round((d.Resolved / d.Total) * 100) : 0
        }));

        const sortedByEff = [...result].sort((a, b) => b.Efficiency - a.Efficiency);
        const topPerformer = sortedByEff.length > 0 ? sortedByEff[0] : { name: 'N/A', Efficiency: 0 };
        const lowPerformer = sortedByEff.length > 0 ? sortedByEff[sortedByEff.length - 1] : { name: 'N/A', Efficiency: 0 };
        const avgEfficiency = result.length > 0 ? Math.round(result.reduce((acc, curr) => acc + curr.Efficiency, 0) / result.length) : 0;

        if (selectedDept !== 'All') result = result.filter(d => d.name === selectedDept);
        
        return { 
            deptEfficiencyData: result.sort((a, b) => b.Total - a.Total),
            kpiStats: { topPerformer, lowPerformer, avgEfficiency }
        };
    }, [complaints, selectedDept]);

    // 4. OTHER STATS
    const statusStats = useMemo(() => {
        const total = complaints.length;
        const pending = complaints.filter(c => (c.status || '').toLowerCase() === 'pending').length;
        const resolved = complaints.filter(c => (c.status || '').toLowerCase() === 'resolved').length;
        const inProgress = total - pending - resolved;
        return [
            { name: 'Pending', value: pending, color: THEME.warning, percent: total ? Math.round((pending/total)*100) : 0 },
            { name: 'In Progress', value: inProgress, color: THEME.info, percent: total ? Math.round((inProgress/total)*100) : 0 },
            { name: 'Resolved', value: resolved, color: THEME.success, percent: total ? Math.round((resolved/total)*100) : 0 },
        ];
    }, [complaints]);

    const employeeStats = useMemo(() => {
        const counts = {};
        complaints.forEach(c => {
            const name = c.employeeName || 'Unknown';
            counts[name] = (counts[name] || 0) + 1;
        });
        return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 5);
    }, [complaints]);

    const managerStats = useMemo(() => {
        const counts = {};
        complaints.forEach(c => {
            const manager = c.resolvedBy || c.managerName || 'System Admin'; 
            if ((c.status || '').toLowerCase() === 'resolved') counts[manager] = (counts[manager] || 0) + 1;
        });
        return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 5); 
    }, [complaints]);

    const comparisonStats = useMemo(() => {
        const resolved = complaints.filter(c => (c.status || '').toLowerCase() === 'resolved').length;
        const pending = complaints.filter(c => (c.status || '').toLowerCase() === 'pending').length;
        return [{ name: 'Volume', Resolved: resolved, Pending: pending }];
    }, [complaints]);

    const departments = useMemo(() => ['All', ...new Set(complaints.map(c => c.departmentName || 'Unknown'))], [complaints]);

    if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>;

    return (
        <div id="report-dashboard" className="min-h-screen bg-slate-50/50 p-6 space-y-8 font-sans text-slate-800">
            
            {/* HEADER */}
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Analytics Dashboard</h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> System Performance & Efficiency Reports
                    </p>
                </div>
                <button onClick={handleExportPDF} disabled={isExporting} className="no-print bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                    {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Export PDF
                </button>
            </motion.div>

            {/* HERO STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {heroStats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className={`relative overflow-hidden rounded-2xl p-6 border shadow-lg backdrop-blur-xl bg-white/70 ${stat.border} group transition-all duration-300`}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50 group-hover:opacity-100 transition-opacity`} />
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
                                <h3 className="text-4xl font-bold text-slate-800 tracking-tight">{stat.value}</h3>
                                <div className="mt-2 flex items-center gap-1"><span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/60 ${stat.color}`}>{stat.trend}</span></div>
                            </div>
                            <div className={`p-3 rounded-2xl bg-white shadow-sm ${stat.color}`}><stat.icon className="w-6 h-6" /></div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* 1. TREND ANALYSIS */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-indigo-500" /> Grievance Volume
                        </h3>
                    </div>
                    <div className="relative no-print">
                        <select value={trendFilter} onChange={(e) => setTrendFilter(e.target.value)} className="appearance-none bg-slate-50 border border-slate-200 pl-4 pr-10 py-2 rounded-lg text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer">
                            <option value="7D">Last 7 Days (Daily)</option>
                            <option value="30D">Last 30 Days (Daily)</option>
                            <option value="6M">Last 6 Months (Monthly)</option>
                            <option value="YTD">Year to Date</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={THEME.primary} stopOpacity={0.3}/><stop offset="95%" stopColor={THEME.primary} stopOpacity={0}/></linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={THEME.grid} vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: THEME.slate, fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: THEME.slate, fontSize: 12}} />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="Received" stroke={THEME.primary} fill="url(#colorRec)" strokeWidth={3} />
                            <Area type="monotone" dataKey="Resolved" stroke={THEME.success} fill="transparent" strokeWidth={3} />
                            <Legend />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* 2. DEPT EFFICIENCY (STACKED) */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-indigo-500" />
                            Department Efficiency Breakdown
                        </h3>
                        <p className="text-sm text-slate-400">Status Mix (Pending/In-Progress/Resolved) vs Efficiency %</p>
                    </div>
                    <div className="relative no-print">
                        <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="appearance-none bg-slate-50 border border-slate-200 pl-4 pr-10 py-2 rounded-lg text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer">
                            {departments.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                {selectedDept === 'All' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-emerald-50 to-white p-4 rounded-xl border border-emerald-100 flex items-center gap-4">
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Trophy className="w-5 h-5" /></div>
                            <div><p className="text-xs text-emerald-600 font-bold uppercase">Top Performer</p><p className="font-bold text-slate-800">{kpiStats.topPerformer.name}</p><p className="text-xs text-slate-500">{kpiStats.topPerformer.Efficiency}% Efficiency</p></div>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-xl border border-indigo-100 flex items-center gap-4">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Zap className="w-5 h-5" /></div>
                            <div><p className="text-xs text-indigo-600 font-bold uppercase">Avg Efficiency</p><p className="font-bold text-slate-800">{kpiStats.avgEfficiency}%</p><p className="text-xs text-slate-500">Across all depts</p></div>
                        </div>
                        <div className="bg-gradient-to-br from-amber-50 to-white p-4 rounded-xl border border-amber-100 flex items-center gap-4">
                            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><AlertTriangle className="w-5 h-5" /></div>
                            <div><p className="text-xs text-amber-600 font-bold uppercase">Needs Attention</p><p className="font-bold text-slate-800">{kpiStats.lowPerformer.name}</p><p className="text-xs text-slate-500">{kpiStats.lowPerformer.Efficiency}% Efficiency</p></div>
                        </div>
                    </div>
                )}

                <div className="h-[380px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={deptEfficiencyData} barSize={40}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={THEME.grid} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: THEME.slate, fontSize: 12}} dy={10} />
                            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: THEME.slate, fontSize: 12}} />
                            <YAxis yAxisId="right" orientation="right" unit="%" axisLine={false} tickLine={false} tick={{fill: THEME.line, fontSize: 12, fontWeight: 'bold'}} />
                            <RechartsTooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                            <Legend iconType="circle" />
                            
                            {/* Stacked Bars */}
                            <Bar yAxisId="left" dataKey="Pending" stackId="a" fill={THEME.warning} />
                            <Bar yAxisId="left" dataKey="InProgress" name="In Progress" stackId="a" fill={THEME.info} />
                            <Bar yAxisId="left" dataKey="Resolved" stackId="a" fill={THEME.success} radius={[4, 4, 0, 0]} />
                            
                            {/* Efficiency Line */}
                            <Line yAxisId="right" type="monotone" dataKey="Efficiency" name="Efficiency %" stroke={THEME.line} strokeWidth={4} dot={{r: 5, fill: '#fff', stroke: THEME.line, strokeWidth: 2}} activeDot={{r: 7}} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* 3. LEADERBOARDS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><Medal className="w-5 h-5 text-amber-500" /> Performance Leaders (Managers)</h3>
                    <div className="space-y-6">
                        {managerStats.length > 0 ? managerStats.map((mgr, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>{i + 1}</div>
                                <div className="flex-1"><div className="flex justify-between text-sm mb-1"><span className="font-semibold text-slate-800">{mgr.name}</span><span className="font-bold text-emerald-600">{mgr.count} Resolved</span></div><div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(mgr.count / (managerStats[0]?.count || 1)) * 100}%` }} /></div></div>
                            </div>
                        )) : <p className="text-center text-slate-400 py-4">No data available</p>}
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><Users className="w-5 h-5 text-indigo-500" /> Top Contributors (Employees)</h3>
                    <div className="space-y-6">
                        {employeeStats.map((emp, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500">{i + 1}</div>
                                <div className="flex-1"><div className="flex justify-between text-sm mb-1"><span className="font-medium text-slate-700">{emp.name}</span><span className="font-bold text-slate-900">{emp.count} Cases</span></div><div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(emp.count / (employeeStats[0]?.count || 1)) * 100}%` }} /></div></div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* 4. STATUS & COMPARISON */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-indigo-500" /> Status Distribution</h3>
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                        <div className="relative w-48 h-48 flex-shrink-0">
                            <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statusStats} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">{statusStats.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Pie><RechartsTooltip content={<CustomTooltip />} /></PieChart></ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"><span className="text-3xl font-bold text-slate-800">{complaints.length}</span><span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total</span></div>
                        </div>
                        <div className="flex-1 w-full space-y-4">{statusStats.map((item) => (<div key={item.name} className="group"><div className="flex justify-between items-center mb-1"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} /><span className="text-sm font-medium text-slate-600">{item.name}</span></div><div className="text-sm font-bold text-slate-800">{item.value} ({item.percent}%)</div></div><div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${item.percent}%`, backgroundColor: item.color }} /></div></div>))}</div>
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><ArrowUpRight className="w-5 h-5 text-amber-500" /> Pending vs Resolved</h3>
                    <div className="flex items-center justify-center h-[200px] mb-4">
                        <ResponsiveContainer width="100%" height="100%"><BarChart data={comparisonStats} layout="vertical" barSize={40}><CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={THEME.grid} /><XAxis type="number" hide /><YAxis type="category" dataKey="name" hide /><RechartsTooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} /><Bar dataKey="Resolved" fill={THEME.success} radius={[4, 0, 0, 4]} /><Bar dataKey="Pending" fill={THEME.warning} radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-emerald-50 p-4 rounded-xl text-center border border-emerald-100"><p className="text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">Resolved</p><p className="text-2xl font-bold text-emerald-700">{statusStats.find(s=>s.name==='Resolved')?.value || 0}</p></div>
                        <div className="bg-amber-50 p-4 rounded-xl text-center border border-amber-100"><p className="text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">Pending</p><p className="text-2xl font-bold text-amber-700">{statusStats.find(s=>s.name==='Pending')?.value || 0}</p></div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Reports;