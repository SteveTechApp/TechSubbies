import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { DashboardSidebar } from '../components/DashboardSidebar.tsx';
import { EngineerProfileView } from './EngineerProfileView.tsx';
import { EditSkillProfileModal } from '../components/EditSkillProfileModal.tsx';
import { AISkillDiscovery } from '../components/AISkillDiscovery.tsx';
import { geminiService } from '../services/geminiService.ts';
import { Loader, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { EngineerProfile, Skill, User } from '../types.ts';

const EngineerDashboard_DashboardView = ({ user, profileDescription, onGenerateDescription, isGeneratingDesc, onSkillsAdded }: {user: User, profileDescription: string, onGenerateDescription: () => void, isGeneratingDesc: boolean, onSkillsAdded: (skills: Skill[]) => void}) => (
    <div>
        <h1 className='text-3xl font-bold mb-6'>Welcome back, {user?.profile?.name.split(' ')[0]}!</h1>
        <AISkillDiscovery onSkillsAdded={onSkillsAdded} />
        <div className='bg-white p-6 rounded-lg shadow'>
            <h2 className='text-xl font-bold'>Profile Summary</h2>
            <p className='my-4 text-gray-700'>
                {String(profileDescription || '')}
            </p>
            <button
                onClick={onGenerateDescription}
                disabled={isGeneratingDesc}
                className='flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300'
            >
                {isGeneratingDesc ? <Loader className='animate-spin w-5 h-5 mr-2' /> : <Sparkles className='w-5 h-5 mr-2' />}
                {isGeneratingDesc ? 'Generating...' : 'Generate Bio with AI'}
            </button>
        </div>
    </div>
);

const EngineerDashboard_AvailabilityView = ({ profile, onUpdateAvailability }: {profile: EngineerProfile, onUpdateAvailability: (date: Date) => void}) => {
    const getInitialDateString = () => {
        try {
            const date = new Date(profile.availability);
            if (isNaN(date.getTime())) {
                throw new Error("Invalid date");
            }
            return date.toISOString().split('T')[0];
        } catch (e) {
            return new Date().toISOString().split('T')[0];
        }
    };
    const [newDateStr, setNewDateStr] = useState(getInitialDateString());

    const handleUpdate = () => {
        onUpdateAvailability(new Date(newDateStr));
    };

    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const monthDate = new Date(currentYear, currentMonth, 1);
    const monthName = monthDate.toLocaleString('default', { month: 'long' });
    const year = monthDate.getFullYear();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

    const blanks = Array(firstDayOfWeek).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const prevMonth = () => {
        setCurrentMonth(m => m === 0 ? 11 : m - 1);
        if (currentMonth === 0) setCurrentYear(y => y - 1);
    };

    const nextMonth = () => {
        setCurrentMonth(m => m === 11 ? 0 : m + 1);
        if (currentMonth === 11) setCurrentYear(y => y + 1);
    };

    const isSameDay = (d1: Date, d2: Date) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    return (
        <div>
            <h1 className='text-3xl font-bold mb-6'>My Availability</h1>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                <div className='lg:col-span-1'>
                    <div className='bg-white p-6 rounded-lg shadow'>
                        <h2 className='text-xl font-bold mb-4'>Update Your Status</h2>
                        <p className='text-gray-600 mb-4'>Companies will see you as available from this date onwards.</p>
                        <label className='block font-medium mb-1'>Available from date:</label>
                        <input
                            type='date'
                            value={newDateStr}
                            onChange={(e) => setNewDateStr(e.target.value)}
                            className='w-full border p-2 rounded mb-4'
                        />
                        <button
                            onClick={handleUpdate}
                            className='w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700'
                        >
                            Update Availability
                        </button>
                    </div>
                </div>
                <div className='lg:col-span-2'>
                    <div className='bg-white p-6 rounded-lg shadow'>
                        <div className='flex justify-between items-center mb-4'>
                            <button onClick={prevMonth} className='p-2 rounded-full hover:bg-gray-100'><ChevronLeft /></button>
                            <h2 className='text-xl font-bold'>{monthName} {year}</h2>
                            <button onClick={nextMonth} className='p-2 rounded-full hover:bg-gray-100'><ChevronRight /></button>
                        </div>
                        <div className='grid grid-cols-7 gap-2 text-center font-semibold text-gray-500'>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
                        </div>
                        <div className='grid grid-cols-7 gap-2 mt-2'>
                            {[...blanks, ...days].map((day, index) => {
                                const dayDate = day ? new Date(currentYear, currentMonth, day) : null;
                                const isToday = dayDate && isSameDay(dayDate, today);
                                const availabilityDate = profile.availability ? new Date(profile.availability) : null;
                                const isAvailableDate = dayDate && availabilityDate && isSameDay(dayDate, availabilityDate);
                                let cellClass = 'w-10 h-10 flex items-center justify-center rounded-full';
                                if (isToday) cellClass += ' bg-blue-500 text-white';
                                else if (isAvailableDate) cellClass += ' ring-2 ring-green-500';
                                else if (day) cellClass += ' hover:bg-gray-100';
                                return <div key={index} className={cellClass}>{day}</div>;
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export const EngineerDashboard = () => {
    const { user, updateUserProfile } = useAppContext();
    const [activeView, setActiveView] = useState('Dashboard');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

    const handleProfileSave = (updatedProfile: EngineerProfile) => {
        updateUserProfile(updatedProfile);
    };

    const handleGenerateDescription = async () => {
        if (!user) return;
        setIsGeneratingDesc(true);
        const desc = await geminiService.generateDescriptionForProfile(user.profile);
        updateUserProfile({ description: desc });
        setIsGeneratingDesc(false);
    };

    const addSkillsFromAI = (newSkills: Skill[]) => {
        if (!user) return;
        const currentSkillNames = user.profile.skills.map((s: Skill) => s.name.toLowerCase());
        const uniqueNewSkills = newSkills.filter(ns => !currentSkillNames.includes(ns.name.toLowerCase()));
        
        updateUserProfile({
            skills: [...user.profile.skills, ...uniqueNewSkills]
        });
    };

    const handleUpdateAvailability = (newDate: Date) => {
        updateUserProfile({ availability: newDate });
    };

    const renderActiveView = () => {
        if (!user) return null;
        switch(activeView) {
            case 'Dashboard':
                return <EngineerDashboard_DashboardView
                    user={user}
                    profileDescription={user.profile.description}
                    onGenerateDescription={handleGenerateDescription}
                    isGeneratingDesc={isGeneratingDesc}
                    onSkillsAdded={addSkillsFromAI}
                />;
            case 'My Profile':
                return <EngineerProfileView profile={user.profile} isEditable={true} onEdit={() => setIsEditModalOpen(true)} />;
            case 'Availability':
                 return <EngineerDashboard_AvailabilityView profile={user.profile} onUpdateAvailability={handleUpdateAvailability} />;
            default:
                return (
                    <div>
                        <h1 className='text-2xl font-bold'>{activeView} - Coming Soon</h1>
                        <p>The functionality for "{activeView}" is under construction.</p>
                    </div>
                );
        }
    };

    if (!user) return <div>Loading...</div>

    return (
        <div className='flex'>
            <DashboardSidebar activeView={activeView} setActiveView={setActiveView} />
            <main className='flex-grow p-8 bg-gray-50'>
                {renderActiveView()}
            </main>
            <EditSkillProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                userProfile={user.profile}
                onSave={handleProfileSave}
            />
        </div>
    );
};
