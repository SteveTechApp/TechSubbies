import React from 'react';
import { DollarSign, Star, Save } from '../../components/Icons';

export const PlatformSettingsView = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Platform Settings</h1>

            <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold border-b pb-2 mb-4">Monetization</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="subscriptionPrice" className="block text-sm font-medium text-gray-700">Skills Profile Subscription Price (£)</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <DollarSign className="h-5 w-5 text-gray-400" size={16} />
                                    </div>
                                    <input type="number" name="subscriptionPrice" id="subscriptionPrice" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-8 pr-12 sm:text-sm border-gray-300 rounded-md bg-gray-100" placeholder="15.00" disabled />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="boostPrice" className="block text-sm font-medium text-gray-700">Profile Boost Credit Price (£)</label>
                                 <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <DollarSign className="h-5 w-5 text-gray-400" size={16} />
                                    </div>
                                    <input type="number" name="boostPrice" id="boostPrice" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-8 pr-12 sm:text-sm border-gray-300 rounded-md bg-gray-100" placeholder="5.00" disabled />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold border-b pb-2 mb-4">Homepage</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="featuredCompanies" className="block text-sm font-medium text-gray-700">Featured Companies</label>
                                <p className="text-xs text-gray-500">Manage which companies appear on the landing page (comma-separated IDs).</p>
                                <input type="text" name="featuredCompanies" id="featuredCompanies" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100" value="comp-1, comp-2, comp-3" disabled />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6 mt-6 border-t">
                    <button
                        type="button"
                        disabled
                        className="flex items-center px-6 py-2 bg-blue-600 text-white font-bold rounded-md disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                        <Save size={18} className="mr-2" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};
