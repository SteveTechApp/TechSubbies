import React, { useState } from 'react';
import { EngineerProfile, Job } from '../../types';
import { FindTalentFilters } from '../../components/Company/FindTalentFilters';
import { FindTalentResults } from '../../components/Company/FindTalentResults';
import { TeamCompositionSuggestions } from '../../components/Company/TeamCompositionSuggestions';

interface FindTalentViewProps {
    engineers: EngineerProfile[];
    myJobs: Job[];
    onSelectEngineer: (eng: EngineerProfile) => void;
}

export const FindTalentView = ({ engineers, myJobs, onSelectEngineer }: FindTalentViewProps) => {
    const [processedEngineers, setProcessedEngineers] = useState<EngineerProfile[]>(engineers);
    const [budgetCeiling, setBudgetCeiling] = useState<number | undefined>(undefined);

    return (
        <div className="flex gap-8 h-[calc(100vh-10rem)]">
            <FindTalentFilters
                engineers={engineers}
                myJobs={myJobs}
                onFilterChange={setProcessedEngineers}
                onBudgetChange={setBudgetCeiling}
            />
            <div className="flex-1 flex flex-col min-h-0">
                {/* Uses the full engineer pool (not the day-rate-filtered list
                    below) so a senior priced above budget still shows up,
                    badged as over-budget, alongside a junior+lead pairing
                    that might fit instead - see utils/teamComposition.ts. */}
                <TeamCompositionSuggestions engineers={engineers} budgetCeiling={budgetCeiling} />
                <FindTalentResults
                    engineers={processedEngineers}
                    onSelectEngineer={onSelectEngineer}
                />
            </div>
        </div>
    );
};