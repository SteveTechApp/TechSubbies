// FIX: Added a triple-slash directive to include Jest's type definitions.
/// <reference types="jest" />

import React, { ReactNode } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { Role } from '../types';

// A test component to consume the context
const TestComponent = () => {
    const { user, login, logout } = useAuth();
    
    return (
        <div>
            {user ? (
                <div>
                    <p data-testid="user-name">{user.profile.name}</p>
                    <button onClick={logout}>Logout</button>
                </div>
            ) : (
                <div>
                    <p>No user logged in</p>
                    <button onClick={() => login(Role.ENGINEER)}>Login as Engineer</button>
                    <button onClick={() => login(Role.COMPANY)}>Login as Company</button>
                </div>
            )}
        </div>
    );
};

// Wrapper for rendering with the provider
const renderWithProvider = (component: ReactNode) => {
    return render(
        <AuthProvider>
            {component}
        </AuthProvider>
    );
};

describe('AuthContext', () => {

    it('should have no user initially', () => {
        renderWithProvider(<TestComponent />);
        expect(screen.getByText('No user logged in')).toBeInTheDocument();
    });

    it('should log in an engineer user', () => {
        renderWithProvider(<TestComponent />);
        
        fireEvent.click(screen.getByText('Login as Engineer'));
        
        expect(screen.getByTestId('user-name')).toHaveTextContent('Steve Goodwin');
    });
    
    it('should log in a company user', () => {
        renderWithProvider(<TestComponent />);
        
        fireEvent.click(screen.getByText('Login as Company'));
        
        expect(screen.getByTestId('user-name')).toHaveTextContent('Pro AV Solutions');
    });

    it('should log out the user', () => {
        renderWithProvider(<TestComponent />);

        // First, log in
        fireEvent.click(screen.getByText('Login as Engineer'));
        expect(screen.getByTestId('user-name')).toBeInTheDocument();

        // Then, log out
        fireEvent.click(screen.getByText('Logout'));
        expect(screen.getByText('No user logged in')).toBeInTheDocument();
    });

});