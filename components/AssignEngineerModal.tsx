import React, { useState, useMemo } from 'react';
// FIX: Corrected import path for useAppContext to resolve 'not a module' error.
import { useAppContext } from '../context/InteractionContext';
// FIX: Corrected import path for types.
import { ProjectRole, EngineerProfile } from '../types';
import { X, User } from './Icons';

interface AssignEngineerModalProps {
    isOpen: boolean;
    onClose: () => void;
    role: ProjectRole;
    onAssign: (roleId: string, engineerId: string) => void;
}

const EngineerListItem = ({ engineer, onSelect }: { engineer: EngineerProfile; onSelect: () => void }) => (
    <button onClick={onSelect} className="w-full flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg text-left">
        <img src={engineer.avatar} alt={engineer.name} className="w-12 h-12 rounded-full" />
        <div className="flex-grow">
            <p className="font-bold">{engineer.name}</p>
            <p className="text-sm text-gray-500">{engineer.experience} yrs exp. | {engineer.currency}{engineer.minDayRate}-{engineer.maxDayRate}/day</p>
        </div>
    </button>
);

export const AssignEngineerModal = ({ isOpen, onClose, role, onAssign }: AssignEngineerModalProps) => {
    const { engineers } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');

    const availableEngineers = useMemo(() => {
        return engineers.filter(e => 
            e.status === 'active' &&
            (e.discipline === role.discipline || e.discipline === 'AV & IT Engineer') &&
            new Date(e.availability) <= role.startDate &&
            e.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [engineers, role, searchTerm]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-white rounded-lg p-6 m-4 max-w-2xl w-full relative transform transition-all duration-300 max-h-[80vh] flex flex-col" 
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"><X size={24} /></button>
                <h2 className="text-2xl font-bold mb-2">Assign Engineer</h2>
                <p className="text-gray-600 mb-4">For role: <span className="font-semibold">{role.title}</span></p>

                <input
                    type="text"
                    placeholder="Search available engineers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border p-2 rounded-md mb-4"
                />

                <div className="flex-grow overflow-y-auto custom-scrollbar -mr-3 pr-3">
                    {availableEngineers.length > 0 ? (
                        <div className="space-y-2">
                            {availableEngineers.map(eng => (
                                <EngineerListItem key={eng.id} engineer={eng} onSelect={() => onAssign(role.id, eng.id)} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <User size={40} className="mx-auto text-gray-400" />
                            <p className="mt-2 font-semibold">No available engineers match this role's requirements.</p>
                            <p className="text-sm text-gray-500">Try adjusting the role's dates or discipline.</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-4 mt-4 border-t">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                </div>
            </div>
        </div>
    );
};