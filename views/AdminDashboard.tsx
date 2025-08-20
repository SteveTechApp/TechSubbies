

import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { SupportRequest, Role } from '../types';
import { Users, AlertTriangle, CheckCircle, Ticket, Inbox } from 'lucide-react';
import { AISkillDiscovery } from '../components/AISkillDiscovery';

const StatCard: React.FC<{ icon: React.ElementType; title: string; value: number | string; color: string }> = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
            <p className="text-sm text-gray-600 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

export const AdminDashboard: React.FC = () => {
    const { engineers, companies, supportRequests, updateSupportRequest } = useAppContext();
    const [showOnlyOpen, setShowOnlyOpen] = useState(true);

    const totalUsers = engineers.length + companies.length;
    const openTickets = useMemo(() => supportRequests.filter(r => r.status === 'Open').length, [supportRequests]);

    const filteredRequests = useMemo(() => {
        const sorted = [...supportRequests].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        if (showOnlyOpen) {
            return sorted.filter(r => r.status === 'Open');
        }
        return sorted;
    }, [supportRequests, showOnlyOpen]);

    const handleResolveTicket = (id: string) => {
        updateSupportRequest(id, 'Resolved');
    };

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard icon={Users} title="Total Users" value={totalUsers} color="bg-blue-500" />
                <StatCard icon={Ticket} title="Total Support Tickets" value={supportRequests.length} color="bg-green-500" />
                <StatCard icon={AlertTriangle} title="Open Tickets" value={openTickets} color="bg-yellow-500" />
            </div>
            
            {/* AI Tools Section */}
            <div className="space-y-8 mb-8">
                 <AISkillDiscovery />
            </div>


            {/* Support Requests Table */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="p-6 flex justify-between items-center border-b">
                    <h2 className="text-xl font-bold text-gray-800">Support Requests</h2>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="showOpen"
                            checked={showOnlyOpen}
                            onChange={() => setShowOnlyOpen(!showOnlyOpen)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="showOpen" className="ml-2 text-sm font-medium text-gray-700">
                            Show only open tickets
                        </label>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRequests.map((req) => (
                                <tr key={req.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{req.userName}</div>
                                        <div className="text-sm text-gray-500 capitalize">{req.userRole}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{req.subject}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">{req.message}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(req.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            req.status === 'Open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {req.status === 'Open' && (
                                            <button
                                                onClick={() => handleResolveTicket(req.id)}
                                                className="flex items-center text-indigo-600 hover:text-indigo-900"
                                            >
                                                <CheckCircle size={16} className="mr-1" />
                                                Mark as Resolved
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredRequests.length === 0 && (
                        <div className="text-center py-12">
                            <Inbox className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No support requests</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {showOnlyOpen ? "There are no open tickets." : "There are no support tickets yet."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};