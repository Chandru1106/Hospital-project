import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            setUser(JSON.parse(userData));
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(user);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Login failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const register = async (username, email, password) => {
        try {
            await api.post('/auth/register', { username, email, password });
            // Optionally auto-login here, but for now just return success
            // The Signup page redirects to login or dashboard.
            // If we want auto-login, we'd need to get the token from the register response or call login() immediately.
            // Based on authController.register, it returns { message, user }, but NO token.
            // So the user must login afterwards.

            // However, Signup.jsx redirects to /dashboard on success, which requires a user to be logged in.
            // So we MUST log them in or redirect to /login.
            // Signup.jsx: if (result.success) navigate('/dashboard');

            // Let's check if we can auto-login.
            const loginResult = await login(email, password);
            if (loginResult.success) {
                return { success: true };
            } else {
                return { success: false, error: 'Registration successful, but auto-login failed. Please login manually.' };
            }

        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Registration failed' };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
