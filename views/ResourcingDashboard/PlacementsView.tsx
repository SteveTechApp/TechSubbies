import React, { useState } from 'react';
import { Contract } from '../../types';
import { useAppContext } from '../../context/InteractionContext';
import { ContractDetailsView } from '../ContractDetailsView';

interface PlacementsViewProps {
    managedContracts: Contract[];
    setActiveView: (view: string) => void;
}

export const PlacementsView = ({ managedContracts, setActiveView }: PlacementsViewProps) => {
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
    const { findUserByProfileId } = useAppContext();

    if (selectedContract) {
        return (
             <div>
                <button onClick={() => setSelectedContract(null)} className="text-blue-600 hover:underline mb-4">&larr; Back to All Placements</button>
                <ContractDetailsView contract={selectedContract} />
            </div>
        )
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Contracts & Placements</h1>
             <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engineer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="relative px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {managedContracts.map(contract => {
                            const engineer = findUserByProfileId(contract.engineerId)?.profile;
                            const company = findUserByProfileId(contract.companyId)?.profile;
                            return (
                                <tr key={contract.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{engineer?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{company?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.jobTitle}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">{contract.currency}{contract.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{contract.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => setSelectedContract(contract)} className="text-blue-600 hover:text-blue-900">View Details</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
