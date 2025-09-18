

import React, { useState, useMemo } from 'react';
// FIX: Corrected import path for types.
import { EngineerProfile } from '../../types';
// FIX: Corrected import path for icons.
import { ChevronLeft, ChevronRight, ArrowLeft, Link as LinkIcon, Copy, CheckCircle } from '../../components/Icons';

interface AvailabilityViewProps {
    profile: EngineerProfile;
    onUpdateAvailability: (date: Date) => void;
    setActiveView: (view: string) => void;
}

export const AvailabilityView = ({ profile, onUpdateAvailability, setActiveView }: AvailabilityViewProps) => {
    const getInitialDateString = () => {
        try {
            const date = new Date(profile.availability);
            return isNaN(date.getTime()) ? new Date().toISOString().split('T')[0] : date.toISOString().split('T')[0];
        } catch (e) {
            return new Date().toISOString().split('T')[0];
        }
    };
    
    const [newDateStr, setNewDateStr] = useState(getInitialDateString());
    const [displayDate, setDisplayDate] = useState(new Date());
    const [copySuccess, setCopySuccess] = useState('');

    const currentMonth = displayDate.getMonth();
    const currentYear = displayDate.getFullYear();

    const handleUpdate = () => {
        onUpdateAvailability(new Date(newDateStr));
        alert('Availability updated!');
    };
    
    const handleCopyUrl = () => {
        if (!profile.calendarSyncUrl) return;
        navigator.clipboard.writeText(profile.calendarSyncUrl).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Failed to copy');
        });
    };

    const calendarGrid = useMemo(() => {
        const monthDate = new Date(currentYear, currentMonth, 1);
        const monthName = monthDate.toLocaleString('default', { month: 'long' });
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDayOfWeek = monthDate.getDay();
        const blanks = Array(firstDayOfWeek).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        return { monthName, year: currentYear, grid: [...blanks, ...days] };
    }, [currentMonth, currentYear]);

    const changeMonth = (delta: number) => {
        setDisplayDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + delta);
            return newDate;
        });
    };

    const isSameDay = (d1: Date, d2: Date) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
        
    const availabilityDate = new Date(profile.availability);

    return (
        <div>
            <button 
                onClick={() => setActiveView('Dashboard')} 
                className="flex items-center mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
                <ArrowLeft size={16} className="mr-2" />
                Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold mb-4">My Availability</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <div className="bg-white p-5 rounded-lg shadow space-y-5">
                        <div>
                            <h2 className="text-xl font-bold mb-2">Update Your Status</h2>
                            <p className="text-gray-600 mb-4">Companies will see you as available from this date onwards.</p>
                            <label htmlFor="availability-date" className="block font-medium mb-1">Available from date:</label>
                            <input
                                id="availability-date"
                                type="date"
                                value={newDateStr}
                                onChange={(e) => setNewDateStr(e.target.value)}
                                className="w-full border p-2 rounded mb-4"
                            />
                            <button
                                onClick={handleUpdate}
                                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"
                            >
                                Update Availability
                            </button>
                        </div>
                        <div className="pt-5 border-t border-gray-200">
                            <h3 className="text-lg font-semibold mb-3 flex items-center">
                                <LinkIcon size={18} className="mr-2"/> Calendar Sync
                            </h3>
                            <p className="text-gray-600 mb-4 text-sm">
                                Subscribe to this URL in your calendar app to automatically sync your availability and project dates.
                            </p>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={profile.calendarSyncUrl || 'No sync URL available.'}
                                    className="w-full border p-2 rounded bg-gray-100 text-gray-600 text-sm"
                                />
                                <button
                                    onClick={handleCopyUrl}
                                    className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors font-medium flex-shrink-0"
                                >
                                    {copySuccess ? <CheckCircle size={18} className="text-green-500"/> : <Copy size={18} />}
                                    <span className="ml-2 w-16 text-center">{copySuccess || 'Copy'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2">
                    <div className="bg-white p-5 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100" aria-label="Previous month"><ChevronLeft /></button>
                            <h2 className="text-xl font-bold">{calendarGrid.monthName} {calendarGrid.year}</h2>
                            <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100" aria-label="Next month"><ChevronRight /></button>
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-center font-semibold text-gray-500">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-2 mt-2">
                            {calendarGrid.grid.map((day, index) => {
                                if (!day) return <div key={`blank-${index}`}></div>;
                                
                                const dayDate = new Date(currentYear, currentMonth, day);
                                const isToday = isSameDay(dayDate, new Date());
                                const isAvailableDate = !isNaN(availabilityDate.getTime()) && isSameDay(dayDate, availabilityDate);
                                
                                const cellClasses = ['w-10 h-10', 'flex', 'items-center', 'justify-center', 'rounded-full'];
                                if (isToday) cellClasses.push('bg-blue-500', 'text-white');
                                else if (isAvailableDate) cellClasses.push('ring-2', 'ring-green-500');
                                else cellClasses.push('hover:bg-gray-100');

                                return <div key={`day-${day}`} className={cellClasses.join(' ')}>{day}</div>;
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
