import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Role } from '../types';
import { MOCK_USERS, MOCK_USER_FREE_ENGINEER } from '../data/mockData';
import apiService from '../services/apiService';

interface AuthContextType {
    user: User | null;
    login: (role: Role) => void;
    logout: () => void;
    createAndLoginEngineer: (data: any) => void;
    createAndLoginCompany: (data: any) => void;
    createAndLoginResourcingCompany: (data: any) => void;
    // FIX: Added setUser to allow InteractionContext to update user profile data globally
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (role: Role) => {
        // Simple login simulation
        if (role === Role.ENGINEER && MOCK_USERS[Role.ENGINEER].profile.name.includes("Steve")) {
             setUser(MOCK_USERS[Role.ENGINEER]);
        } else {
            setUser(MOCK_USERS[role] || MOCK_USER_FREE_ENGINEER);
        }
    };

    const logout = () => {
        setUser(null);
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
