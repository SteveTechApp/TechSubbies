import React, { useState, useMemo } from 'react';
import { EngineerProfile } from '../../context/AppContext.tsx';
import { ChevronLeft, ChevronRight, Download, CalendarPlus } from '../../components/Icons.tsx';

interface AvailabilityViewProps {
    profile: EngineerProfile;
    onUpdateAvailability: (date: Date) => void;
}

export const AvailabilityView = ({ profile, onUpdateAvailability }: AvailabilityViewProps) => {
    const getInitialDateString = () => {
        try {
            const date = new Date(profile.availability);
            return isNaN(date.getTime()) ? new Date().toISOString().split('T')[0] : date.toISOString().split('T')[0];
        } catch (e) {
            return new Date().toISOString().split('T')[0];
        }
    };
    
    const [newDateStr, setNewDateStr] = useState(getInitialDateString());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const handleUpdate = () => {
        onUpdateAvailability(new Date(newDateStr));
    };

    const { monthName, blanks, days } = useMemo(() => {
        const monthDate = new Date(currentYear, currentMonth, 1);
        const monthName = monthDate.toLocaleString('default', { month: 'long' });
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
        const blanksArray = Array(firstDayOfWeek).fill(null);
        const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        return { monthName, blanks: blanksArray, days: daysArray };
    }, [currentMonth, currentYear]);

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
        
    const availabilityDate = new Date(profile.availability);
    
    const formatDateForCalendar = (date: Date) => {
        const year = date.getUTCFullYear();
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = date.getUTCDate().toString().padStart(2, '0');
        return `${year}${month}${day}`;
    };

    const handleGoogleCalendarClick = () => {
        if (isNaN(availabilityDate.getTime())) return;
        const startDate = formatDateForCalendar(availabilityDate);
        const tempEndDate = new Date(availabilityDate);
        tempEndDate.setUTCDate(tempEndDate.getUTCDate() + 1);
        const endDate = formatDateForCalendar(tempEndDate);
        const eventDetails = `This marks the start of my availability for new freelance contracts on TechSubbies.com.`;
        const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=Available+for+New+Projects&dates=${startDate}/${endDate}&details=${encodeURIComponent(eventDetails)}&location=${encodeURIComponent(profile.location)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleIcsDownloadClick = () => {
        if (isNaN(availabilityDate.getTime())) return;
        const calDate = formatDateForCalendar(availabilityDate);
        const timestamp = new Date().toISOString().replace(/[-:.]/g, "") + "Z";
        const icsContent = [
            'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//TechSubbies.com//EN', 'BEGIN:VEVENT',
            `UID:${profile.id}-${calDate}@techsubbies.com`, `DTSTAMP:${timestamp}`,
            `DTSTART;VALUE=DATE:${calDate}`, 'SUMMARY:Available for New Projects',
            `DESCRIPTION:This marks the start of my availability for new freelance contracts on TechSubbies.com for ${profile.name}.`,
            `LOCATION:${profile.location}`, 'END:VEVENT', 'END:VCALENDAR'
        ].join('\r\n');
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'techsubbies_availability.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">My Availability</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <div className="bg-white p-5 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">Update Your Status</h2>
                        <p className="text-gray-600 mb-4">Companies will see you as available from this date onwards.</p>
                        <label className="block font-medium mb-1">Available from date:</label>
                        <input
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
                        <div className="mt-5 pt-5 border-t border-gray-200">
                            <h3 className="text-lg font-semibold mb-3">Calendar Integration</h3>
                            <p className="text-gray-600 mb-4 text-sm">Add your availability start date to your personal calendar to keep track of your schedule.</p>
                            <div className="space-y-3">
                                <button
                                    onClick={handleGoogleCalendarClick}
                                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
                                >
                                    <CalendarPlus className="w-5 h-5 mr-2" /> Add to Google Calendar
                                </button>
                                <button
                                    onClick={handleIcsDownloadClick}
                                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
                                >
                                    <Download className="w-5 h-5 mr-2" /> Download for Outlook / iCal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2">
                    <div className="bg-white p-5 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeft /></button>
                            <h2 className="text-xl font-bold">{monthName} {currentYear}</h2>
                            <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100"><ChevronRight /></button>
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-center font-semibold text-gray-500">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-2 mt-2">
                            {[...blanks, ...days].map((day, index) => {
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