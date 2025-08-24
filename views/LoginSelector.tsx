import React from 'react';
import { useAppContext, Role, PRE_AUTH_USER } from '../context/AppContext.tsx';
import { Logo } from '../components/Logo.tsx';
import { LoginButton } from '../components/LoginButton.tsx';
import { User, Building, Users, UserCog } from '../components/Icons.tsx';
import { PageHeader } from '../components/PageHeader.tsx';

interface LoginPageProps {
    onNavigateHome: () => void;
}

export const LoginPage = ({ onNavigateHome }: LoginPageProps) => {
    const { login } = useAppContext();
    const isAdminUser = PRE_AUTH_USER.email === 'SteveGoodwin1972@gmail.com';

    const handleLogin = (role: Role) => {
        login(role);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col antialiased">
            <PageHeader onBack={onNavigateHome} />
            <main className="flex-grow flex flex-col justify-center items-center p-4">
                <div className="w-full max-w-4xl text-center">
                    <a href="/" aria-label="Go to homepage">
                      <Logo className="text-4xl justify-center mb-4 text-gray-800" />
                    </a>
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

export const LoginSelector = LoginPage;