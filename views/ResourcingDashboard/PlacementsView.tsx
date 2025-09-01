import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { Contract, Role } from '../../types/index.ts';
import { ContractDetailsView } from '../../components/ContractDetailsView.tsx';
import { Briefcase, ArrowLeft } from '../../components/Icons.tsx';

const ContractListItem = ({ contract, onSelect }: { contract: Contract, onSelect: () => void }) => {
    const { findUserByProfileId } = useAppContext();
    
    const company = findUserByProfileId(contract.companyId);
    const engineer = findUserByProfileId(contract.engineerId);

    return (
        <button onClick={onSelect} className="w-full text-left p-4 border rounded-md flex justify-between items-center hover:bg-gray-50 hover:shadow-md transition-all">
            <div>
                <h3 className="font-bold text-lg text-blue-700">{contract.jobTitle}</h3>
                <p className="text-gray-600 text-sm">
                    <span className="font-semibold">{company?.profile.name || '...'}</span> hiring <span className="font-semibold">{engineer?.profile.name || '...'}</span>
                </p>
            </div>
             <div className="text-right">
                 <p className="text-sm font-bold">{contract.currency}{contract.amount}</p>
                 <p className="text-xs text-gray-400 mt-1">ID: {contract.id}</p>
            </div>
        </button>
    );
};


export const PlacementsView = ({ managedContracts, setActiveView }: { managedContracts: Contract[], setActiveView: (view: string) => void }) => {
    const { jobs } = useAppContext();
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

    const contractsWithTitles = useMemo(() => {
        return managedContracts
            .map(c => {
                const job = jobs.find(j => j.id === c.jobId);
                return { ...c, jobTitle: job?.title || 'Unknown Job' };
            })
            .sort((a, b) => b.id.localeCompare(a.id));
    }, [managedContracts, jobs]);

    if (selectedContract) {
        return (
            <div>
                 <button 
                    onClick={() => setSelectedContract(null)} 
                    className="flex items-center mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Placements List
                </button>
                <ContractDetailsView contract={selectedContract} />
            </div>
        );
    }
    
    return (
      <div>
        <h1 className="text-3xl font-bold mb-4 flex items-center"><Briefcase className="mr-3"/> My Placements</h1>
        <div className="bg-white p-5 rounded-lg shadow">
            {contractsWithTitles.length > 0 ? (
                <div className="space-y-4">
                    {contractsWithTitles.map(contract => 
                        <ContractListItem 
                            key={contract.id} 
                            contract={contract} 
                            onSelect={() => setSelectedContract(contract)}
                        />
                    )}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-8">You do not have any active placements for your managed engineers yet.</p>
            )}
        </div>
      </div>
  );
};