import React, { useState, useEffect, useRef } from 'react';
// FIX: Changed './context/AuthContext.jsx' to '../context/AuthContext.jsx'
// assuming this component file will be placed inside a subdirectory like 'components/ui'.
import { useAuth } from '../context/AuthContext.jsx';
import { MessageSquare, Send, X } from 'lucide-react';
 
// --- CHATBOT CONSTANTS ---
// This constant must be defined for the API call to work
const GEMINI_MODEL = 'gemini-2.5-flash-preview-09-2025';
// --- END CHATBOT CONSTANTS ---
 
// --- CHATBOT COMPONENT: ChatbotPopup ---
export const ChatbotPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', text: 'Hello! I am your AI assistant. I can help with general questions about the platform or data management. How can I assist you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);
 
    // Scroll to the bottom of the chat when messages update
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
 
    // Function to handle exponential backoff for API calls
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
                parts: [{ text: 'You are a helpful and friendly administrative assistant for a user management platform. Keep your answers concise and professional.' }]
            }
        };
 
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
 
        try {
            const response = await withExponentialBackoff(() => fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }));
           
            if (!response.ok) {
                throw new Error(`API returned status ${response.status}`);
            }
 
            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
 
            if (text) {
                setMessages(prev => [...prev, { role: 'model', text }]);
            } else {
                setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I received an empty response from the AI.' }]);
            }
 
        } catch (error) {
            console.error("Gemini API Error:", error);
            setMessages(prev => [...prev, { role: 'model', text: 'I encountered a network or API error. Please try again later.' }]);
        } finally {
            setIsLoading(false);
        }
    };
   
    // Message bubble component
    const Message = ({ message }) => (
        <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-xs sm:max-w-md px-4 py-3 rounded-2xl shadow-md ${
                message.role === 'user'
                    ? 'bg-violet-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-slate-800 rounded-tl-none'
            }`}>
                <p className="whitespace-pre-wrap text-sm">{message.text}</p>
            </div>
        </div>
    );
 
    return (
        <>
            {/* Floating Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                // Changed color to teal/cyan, adjusted shadow/hover effect
                className="fixed bottom-6 right-6 z-50 p-4 bg-cyan-500 text-white rounded-full shadow-lg shadow-cyan-500/50 hover:bg-cyan-600 transition-all duration-300 transform hover:scale-110"
                aria-label={isOpen ? "Close Chatbot" : "Open Chatbot"}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </button>
 
            {/* Chat Popup Window */}
            <div className={`fixed bottom-24 right-6 w-11/12 sm:w-80 h-96 z-50 bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 transform border border-slate-200 ${
                isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
            } origin-bottom-right`}>
               
                {/* Header */}
                <div className="p-4 bg-violet-600 text-white rounded-t-2xl flex justify-between items-center shadow-lg">
                    <div className="flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2" />
                        <h4 className="font-semibold text-lg">AI Assistant</h4>
                    </div>
                    <button onClick={() => setIsOpen(false)} aria-label="Close chat">
                        <X className="w-5 h-5 hover:text-gray-200" />
                    </button>
                </div>
               
                {/* Messages Body */}
                <div className="flex-grow p-4 overflow-y-auto custom-scrollbar">
                    {messages.map((msg, index) => (
                        <Message key={index} message={msg} />
                    ))}
                    {isLoading && (
                        <div className="flex justify-start mb-4">
                            <div className="bg-gray-100 text-slate-500 px-4 py-3 rounded-2xl rounded-tl-none shadow-md animate-pulse">
                                ... typing
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
               
                {/* Input Footer */}
                <form onSubmit={sendMessage} className="p-4 border-t border-slate-200">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-grow p-2 border border-slate-300 rounded-xl focus:ring-violet-500 focus:border-violet-500 text-sm"
                            placeholder="Type your message..."
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className={`p-2 rounded-full transition-colors ${isLoading || !input.trim()
                                ? 'bg-violet-300 cursor-not-allowed'
                                : 'bg-violet-600 hover:bg-violet-700 shadow-md'}`}
                            disabled={isLoading || !input.trim()}
                            aria-label="Send Message"
                        >
                            <Send className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </form>
            </div>
            {/* Custom CSS for scrollbar */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #a78bfa; /* violet-400 */
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }
            `}</style>
        </>
    );
};
// --- END CHATBOT COMPONENT ---
 
 
// --- WRAPPER COMPONENT: AuthenticatedChatbot ---
export const AuthenticatedChatbot = () => {
    // Requires useAuth() from your AuthContext to determine login status.
    const { user, loading } = useAuth();
   
    // Do not render the chatbot if authentication state is loading or if the user is not authenticated
    if (loading || !user) {
        return null;
    }
   
    // If authenticated, render the floating chatbot
    return <ChatbotPopup />;
}
 