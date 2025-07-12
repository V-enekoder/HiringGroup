import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('authUser');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Error parseando authUser de localStorage', error);
            localStorage.removeItem('authUser');
        }
    }, []);

    const login = (userData) => {
        if (!userData || typeof userData !== 'object') {
            console.error('login: userData inválido', userData);
            return;
        }
        setUser(userData);
        localStorage.setItem('authUser', JSON.stringify(userData));
    };


    const logout = () => {
        setUser(null);
        localStorage.removeItem('authUser');
        localStorage.removeItem('authToken');
    };

    const value = {
        user,
        isAuthenticated: !!user,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
