import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Role } from '../types';
import { DashboardHelpCenter } from './DashboardHelpCenter';

describe('DashboardHelpCenter', () => {
    it('shows role-specific shortcuts and navigates to the selected tool', () => {
        const setActiveView = vi.fn();
        render(<DashboardHelpCenter role={Role.COMPANY} setActiveView={setActiveView} />);

        expect(screen.getByRole('heading', { name: 'Help Center' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /manage applicants/i }));

        expect(setActiveView).toHaveBeenCalledWith('My Jobs');
    });

    it('searches role and general help answers and explains empty results', () => {
        render(<DashboardHelpCenter role={Role.ENGINEER} setActiveView={vi.fn()} />);
        const search = screen.getByRole('searchbox', { name: 'Search help articles' });

        fireEvent.change(search, { target: { value: 'get paid' } });
        expect(screen.getByText('How do I get paid?')).toBeInTheDocument();
        expect(screen.queryByText('What is a Talent Pool?')).not.toBeInTheDocument();

        fireEvent.change(search, { target: { value: 'no-answer-for-this-query' } });
        expect(screen.getByText('No matching help articles')).toBeInTheDocument();
    });
});
