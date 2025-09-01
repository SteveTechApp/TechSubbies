import React from 'react';
import { BarChart, TrendingUp, Users } from '../../components/Icons.tsx';

export const AnalyticsView = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 flex items-center">
                <BarChart size={30} className="mr-3"/>
                My Profile Analytics
            </h1>
            <div className="p-6 bg-yellow-50 border-2 border-dashed border-yellow-300 rounded-lg text-center">
                 <h2 className="text-2xl font-bold text-yellow-800">This is a Business Tier Feature</h2>
                 <p className="text-yellow-700 mt-2">This dashboard will provide you with detailed insights into your profile's performance, including search appearances, profile views, and engagement metrics.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                 <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Profile Views (30d)</p>
                            <p className="text-4xl font-bold text-gray-800">1,204</p>
                        </div>
                        <TrendingUp size={24} className="text-green-500" />
                    </div>
                    <p className="text-xs text-green-600 mt-2">+15% from last month</p>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Search Appearances</p>
                            <p className="text-4xl font-bold text-gray-800">8,921</p>
                        </div>
                         <Users size={24} className="text-blue-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">How many times you appeared in a company's search results.</p>
                </div>
            </div>
        </div>
    );
};
