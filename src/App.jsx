import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import Login from './pages/Login.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Reports from './pages/Reports.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import NotificationToast from './components/ui/NotificationToast.jsx';
import AdminPage from './pages/AdminPage.jsx';
import DepartmentPage from './pages/DepartmentPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import AboutPage from './pages/AboutPage.jsx'; // NEW Import
import GlassNavbar from './components/ui/GlassNavbar.jsx';
import { useState, useEffect, useRef } from 'react';
 
 
import { X, MessageSquare, Send } from 'lucide-react';
 
// Gemini Model
const GEMINI_MODEL = 'gemini-2.5-flash-preview-09-2025';
 
 
// -------------------------------------------------------------
// CHATBOT POPUP COMPONENT
// -------------------------------------------------------------
const ChatbotPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', text: 'Hello! I am your AI assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);
 
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
 
    const withExponentialBackoff = async (fn, maxRetries = 5) => {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    };
 
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
 
        const userMessage = { role: 'user', text: input.trim() };
        const newHistory = [...messages, userMessage];
 
        setMessages(newHistory);
        setInput('');
        setIsLoading(true);
 
        const chatHistory = newHistory.map(msg => ({
            role: msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.text }]
        }));
 
        const payload = {
            contents: chatHistory,
            systemInstruction: {
                parts: [
                    { text: 'You are a helpful and friendly administrative assistant for a user management platform.' }
                ]
            }
        };
 
        // const apiKey = process.env.GEMINI_API_KEY || process.env.REACT_APP_GEMINI_API_KEY || "";
        // const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKe…
 
        const apiKey = "AIzaSyDeY-NAi_rOZMR5wluNq5AqqLFLWRPLoc8";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
 
 
        try {
            const response = await withExponentialBackoff(() =>
                fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
            );
 
            if (!response.ok) throw new Error(`Status ${response.status}`);
 
            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
 
            setMessages(prev => [...prev, { role: 'model', text: text || 'Empty AI response.' }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', text: 'API error. Try again later.' }]);
        } finally {
            setIsLoading(false);
        }
    };
 
    const Message = ({ message }) => (
        <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`max-w-xs sm:max-w-md px-4 py-3 rounded-2xl shadow-md ${
                    message.role === 'user'
                        ? 'bg-violet-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-slate-800 rounded-tl-none'
                }`}
            >
                <p className="whitespace-pre-wrap text-sm">{message.text}</p>
            </div>
        </div>
    );
 
    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 p-4 bg-violet-600 text-white rounded-full shadow-lg hover:bg-violet-700 transition-all"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </button>
 
            <div
                className={`fixed bottom-24 right-6 w-11/12 sm:w-80 h-96 z-50 bg-white rounded-2xl shadow-2xl flex flex-col transition-all transform border ${
                    isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
                }`}
            >
                <div className="p-4 bg-violet-600 text-white rounded-t-2xl flex justify-between items-center">
                    <h4 className="font-semibold">AI Assistant</h4>
                    <button onClick={() => setIsOpen(false)}>
                        <X className="w-5 h-5" />
                    </button>
                </div>
 
                <div className="flex-grow p-4 overflow-y-auto custom-scrollbar">
                    {messages.map((msg, index) => (
                        <Message key={index} message={msg} />
                    ))}
 
                    {isLoading && (
                        <div className="bg-gray-100 text-slate-500 px-4 py-3 rounded-xl shadow animate-pulse w-max">
                            ... typing
                        </div>
                    )}
 
                    <div ref={chatEndRef} />
                </div>
 
                <form onSubmit={sendMessage} className="p-4 border-t">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={input}
                            disabled={isLoading}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-grow p-2 border rounded-xl text-sm"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className={`p-2 rounded-full ${
                                isLoading || !input.trim()
                                    ? 'bg-violet-300'
                                    : 'bg-violet-600 text-white hover:bg-violet-700'
                            }`}
                        >
                            <Send className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};
 
 
// -------------------------------------------------------------
// SHOW CHATBOT ONLY IF USER IS LOGGED IN
// -------------------------------------------------------------
const AuthenticatedChatbot = () => {
    const { user, loading } = useAuth();
    if (loading || !user) return null;
    return <ChatbotPopup />;
};
 
 
 
 
// error boundary no changes made
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }
 
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
 
    componentDidCatch(error, errorInfo) {
        console.error("Uncaught Error in Component:", error, errorInfo);
        this.setState({ error, errorInfo });
    }
 
    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-8">
                    <div className="max-w-md bg-red-800/20 border border-red-700/50 p-6 rounded-xl text-center">
                        <h1 className="text-3xl font-bold text-red-400 mb-4">Application Error</h1>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-white bg-red-600 hover:bg-red-700 font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
 
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
    const HomeRoute = useAuth()?.user ? <Navigate to="/dashboard" /> : <LandingPage />;
 
    return (
        <AuthProvider>
            <NotificationProvider>
                <Router>
{/* changes made here */}
                    <AuthenticatedChatbot />  
                    <NotificationToast />
                    <Routes>
                        <Route path="/" element={
                            <ErrorBoundary>
                                <>
                                    <GlassNavbar />
                                    <LandingPage />
                                </>
                            </ErrorBoundary>
                        } />
 
                        {/* NEW: About Route */}
                        <Route path="/about" element={
                            <ErrorBoundary>
                                <AboutPage />
                            </ErrorBoundary>
                        } />
                       
                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                       
                        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/reports" element={<ProtectedRoute roleRequired={true}><Reports /></ProtectedRoute>} />
                            <Route path="/admin" element={<ProtectedRoute roleRequired={true}><AdminPage /></ProtectedRoute>} />
                            <Route path="/departments" element={<ProtectedRoute roleRequired={true}><DepartmentPage /></ProtectedRoute>} />
                        </Route>
 
                        <Route path="/home" element={<ErrorBoundary>{HomeRoute}</ErrorBoundary>} />
                    </Routes>
                </Router>
            </NotificationProvider>
        </AuthProvider>
    );
};
 
export default App;