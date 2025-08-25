import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { Role, PRE_AUTH_USER } from '../types/index.ts';
import { Logo } from '../components/Logo.tsx';
import { User, Building } from '../components/Icons.tsx';

type Page = 'landing' | 'login' | 'forEngineers' | 'forCompanies' | 'engineerSignUp';

interface LoginSelectorProps {
    onNavigate: (page: Page) => void;
}

export const LoginSelector = ({ onNavigate }: LoginSelectorProps) => {
    const { login } = useAppContext();
    const [activeTab, setActiveTab] = useState('signin');
    const isAdminUser = PRE_AUTH_USER.email === 'SteveGoodwin1972@gmail.com';

    const handleLogin = (role: Role, isFreeTier: boolean = false) => {
        login(role, isFreeTier);
    };
    
    const tabClass = (tabName: string) => 
        `w-1/2 py-3 text-center font-semibold border-b-2 transition-colors ${
            activeTab === tabName 
            ? 'border-blue-600 text-blue-600' 
            : 'border-gray-200 text-gray-500 hover:bg-gray-100'
        }`;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 antialiased" style={{backgroundImage: "url('https://images.unsplash.com/photo-1554672408-758865e23218?q=80&w=2070&auto=format&fit=crop')", backgroundSize: 'cover'}}>
            <div className="w-full max-w-md">
                 <button onClick={() => onNavigate('landing')} className="block mx-auto mb-6">
                    <Logo className="h-16"/>
                </button>
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="flex">
                        <button onClick={() => setActiveTab('signin')} className={tabClass('signin')}>Sign In</button>
                        <button onClick={() => setActiveTab('create')} className={tabClass('create')}>Create Account</button>
                    </div>

                    <div className="p-8">
                        {/* --- SIGN IN TAB --- */}
                        {activeTab === 'signin' && (
                            <div className="space-y-4 fade-in-up">
                                <h2 className="text-2xl font-bold text-center text-gray-800">Welcome Back</h2>
                                <p className="text-center text-gray-500">Select your role to sign in.</p>
                                <button onClick={() => handleLogin(Role.ENGINEER)} className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors font-semibold text-blue-700">Engineer Sign In (Skills Profile)</button>
                                <button onClick={() => handleLogin(Role.ENGINEER, true)} className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors">Engineer Sign In (Free Tier)</button>
                                <button onClick={() => handleLogin(Role.COMPANY)} className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors">Company Sign In</button>
                                <button onClick={() => handleLogin(Role.RESOURCING_COMPANY)} className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors">Resourcing Co. Sign In</button>
                                {isAdminUser && (
                                    <button onClick={() => handleLogin(Role.ADMIN)} className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors">Admin Sign In</button>
                                )}
                            </div>
                        )}
                        
                        {/* --- CREATE ACCOUNT TAB --- */}
                        {activeTab === 'create' && (
                            <div className="space-y-4 fade-in-up">
                                <h2 className="text-2xl font-bold text-center text-gray-800">Join TechSubbies</h2>
                                <p className="text-center text-gray-500">Are you looking for work or to hire talent?</p>
                                
                                <button onClick={() => onNavigate('engineerSignUp')} className="w-full p-6 text-left border-2 border-blue-500 bg-blue-50 rounded-lg hover:shadow-lg transition-shadow">
                                    <div className="flex items-center">
                                        <User className="w-8 h-8 text-blue-600 mr-4"/>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-800">I'm an Engineer</h3>
                                            <p className="text-gray-600">Create a profile to find freelance work.</p>
                                        </div>
                                    </div>
                                </button>
                                
                                <button onClick={() => handleLogin(Role.COMPANY)} className="w-full p-6 text-left border rounded-lg hover:shadow-lg transition-shadow">
                                     <div className="flex items-center">
                                        <Building className="w-8 h-8 text-gray-600 mr-4"/>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-800">I'm a Company</h3>
                                            <p className="text-gray-600">Post jobs and find talent for free.</p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};