
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { LOCATIONS_DATA } from '../data/locations';
import { MapPin } from './Icons';

interface LocationAutocompleteProps {
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
}

export const LocationAutocomplete = ({ value, onValueChange, placeholder = "e.g., London, UK" }: LocationAutocompleteProps) => {
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
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => {
                        setSuggestions(filteredSuggestions);
                        setIsOpen(true);
                    }}
                    placeholder={placeholder}
                    className="w-full border p-2 pl-8 rounded"
                    autoComplete="off"
                />
            </div>
            {isOpen && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map(suggestion => (
                        <button
                            key={suggestion.name}
                            type="button"
                            onClick={() => handleSuggestionClick(suggestion.name)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            {suggestion.name} <span className="text-xs text-gray-400">({suggestion.type})</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
