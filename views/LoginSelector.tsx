

import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Role } from '../types';
import { ArrowLeft, LogIn, User, Building, UserCog, AlertCircle, Zap } from 'lucide-react';

export const LoginSelector: React.FC<{ roleToLogin: Role }> = ({ roleToLogin }) => {
    const { login, setRole } = useAppContext();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');

    const handleBack = () => {
        setError('');
        setRole(Role.NONE);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const correctPassword = 'G00dw1n!';
        let loginSuccessful = false;

        switch (roleToLogin) {
            case Role.ENGINEER:
                if (username === 'SteveEngineer' && password === correctPassword) {
                    login(Role.ENGINEER, 'eng_steve');
                    loginSuccessful = true;
                }
                break;
            case Role.COMPANY:
                if (username === 'SteveCompany' && password === correctPassword) {
                    login(Role.COMPANY, 'com_steve');
                    loginSuccessful = true;
                }
                break;
            case Role.ADMIN:
                if (username === 'admin' && password === correctPassword) {
                    login(Role.ADMIN, 'admin1');
                    loginSuccessful = true;
                }
                break;
        }

        if (!loginSuccessful) {
            setError('Invalid username or password. Please try again.');
        }
    };
    
    const getLoginDetails = () => {
        switch(roleToLogin) {
            case Role.ENGINEER:
                return {
                    title: 'Engineer Login',
                    icon: <User className="h-8 w-8 text-white" />,
                    demoUser: 'SteveEngineer'
                };
            case Role.COMPANY:
                return {
                    title: 'Company Login',
                    icon: <Building className="h-8 w-8 text-white" />,
                    demoUser: 'SteveCompany'
                };
            case Role.ADMIN:
                return {
                    title: 'Administrator Login',
                    icon: <UserCog className="h-8 w-8 text-white" />,
                    demoUser: 'admin'
                };
            default:
                return {
                    title: 'Login',
                    icon: <LogIn className="h-8 w-8 text-white" />,
                    demoUser: ''
                };
        }
    }
    
    const { title, icon, demoUser } = getLoginDetails();

    const handlePopulateDemo = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setUsername(demoUser);
        setPassword('G00dw1n!');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] bg-gray-100 p-4">
             <div className="w-full max-w-md">
                <button onClick={handleBack} className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-800 mb-4">
                    <ArrowLeft size={16} className="mr-2"/>
                    Back to Home
                </button>
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                    <div className="bg-blue-600 p-6 flex flex-col items-center text-center">
                        <div className="h-16 w-16 rounded-full bg-blue-700 flex items-center justify-center mb-4 border-4 border-blue-500">
                            {icon}
                        </div>
                        <h1 className="text-2xl font-bold text-white">{title}</h1>
                    </div>
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                    autoComplete="username"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                    autoComplete="current-password"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                        Remember me
                                    </label>
                                </div>
                            </div>
                            
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-400 p-4 flex items-start">
                                    <div className="flex-shrink-0">
                                        <AlertCircle className="h-5 w-5 text-red-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            )}

                             <div className="space-y-3">
                                <button
                                    type="button"
                                    onClick={handlePopulateDemo}
                                    className="w-full bg-gray-100 text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    <Zap size={20} className="mr-2 text-yellow-500"/>
                                    Use Demo Credentials
                                </button>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <LogIn size={20} className="mr-2"/>
                                    Sign In
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                            <h3 className="font-semibold text-gray-800">Demo Credentials:</h3>
                            <p className="text-gray-600 mt-1">Username: <code className="bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded">{demoUser}</code></p>
                            <p className="text-gray-600 mt-1">Password: <code className="bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded">G00dw1n!</code></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};