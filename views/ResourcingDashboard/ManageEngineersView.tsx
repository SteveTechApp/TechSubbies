import React, { useState, useMemo } from 'react';
import { EngineerProfile } from '../../context/AppContext.tsx';
import { MapPin, Calendar, DollarSign, PlusCircle, Search } from '../../components/Icons.tsx';

const formatDate = (date: Date): string => {
    try {
        return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
        return 'N/A';
    }
};

const ManagedEngineerCard = ({ profile }: { profile: EngineerProfile }) => (
    <div className="bg-white p-4 rounded-lg shadow-md border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
            <img src={profile.avatar} alt={profile.name} className="w-16 h-16 rounded-full mr-4 border-2 border-gray-200" />
            <div>
                <h3 className="text-lg font-bold text-gray-800">{profile.name}</h3>
                <p className="text-blue-600 font-semibold">{profile.tagline}</p>
                <p className="text-sm text-gray-500 flex items-center mt-1"><MapPin size={14} className="mr-1"/> {profile.location}</p>
            </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 sm:text-right">
             <div className="text-sm text-gray-600">
                <p className="flex items-center sm:justify-end"><Calendar size={14} className="mr-1.5 text-gray-400"/> Available From</p>
                <p className="font-semibold">{formatDate(profile.availability)}</p>
            </div>
            <div className="text-sm text-gray-600">
                <p className="flex items-center sm:justify-end"><DollarSign size={14} className="mr-1.5 text-gray-400"/> Day Rate</p>
                <p className="font-semibold">{profile.currency}{profile.dayRate}</p>
            </div>
        </div>
        <div className="flex-shrink-0 flex sm:flex-col gap-2">
            <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 w-full">View Profile</button>
            <button className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 w-full">Edit Details</button>
        </div>
    </div>
);


interface ManageEngineersViewProps {
    managedEngineers: EngineerProfile[];
}

export const ManageEngineersView = ({ managedEngineers }: ManageEngineersViewProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const processedEngineers = useMemo(() => {
        return managedEngineers
            .filter(profile =>
                profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                profile.tagline.toLowerCase().includes(searchTerm.toLowerCase())
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

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Engineers</h1>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">
                    <PlusCircle size={18} className="mr-2" />
                    Add New Engineer
                </button>
            </div>

            {/* Search and Sort Controls */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white rounded-lg shadow-sm border">
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
            
            <div className="space-y-4">
                {processedEngineers.length > 0 ? (
                    processedEngineers.map(profile => <ManagedEngineerCard key={profile.id} profile={profile} />)
                ) : (
                    <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                        <p className="font-semibold">{searchTerm ? 'No engineers match your search.' : 'No engineers are currently managed.'}</p>
                        <p className="text-sm text-gray-500">{searchTerm ? 'Try a different search term.' : 'Click "Add New Engineer" to build your roster.'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};