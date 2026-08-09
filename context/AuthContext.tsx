import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role } from '../types';
import { MOCK_USERS, MOCK_USER_FREE_ENGINEER } from '../data/mockData';
import { getDemoSession } from '../data/demoAccounts';
import apiService from '../services/apiService';
import type { CompanyRegistrationInput, EngineerRegistrationInput } from '../types/marketplaceApi';

interface AuthContextType {
    user: User | null;
    isAuthLoading: boolean;
    login: (role: Role) => void;
    logout: () => void;
    createAndLoginEngineer: (data: EngineerRegistrationInput) => Promise<void>;
    createAndLoginCompany: (data: CompanyRegistrationInput) => Promise<void>;
    createAndLoginResourcingCompany: (data: CompanyRegistrationInput) => Promise<void>;
    // FIX: Added setUser to allow InteractionContext to update user profile data globally
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const demoSession = getDemoSession();
        return demoSession ? MOCK_USERS[demoSession.role as Role] || null : null;
    });
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    // Restore a real (backend-backed) session after a page reload, if a
    // login token was saved. Demo-role sessions (via `login` below) are
    // intentionally not persisted - that's a quick local testing shortcut,
    // not a real account.
    useEffect(() => {
        let cancelled = false;
        const demoSession = getDemoSession();
        const restoreSession = demoSession
            ? apiService.loginWithDemoCredentials(demoSession.email, 'password')
            : apiService.getCurrentUserFromToken();
        restoreSession.then((restoredUser) => {
            if (!cancelled && restoredUser) {
                setUser(restoredUser);
            }
        }).finally(() => {
            if (!cancelled) {
                setIsAuthLoading(false);
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
        setIsAuthLoading(false);
    };

    const logout = () => {
        setUser(null);
        setIsAuthLoading(false);
        void apiService.logoutSession();
    };
    
    // FIX: Implemented createAndLoginEngineer to fix missing property error.
    const createAndLoginEngineer = async (data: EngineerRegistrationInput) => {
        const newUser = await apiService.createEngineer(data);
        setUser(newUser);
    };

    // FIX: Implemented createAndLoginCompany to fix missing property error.
    const createAndLoginCompany = async (data: CompanyRegistrationInput) => {
        const newUser = await apiService.createCompany(data);
        setUser(newUser);
    };

    // FIX: Implemented createAndLoginResourcingCompany to fix missing property error.
    const createAndLoginResourcingCompany = async (data: CompanyRegistrationInput) => {
        const newUser = await apiService.createResourcingCompany(data);
        setUser(newUser);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthLoading, login, logout, createAndLoginEngineer, createAndLoginCompany, createAndLoginResourcingCompany, setUser }}>
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
