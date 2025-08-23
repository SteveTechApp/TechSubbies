import React from 'react';
import { useAppContext, Role, PRE_AUTH_USER } from '../context/AppContext.tsx';
import { Logo } from '../components/Logo.tsx';
import { LoginButton } from '../components/LoginButton.tsx';
import { User, Building, Users, UserCog, ArrowLeft } from '../components/Icons.tsx';

interface LoginPageProps {
    onNavigateHome: () => void;
}

export const LoginPage = ({ onNavigateHome }: LoginPageProps) => {
    const { login } = useAppContext();
    const isAdminUser = PRE_AUTH_USER.email === 'SteveGoodwin1972@gmail.com';

    const handleLogin = (role: Role) => {
        login(role);
        // App.tsx will handle re-rendering to the dashboard after login
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col antialiased">
            <header className="p-4 sm:p-6 absolute top-0 left-0">
                <button onClick={onNavigateHome} className="flex items-center text-gray-600 hover:text-gray-900 font-semibold transition-colors">
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Home
                </button>
            </header>
            <main className="flex-grow flex flex-col justify-center items-center p-4">
                <div className="w-full max-w-4xl text-center">
                    <Logo className="text-4xl justify-center mb-4 text-gray-800" />
                    <h1 className="text-3xl font-bold text-gray-900">Welcome to TechSubbies</h1>
                    <p className="text-lg text-gray-600 mt-2">Select a role to sign in and continue.</p>
                </div>
                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                    <LoginButton
                        role={Role.ENGINEER}
                        label="Engineer"
                        icon={User}
                        description="Manage your profile, set your availability, and find your next contract."
                        onLogin={handleLogin}
                    />
                    <LoginButton
                        role={Role.COMPANY}
                        label="Company"
                        icon={Building}
                        description="Post jobs for free, search for expert talent, and build your project teams."
                        onLogin={handleLogin}
                    />
                    <LoginButton
                        role={Role.RESOURCING_COMPANY}
                        label="Resourcing Company"
                        icon={Users}
                        description="Manage multiple engineer profiles and streamline your subcontractor placements."
                        onLogin={handleLogin}
                    />
                    {isAdminUser && (
                        <LoginButton
                            role={Role.ADMIN}
                            label="Platform Admin"
                            icon={UserCog}
                            description="Oversee platform activity, manage users and jobs, and view analytics."
                            onLogin={handleLogin}
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

// This export is retained to prevent breaking changes in case other files reference it,
// though its usage as a modal is now deprecated.
export const LoginSelector = LoginPage;