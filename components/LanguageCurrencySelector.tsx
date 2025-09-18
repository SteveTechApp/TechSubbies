import React, { useState, useRef, useEffect } from 'react';
// FIX: Corrected import path for useAppContext to resolve 'not a module' error.
import { useAppContext } from '../context/InteractionContext';
import { Language, Currency } from '../types';
import { Globe, ChevronDown } from './Icons';

export const LanguageCurrencySelector = () => {
    const { language, setLanguage, currency, setCurrency } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang);
        setIsOpen(false);
    };

    const handleCurrencyChange = (curr: Currency) => {
        setCurrency(curr);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100"
                aria-label="Select Language and Currency"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <Globe />
                <ChevronDown size={16} className={`ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div 
                    className="absolute top-full right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50 fade-in-up" 
                    style={{animationDuration: '0.2s'}}
                    role="menu"
                >
                    <div className="p-3 border-b">
                        <label htmlFor="language-selector" className="block text-xs font-semibold text-gray-500 mb-1">Language</label>
                        <select
                            id="language-selector"
                            value={language}
                            onChange={(e) => handleLanguageChange(e.target.value as Language)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        >
                            {Object.values(Language).map((value) => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </select>
                    </div>
                     <div className="p-3">
                        <label htmlFor="currency-selector" className="block text-xs font-semibold text-gray-500 mb-1">Currency</label>
                         <select
                            id="currency-selector"
                            value={currency}
                            onChange={(e) => handleCurrencyChange(e.target.value as Currency)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        >
                            {Object.values(Currency).map((value) => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};