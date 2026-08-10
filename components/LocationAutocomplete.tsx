
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { LOCATIONS_DATA } from '../data/locations';
import { MapPin } from './Icons';

interface LocationAutocompleteProps {
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    variant?: 'light' | 'dark';
}

export const LocationAutocomplete = ({ value, onValueChange, placeholder = "e.g., London, UK", variant = 'light' }: LocationAutocompleteProps) => {
    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState<typeof LOCATIONS_DATA>([]);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredSuggestions = useMemo(() => {
        if (!inputValue) {
            return LOCATIONS_DATA.filter(loc => ['Special', 'Continent'].includes(loc.type)).slice(0, 10);
        }
        const lowercasedInput = inputValue.toLowerCase();
        return LOCATIONS_DATA.filter(loc =>
            loc.name.toLowerCase().includes(lowercasedInput)
        ).slice(0, 10);
    }, [inputValue]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onValueChange(newValue);
        if (newValue) {
            setSuggestions(filteredSuggestions);
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };
    
    const handleSuggestionClick = (suggestionName: string) => {
        setInputValue(suggestionName);
        onValueChange(suggestionName);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={containerRef}>
            <div className="relative">
                <MapPin size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${variant === 'dark' ? 'text-cyan-300' : 'text-gray-400'}`} />
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => {
                        setSuggestions(filteredSuggestions);
                        setIsOpen(true);
                    }}
                    placeholder={placeholder}
                    className={variant === 'dark'
                        ? 'w-full rounded-xl border border-white/10 bg-slate-950 py-3 pl-10 pr-4 text-white outline-none placeholder:text-slate-600 focus:border-cyan-300'
                        : 'w-full border p-2 pl-8 rounded'}
                    autoComplete="off"
                />
            </div>
            {isOpen && suggestions.length > 0 && (
                <div className={variant === 'dark'
                    ? 'absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-cyan-300/20 bg-slate-950 p-1 shadow-2xl'
                    : 'absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto'}>
                    {suggestions.map(suggestion => (
                        <button
                            key={suggestion.name}
                            type="button"
                            onClick={() => handleSuggestionClick(suggestion.name)}
                            className={variant === 'dark'
                                ? 'w-full rounded-lg px-4 py-2 text-left text-sm text-slate-200 hover:bg-cyan-300/10 hover:text-cyan-100'
                                : 'w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'}
                        >
                            {suggestion.name} <span className={variant === 'dark' ? 'text-xs text-slate-500' : 'text-xs text-gray-400'}>({suggestion.type})</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
