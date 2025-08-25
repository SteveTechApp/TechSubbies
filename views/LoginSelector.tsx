import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { Role } from '../types/index.ts';
import { Logo } from '../components/Logo.tsx';
import { User, Building } from '../components/Icons.tsx';

type Page = 'landing' | 'login' | 'forEngineers' | 'forCompanies' | 'engineerSignUp';

interface LoginSelectorProps {
    onNavigate: (page: Page) => void;
}

export const LoginSelector = ({ onNavigate }: LoginSelectorProps) => {
    const { login } = useAppContext();
    const [activeTab, setActiveTab] = useState('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        // This is a mock authentication system based on email.
        // In a real app, you would send email and password to a server.
        switch (email.toLowerCase()) {
            case 'neil.bishop@example.com':
                login(Role.ENGINEER, false); // Premium Engineer
                break;
            case 'emily.carter@example.com':
                 login(Role.ENGINEER, true); // Free Tier Engineer
                break;
            case 'sam.greene@example.com':
                 login(Role.ENGINEER, true); // Another Free Tier Engineer
                break;
            case 'contact@proav.com':
                login(Role.COMPANY);
                break;
            case 'contact@avplacements.com':
                login(Role.RESOURCING_COMPANY);
                break;
            case 'stevegoodwin1972@gmail.com':
                login(Role.ADMIN);
                break;
            default:
                setError('Invalid email. Please use one of the mock user emails below.');
                break;
        }
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
                            <form onSubmit={handleLogin} className="space-y-4 fade-in-up">
                                <h2 className="text-2xl font-bold text-center text-gray-800">Welcome Back</h2>
                                <p className="text-center text-gray-500">Sign in to continue to TechSubbies.</p>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com" 
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2" 
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password-login" className="block text-sm font-medium text-gray-700">Password</label>
                                    <input 
                                        type="password" 
                                        id="password-login"
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••" 
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2" 
                                    />
                                </div>
                                {error && <p className="text-sm text-red-600">{error}</p>}
                                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
                                    <strong>Demo Logins:</strong>
                                    <ul className="list-disc pl-4 mt-1">
                                        <li><code className="bg-gray-200 px-1 rounded">neil.bishop@example.com</code> (Premium Engineer)</li>
                                        <li><code className="bg-gray-200 px-1 rounded">emily.carter@example.com</code> (Free Engineer)</li>
                                        <li><code className="bg-gray-200 px-1 rounded">contact@proav.com</code> (Company)</li>
                                        <li><code className="bg-gray-200 px-1 rounded">stevegoodwin1972@gmail.com</code> (Admin)</li>
                                    </ul>
                                    <p className="mt-1">Password can be anything.</p>
                                </div>
                                <button type="submit" className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                                    Sign In
                                </button>
                            </form>
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
                                
                                <button onClick={() => login(Role.COMPANY)} className="w-full p-6 text-left border rounded-lg hover:shadow-lg transition-shadow">
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
