

import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const ROLES = {
    ADMIN: 1,
    HIRING_GROUP: 2,
    COMPANY: 3,
    CANDIDATE: 4
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    const value = { user, isAuthenticated: !!user, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};