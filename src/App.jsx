import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext'; // NEW Import
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import MainLayout from './components/layout/MainLayout';
import NotificationToast from './components/ui/NotificationToast'; // NEW Import

const ProtectedRoute = ({ children, roleRequired }) => {
    const { user, loading } = useAuth();
    
    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    
    if (roleRequired && !['Manager', 'Admin'].includes(user.role)) {
        return <Navigate to="/dashboard" />;
    }
    
    return children;
};

const App = () => {
    return (
        <AuthProvider>
            <NotificationProvider> {/* Wrap App */}
                <Router>
                    <NotificationToast /> {/* Add Toast Container */}
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        
                        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            
                            <Route 
                                path="/reports" 
                                element={
                                    <ProtectedRoute roleRequired={true}>
                                        <Reports />
                                    </ProtectedRoute>
                                } 
                            />
                        </Route>
                        
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                    </Routes>
                </Router>
            </NotificationProvider>
        </AuthProvider>
    );
};

export default App;