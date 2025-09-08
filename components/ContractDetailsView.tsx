import React, { useState } from 'react';
import { Contract, User, Role, ContractStatus, UserProfile, CompanyProfile, EngineerProfile, Milestone, MilestoneStatus, ContractType, Timesheet, PaymentTerms } from '../types';
import { useAppContext } from '../context/AppContext';
import { FileText, User as UserIcon, Building, Calendar, CheckCircle, Clock, DollarSign, Loader, BrainCircuit, Download } from './Icons';
import { SignContractModal } from './SignContractModal';
import { formatDisplayDate } from '../utils/dateFormatter';
import { PaymentModal } from './PaymentModal';
import { TimesheetRow } from './TimesheetRow';
import { TimesheetSubmitModal } from './TimesheetSubmitModal';
import { InvoiceGeneratorModal } from './InvoiceGeneratorModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
        [MilestoneStatus.APPROVED_PENDING_INVOICE]: { text: 'Approved - Pending Invoice', color: 'bg-teal-100 text-teal-800' },
        [MilestoneStatus.COMPLETED_PAID]: { text: 'Paid', color: 'bg-green-100 text-green-700' },
    };
    const info = STATUS_INFO[status] || { text: status, color: 'bg-gray-200 text-gray-800' };
    return <span className={`px-3 py-1 text-xs font-bold rounded-full ${info.color} ${className}`}>{info.text}</span>;
};


