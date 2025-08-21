import React, { useState } from 'react';
import { DashboardSidebar } from '../components/DashboardSidebar.tsx';

export const AdminDashboard = () => {
    const [activeView, setActiveView] = useState('Dashboard');
    return (
        <div className='flex'>
            <DashboardSidebar activeView={activeView} setActiveView={setActiveView} />
            <main className='flex-grow p-8 bg-gray-50'>
                <h1 className='text-3xl font-bold mb-6'>Admin Dashboard</h1>
                <div className='bg-white p-6 rounded-lg shadow'>
                    <h2 className='text-xl font-bold'>{activeView}</h2>
                    <p className='mt-4'>This feature is currently under development. Please check back later!</p>
                </div>
            </main>
        </div>
    );
};
