
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Role, Engineer, Job, Company, Currency, Admin, SupportRequest } from '../types';
import { MOCK_ENGINEERS, MOCK_JOBS, MOCK_COMPANIES, MOCK_ADMINS, MOCK_SUPPORT_REQUESTS } from '../constants';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  language: string;
  setLanguage: (lang: string) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  engineers: Engineer[];
  jobs: Job[];
  companies: Company[];
  admins: Admin[];
  supportRequests: SupportRequest[];
  updateSupportRequest: (id: string, status: 'Open' | 'Resolved') => void;
  getCompanyById: (id: string) => Company | undefined;
  currentUser: Engineer | Company | Admin | null;
  login: (role: Role, id: string) => void;
  logout: () => void;
  updateEngineer: (updatedEngineer: Engineer) => void;
  viewingEngineer: Engineer | null;
  setViewingEngineer: (engineer: Engineer | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>(Role.NONE);
  const [language, setLanguage] = useState<string>('EN');
  const [currency, setCurrency] = useState<Currency>(Currency.GBP);
  const [currentUser, setCurrentUser] = useState<Engineer | Company | Admin | null>(null);
  const [viewingEngineer, setViewingEngineer] = useState<Engineer | null>(null);
  
  const [engineers, setEngineers] = useState<Engineer[]>(MOCK_ENGINEERS);
  const [jobs] = useState<Job[]>(MOCK_JOBS);
  const [companies] = useState<Company[]>(MOCK_COMPANIES);
  const [admins] = useState<Admin[]>(MOCK_ADMINS);
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>(MOCK_SUPPORT_REQUESTS);

  const getCompanyById = (id: string) => companies.find(c => c.id === id);

  const login = (role: Role, id: string) => {
    let user: Engineer | Company | Admin | undefined;
    if (role === Role.ENGINEER) {
      user = engineers.find(e => e.id === id);
    } else if (role === Role.COMPANY) {
      user = companies.find(c => c.id === id);
    } else if (role === Role.ADMIN) {
      user = admins.find(a => a.id === id);
    }
    
    if (user) {
        setCurrentUser(user);
        setRole(role);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setRole(Role.NONE);
    setViewingEngineer(null);
  };
  
  const updateEngineer = (updatedEngineer: Engineer) => {
    setEngineers(prevEngineers => 
      prevEngineers.map(eng => eng.id === updatedEngineer.id ? updatedEngineer : eng)
    );
    if(currentUser && currentUser.id === updatedEngineer.id) {
        setCurrentUser(updatedEngineer);
    }
  };

  const updateSupportRequest = (id: string, status: 'Open' | 'Resolved') => {
    setSupportRequests(prev => 
        prev.map(req => req.id === id ? { ...req, status } : req)
    );
  };

  const enhancedSetRole = (newRole: Role) => {
    setRole(newRole);
    if (newRole === Role.NONE) {
      setViewingEngineer(null);
    }
  };


  return (
    <AppContext.Provider value={{ 
      role, setRole: enhancedSetRole, 
      language, setLanguage, 
      currency, setCurrency, 
      engineers, jobs, companies, admins,
      supportRequests, updateSupportRequest,
      getCompanyById,
      currentUser, login, logout, updateEngineer,
      viewingEngineer, setViewingEngineer
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};