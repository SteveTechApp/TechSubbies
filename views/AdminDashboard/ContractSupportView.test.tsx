import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const listAdminContractSupportCases = vi.fn();
const resolveAdminContractSupportCase = vi.fn();

vi.mock('../../services/contractSupportService', () => ({
    listAdminContractSupportCases,
    resolveAdminContractSupportCase,
}));

import { ContractSupportView } from './ContractSupportView';

const supportCase = {
    id: 'case-admin-1',
    contractId: 'contract-77',
    caseType: 'no_show',
    status: 'under_review',
    openedById: 'company-1',
    counterpartyId: 'engineer-1',
    openedByName: 'AV Integrator Ltd',
    counterpartyName: 'Engineer One',
    proposedEngineerId: null,
    proposedEngineerName: null,
    summary: 'Engineer did not arrive on site',
    details: 'The engineer was unavailable at the confirmed start time.',
    resolution: null,
    resolvedById: null,
    createdAt: '2026-08-08T09:00:00.000Z',
    updatedAt: '2026-08-08T09:00:00.000Z',
    events: [],
};

describe('ContractSupportView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        listAdminContractSupportCases.mockResolvedValue([supportCase]);
        resolveAdminContractSupportCase.mockResolvedValue({ ...supportCase, status: 'resolved' });
    });

    it('lists support cases and records an Admin resolution', async () => {
        render(<ContractSupportView />);

        expect(await screen.findByText('Engineer did not arrive on site')).toBeVisible();
        expect(screen.getByText('AV Integrator Ltd')).toBeVisible();
        expect(screen.getByText('Engineer One')).toBeVisible();

        fireEvent.change(screen.getByLabelText('Resolution / support outcome'), {
            target: { value: 'Both parties were contacted and agreed the replacement attendance plan.' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Resolve case' }));

        await waitFor(() => expect(resolveAdminContractSupportCase).toHaveBeenCalledWith(
            'case-admin-1',
            'Both parties were contacted and agreed the replacement attendance plan.'
        ));
        expect(await screen.findByRole('status')).toHaveTextContent(/resolved and both contract parties notified/i);
    });
});
