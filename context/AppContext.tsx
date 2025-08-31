import React, { createContext, useContext, ReactNode } from 'react';
import { useAppLogic } from './useAppLogic.ts';

// The type definition for the context value remains the same, ensuring a consistent API for consumers.
import type { AppContextType } from '../types/index.ts';

// Create the context with an undefined initial value.
const AppContext = createContext<AppContextType | undefined>(undefined);

// The AppProvider now simply calls the useAppLogic hook and provides its return value to the context.
export const AppProvider = ({ children }: { children: ReactNode }) => {
    const logic = useAppLogic();
    return <AppContext.Provider value={logic}>{children}</AppContext.Provider>;
};

// The consumer hook remains unchanged.
export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
