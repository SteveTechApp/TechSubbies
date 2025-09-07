import React from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { Page, Role } from '../types/index.ts';
import { Logo } from '../components/Logo.tsx';
import { MOCK_USERS, MOCK_USER_FREE_ENGINEER, PRE_AUTH_USER } from '../data/mockData.ts';
import { User, Briefcase, Building } from '../components/Icons.tsx';

interface LoginSelectorProps {
    onNavigate: (page: Page) => void;
}

export const LoginSelector = ({ onNavigate }: LoginSelectorProps) => {
    const { login } = useAppContext();

    const handleLogin = (role: Role) => {
        if (role === Role.ENGINEER && PRE_AUTH_USER.email.includes('stevegoodwin')) {
            login(MOCK_USERS[Role.ENGINEER]);
        } else if (role === Role.ENGINEER) {
             login(MOCK_USER_FREE_ENGINEER);
        }
        else {
             login(MOCK_USERS[role]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Logo className="h-20 mx-auto mb-8" />
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
                        <p className="text-gray-500">Please sign in to your account.</p>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input 
                                type="email" 
                                value={PRE_AUTH_USER.email}
                                readOnly 
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input 
                                type="password" 
                                value="●●●●●●●●" 
                                readOnly
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                            />
                        </div>
                    </div>
                    
                    <p className="text-center font-semibold text-gray-700 mb-4">Log in as:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button onClick={() => handleLogin(Role.ENGINEER)} className="w-full flex items-center justify-center gap-3 p-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
                            <User />
                            <span>Engineer</span>
                        </button>
                        <button onClick={() => handleLogin(Role.COMPANY)} className="w-full flex items-center justify-center gap-3 p-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105">
                            <Building />
                            <span>Company</span>
                        </button>
                         <button onClick={() => handleLogin(Role.RESOURCING_COMPANY)} className="w-full flex items-center justify-center gap-3 p-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105">
                            <Briefcase />
                            <span>Resourcing</span>
                        </button>
                        <button onClick={() => handleLogin(Role.ADMIN)} className="w-full flex items-center justify-center gap-3 p-4 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-800 transition-transform transform hover:scale-105">
                            <span>Admin</span>
                        </button>
                    </div>

                    <div className="mt-6 text-center text-sm">
                        <p className="text-gray-600">Don't have an account?</p>
                        <div className="flex justify-center gap-4 mt-2">
                           <button onClick={() => onNavigate('engineerSignUp')} className="font-semibold text-blue-600 hover:underline">Engineer Sign Up</button>
                           <button onClick={() => onNavigate('companySignUp')} className="font-semibold text-blue-600 hover:underline">Company Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};