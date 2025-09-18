import React from 'react';
// FIX: Corrected import path for types.
import { EngineerProfile } from '../../types';
import { EngineerCard } from '../EngineerCard';

interface FindTalentResultsProps {
    engineers: EngineerProfile[];
    onSelectEngineer: (eng: EngineerProfile) => void;
}

export const FindTalentResults = ({ engineers, onSelectEngineer }: FindTalentResultsProps) => {
    return (
        <main className="flex-1 bg-gray-50 overflow-y-auto custom-scrollbar pr-2">
            <p className="text-sm text-gray-600 mb-4">Showing {engineers.length} active engineers.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {engineers.length > 0 ? (
                    engineers.map(eng => 
                        <EngineerCard 
                            key={eng.id} 
                            profile={eng} 
                            matchScore={eng.matchScore} 
                            onClick={() => onSelectEngineer(eng)} 
                        />
                    )
                ) : (
                    <div className="text-center py-10 md:col-span-2 xl:col-span-4 bg-white rounded-lg">
                        <p className="font-semibold">No engineers match your criteria.</p>
                        <p className="text-sm text-gray-500">Try adjusting your filters or use AI Smart Match.</p>
                    </div>
                )}
            </div>
        </main>
    );
};
