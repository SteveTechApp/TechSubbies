import React, { useState, useMemo } from 'react';
import { EngineerProfile } from '../../types/index.ts';
import { MapPin, Calendar, DollarSign, PlusCircle, Search, MessageCircle } from '../../components/Icons.tsx';
import { useAppContext } from '../../context/AppContext.tsx';

const formatDate = (date: Date): string => {
    try {
        return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
        return 'N/A';
    }
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
                <p className="flex items-center text-gray-500"><Calendar size={14} className="mr-1.5"/> Available From</p>
                <p className="font-semibold">{formatDate(profile.availability)}</p>
            </div>
            <div className="flex justify-between">
                <p className="flex items-center text-gray-500"><DollarSign size={14} className="mr-1.5"/> Day Rate</p>
                <p className="font-semibold">{profile.currency}{profile.dayRate}</p>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t flex flex-col gap-2">
             <button 
                onClick={() => onMessage(profile.id)}
                className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 w-full font-semibold flex items-center justify-center"
            >
                <MessageCircle size={16} className="mr-2"/> Message Engineer
            </button>
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
                if (sortOrder === 'asc') {
                    return nameA.localeCompare(nameB);
                } else {
                    return nameB.localeCompare(nameA);
                }
            });
    }, [managedEngineers, searchTerm, sortOrder]);

    const handleMessageEngineer = (profileId: string) => {
        startConversationAndNavigate(profileId, () => setActiveView('Messages'));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Manage Engineers</h1>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">
                    <PlusCircle size={18} className="mr-2" />
                    Add New Engineer
                </button>
            </div>

            {/* Search and Sort Controls */}
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
                    <button
                        onClick={() => setSortOrder('asc')}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${sortOrder === 'asc' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        A-Z
                    </button>
                    <button
                        onClick={() => setSortOrder('desc')}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${sortOrder === 'desc' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        Z-A
                    </button>
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