import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Page } from '../types';
import { useAuth } from './AuthContext';

interface NavigationContextType {
  page: Page;
  setPage: (page: Page) => void;
  currentPageContext: string;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  // FIX: Replaced string literal with Page enum for type safety.
  const [page, setPage] = useState<Page>(Page.LANDING);
  const { user } = useAuth() || {}; // Handle initial render where AuthContext might be undefined

  const currentPageContext = useMemo(() => {
        if (user) {
            return `${user.role} Dashboard`;
        }
        return page;
    }, [user, page]);

  return (
    <NavigationContext.Provider value={{ page, setPage, currentPageContext }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
