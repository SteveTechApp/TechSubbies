import React, { useMemo } from 'react';
import { ProjectRole } from '../types';
import { User } from './Icons';

interface ProjectTimelineProps {
    roles: ProjectRole[];
}

const COLORS = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500'];

export const ProjectTimeline = ({ roles }: ProjectTimelineProps) => {
    
    const { phases, startDate, endDate, totalDays } = useMemo(() => {
        if (roles.length === 0) {
            const today = new Date();
            const nextMonth = new Date();
            nextMonth.setMonth(today.getMonth() + 1);
            return { phases: [], startDate: today, endDate: nextMonth, totalDays: 30 };
        }

        const dates = roles.flatMap(r => [new Date(r.startDate).getTime(), new Date(r.endDate).getTime()]);
        const minTime = Math.min(...dates);
        const maxTime = Math.max(...dates);
        const startDate = new Date(minTime);
        const endDate = new Date(maxTime);
        const totalDays = Math.max(1, (maxTime - minTime) / (1000 * 3600 * 24));
        
        const groupedByPhase = roles.reduce((acc, role) => {
            const phaseName = (role as any).phase || 'Unphased';
            if (!acc[phaseName]) {
                acc[phaseName] = [];
            }
            acc[phaseName].push(role);
            return acc;
        }, {} as Record<string, ProjectRole[]>);

        return { phases: Object.entries(groupedByPhase), startDate, endDate, totalDays };

    }, [roles]);

    const getRoleStyle = (role: ProjectRole) => {
        const left = ((new Date(role.startDate).getTime() - startDate.getTime()) / (1000 * 3600 * 24) / totalDays) * 100;
        const width = ((new Date(role.endDate).getTime() - new Date(role.startDate).getTime()) / (1000 * 3600 * 24) / totalDays) * 100;
        return {
            left: `${left}%`,
            width: `${Math.max(width, 2)}%`, // Ensure a minimum width for visibility
        };
    };

    return (
        <div className="space-y-4 text-xs">
            <div className="flex justify-between font-bold text-gray-500">
                <span>{startDate.toLocaleDateString()}</span>
                <span>{endDate.toLocaleDateString()}</span>
            </div>
            {phases.map(([phaseName, phaseRoles], index) => (
                <div key={phaseName}>
                    <h5 className="font-bold text-gray-700 mb-2">{phaseName}</h5>
                    <div className="relative bg-gray-100 rounded-lg h-10">
                        {phaseRoles.map((role, rIndex) => (
                             <div 
                                key={role.id || rIndex} 
                                style={getRoleStyle(role)} 
                                title={`${role.title} (${new Date(role.startDate).toLocaleDateString()} - ${new Date(role.endDate).toLocaleDateString()})`}
                                className={`absolute top-1 bottom-1 ${COLORS[index % COLORS.length]} rounded text-white flex items-center px-2 shadow-sm overflow-hidden`}
                            >
                                <User size={12} className="mr-1.5 flex-shrink-0"/>
                                <span className="truncate">{role.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