const MilestoneRow = ({ milestone, contract, onFund, userRole }: { milestone: Milestone, contract: Contract, onFund: () => void, userRole: Role }) => {
    const { submitMilestoneForApproval, approveMilestone } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);

    const handleAction = async (action: (contractId: string, milestoneId: string) => void) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        action(contract.id, milestone.id);
        setIsLoading(false);
    };

    const renderAction = () => {
        if (isLoading) return <Loader className="animate-spin w-5 h-5 text-gray-500"/>;

        if (userRole === Role.COMPANY || userRole === Role.ADMIN) {
            if (milestone.status === MilestoneStatus.AWAITING_FUNDING) {
                return <button onClick={onFund} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Fund Milestone</button>;
            }
            if (milestone.status === MilestoneStatus.SUBMITTED_FOR_APPROVAL) {
                return <button onClick={() => handleAction(approveMilestone)} className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">Approve Milestone</button>;
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
    const { user, findUserByProfileId, signContract, fundMilestone, submitTimesheet, generateInvoice } = useAppContext();
    const [isSignModalOpen, setIsSignModalOpen] = useState(false);
    const [fundingMilestone, setFundingMilestone] = useState<Milestone | null>(null);
    const [isTimesheetModalOpen, setIsTimesheetModalOpen] = useState(false);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);


    const engineerUser = findUserByProfileId(contract.engineerId);
    const companyUser = findUserByProfileId(contract.companyId);
    
    const engineer = engineerUser?.profile as EngineerProfile | undefined;
    const company = companyUser?.profile as CompanyProfile | undefined;


    if (!engineer || !company || !user) return <div>Loading contract parties...</div>;
    
    const canEngineerSign = user.profile.id === engineer.id && contract.status === ContractStatus.PENDING_SIGNATURE && !contract.engineerSignature;
    const canCompanySign = (user.profile.id === company.id || user.role === Role.ADMIN) && contract.status === ContractStatus.SIGNED && !contract.companySignature;
    const canExportPdf = (user.role === Role.COMPANY || user.role === Role.ADMIN) && contract.status === ContractStatus.ACTIVE;

    const approvedMilestones = contract.milestones.filter(m => m.status === MilestoneStatus.APPROVED_PENDING_INVOICE);
    const canGenerateInvoice = user.role === Role.ENGINEER && approvedMilestones.length > 0;

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
    
    const handleTimesheetSubmit = (timesheetData: Omit<Timesheet, 'id' | 'contractId' | 'engineerId' | 'status'>) => {
        submitTimesheet(contract.id, timesheetData);
        setIsTimesheetModalOpen(false);
    };

    const handleOpenInvoiceModal = () => {
        setIsInvoiceModalOpen(true);
    };

    const handleInvoiceSubmit = (paymentTerms: PaymentTerms) => {
        generateInvoice(contract.id, paymentTerms);
        setIsInvoiceModalOpen(false);
    };
    
    const handleExportPdf = async () => {
        setIsGeneratingPdf(true);
        const reportElement = document.createElement('div');
        
        const getFinancialsHtml = () => {
            if (contract.type === ContractType.SOW) {
                const total = contract.milestones.reduce((sum, m) => sum + Number(m.amount), 0);
                return `
                    <h3 style="font-size: 1.2rem; margin-top: 20px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Project Milestones</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                        <thead>
                            <tr style="background-color: #f2f2f2;">
                                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Description</th>
                                <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${contract.milestones.map(m => `
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${m.description}</td>
                                    <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">${contract.currency}${m.amount.toLocaleString()}</td>
                                </tr>
                            `).join('')}
                            <tr style="font-weight: bold;">
                                <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">Total Project Value</td>
                                <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">${contract.currency}${total.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                `;
            } else {
                return `
                     <h3 style="font-size: 1.2rem; margin-top: 20px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Financial Terms</h3>
                     <p><strong>Day Rate:</strong> ${contract.currency}${contract.amount}</p>
                `;
            }
        };

        const getSignatureHtml = (sig: {name: string, date: Date} | null, role: string) => {
             if (sig) {
                return `<p><strong>Signed by ${role}:</strong> ${sig.name} on ${new Date(sig.date).toLocaleDateString()}</p>`;
            }
            return `<div style="margin-top: 30px; border-top: 1px solid #333; width: 60%;"><p style="margin-top: 5px;">Signature (${role})</p></div>`;
        }

        reportElement.innerHTML = `
            <div style="width: 210mm; padding: 20mm; font-family: Arial, sans-serif; color: #333; background-color: white;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #eee; padding-bottom: 10px;">
                <img src="${company.logo || company.avatar}" alt="Company Logo" style="max-height: 50px; max-width: 180px; object-fit: contain;">
                <div style="text-align: right;">
                  <h2 style="margin: 0; font-size: 1.5rem;">${company.name}</h2>
                  <p style="margin: 5px 0 0;">${company.contact.email}</p>
                  <p style="margin: 5px 0 0;">${company.website}</p>
                </div>
              </div>

              <h1 style="text-align: center; margin: 40px 0; color: #1e40af;">Service Agreement</h1>

              <div style="display: flex; justify-content: space-between; margin: 30px 0;">
                 <div><strong>Client:</strong><br/>${company.name}</div>
                 <div><strong>Contractor:</strong><br/>${engineer.name}</div>
              </div>
              
              <p><strong>Job Title:</strong> ${contract.jobTitle}</p>
              <p><strong>Contract ID:</strong> ${contract.id}</p>

              <h3 style="font-size: 1.2rem; margin-top: 20px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Agreement Terms</h3>
              <div style="font-size: 0.9rem; white-space: pre-wrap; margin-top: 10px;">${contract.description}</div>

              ${getFinancialsHtml()}

              <div style="margin-top: 50px;">
                <h3 style="font-size: 1.2rem;">Signatures</h3>
                ${getSignatureHtml(contract.engineerSignature, 'Contractor')}
                ${getSignatureHtml(contract.companySignature, 'Client')}
              </div>
              
              <p style="text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 10px; margin-top: 40px; position: absolute; bottom: 20mm; width: calc(100% - 40mm);">
                Generated by TechSubbies.com on ${new Date().toLocaleDateString()}
              </p>
            </div>
        `;
        
        reportElement.style.position = 'absolute';
        reportElement.style.left = '-9999px';
        document.body.appendChild(reportElement);

        const canvas = await html2canvas(reportElement.children[0] as HTMLElement, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        const width = pdfWidth;
        const height = width / ratio;

        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        pdf.save(`Contract_${contract.jobTitle?.replace(/\s/g, '_')}_${company.name.replace(/\s/g, '')}.pdf`);
        
        document.body.removeChild(reportElement);
        setIsGeneratingPdf(false);
    };


    return (
        <>
            {fundingMilestone && (
                <PaymentModal
                    isOpen={!!fundingMilestone}
                    onClose={() => setFundingMilestone(null)}
                    onSuccess={handlePaymentSuccess}
                    amount={fundingMilestone.amount}
                    currency={String(contract.currency)}
                    paymentDescription={`Fund Milestone: ${fundingMilestone.description}`}
                />
            )}
            {isTimesheetModalOpen && (
                <TimesheetSubmitModal 
                    isOpen={isTimesheetModalOpen}
                    onClose={() => setIsTimesheetModalOpen(false)}
                    onSubmit={handleTimesheetSubmit}
                    contract={contract}
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
                                    userRole={user.role} 
                                />
                            )}
                        </div>
                    </div>
                )}

                 {contract.type === ContractType.DAY_RATE && (
                     <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                             <h3 className="font-bold text-lg">Timesheets</h3>
                             {user.role === Role.ENGINEER && (
                                <button onClick={() => setIsTimesheetModalOpen(true)} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Submit Timesheet</button>
                             )}
                        </div>
                        <div className="space-y-2">
                            {contract.timesheets && contract.timesheets.length > 0 ? (
                                contract.timesheets.map(ts => <TimesheetRow key={ts.id} timesheet={ts} contract={contract} userRole={user.role} />)
                            ) : (
                                <p className="text-sm text-gray-500 text-center bg-gray-50 p-3 rounded-md">No timesheets submitted yet.</p>
                            )}
                        </div>
                         <div className="mt-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-md text-sm flex items-start gap-2">
                            <BrainCircuit size={20} className="flex-shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold">Coming Soon:</span> AI-powered timesheet verification using geolocation to confirm time on-site and travel.
                            </div>
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

                <div className="mt-6 pt-6 border-t flex justify-end gap-3 flex-wrap">
                    {canExportPdf && (
                         <button onClick={handleExportPdf} disabled={isGeneratingPdf} className="flex items-center px-6 py-2 bg-gray-600 text-white font-bold rounded-md hover:bg-gray-700 disabled:bg-gray-400">
                             {isGeneratingPdf ? <Loader className="animate-spin w-5 h-5 mr-2" /> : <Download size={18} className="mr-2" />}
                             {isGeneratingPdf ? 'Generating...' : 'Export PDF'}
                        </button>
                    )}
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
                     {canGenerateInvoice && (
                        <button onClick={handleOpenInvoiceModal} className="px-6 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700">
                            Generate Invoice for Approved Milestones
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
            {isInvoiceModalOpen && (
                 <InvoiceGeneratorModal
                    isOpen={isInvoiceModalOpen}
                    onClose={() => setIsInvoiceModalOpen(false)}
                    onSubmit={handleInvoiceSubmit}
                    contract={contract}
                />
            )}
        </>
    );
};