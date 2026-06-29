import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user_session');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            
            if (!user) {
                const savedUser = localStorage.getItem('user_session');
                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                } else {
                    setUser({ name: "Estudiante", email: "usuario@utn.com" });
                }
            }
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user_session');
            setUser(null);
        }
        setLoading(false);
    }, [token, user]);

    const login = (jwtToken, userData) => {
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user_session', JSON.stringify(userData));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user_session');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);