import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role } from '../types';
import { MOCK_USERS, MOCK_USER_FREE_ENGINEER } from '../data/mockData';
import apiService from '../services/apiService';

interface AuthContextType {
    user: User | null;
    login: (role: Role) => void;
    logout: () => void;
    createAndLoginEngineer: (data: any) => Promise<void>;
    createAndLoginCompany: (data: any) => Promise<void>;
    createAndLoginResourcingCompany: (data: any) => Promise<void>;
    // FIX: Added setUser to allow InteractionContext to update user profile data globally
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // Restore a real (backend-backed) session after a page reload, if a
    // login token was saved. Demo-role sessions (via `login` below) are
    // intentionally not persisted - that's a quick local testing shortcut,
    // not a real account.
    useEffect(() => {
        let cancelled = false;
        apiService.getCurrentUserFromToken().then((restoredUser) => {
            if (!cancelled && restoredUser) {
                setUser(restoredUser);
            }
        });
        return () => {
            cancelled = true;
        };
    }, []);

    const login = (role: Role) => {
        // Simple login simulation
        // FIX: Correctly log in the mock user for the selected role.
        setUser(MOCK_USERS[role] || null);
    };

    const logout = () => {
        setUser(null);
        void apiService.logoutSession();
    };
    
    // FIX: Implemented createAndLoginEngineer to fix missing property error.
    const createAndLoginEngineer = async (data: any) => {
        const newUser = await apiService.createEngineer(data);
        setUser(newUser);
    };

    // FIX: Implemented createAndLoginCompany to fix missing property error.
    const createAndLoginCompany = async (data: any) => {
        const newUser = await apiService.createCompany(data);
        setUser(newUser);
    };

    // FIX: Implemented createAndLoginResourcingCompany to fix missing property error.
    const createAndLoginResourcingCompany = async (data: any) => {
        const newUser = await apiService.createResourcingCompany(data);
        setUser(newUser);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, createAndLoginEngineer, createAndLoginCompany, createAndLoginResourcingCompany, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
