import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // 🌟 Intentamos levantar el usuario guardado previamente para mantener la sesión real
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user_session');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            
            // 🌟 CORREGIDO: Si no hay un usuario en el estado, buscamos en el storage o creamos uno genérico
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
        // 🌟 Guardamos el objeto usuario real en el storage para que persista al refrescar
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