// FIX: Added a triple-slash directive to include Jest's type definitions.
/// <reference types="jest" />

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StatCard } from './StatCard';
import { User } from './Icons';

describe('StatCard', () => {
    it('renders the value, label, and icon correctly', () => {
        const testProps = {
            icon: User,
            value: '1,234',
            label: 'Total Users',
            colorClass: 'bg-green-500'
        };

        render(<StatCard {...testProps} />);

        // Check if value is on the screen
        expect(screen.getByText('1,234')).toBeInTheDocument();

        // Check if label is on the screen
        expect(screen.getByText('Total Users')).toBeInTheDocument();

        // The icon is an SVG, so we can check for its presence.
        // A simple way is to check if the parent div has the correct color class.
        const iconContainer = screen.getByText('1,234').parentElement?.previousElementSibling;
        expect(iconContainer).toHaveClass('bg-green-500');
    });

    it('uses the default blue color class when none is provided', () => {
        const testProps = {
            icon: User,
            value: '567',
            label: 'Active Sessions',
        };
        
        render(<StatCard {...testProps} />);

        const iconContainer = screen.getByText('567').parentElement?.previousElementSibling;
        expect(iconContainer).toHaveClass('bg-blue-500');
    });
});