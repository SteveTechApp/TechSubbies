import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/InteractionContext';
import { Contract, ContractStatus, UserProfile } from '../types';
import { FileText, Calendar, DollarSign } from '../components/Icons';
import { formatDisplayDate } from '../utils/dateFormatter';
import { ContractDetailsView } from './ContractDetailsView';

interface ContractCardProps {
    contract: Contract;
    otherParty: UserProfile | undefined;
    onSelect: () => void;
}

const getStatusClass = (status: ContractStatus) => {
    switch(status) {
        case ContractStatus.ACTIVE: return 'border-green-500';
        case ContractStatus.COMPLETED: return 'border-purple-500';
        case ContractStatus.PENDING_SIGNATURE: return 'border-yellow-500';
        case ContractStatus.SIGNED: return 'border-blue-500';
        default: return 'border-gray-300';
    }
}

const ContractCard = ({ contract, otherParty, onSelect }: ContractCardProps) => (
    <button onClick={onSelect} className={`w-full text-left p-4 bg-white rounded-lg shadow-md border-l-4 ${getStatusClass(contract.status)} hover:shadow-lg hover:-translate-y-1 transition-transform`}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm text-gray-500">vs. {otherParty?.name || '...'}</p>
                <h3 className="font-bold text-gray-800">{contract.jobTitle || 'Contract'}</h3>
            </div>
             <span className="text-xs font-bold text-gray-500">{contract.id}</span>
        </div>
        <div className="mt-3 pt-3 border-t text-sm text-gray-600 flex justify-between">
            <span className="flex items-center"><DollarSign size={14} className="mr-1.5"/>{contract.currency}{typeof contract.amount === 'number' ? contract.amount.toLocaleString() : contract.amount}</span>
            <span className="flex items-center"><Calendar size={14} className="mr-1.5"/>{formatDisplayDate(new Date())}</span>
        </div>
    </button>
);

interface ContractsViewProps {
    setActiveView: (view: string) => void;
}

export const ContractsView = ({ setActiveView }: ContractsViewProps) => {
    const { user, contracts, findUserByProfileId } = useAppContext();
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

    const myContracts = useMemo(() => {
        if (!user) return [];
        return contracts.filter(
            c => c.engineerId === user.profile.id || c.companyId === user.profile.id
        );
    }, [user, contracts]);

    if (!user) return null;

    if (selectedContract) {
        return (
            <div>
                <button onClick={() => setSelectedContract(null)} className="text-blue-600 hover:underline mb-4">&larr; Back to All Contracts</button>
                <ContractDetailsView contract={selectedContract} />
            </div>
        );
    }
    
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 flex items-center">
                <FileText size={30} className="mr-3 text-blue-600"/>
                My Contracts
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myContracts.map(c => {
                     const otherPartyId = user.role === 'Engineer' ? c.companyId : c.engineerId;
                     const otherParty = findUserByProfileId(otherPartyId);
                    return (
                        <ContractCard 
                            key={c.id} 
                            contract={c} 
                            otherParty={otherParty?.profile} 
                            onSelect={() => setSelectedContract(c)}
                        />
                    );
                })}
            </div>
             {myContracts.length === 0 && <p className="text-center text-gray-500 p-8">No contracts found.</p>}
        </div>
    );
};
