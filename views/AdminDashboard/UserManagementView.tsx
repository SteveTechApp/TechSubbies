import React, { useState, useMemo } from 'react';
// FIX: Corrected import path for useAppContext to resolve 'not a module' error.
import { useAppContext } from '../../context/InteractionContext';
import { User, Role } from '../../types';
import { Search, User as UserIcon, Building, ShieldCheck } from '../../components/Icons';

export const UserManagementView = () => {
    const { allUsers, toggleUserStatus } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    const filteredUsers = useMemo(() => {
        return allUsers
            .filter(user => {
                const roleMatch = filterRole === 'all' || user.role === filterRole;
                const searchMatch = user.profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    ('contact' in user.profile && 'email' in user.profile.contact && user.profile.contact.email.toLowerCase().includes(searchTerm.toLowerCase()));
                return roleMatch && searchMatch;
            })
            .sort((a, b) => a.profile.name.localeCompare(b.profile.name));
    }, [allUsers, searchTerm, filterRole]);

    const getRoleDisplay = (role: Role) => {
        switch (role) {
            case Role.ENGINEER: return { text: 'Engineer', icon: UserIcon, color: 'text-green-600' };
            case Role.COMPANY: return { text: 'Company', icon: Building, color: 'text-blue-600' };
            case Role.RESOURCING_COMPANY: return { text: 'Resourcing', icon: Building, color: 'text-indigo-600' };
            case Role.ADMIN: return { text: 'Admin', icon: ShieldCheck, color: 'text-purple-600' };
            default: return { text: 'Unknown', icon: UserIcon, color: 'text-gray-500' };
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">User Management</h1>
            
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4 p-3 bg-white rounded-lg shadow-sm border">
                <div className="relative w-full sm:w-auto sm:flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 pl-10 focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                 <div className="flex items-center gap-2">
                    <label htmlFor="roleFilter" className="text-sm font-medium text-gray-700">Filter by role:</label>
                    <select
                        id="roleFilter"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 bg-white"
                    >
                        <option value="all">All Roles</option>
                        <option value={Role.ENGINEER}>Engineer</option>
                        <option value={Role.COMPANY}>Company</option>
                        <option value={Role.RESOURCING_COMPANY}>Resourcing</option>
                        <option value={Role.ADMIN}>Admin</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map(user => {
                            const roleInfo = getRoleDisplay(user.role);
                            const email = 'contact' in user.profile && 'email' in user.profile.contact ? user.profile.contact.email : 'N/A';
                            return (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img className="h-10 w-10 rounded-full" src={user.profile.avatar} alt="" />
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.profile.name}</div>
                                                <div className="text-sm text-gray-500">{email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm font-semibold flex items-center ${roleInfo.color}`}>
                                            <roleInfo.icon size={16} className="mr-1.5" />
                                            {roleInfo.text}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.profile.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.profile.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            onClick={() => toggleUserStatus(user.profile.id)}
                                            className={`px-3 py-1 rounded-md text-white ${user.profile.status === 'active' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                                        >
                                            {user.profile.status === 'active' ? 'Suspend' : 'Reactivate'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};