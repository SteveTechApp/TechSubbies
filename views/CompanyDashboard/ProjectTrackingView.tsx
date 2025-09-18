import React, { useMemo, useState } from 'react';
// FIX: Corrected import path for useAppContext to resolve 'not a module' error.
import { useAppContext } from '../../context/InteractionContext';
import { Project, ProjectRole, EngineerProfile } from '../../types';
// FIX: Added UserPlus icon to the import after defining it in Icons.tsx.
import { ClipboardList, Users, DollarSign, Plus, UserPlus } from '../../components/Icons';
import { ProjectTimeline } from '../../components/ProjectTimeline';
import { AssignEngineerModal } from '../../components/AssignEngineerModal';

const ProgressBar = ({ value, colorClass }: { value: number; colorClass: string }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`${colorClass} h-2.5 rounded-full`} style={{ width: `${value}%` }}></div>
    </div>
);

const ProjectTrackerCard = ({ project, onAssignClick }: { project: Project, onAssignClick: (role: ProjectRole) => void }) => {
    const { contracts, engineers } = useAppContext();

    const { milestoneProgress, budgetProgress, totalBudget, spentBudget } = useMemo(() => {
        const assignedEngineerIds = new Set(project.roles.map(r => r.assignedEngineerId).filter(Boolean));
        const projectContracts = contracts.filter(c => assignedEngineerIds.has(c.engineerId));

        let totalMilestones = 0;
        let completedMilestones = 0;
        let totalBudget = 0;
        let spentBudget = 0;

        projectContracts.forEach(contract => {
            totalMilestones += contract.milestones.length;
            contract.milestones.forEach(milestone => {
                const amount = Number(milestone.amount) || 0;
                if (milestone.status === 'Completed & Paid') {
                    completedMilestones++;
                    spentBudget += amount;
                }
                totalBudget += amount;
            });
        });
        
        const totalDayRateCost = project.roles.reduce((acc, role) => {
            const engineer = getEngineerForRole(role.id);
            if (engineer) {
                 const durationInDays = (new Date(role.endDate).getTime() - new Date(role.startDate).getTime()) / (1000 * 3600 * 24);
                 // Using an average of min/max for simulation
                 const avgRate = (engineer.minDayRate + engineer.maxDayRate) / 2;
                 return acc + (durationInDays * avgRate);
            }
            return acc;
        }, 0);


        return {
            milestoneProgress: totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0,
            budgetProgress: (totalBudget + totalDayRateCost) > 0 ? (spentBudget / (totalBudget + totalDayRateCost)) * 100 : 0,
            totalBudget: totalBudget + totalDayRateCost, 
            spentBudget
        };
    }, [project, contracts]);
    
    const getEngineerForRole = (roleId: string): EngineerProfile | undefined => {
        const role = project.roles.find(r => r.id === roleId);
        return role?.assignedEngineerId ? engineers.find(e => e.id === role.assignedEngineerId) : undefined;
    };

    return (
        <div className="bg-white p-5 rounded-lg shadow-md border flex flex-col">
            <h3 className="text-xl font-bold text-gray-800">{project.name}</h3>
            
            <div className="my-4 space-y-3">
                 <div>
                    <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                        <span>Budget Used</span>
                        <span>{budgetProgress.toFixed(0)}%</span>
                    </div>
                    <ProgressBar value={budgetProgress} colorClass="bg-green-600" />
                    <p className="text-xs text-right text-gray-500 mt-1">£{spentBudget.toLocaleString()} / £{totalBudget.toLocaleString()}</p>
                </div>
            </div>
             <div className="p-3 bg-gray-50 rounded-md border">
                <h4 className="font-semibold text-sm mb-2">Project Timeline</h4>
                <ProjectTimeline roles={project.roles} />
            </div>

            <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold text-sm mb-2 flex items-center"><Users size={16} className="mr-2"/> Assigned Resources</h4>
                <div className="space-y-2">
                {project.roles.map(role => {
                    const assignedEngineer = getEngineerForRole(role.id);
                    return (
                        <div key={role.id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                           <div>
                               <p className="font-semibold text-sm">{role.title}</p>
                               {assignedEngineer && <p className="text-xs text-gray-600">{assignedEngineer.name}</p>}
                           </div>
                            {assignedEngineer ? (
                                <img src={assignedEngineer.avatar} alt={assignedEngineer.name} title={assignedEngineer.name} className="w-8 h-8 rounded-full" />
                            ) : (
                                <button onClick={() => onAssignClick(role)} className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded hover:bg-blue-200">
                                    <UserPlus size={12} /> Assign
                                </button>
                            )}
                        </div>
                    );
                })}
                </div>
            </div>
        </div>
    );
};

export const ProjectTrackingView = () => {
    // FIX: Added assignEngineerToProjectRole to the destructuring to fix missing property error.
    const { user, projects, assignEngineerToProjectRole } = useAppContext();
    const [assigningRole, setAssigningRole] = useState<ProjectRole | null>(null);

    const myProjects = useMemo(() => {
        if (!user) return [];
        return projects.filter(p => p.companyId === user.profile.id);
    }, [projects, user]);
    
    const handleAssign = (roleId: string, engineerId: string) => {
        if (assigningRole) {
            assignEngineerToProjectRole(assigningRole.id, engineerId);
        }
        setAssigningRole(null);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 flex items-center">
                <ClipboardList size={30} className="mr-3 text-green-600" /> Project Progress Tracking
            </h1>
            
            {myProjects.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {myProjects.map(project => (
                        <ProjectTrackerCard key={project.id} project={project} onAssignClick={setAssigningRole} />
                    ))}
                </div>
            ) : (
                <div className="text-center p-12 bg-white rounded-lg shadow-md border-2 border-dashed">
                    <p className="font-semibold text-lg">No projects found.</p>
                    <p className="text-gray-500">Use the 'Project Planner' to create a new project.</p>
                </div>
            )}

            {assigningRole && (
                <AssignEngineerModal 
                    isOpen={!!assigningRole}
                    onClose={() => setAssigningRole(null)}
                    role={assigningRole}
                    onAssign={handleAssign}
                />
            )}
        </div>
    );
};
