import React, { useState } from 'react';
import { Project, ProjectRole, Discipline } from '../../types/index.ts';
import { ProgressTracker } from '../../components/SignUp/ProgressTracker.tsx';
import { ProjectTimeline } from '../../components/ProjectTimeline.tsx';
import { ArrowLeft, ArrowRight, Plus, Trash2 } from '../../components/Icons.tsx';
import { useAppContext } from '../../context/AppContext.tsx';

// --- Step Components ---

const Step1Details = ({ data, setData }: { data: Partial<Project>, setData: Function }) => (
    <div className="space-y-4">
        <div>
            <label className="block font-medium mb-1">Project Name</label>
            <input type="text" value={data.name || ''} onChange={e => setData({ ...data, name: e.target.value })} className="w-full border p-2 rounded" placeholder="e.g., Corporate HQ AV Fit-Out"/>
        </div>
        <div>
            <label className="block font-medium mb-1">Project Description / Scope of Work</label>
            <textarea value={data.description || ''} onChange={e => setData({ ...data, description: e.target.value })} rows={5} className="w-full border p-2 rounded" placeholder="Provide a high-level overview of the project."/>
        </div>
    </div>
);

const Step2Resources = ({ data, setData }: { data: Partial<Project>, setData: Function }) => {
    const [phases, setPhases] = useState<{ name: string; roles: Partial<ProjectRole>[] }[]>([
        { name: 'Phase 1: Design & First Fix', roles: [{id: `role-${Math.random()}`, title: 'AV Systems Designer', discipline: Discipline.AV, startDate: new Date(), endDate: new Date(new Date().setDate(new Date().getDate() + 30)) }] }
    ]);

    const addPhase = () => setPhases([...phases, { name: `Phase ${phases.length + 1}`, roles: [] }]);
    
    const addRole = (phaseIndex: number) => {
        const newPhases = [...phases];
        newPhases[phaseIndex].roles.push({ id: `role-${Math.random()}`, title: '', discipline: Discipline.AV, startDate: new Date(), endDate: new Date() });
        setPhases(newPhases);
    };

    const removeRole = (phaseIndex: number, roleIndex: number) => {
        const newPhases = [...phases];
        newPhases[phaseIndex].roles.splice(roleIndex, 1);
        setPhases(newPhases);
        updateMainData(newPhases);
    };

    const handleRoleChange = (phaseIndex: number, roleIndex: number, field: keyof ProjectRole, value: any) => {
        const newPhases = [...phases];
        const role = newPhases[phaseIndex].roles[roleIndex] as any;
        role[field] = value;

        // Auto-adjust end date if start date changes
        if(field === 'startDate' && new Date(value) > role.endDate) {
            role.endDate = value;
        }

        setPhases(newPhases);
        updateMainData(newPhases);
    };
    
    const updateMainData = (currentPhases: typeof phases) => {
         setData({ ...data, roles: currentPhases.flatMap(p => p.roles.map(r => ({ ...r, phase: p.name }))) });
    };

    return (
        <div className="space-y-4">
            {phases.map((phase, pIndex) => (
                <div key={pIndex} className="p-4 border rounded-lg bg-gray-50">
                    <input value={phase.name} onChange={e => {
                        const newPhases = [...phases]; newPhases[pIndex].name = e.target.value; setPhases(newPhases);
                    }} className="text-lg font-bold bg-transparent outline-none border-b-2 border-transparent focus:border-gray-300 w-full mb-3" />
                    
                    {phase.roles.map((role, rIndex) => (
                        <div key={rIndex} className="p-3 bg-white rounded-md border mb-2 space-y-2 relative">
                            <button onClick={() => removeRole(pIndex, rIndex)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                            <input type="text" placeholder="Role Title (e.g., Lead Engineer)" value={role.title || ''} onChange={e => handleRoleChange(pIndex, rIndex, 'title', e.target.value)} className="w-full border p-1 rounded text-sm"/>
                            <div className="grid grid-cols-3 gap-2">
                                <select value={role.discipline} onChange={e => handleRoleChange(pIndex, rIndex, 'discipline', e.target.value as Discipline)} className="w-full border p-1 rounded text-sm bg-white"><option>{Discipline.AV}</option><option>{Discipline.IT}</option><option>{Discipline.BOTH}</option></select>
                                <input type="date" value={(role.startDate as Date)?.toISOString().split('T')[0]} onChange={e => handleRoleChange(pIndex, rIndex, 'startDate', new Date(e.target.value))} className="w-full border p-1 rounded text-sm"/>
                                <input type="date" value={(role.endDate as Date)?.toISOString().split('T')[0]} onChange={e => handleRoleChange(pIndex, rIndex, 'endDate', new Date(e.target.value))} className="w-full border p-1 rounded text-sm"/>
                            </div>
                        </div>
                    ))}
                    <button onClick={() => addRole(pIndex)} className="text-sm font-semibold text-blue-600 flex items-center"><Plus size={16} className="mr-1"/> Add Role to Phase</button>
                </div>
            ))}
            <button onClick={addPhase} className="font-semibold text-green-600 mt-2">Add Project Phase</button>
        </div>
    );
};

const Step3Summary = ({ data }: { data: Partial<Project> }) => (
    <div>
        <h3 className="text-xl font-bold mb-2">{data.name}</h3>
        <p className="text-gray-600 mb-4">{data.description}</p>
        <div className="p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-semibold mb-2">Project Timeline</h4>
            <ProjectTimeline roles={(data.roles || []) as ProjectRole[]} />
        </div>
    </div>
);


// --- Main Component ---

export const ProjectPlannerView = () => {
    const { user } = useAppContext();
    const [step, setStep] = useState(1);
    const [projectData, setProjectData] = useState<Partial<Project>>({ companyId: user?.profile.id, roles: [] });

    const nextStep = () => setStep(s => Math.min(s + 1, 3));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));
    
    const handleSubmit = () => {
        alert("Project Created! (Check console for data)");
        console.log(projectData);
    };

    const renderStep = () => {
        switch(step) {
            case 1: return <Step1Details data={projectData} setData={setProjectData} />;
            case 2: return <Step2Resources data={projectData} setData={setProjectData} />;
            case 3: return <Step3Summary data={projectData} />;
            default: return null;
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">Project Resourcing Wizard</h1>
            <p className="text-gray-500 mb-6">Plan your entire project's freelance needs from start to finish.</p>
            
            <ProgressTracker currentStep={step} />

            <div className="mt-8">
                {renderStep()}
            </div>
            
             <div className="flex justify-between mt-8 pt-6 border-t">
                <button onClick={prevStep} disabled={step === 1} className="flex items-center px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50">
                    <ArrowLeft size={16} className="mr-2"/> Back
                </button>
                {step < 3 ? (
                    <button onClick={nextStep} className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Next <ArrowRight size={16} className="ml-2"/>
                    </button>
                ) : (
                    <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                        Create Project
                    </button>
                )}
            </div>
        </div>
    );
};