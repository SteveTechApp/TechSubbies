import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Currency, InvoiceStatus, Role } from '../types';

const { mockUseAppContext } = vi.hoisted(() => ({
    mockUseAppContext: vi.fn(),
}));

vi.mock('../context/InteractionContext', () => ({
    useAppContext: mockUseAppContext,
}));

import { InvoicesView } from './InvoicesView';

const invoice = {
    id: 'inv-100',
    contractId: 'contract-100',
    companyId: 'company-1',
    engineerId: 'engineer-1',
    items: [{ description: 'Commissioning milestone', amount: 850 }],
    total: 850,
    currency: Currency.USD,
    issueDate: new Date('2026-07-01'),
    dueDate: new Date('2026-07-15'),
    status: InvoiceStatus.SENT,
};

beforeEach(() => {
    mockUseAppContext.mockReturnValue({
        user: { role: Role.ENGINEER, profile: { id: 'engineer-1' } },
        invoices: [invoice],
        findUserByProfileId: () => ({ profile: { name: 'Example Client' } }),
    });
});

describe('InvoicesView', () => {
    it('opens real invoice details and closes them with Escape', () => {
        render(<InvoicesView />);

        fireEvent.click(screen.getAllByRole('button', { name: 'View details' })[0]);

        const dialog = screen.getByRole('dialog', { name: 'Invoice details' });
        expect(dialog).toBeInTheDocument();
        expect(dialog).toHaveTextContent('Commissioning milestone');
        expect(dialog).toHaveTextContent('contract-100');
        expect(dialog).toHaveTextContent('$850.00');

        fireEvent.keyDown(window, { key: 'Escape' });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('shows a useful empty state when no invoices exist', () => {
        mockUseAppContext.mockReturnValue({
            user: { role: Role.COMPANY, profile: { id: 'company-1' } },
            invoices: [],
            findUserByProfileId: vi.fn(),
        });

        render(<InvoicesView />);

        expect(screen.getByRole('heading', { name: 'No invoices yet' })).toBeInTheDocument();
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
});
