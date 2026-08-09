import React, { useState, useMemo, useEffect } from 'react';
import { EngineerProfile } from '../../types';
import { MapPin, Calendar, DollarSign, PlusCircle, Search, MessageCircle } from '../../components/Icons';
// FIX: Replaced incorrect context hook 'useInteractions' with the correct hook 'useAppContext'.
import { useAppContext } from '../../context/InteractionContext';
import { formatDisplayDate } from '../../utils/dateFormatter';
import apiService from '../../services/apiService';
import type { PendingCompanyAttachmentRequestDTO } from '../../types/marketplaceApi';
import { errorMessage } from '../../utils/errorMessage';

const PendingJoinRequests = () => {
    const [requests, setRequests] = useState<PendingCompanyAttachmentRequestDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [resolvedNote, setResolvedNote] = useState('');

    const loadRequests = async () => {
        setLoading(true);
        try {
            const data = await apiService.getPendingCompanyAttachmentRequests();
            setRequests(data);
        } catch {
            // Quietly leave the list empty - this panel is a bonus, not core dashboard function.
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const handleRespond = async (requestId: string, approve: boolean) => {
        setBusyId(requestId);
        setError('');
        setResolvedNote('');
        try {
            await apiService.respondToCompanyAttachmentRequest(requestId, approve);
            setResolvedNote(approve ? 'Engineer approved and added to your roster.' : 'Request declined.');
            await loadRequests();
        } catch (err: unknown) {
            setError(errorMessage(err, 'Could not process this request.'));
        } finally {
            setBusyId(null);
        }
    };

    if (loading || requests.length === 0) {
        return null;
    }

    return (
        <div className="mb-6 bg-white rounded-lg shadow-sm border p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Pending join requests</h2>
            <p className="text-sm text-gray-500 mb-3">Engineers who have asked to join your resourcing company.</p>

            {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
            {resolvedNote && <p className="text-sm text-green-600 mb-2">{resolvedNote}</p>}

            <div className="space-y-2">
                {requests.map((req) => (
                    <div key={req.id} className="flex items-center justify-between border rounded-md p-3">
                        <div>
                            <p className="font-semibold text-gray-800">{req.engineer?.profile?.name || 'Unknown engineer'}</p>
                            <p className="text-sm text-gray-500">{req.engineer?.profile?.contact?.email}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleRespond(req.id, true)}
                                disabled={busyId === req.id}
                                className="px-3 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 disabled:opacity-50"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleRespond(req.id, false)}
                                disabled={busyId === req.id}
                                className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm font-semibold rounded-md hover:bg-gray-300 disabled:opacity-50"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ManagedEngineerCard = ({ profile, onMessage }: { profile: EngineerProfile, onMessage: (profileId: string) => void }) => (
    <div className="bg-white p-4 rounded-lg shadow-md border flex flex-col h-full">
        <div className="flex items-center mb-3 pb-3 border-b">
            <img src={profile.avatar} alt={profile.name} className="w-16 h-16 rounded-full mr-4 border-2 border-gray-200" />
            <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-800">{profile.name}</h3>
                <p className="text-blue-600 font-semibold">{profile.discipline}</p>
                <p className="text-sm text-gray-500 flex items-center mt-1"><MapPin size={14} className="mr-1"/> {profile.location}</p>
            </div>
        </div>
        <div className="flex-grow space-y-2 text-sm text-gray-600 pt-2">
             <div className="flex justify-between">
                <span className="flex items-center text-gray-500"><Calendar size={14} className="mr-1.5"/> Available From</span>
                <span className="font-semibold">{formatDisplayDate(profile.availability)}</span>
            </div>
            <div className="flex justify-between">
                <span className="flex items-center text-gray-500"><DollarSign size={14} className="mr-1.5"/> Day Rate</span>
                <span className="font-semibold">{profile.currency}{profile.minDayRate} - {profile.maxDayRate}</span>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t flex flex-col gap-2">
             <button onClick={() => onMessage(profile.id)} className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 w-full font-semibold flex items-center justify-center"><MessageCircle size={16} className="mr-2"/> Message Engineer</button>
            <button className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 w-full font-semibold">View Profile</button>
            <button className="px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 w-full font-semibold">Edit Details</button>
        </div>
    </div>
);

interface ManageEngineersViewProps {
    managedEngineers: EngineerProfile[];
    setActiveView: (view: string) => void;
}

export const ManageEngineersView = ({ managedEngineers, setActiveView }: ManageEngineersViewProps) => {
    const { startConversationAndNavigate } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const processedEngineers = useMemo(() => {
        return managedEngineers
            .filter(profile =>
                profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                profile.discipline.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();
                return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
            });
    }, [managedEngineers, searchTerm, sortOrder]);

    const handleMessageEngineer = (profileId: string) => {
        startConversationAndNavigate(profileId, () => setActiveView('Messages'));
    };

    return (
        <div>
            <PendingJoinRequests />

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Manage Engineers</h1>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">
                    <PlusCircle size={18} className="mr-2" /> Add New Engineer
                </button>
            </div>

            <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4 p-3 bg-white rounded-lg shadow-sm border">
                <div className="relative w-full sm:w-auto sm:flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search engineers by name or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 pl-10 focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-medium text-gray-600">Sort by:</span>
                    <button onClick={() => setSortOrder('asc')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${sortOrder === 'asc' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>A-Z</button>
                    <button onClick={() => setSortOrder('desc')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${sortOrder === 'desc' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Z-A</button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {processedEngineers.length > 0 ? (
                    processedEngineers.map(profile => <ManagedEngineerCard key={profile.id} profile={profile} onMessage={handleMessageEngineer}/>)
                ) : (
                    <div className="col-span-full text-center py-10 bg-white rounded-lg shadow-sm">
                        <p className="font-semibold">{searchTerm ? 'No engineers match your search.' : 'No engineers are currently managed.'}</p>
                        <p className="text-sm text-gray-500">{searchTerm ? 'Try a different search term.' : 'Click "Add New Engineer" to build your roster.'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
