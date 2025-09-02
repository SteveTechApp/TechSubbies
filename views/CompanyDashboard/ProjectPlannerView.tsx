import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { Project, ProjectRole, Discipline, EngineerProfile } from '../../types/index.ts';
import { KanbanSquare, Plus, ArrowLeft, Calendar, Briefcase, User, Edit, Trash2, Bed, Plane, UtensilsCrossed } from '../../components/Icons.tsx';
import { AssignEngineerModal } from '../../components/AssignEngineerModal.tsx';
import { ProjectTimeline } from '../../components/ProjectTimeline.tsx';

// --- Main View Component ---
export const ProjectPlannerView = () => {
    const { user, projects, createProject } = useAppContext();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const myProjects = useMemo(() => {
        if (!user) return [];
        return projects.filter(p => p.companyId === user.profile.id);
    }, [projects, user]);

    const handleCreateProject = () => {
        const name = prompt("Enter new project name:");
        if (name) {
            const newProject = createProject(name, "A new project to manage resources.");
            setSelectedProject(newProject);
        }
    };

    if (selectedProject) {
        return <ProjectBuilderView project={selectedProject} onBack={() => setSelectedProject(null)} />;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center"><KanbanSquare className="mr-3 text-blue-600" /> Project Planner</h1>
                <button onClick={handleCreateProject} className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">
                    <Plus size={18} className="mr-2" /> Create New Project
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProjects.map(project => (
                    <ProjectCard key={project.id} project={project} onSelect={() => setSelectedProject(project)} />
                ))}
            </div>
        </div>
    );
};

// --- Project Card for List View ---
const ProjectCard = ({ project, onSelect }: { project: Project; onSelect: () => void }) => {
    const projectDuration = useMemo(() => {
        if (project.roles.length === 0) return 'N/A';
        const startDates = project.roles.map(r => r.startDate.getTime());
        const endDates = project.roles.map(r => r.endDate.getTime());
        const minStart = new Date(Math.min(...startDates));
        const maxEnd = new Date(Math.max(...endDates));
        return `${minStart.toLocaleDateString()} - ${maxEnd.toLocaleDateString()}`;
    }, [project.roles]);

    return (
        <div className="bg-white p-5 rounded-lg shadow flex flex-col h-full">
            <h3 className="text-xl font-bold text-gray-800">{project.name}</h3>
            <p className="text-sm text-gray-500 flex-grow mt-1">{project.description.substring(0, 100)}...</p>
            <div className="mt-4 pt-4 border-t text-sm text-gray-600 space-y-2">
                <div className="flex justify-between"><span>Status:</span> <span className="font-semibold">{project.status}</span></div>
                <div className="flex justify-between"><span>Roles:</span> <span className="font-semibold">{project.roles.length}</span></div>
                <div className="flex justify-between"><span>Timeline:</span> <span className="font-semibold">{projectDuration}</span></div>
            </div>
            <button onClick={onSelect} className="mt-4 w-full text-center px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700">
                Manage Project
            </button>
        </div>
    );
};

// --- Project Builder View ---
const ProjectBuilderView = ({ project, onBack }: { project: Project; onBack: () => void }) => {
    const { engineers, addRoleToProject, assignEngineerToRole } = useAppContext();
    const [isAssignModalOpen, setIsAssignModalOpen] = useState<ProjectRole | null>(null);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

    const handleAssignEngineer = (roleId: string, engineerId: string) => {
        assignEngineerToRole(project.id, roleId, engineerId);
        setIsAssignModalOpen(null);
    };

    return (
        <>
            <button onClick={onBack} className="flex items-center mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                <ArrowLeft size={16} className="mr-2" /> Back to All Projects
            </button>

            <div className="bg-white p-6 rounded-lg shadow space-y-6">
                <div>
                    <h2 className="text-3xl font-bold">{project.name}</h2>
                    <p className="text-gray-600">{project.description}</p>
                </div>
                
                {/* Roles Section */}
                <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                         <h3 className="text-2xl font-bold">Project Roles</h3>
                         <button onClick={() => setIsRoleModalOpen(true)} className="flex items-center px-3 py-1.5 bg-blue-500 text-white text-sm font-semibold rounded-md hover:bg-blue-600"><Plus size={16} className="mr-1.5" /> Add Role</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {project.roles.map(role => (
                            <RoleCard key={role.id} role={role} onAssignClick={() => setIsAssignModalOpen(role)} engineers={engineers} />
                        ))}
                    </div>
                </div>

                {/* Timeline Section */}
                <div className="pt-4 border-t">
                     <h3 className="text-2xl font-bold mb-4">Project Timeline</h3>
                     <ProjectTimeline project={project} />
                </div>
            </div>

            {isAssignModalOpen && (
                <AssignEngineerModal
                    isOpen={!!isAssignModalOpen}
                    onClose={() => setIsAssignModalOpen(null)}
                    role={isAssignModalOpen}
                    onAssign={handleAssignEngineer}
                />
            )}
            {isRoleModalOpen && (
                <AddRoleModal 
                    isOpen={isRoleModalOpen}
                    onClose={() => setIsRoleModalOpen(false)}
                    onAddRole={(roleData) => addRoleToProject(project.id, roleData)}
                />
            )}
        </>
    );
};

