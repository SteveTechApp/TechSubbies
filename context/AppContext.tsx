
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Role, Engineer, Job, Company, Currency } from '../types';
import { MOCK_ENGINEERS, MOCK_JOBS, MOCK_COMPANIES } from '../constants';

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
  getCompanyById: (id: string) => Company | undefined;
  currentUser: Engineer | Company | null;
  login: (role: Role, id: string) => void;
  logout: () => void;
  updateEngineer: (updatedEngineer: Engineer) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>(Role.NONE);
  const [language, setLanguage] = useState<string>('EN');
  const [currency, setCurrency] = useState<Currency>(Currency.GBP);
  const [currentUser, setCurrentUser] = useState<Engineer | Company | null>(null);
  
  const [engineers, setEngineers] = useState<Engineer[]>(MOCK_ENGINEERS);
  const [jobs] = useState<Job[]>(MOCK_JOBS);
  const [companies] = useState<Company[]>(MOCK_COMPANIES);

  const getCompanyById = (id: string) => companies.find(c => c.id === id);

  const login = (role: Role, id: string) => {
    if (role === Role.ENGINEER) {
      const user = engineers.find(e => e.id === id);
      if (user) {
        setCurrentUser(user);
        setRole(Role.ENGINEER);
      }
    } else if (role === Role.COMPANY) {
      const user = companies.find(c => c.id === id);
      if (user) {
        setCurrentUser(user);
        setRole(Role.COMPANY);
      }
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setRole(Role.NONE);
  };
  
  const updateEngineer = (updatedEngineer: Engineer) => {
    setEngineers(prevEngineers => 
      prevEngineers.map(eng => eng.id === updatedEngineer.id ? updatedEngineer : eng)
    );
    setCurrentUser(updatedEngineer); // also update the currentUser state
  };


  return (
    <AppContext.Provider value={{ 
      role, setRole, 
      language, setLanguage, 
      currency, setCurrency, 
      engineers, jobs, companies, 
      getCompanyById,
      currentUser, login, logout, updateEngineer
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
