import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { Search, MapPin, Calendar, DollarSign, Home, ArrowUp } from '../../components/Icons.tsx';

const formatDate = (date: any): string => {
    if (!date) return 'TBD';
    try {
        const d = new Date(date);
        return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
        return 'Invalid Date';
    }
};

interface JobManagementViewProps {
    setActiveView: (view: string) => void;
}

export const JobManagementView = ({ setActiveView }: JobManagementViewProps) => {
    const { jobs, companies, toggleJobStatus } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');

    const getCompanyName = (companyId: string) => {
        return companies.find(c => c.id === companyId)?.name || 'Unknown Company';
    };

    const filteredJobs = useMemo(() => {
        return jobs.filter(job =>
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            getCompanyName(job.companyId).toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [jobs, searchTerm, companies]);

    return (
        <div id="page-top">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Job Management</h1>
                <button
                    onClick={() => setActiveView('Dashboard')}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                >
                    <Home size={18} className="mr-2" />
                    Home
                </button>
            </div>


            <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by job title or company name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 pl-10 focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredJobs.map(job => (
                            <tr key={job.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{job.title}</div>
                                    <div className="text-sm text-gray-500 flex items-center mt-1">
                                        <MapPin size={14} className="mr-1" />{job.location}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{getCompanyName(job.companyId)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex items-center"><DollarSign size={14} className="mr-1" />{job.currency}{job.dayRate}/day</div>
                                    <div className="flex items-center mt-1"><Calendar size={14} className="mr-1" />Starts: {formatDate(job.startDate)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {job.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => toggleJobStatus(job.id)}
                                        className={`px-3 py-1 rounded-md text-white ${job.status === 'active' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                                    >
                                        {job.status === 'active' ? 'Deactivate' : 'Reactivate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

             <div className="mt-8 text-center">
                <a href="#page-top" className="inline-flex items-center text-blue-600 hover:underline font-semibold">
                    <ArrowUp size={16} className="mr-2" />
                    Return to Top
                </a>
            </div>
        </div>
    );
};