// --- Role Card in Builder View ---
const RoleCard = ({ role, onAssignClick, engineers }: { role: ProjectRole; onAssignClick: () => void; engineers: EngineerProfile[] }) => {
    const assignedEngineer = useMemo(() => engineers.find(e => e.id === role.assignedEngineerId), [engineers, role.assignedEngineerId]);
    return (
        <div className="bg-gray-50 p-4 rounded-lg border flex flex-col">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-lg">{role.title}</h4>
                    <p className="text-sm text-gray-500">{role.discipline}</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-1.5 text-gray-500 hover:text-blue-600"><Edit size={16}/></button>
                    <button className="p-1.5 text-gray-500 hover:text-red-600"><Trash2 size={16}/></button>
                </div>
            </div>
            <p className="text-sm my-3 flex items-center gap-2"><Calendar size={14} /> {role.startDate.toLocaleDateString()} to {role.endDate.toLocaleDateString()}</p>
            
            <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                {role.hotelCovered && <span className="flex items-center gap-1.5" title="Hotel Covered"><Bed size={14} /> Hotel</span>}
                {role.travelCovered && <span className="flex items-center gap-1.5" title="Travel Covered"><Plane size={14} /> Travel</span>}
                {role.mealsCovered && <span className="flex items-center gap-1.5" title="Meals Covered"><UtensilsCrossed size={14} /> Meals</span>}
            </div>

            <div className="mt-auto pt-3 border-t">
                {assignedEngineer ? (
                    <div className="flex items-center gap-3">
                        <img src={assignedEngineer.avatar} alt={assignedEngineer.name} className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="font-semibold">{assignedEngineer.name}</p>
                            <button onClick={onAssignClick} className="text-xs text-blue-600 hover:underline">Change</button>
                        </div>
                    </div>
                ) : (
                    <button onClick={onAssignClick} className="w-full text-blue-600 font-bold hover:text-blue-800 flex items-center justify-center gap-2">
                        <User size={16}/> Assign Engineer
                    </button>
                )}
            </div>
        </div>
    );
};


// --- Add Role Modal ---
const AddRoleModal = ({ isOpen, onClose, onAddRole }: { isOpen: boolean, onClose: () => void, onAddRole: (role: Omit<ProjectRole, 'id' | 'assignedEngineerId'>) => void }) => {
    const [formData, setFormData] = useState({
        title: '',
        discipline: Discipline.AV,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
        hotelCovered: false,
        travelCovered: false,
        mealsCovered: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddRole({
            ...formData,
            startDate: new Date(formData.startDate),
            endDate: new Date(formData.endDate),
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">Add New Role to Project</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Role Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border p-2 rounded" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Discipline</label>
                        <select name="discipline" value={formData.discipline} onChange={handleChange} className="w-full border p-2 rounded bg-white">
                            {Object.values(Discipline).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Start Date</label>
                            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full border p-2 rounded" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">End Date</label>
                            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full border p-2 rounded" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Additional Costs Covered</label>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center"><input type="checkbox" name="hotelCovered" checked={formData.hotelCovered} onChange={handleChange} className="h-4 w-4 mr-1.5" /> Hotel</label>
                            <label className="flex items-center"><input type="checkbox" name="travelCovered" checked={formData.travelCovered} onChange={handleChange} className="h-4 w-4 mr-1.5" /> Travel</label>
                            <label className="flex items-center"><input type="checkbox" name="mealsCovered" checked={formData.mealsCovered} onChange={handleChange} className="h-4 w-4 mr-1.5" /> Meals</label>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Add Role</button>
                </div>
            </form>
        </div>
    );
};