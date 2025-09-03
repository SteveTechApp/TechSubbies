import React, { useEffect, useState } from 'react';
import { JobRoleDefinition, JobSkillRequirement, SkillImportance, ExperienceLevel } from '../../types/index.ts';
import { JOB_ROLE_DEFINITIONS } from '../../data/jobRoles.ts';
import { Save } from '../Icons.tsx';

interface JobPostStep2Props {
    jobDetails: any;
    skillRequirements: JobSkillRequirement[];
    setSkillRequirements: (skills: JobSkillRequirement[]) => void;
    onBack: () => void;
    onSubmit: () => void;
}

export const JobPostStep2 = ({ jobDetails, skillRequirements, setSkillRequirements, onBack, onSubmit }: JobPostStep2Props) => {
    const [selectedRoleDef, setSelectedRoleDef] = useState<JobRoleDefinition | null>(null);

    useEffect(() => {
        if (!jobDetails.jobRole) return;
        const roleDef = JOB_ROLE_DEFINITIONS.find(r => r.name === jobDetails.jobRole);
        if (roleDef) {
            setSelectedRoleDef(roleDef);
            const experience = jobDetails.experienceLevel;
            
            const expertThreshold = 0.4; // 40% of skills are essential for experts.
            const seniorThreshold = 2; // Top 2 skills are essential for seniors.
            
            let newReqs: JobSkillRequirement[] = [];
            
            roleDef.skillCategories.forEach(category => {
                let skillsForCategory = [...category.skills];
                
                if (experience === ExperienceLevel.JUNIOR) {
                    skillsForCategory = skillsForCategory.slice(0, Math.ceil(skillsForCategory.length * 0.6));
                }
                
                const categoryReqs = skillsForCategory.map((skillDef, index) => {
                    let importance: SkillImportance = 'desirable';
                    if (experience === ExperienceLevel.SENIOR && index < seniorThreshold) {
                        importance = 'essential';
                    } else if (experience === ExperienceLevel.EXPERT && index < Math.ceil(skillsForCategory.length * expertThreshold)) {
                        importance = 'essential';
                    }
                    return { name: skillDef.name, importance };
                });
                newReqs.push(...categoryReqs);
            });
            setSkillRequirements(newReqs);
        }
    }, [jobDetails.jobRole, jobDetails.experienceLevel, setSkillRequirements]);

    const handleImportanceToggle = (skillName: string) => {
        setSkillRequirements(skillRequirements.map(skill => 
            skill.name === skillName
            ? { ...skill, importance: skill.importance === 'desirable' ? 'essential' : 'desirable' }
            : skill
        ));
    };

    return (
        <>
            <h2 className="text-2xl font-bold mb-2">Step 2: Define Skill Importance</h2>
            <p className="text-gray-500 mb-4">Mark skills as 'Essential' or 'Desirable'. This will power the AI matching.</p>
            <div className="space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
                {selectedRoleDef?.skillCategories.map(category => (
                    <div key={category.category} className="p-4 bg-gray-50 rounded-lg border">
                        <h3 className="font-bold text-lg text-blue-700 mb-3 border-b pb-2">{category.category}</h3>
                        <div className="space-y-2">
                            {skillRequirements.filter(skillReq => category.skills.some(skillDef => skillDef.name === skillReq.name)).map(skill => {
                                const isEssential = skill.importance === 'essential';
                                return (
                                    <div key={skill.name} className="flex items-center justify-between p-2 bg-white rounded-md">
                                        <span className="font-medium text-gray-700 text-sm">{skill.name}</span>
                                        <div className="flex items-center gap-2">
                                            <button type="button" onClick={() => handleImportanceToggle(skill.name)} className={`px-3 py-1 text-xs font-bold rounded-full ${!isEssential ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-600'}`}>Desirable</button>
                                            <button type="button" onClick={() => handleImportanceToggle(skill.name)} className={`px-3 py-1 text-xs font-bold rounded-full ${isEssential ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-200 text-gray-600'}`}>Essential</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <button onClick={onBack} className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Back</button>
                <button onClick={onSubmit} className="flex items-center px-6 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700">
                    <Save size={18} className="mr-2" /> Post Job
                </button>
            </div>
        </>
    );
};