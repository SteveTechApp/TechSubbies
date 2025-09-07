import React, { useState, useMemo } from 'react';
import { EngineerProfile, Job } from '../../types';
import { FindTalentFilters } from '../../components/Company/FindTalentFilters';
import { FindTalentResults } from '../../components/Company/FindTalentResults';

interface FindTalentViewProps {
    engineers: EngineerProfile[];
    myJobs: Job[];
    onSelectEngineer: (eng: EngineerProfile) => void;
}

export const FindTalentView = ({ engineers, myJobs, onSelectEngineer }: FindTalentViewProps) => {
    const [processedEngineers, setProcessedEngineers] = useState<EngineerProfile[]>(engineers);

    return (
        <div className="flex gap-8 h-[calc(100vh-10rem)]">
            <FindTalentFilters 
                engineers={engineers}
                myJobs={myJobs}
                onFilterChange={setProcessedEngineers}
            />
            <FindTalentResults
                engineers={processedEngineers}
                onSelectEngineer={onSelectEngineer}
            />
        </div>
    );
};