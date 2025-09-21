import React, { useMemo } from 'react';
import { useAppContext } from '../../context/InteractionContext';
import { Contract, CompanyProfile, ResourcingCompanyProfile } from '../../types';
import { Briefcase, MessageCircle, Link as LinkIcon } from '../../components/Icons';

interface CompanyInteraction {
    company: CompanyProfile | ResourcingCompanyProfile;
    contracts: Contract[];
}

export const MyNetworkView = ({ setActiveView }: { setActiveView: (view: string) => void }) => {
    const { user, contracts, companies, startConversationAndNavigate } = useAppContext();

    const networkData = useMemo(() => {
        if (!user) return [];
        
        // FIX: Refactored reducer logic to improve TypeScript type inference.
        // The previous logic using a mutable `let entry` was confusing the compiler's
        // control flow analysis, leading to properties being typed as `unknown`.
        // This more explicit approach resolves the error.
        const interactionsByCompanyId = contracts
            .filter(c => c.engineerId === user.profile.id)
            .reduce((acc: Record<string, CompanyInteraction>, contract) => {
                const companyId = contract.companyId;
                const company = companies.find(c => c.id === companyId);
                if (company) {
                    if (!acc[companyId]) {
                        acc[companyId] = { company, contracts: [] };
                    }
                    acc[companyId].contracts.push(contract);
                }
                return acc;
            }, {});

        return Object.values(interactionsByCompanyId).sort((a, b) => b.contracts.length - a.contracts.length);

    }, [user, contracts, companies]);
    
    const handleMessage = (companyProfileId: string) => {
        startConversationAndNavigate(companyProfileId, () => setActiveView('Messages'));
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">My Network</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {networkData.map(({ company, contracts }) => (
                    <div key={company.id} className="bg-white p-5 rounded-lg shadow-md border flex flex-col">
                        <div className="flex items-center mb-3 pb-3 border-b">
                            <img src={company.avatar} alt={company.name} className="w-16 h-16 rounded-lg mr-4 object-contain" />
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">{company.name}</h3>
                                <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center">
                                    <LinkIcon size={12} className="mr-1"/> Website
                                </a>
                            </div>
                        </div>
                        <div className="flex-grow">
                            <p className="text-sm text-gray-500 mb-2">You have completed <span className="font-bold">{contracts.length}</span> contract(s) with this company:</p>
                            <ul className="text-sm space-y-1">
                                {contracts.slice(0, 3).map(c => (
                                    <li key={c.id} className="flex items-center text-gray-700">
                                        <Briefcase size={14} className="mr-2 text-gray-400"/> {c.jobTitle || 'Contract'}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                            <button onClick={() => handleMessage(company.id)} className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md text-sm hover:bg-blue-700">
                                <MessageCircle size={16} className="mr-2"/> Message {company.name}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};