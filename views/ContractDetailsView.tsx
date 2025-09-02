import React, { useState } from 'react';
import { Contract, User, Role, ContractStatus, UserProfile, CompanyProfile, EngineerProfile, Milestone, MilestoneStatus, ContractType } from '../types/index.ts';
import { useAppContext } from '../context/AppContext.tsx';
import { FileText, User as UserIcon, Building, Calendar, CheckCircle, Clock, DollarSign, Loader } from '../components/Icons.tsx';
import { SignContractModal } from '../components/SignContractModal.tsx';
import { formatDisplayDate } from '../utils/dateFormatter.ts';
import { PaymentModal } from '../components/PaymentModal.tsx';

interface ContractDetailsViewProps {
    contract: Contract;
}

const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const StatusBadge = ({ status, className }: { status: string, className?: string }) => {
    const STATUS_INFO: Record<string, { text: string, color: string }> = {
        [ContractStatus.DRAFT]: { text: 'Draft', color: 'bg-gray-200 text-gray-800' },
        [ContractStatus.PENDING_SIGNATURE]: { text: 'Pending Signature', color: 'bg-yellow-100 text-yellow-800' },
        [ContractStatus.SIGNED]: { text: 'Signed by Engineer', color: 'bg-blue-100 text-blue-800' },
        [ContractStatus.ACTIVE]: { text: 'Active & In Progress', color: 'bg-green-100 text-green-800' },
        [ContractStatus.COMPLETED]: { text: 'Completed', color: 'bg-purple-100 text-purple-800' },
        [ContractStatus.CANCELLED]: { text: 'Cancelled', color: 'bg-red-100 text-red-800' },
        [MilestoneStatus.AWAITING_FUNDING]: { text: 'Awaiting Funding', color: 'bg-gray-200 text-gray-700' },
        [MilestoneStatus.FUNDED_IN_PROGRESS]: { text: 'In Progress', color: 'bg-blue-100 text-blue-700' },
        [MilestoneStatus.SUBMITTED_FOR_APPROVAL]: { text: 'Submitted', color: 'bg-yellow-100 text-yellow-700' },
        [MilestoneStatus.COMPLETED_PAID]: { text: 'Paid', color: 'bg-green-100 text-green-700' },
    };
    const info = STATUS_INFO[status] || { text: status, color: 'bg-gray-200 text-gray-800' };
    return <span className={`px-3 py-1 text-xs font-bold rounded-full ${info.color} ${className}`}>{info.text}</span>;
};


const MilestoneRow = ({ milestone, contract, onFund, onAction, userRole }: { milestone: Milestone, contract: Contract, onFund: () => void, onAction: (action: Function) => void, userRole: Role }) => {
    const { submitMilestoneForApproval, approveMilestonePayout } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);

    const handleAction = async (action: Function) => {
        setIsLoading(true);
        // Simulate async action
        await new Promise(resolve => setTimeout(resolve, 500));
        onAction(action);
        setIsLoading(false);
    };

    const renderAction = () => {
        if (isLoading) return <Loader className="animate-spin w-5 h-5 text-gray-500"/>;

        if (userRole === Role.COMPANY || userRole === Role.ADMIN) {
            if (milestone.status === MilestoneStatus.AWAITING_FUNDING) {
                return <button onClick={onFund} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Fund Milestone</button>;
            }
            if (milestone.status === MilestoneStatus.SUBMITTED_FOR_APPROVAL) {
                return <button onClick={() => handleAction(approveMilestonePayout)} className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">Approve & Release Payment</button>;
            }
        }
        if (userRole === Role.ENGINEER && milestone.status === MilestoneStatus.FUNDED_IN_PROGRESS) {
            return <button onClick={() => handleAction(submitMilestoneForApproval)} className="px-3 py-1 text-sm bg-yellow-500 text-yellow-900 rounded hover:bg-yellow-600">Submit for Approval</button>;
        }
        return null;
    };
    
    return (
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md border">
            <div>
                <p className="font-semibold">{milestone.description}</p>
                <p className="text-sm font-bold text-green-700">{contract.currency}{milestone.amount}</p>
            </div>
            <div className="flex items-center gap-4">
                <StatusBadge status={milestone.status} />
                <div className="w-40 text-right">{renderAction()}</div>
            </div>
        </div>
    );
};

