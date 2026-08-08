import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const listContractSupportCases = vi.fn();
const createContractSupportCase = vi.fn();
const respondToContractSupportCase = vi.fn();
const withdrawContractSupportCase = vi.fn();

vi.mock('../services/contractSupportService', () => ({
    listContractSupportCases,
    createContractSupportCase,
    respondToContractSupportCase,
    withdrawContractSupportCase,
}));

import { ContractSupportPanel } from './ContractSupportPanel';

const cancellationCase = {
    id: 'case-1',
    contractId: 'contract-1',
    caseType: 'cancellation',
    status: 'awaiting_other_party',
    openedById: 'engineer-1',
    counterpartyId: 'company-1',
    openedByName: 'Engineer One',
    counterpartyName: 'Company One',
    proposedEngineerId: null,
    proposedEngineerName: null,
    summary: 'Unable to attend project date',
    details: 'The agreed project date can no longer be attended.',
    resolution: null,
    resolvedById: null,
    createdAt: '2026-08-08T10:00:00.000Z',
    updatedAt: '2026-08-08T10:00:00.000Z',
    events: [],
} as const;

describe('ContractSupportPanel', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        listContractSupportCases.mockResolvedValue([]);
        createContractSupportCase.mockResolvedValue({});
        respondToContractSupportCase.mockResolvedValue({});
        withdrawContractSupportCase.mockResolvedValue({});
    });

    it('opens a support case from a contract', async () => {
        render(<ContractSupportPanel contractId="contract-1" currentUserId="engineer-1" />);
        await screen.findByText(/No support cases recorded/i);

        fireEvent.click(screen.getByRole('button', { name: 'Report / request support' }));
        fireEvent.change(screen.getByLabelText('Issue type'), { target: { value: 'no_show' } });
        fireEvent.change(screen.getByLabelText('Summary'), { target: { value: 'Engineer did not arrive' } });
        fireEvent.change(screen.getByLabelText('Details'), { target: { value: 'The engineer did not arrive at the confirmed project start time.' } });
        fireEvent.click(screen.getByRole('button', { name: 'Open support case' }));

        await waitFor(() => expect(createContractSupportCase).toHaveBeenCalledWith({
            contractId: 'contract-1',
            caseType: 'no_show',
            summary: 'Engineer did not arrive',
            details: 'The engineer did not arrive at the confirmed project start time.',
        }));
    });

    it('requires a response note before accepting a cancellation', async () => {
        listContractSupportCases.mockResolvedValue([cancellationCase]);
        render(<ContractSupportPanel contractId="contract-1" currentUserId="company-1" />);

        expect(await screen.findByText('Unable to attend project date')).toBeVisible();
        fireEvent.click(screen.getByRole('button', { name: 'Accept' }));
        expect(screen.getByRole('alert')).toHaveTextContent(/short response note/i);
        expect(respondToContractSupportCase).not.toHaveBeenCalled();

        fireEvent.change(screen.getByLabelText('Your response to Engineer One'), { target: { value: 'Agreed, please cancel the engagement.' } });
        fireEvent.click(screen.getByRole('button', { name: 'Accept' }));
        await waitFor(() => expect(respondToContractSupportCase).toHaveBeenCalledWith(
            'case-1',
            'accept',
            'Agreed, please cancel the engagement.'
        ));
    });
});
