import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { Role, Contract, ContractStatus } from '../types/index.ts';
import { ContractDetailsView } from '../components/ContractDetailsView.tsx';
import { Briefcase, ArrowLeft } from '../components/Icons.tsx';

const ContractListItem = ({ contract, onSelect, userRole }: { contract: Contract, onSelect: () => void, userRole: Role }) => {
    const { findUserByProfileId } = useAppContext();
    
    const otherPartyId = userRole === Role.ENGINEER ? contract.companyId : contract.engineerId;
    const otherParty = findUserByProfileId(otherPartyId);

    const STATUS_INFO = {
        [ContractStatus.DRAFT]: { text: 'Draft', color: 'bg-gray-200 text-gray-800' },
        [ContractStatus.PENDING_SIGNATURE]: { text: 'Pending Signature', color: 'bg-yellow-100 text-yellow-800' },
        [ContractStatus.SIGNED]: { text: 'Signed', color: 'bg-blue-100 text-blue-800' },
        [ContractStatus.ACTIVE]: { text: 'Active', color: 'bg-green-100 text-green-800' },
        [ContractStatus.COMPLETED]: { text: 'Completed', color: 'bg-purple-100 text-purple-800' },
        [ContractStatus.CANCELLED]: { text: 'Cancelled', color: 'bg-red-100 text-red-800' },
    };
    const statusInfo = STATUS_INFO[contract.status] || STATUS_INFO[ContractStatus.DRAFT];

    return (
        <button onClick={onSelect} className="w-full text-left p-4 border rounded-md flex justify-between items-center hover:bg-gray-50 hover:shadow-md transition-all">
            <div>
                <h3 className="font-bold text-lg text-blue-700">Contract with {otherParty?.profile.name || '...'}</h3>
                <p className="text-gray-600 text-sm">Job: {contract.jobTitle}</p>
            </div>
             <div className="text-right">
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusInfo.color}`}>{statusInfo.text}</span>
                 <p className="text-xs text-gray-400 mt-1">ID: {contract.id}</p>
            </div>
        </button>
    );
};


export const ContractsView = ({ setActiveView }: { setActiveView: (view: string) => void }) => {
    const { user, contracts, jobs } = useAppContext();
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

    const myContracts = useMemo(() => {
        if (!user) return [];
        return contracts
            .filter(c => c.companyId === user.profile.id || c.engineerId === user.profile.id)
            .map(c => {
                const job = jobs.find(j => j.id === c.jobId);
                return { ...c, jobTitle: job?.title || 'Unknown Job' };
            })
            .sort((a, b) => b.id.localeCompare(a.id)); // Simple sort for now
    }, [user, contracts, jobs]);

    if (!user) return null;

    if (selectedContract) {
        return (
            <div>
                 <button 
                    onClick={() => setSelectedContract(null)} 
                    className="flex items-center mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Contracts List
                </button>
                <ContractDetailsView contract={selectedContract} />
            </div>
        );
    }
    
    return (
      <div>
        <h1 className="text-3xl font-bold mb-4 flex items-center"><Briefcase className="mr-3"/> My Contracts</h1>
        <div className="bg-white p-5 rounded-lg shadow">
            {myContracts.length > 0 ? (
                <div className="space-y-4">
                    {myContracts.map(contract => 
                        <ContractListItem 
                            key={contract.id} 
                            contract={contract} 
                            onSelect={() => setSelectedContract(contract)}
                            userRole={user.role}
                        />
                    )}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-8">You do not have any contracts yet.</p>
            )}
        </div>
      </div>
  );
};