export const ContractDetailsView = ({ contract }: ContractDetailsViewProps) => {
    const { user, findUserByProfileId, signContract, fundMilestone } = useAppContext();
    const [isSignModalOpen, setIsSignModalOpen] = useState(false);
    const [fundingMilestone, setFundingMilestone] = useState<Milestone | null>(null);

    const engineerUser = findUserByProfileId(contract.engineerId);
    const companyUser = findUserByProfileId(contract.companyId);
    
    const engineer = engineerUser?.profile as EngineerProfile | undefined;
    const company = companyUser?.profile as CompanyProfile | undefined;


    if (!engineer || !company || !user) return <div>Loading contract parties...</div>;
    
    const canEngineerSign = user.profile.id === engineer.id && contract.status === ContractStatus.PENDING_SIGNATURE && !contract.engineerSignature;
    const canCompanySign = (user.profile.id === company.id || user.role === Role.ADMIN) && contract.status === ContractStatus.SIGNED && !contract.companySignature;


    const handleSign = (signatureName: string) => {
        signContract(contract.id, signatureName);
        setIsSignModalOpen(false);
    };

    const handlePaymentSuccess = () => {
        if (fundingMilestone) {
            fundMilestone(contract.id, fundingMilestone.id);
            setFundingMilestone(null);
        }
    };

    return (
        <>
            {fundingMilestone && (
                <PaymentModal
                    isOpen={!!fundingMilestone}
                    onClose={() => setFundingMilestone(null)}
                    onSuccess={handlePaymentSuccess}
                    amount={fundingMilestone.amount}
                    currency={contract.currency}
                    paymentDescription={`Fund Milestone: ${fundingMilestone.description}`}
                />
            )}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4 pb-4 border-b">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center"><FileText className="mr-3 text-blue-600"/> Contract Details</h2>
                        <p className="text-gray-500">ID: {contract.id}</p>
                    </div>
                    <StatusBadge status={contract.status} className="text-sm" />
                </div>
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md text-sm mb-4">
                    <strong>Disclaimer:</strong> This is a legally binding agreement directly between the Client and the Contractor. TechSubbies.com is a facilitator and is not a party to this agreement.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-bold text-lg flex items-center mb-2"><Building className="mr-2"/> Client</h3>
                        <p>{company.name}</p>
                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">{company.website}</a>
                    </div>
                     <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-bold text-lg flex items-center mb-2"><UserIcon className="mr-2"/> Contractor</h3>
                        <p>{engineer.name}</p>
                        <p className="text-sm text-gray-500">{engineer.contact.email}</p>
                    </div>
                </div>

                {contract.type === ContractType.SOW && (
                     <div className="mt-4">
                        <h3 className="font-bold text-lg mb-2">Project Milestones</h3>
                        <div className="space-y-2">
                            {contract.milestones.map(m => 
                                <MilestoneRow 
                                    key={m.id} 
                                    milestone={m} 
                                    contract={contract}
                                    onFund={() => setFundingMilestone(m)} 
                                    onAction={(action) => action(contract.id, m.id)}
                                    userRole={user.role} 
                                />
                            )}
                        </div>
                    </div>
                )}
                
                <div className="mt-4 pt-4 border-t">
                     <h3 className="font-bold text-lg mb-2">Signature Status</h3>
                     <div className="space-y-2">
                        <div className={`p-3 rounded-md flex items-center gap-3 ${contract.engineerSignature ? 'bg-green-50' : 'bg-gray-100'}`}>
                            <CheckCircle className={`w-6 h-6 ${contract.engineerSignature ? 'text-green-600' : 'text-gray-400'}`} />
                            <div>
                                <p className="font-semibold">Engineer Signature</p>
                                {contract.engineerSignature ? (
                                    <p className="text-sm text-green-700">Signed by {contract.engineerSignature.name} on {formatDate(contract.engineerSignature.date)}</p>
                                ) : (
                                    <p className="text-sm text-gray-500">Awaiting signature from {engineer.name}</p>
                                )}
                            </div>
                        </div>
                        <div className={`p-3 rounded-md flex items-center gap-3 ${contract.companySignature ? 'bg-green-50' : 'bg-gray-100'}`}>
                             <CheckCircle className={`w-6 h-6 ${contract.companySignature ? 'text-green-600' : 'text-gray-400'}`} />
                            <div>
                                <p className="font-semibold">Client Signature</p>
                                {contract.companySignature ? (
                                     <p className="text-sm text-green-700">Signed by {contract.companySignature.name} on {formatDate(contract.companySignature.date)}</p>
                                ) : (
                                    <p className="text-sm text-gray-500">Awaiting countersignature from {company.name}</p>
                                )}
                            </div>
                        </div>
                     </div>
                </div>

                <div className="mt-6 pt-6 border-t flex justify-end">
                    {canEngineerSign && (
                        <button onClick={() => setIsSignModalOpen(true)} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700">
                            Review & Sign Contract
                        </button>
                    )}
                    {canCompanySign && (
                         <button onClick={() => setIsSignModalOpen(true)} className="px-6 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700">
                            Countersign & Activate
                        </button>
                    )}
                </div>
            </div>
            {isSignModalOpen && (
                <SignContractModal
                    isOpen={isSignModalOpen}
                    onClose={() => setIsSignModalOpen(false)}
                    contract={contract}
                    onSubmit={handleSign}
                />
            )}
        </>
    );
};