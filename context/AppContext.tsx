import React, { createContext, useContext, ReactNode } from 'react';
// FIX: Corrected module imports to remove file extensions.
import { useAppLogic } from './useAppLogic';
import type { AppContextType } from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * AppProvider component that wraps the application and provides all global state and logic.
 * It utilizes the useAppLogic hook to keep the provider itself clean and focused.
 */
export const AppProvider = ({ children }: { children: ReactNode }) => {
    const logic = useAppLogic();
    return <AppContext.Provider value={logic}>{children}</AppContext.Provider>;
};

/**
 * Custom hook to easily consume the AppContext throughout the application.
 * It ensures that the context is used within a valid AppProvider.
 */
export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};