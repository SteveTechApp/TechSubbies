import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { DataProvider } from './DataContext';
import { InteractionProvider } from './InteractionContext';
import { NavigationProvider } from './NavigationContext';
import { SettingsProvider } from './SettingsContext';
import { ErrorBoundary } from '../components/ErrorBoundary';

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <SettingsProvider>
            <NavigationProvider>
              <InteractionProvider>
                {children}
              </InteractionProvider>
            </NavigationProvider>
          </SettingsProvider>
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};
