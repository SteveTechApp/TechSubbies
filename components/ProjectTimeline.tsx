import React, { useMemo } from 'react';
import { Project } from '../types/index.ts';
import { useAppContext } from '../context/AppContext.tsx';

interface ProjectTimelineProps {
    project: Project;
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const ProjectTimeline = ({ project }: ProjectTimelineProps) => {
    const { engineers } = useAppContext();

    const { projectStart, projectEnd, totalDurationDays, timelineMonths } = useMemo(() => {
        if (project.roles.length === 0) {
            const today = new Date();
            const end = new Date();
            end.setMonth(today.getMonth() + 2);
            return { projectStart: today, projectEnd: end, totalDurationDays: 60, timelineMonths: [] };
        }

        const startDates = project.roles.map(r => r.startDate.getTime());
        const endDates = project.roles.map(r => r.endDate.getTime());
        
        const projectStart = new Date(Math.min(...startDates));
        projectStart.setDate(1); // Start timeline at the beginning of the first month

        const projectEnd = new Date(Math.max(...endDates));
        projectEnd.setMonth(projectEnd.getMonth() + 1, 0); // End timeline at the end of the last month
        
        const totalDurationDays = (projectEnd.getTime() - projectStart.getTime()) / (1000 * 3600 * 24);
        
        // Generate month markers for the timeline header
        const months = [];
        let currentDate = new Date(projectStart);
        while (currentDate <= projectEnd) {
            months.push({ name: MONTH_NAMES[currentDate.getMonth()], year: currentDate.getFullYear() });
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        return { projectStart, projectEnd, totalDurationDays, timelineMonths: months };
    }, [project.roles]);

    const getRoleStyle = (role: typeof project.roles[0]) => {
        const offsetMs = role.startDate.getTime() - projectStart.getTime();
        const durationMs = role.endDate.getTime() - role.startDate.getTime();
        const totalDurationMs = totalDurationDays * 24 * 3600 * 1000;

        const left = (offsetMs / totalDurationMs) * 100;
        const width = (durationMs / totalDurationMs) * 100;

        return {
            left: `${left}%`,
            width: `${width}%`,
        };
    };

    if (project.roles.length === 0) {
        return <div className="text-center p-8 bg-gray-100 rounded-md">Add roles to see the project timeline.</div>
    }

    return (
        <div className="space-y-3 font-sans">
            {/* Timeline Header */}
            <div className="flex bg-gray-200 rounded-t-lg overflow-hidden">
                {timelineMonths.map((month, index) => (
                    <div key={index} className="flex-1 text-center p-2 text-sm font-semibold border-r border-gray-300 last:border-r-0">
                        {month.name} '{String(month.year).slice(2)}
                    </div>
                ))}
            </div>
            
            {/* Timeline Rows */}
            {project.roles.map((role, index) => {
                const style = getRoleStyle(role);
                const engineer = engineers.find(e => e.id === role.assignedEngineerId);
                const colorIndex = index % 5;
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-teal-500'];

                return (
                    <div key={role.id} className="relative h-12 flex items-center bg-gray-100 rounded-md">
                        <div
                            className={`absolute h-full ${colors[colorIndex]} rounded-md opacity-70`}
                            style={style}
                        ></div>
                        <div className="relative z-10 p-3 w-full flex justify-between items-center text-white">
                            <span className="font-bold text-sm truncate">{role.title}</span>
                            {engineer && (
                                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                    <span className="text-xs font-semibold">{engineer.name}</span>
                                    <img src={engineer.avatar} alt={engineer.name} className="w-6 h-6 rounded-full border-2 border-white"/>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
