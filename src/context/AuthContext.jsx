import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

const parseJwt = (token) => {
    try {
        if (!token) return null;
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window.atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (err) {
        console.error("JWT Parse Error:", err);
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore login on refresh
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        // 🟣 STEP 1 — If user object exists, restore it instantly
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setLoading(false);
            return;
        }

        // 🟣 STEP 2 — If token exists, decode JWT and rebuild user
        if (token) {
            const decoded = parseJwt(token);

            if (!decoded || decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem('token');
                setUser(null);
                setLoading(false);
                return;
            }

            const restoredUser = {
                id: decoded.nameid,
                email: decoded.email,
                fullName: decoded.fullName || decoded.unique_name,
                role: Array.isArray(decoded.role) ? decoded.role[0] : decoded.role,
                deptId: decoded.DepartmentId ? parseInt(decoded.DepartmentId) : null
            };

            setUser(restoredUser);

            // Save rebuilt user in localStorage
            localStorage.setItem('user', JSON.stringify(restoredUser));
        }

        setLoading(false);
    }, []);

    // Login
    const login = async (email, password) => {
        try {
            const response = await api.post('/Auth/login', { email, password });
            const data = response.data;

            const newUser = {
                id: data.userId,
                email: data.email,
                fullName: data.fullName,
                role: data.role,
                deptId: data.departmentId
            };

            // Save token + full user object
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(newUser));

            setUser(newUser);

            return { success: true };

        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Login failed. Invalid username or password."
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);