
import React, { useState } from 'react';
import { X, Building, User, Search, Handshake, ClipboardList, CalendarDays, DollarSign, PenSquare } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const companySteps = [
  { icon: PenSquare, title: 'Post a Job', description: 'Quickly post your project requirements for free. Use our AI assistant to help write the perfect job description.' },
  { icon: Search, title: 'Find Talent', description: 'Search our network and use powerful filters to find engineers with the exact skills and proficiency you need.' },
  { icon: ClipboardList, title: 'Review & Select', description: 'Review detailed profiles, verified skills, and peer ratings to confidently choose the best candidate.' },
  { icon: Handshake, title: 'Hire Directly', description: 'Connect with your chosen engineer, agree on terms, and start your project. All commercial agreements are handled directly between you.' },
];

const engineerSteps = [
  { icon: User, title: 'Create Your Profile', description: 'Sign up for free and build your basic profile. Showcase your core skills, location, and transport details.' },
  { icon: ClipboardList, title: 'Add Skill Profiles', description: 'Upgrade to create specialized profiles for roles like "Crestron Programmer" or "Network Specialist" to highlight your expertise.' },
  { icon: DollarSign, title: 'Set Your Rate', description: 'Define custom day rates for each of your specialized skill profiles, maximizing your earning potential.' },
  { icon: CalendarDays, title: 'Manage Availability', description: 'Keep your calendar up-to-date to receive relevant job offers that match your schedule and skill set.' },
];

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'company' | 'engineer'>('company');

  const steps = activeTab === 'company' ? companySteps : engineerSteps;

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      aria-labelledby="how-it-works-title" 
      role="dialog" 
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-lg shadow-xl w-full max-w-3xl transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 id="how-it-works-title" className="text-2xl font-bold text-gray-800">How It Works</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('company')}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'company' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                aria-current={activeTab === 'company' ? 'page' : undefined}
              >
                For Companies
              </button>
              <button
                onClick={() => setActiveTab('engineer')}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'engineer' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                aria-current={activeTab === 'engineer' ? 'page' : undefined}
              >
                For Engineers
              </button>
            </nav>
          </div>
          
          <div key={activeTab} className="space-y-6">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="flex items-start space-x-4 fade-in-up" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
                  <p className="mt-1 text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};