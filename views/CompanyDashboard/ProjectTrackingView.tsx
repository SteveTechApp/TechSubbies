import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { Project, ContractStatus, MilestoneStatus } from '../../types/index.ts';
import { ClipboardList, Users, DollarSign } from '../../components/Icons.tsx';

const ProgressBar = ({ value, colorClass }: { value: number; colorClass: string }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`${colorClass} h-2.5 rounded-full`} style={{ width: `${value}%` }}></div>
    </div>
);

const ProjectTrackerCard = ({ project }: { project: Project }) => {
    const { contracts, engineers } = useAppContext();

    const { milestoneProgress, budgetProgress, assignedEngineers, totalBudget, spentBudget } = useMemo(() => {
        const projectContracts = contracts.filter(c => project.roles.some(r => r.assignedEngineerId === c.engineerId));

        let totalMilestones = 0;
        let completedMilestones = 0;
        let totalBudget = 0;
        let spentBudget = 0;

        projectContracts.forEach(contract => {
            if (contract.milestones && contract.milestones.length > 0) {
                totalMilestones += contract.milestones.length;
                contract.milestones.forEach(milestone => {
                    const amount = Number(milestone.amount) || 0;
                    totalBudget += amount;
                    if (milestone.status === MilestoneStatus.COMPLETED_PAID) {
                        completedMilestones++;
                        spentBudget += amount;
                    }
                });
            }
        });
        
        const assignedEngineerIds = new Set(project.roles.map(r => r.assignedEngineerId).filter(Boolean));
        const assignedEngineersList = engineers.filter(e => assignedEngineerIds.has(e.id));

        return {
            milestoneProgress: totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0,
            budgetProgress: totalBudget > 0 ? (spentBudget / totalBudget) * 100 : 0,
            assignedEngineers: assignedEngineersList,
            totalBudget,
            spentBudget
        };
    }, [project, contracts, engineers]);

    return (
        <div className="bg-white p-5 rounded-lg shadow-md border flex flex-col">
            <h3 className="text-xl font-bold text-gray-800">{project.name}</h3>
            <p className="text-sm text-gray-500 flex-grow mt-1">{project.description}</p>
            
            <div className="my-4 space-y-3">
                <div>
                    <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                        <span>Milestone Progress</span>
                        <span>{milestoneProgress.toFixed(0)}%</span>
                    </div>
                    <ProgressBar value={milestoneProgress} colorClass="bg-blue-600" />
                </div>
                 <div>
                    <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                        <span>Budget Used</span>
                        <span>{budgetProgress.toFixed(0)}%</span>
                    </div>
                    <ProgressBar value={budgetProgress} colorClass="bg-green-600" />
                    <p className="text-xs text-right text-gray-500 mt-1">£{spentBudget.toLocaleString()} / £{totalBudget.toLocaleString()}</p>
                </div>
            </div>

            <div className="mt-2 pt-4 border-t">
                <h4 className="font-semibold text-sm mb-2 flex items-center"><Users size={16} className="mr-2"/> Assigned Engineers</h4>
                {assignedEngineers.length > 0 ? (
                    <div className="flex items-center -space-x-2">
                        {assignedEngineers.map(eng => (
                            <img key={eng.id} src={eng.avatar} alt={eng.name} title={eng.name} className="w-8 h-8 rounded-full border-2 border-white" />
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-gray-500">No engineers assigned yet.</p>
                )}
            </div>
        </div>
    );
};

export const ProjectTrackingView = () => {
    const { user, projects } = useAppContext();

    const myProjects = useMemo(() => {
        if (!user) return [];
        return projects.filter(p => p.companyId === user.profile.id);
    }, [projects, user]);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 flex items-center">
                <ClipboardList size={30} className="mr-3 text-green-600" /> Project Progress Tracking
            </h1>
            
            {myProjects.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {myProjects.map(project => (
                        <ProjectTrackerCard key={project.id} project={project} />
                    ))}
                </div>
            ) : (
                <div className="text-center p-12 bg-white rounded-lg shadow-md border-2 border-dashed">
                    <p className="font-semibold text-lg">No projects found.</p>
                    <p className="text-gray-500">Use the 'Project Planner' to create a new project.</p>
                </div>
            )}
        </div>
    );
};