import React, { useMemo } from 'react';
import { EngineerProfile } from '../../types';
import { buildTeamCompositions, CompositionCandidate } from '../../utils/teamComposition';
import { Users, CheckCircle, AlertTriangle } from '../Icons';

interface TeamCompositionSuggestionsProps {
    engineers: EngineerProfile[];
    budgetCeiling?: number;
}

// Shows realistic ways to staff a role from the currently-filtered engineer
// list: a single senior/expert engineer alone, or a cheaper junior paired
// with a lead (the junior-must-have-a-lead rule - see
// utils/leadSupervision.ts for the same rule enforced at posting/contract
// time). Ranked by skill fit; budget is shown as a badge, not a filter, so
// an over-budget option is still visible if it's the best fit.
export const TeamCompositionSuggestions = ({ engineers, budgetCeiling }: TeamCompositionSuggestionsProps) => {
    const compositions = useMemo(() => {
        const candidates: CompositionCandidate[] = engineers.map((e) => ({
            id: e.id,
            name: e.name,
            dayRate: e.minDayRate,
            experienceLevel: e.experienceLevel,
            matchScore: e.matchScore ?? e.reputation ?? 50,
        }));
        return buildTeamCompositions(candidates, budgetCeiling).slice(0, 4);
    }, [engineers, budgetCeiling]);

    if (compositions.length === 0) return null;

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h3 className="font-bold flex items-center mb-1">
                <Users size={18} className="mr-2" /> Suggested staffing options
            </h3>
            <p className="text-sm text-gray-500 mb-3">
                Ranked by skill fit. A junior always appears paired with a lead, never alone.
                {budgetCeiling ? ` Budget shown against your max day rate (£${budgetCeiling}).` : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {compositions.map((option, index) => (
                    <div key={index} className="border rounded-md p-3">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold uppercase text-gray-500">
                                {option.type === 'solo' ? 'Solo senior/expert' : 'Junior + lead pairing'}
                            </span>
                            {option.withinBudget !== null && (
                                option.withinBudget ? (
                                    <span className="flex items-center text-xs font-semibold text-green-700">
                                        <CheckCircle size={14} className="mr-1" /> Within budget
                                    </span>
                                ) : (
                                    <span className="flex items-center text-xs font-semibold text-amber-700">
                                        <AlertTriangle size={14} className="mr-1" /> Over budget
                                    </span>
                                )
                            )}
                        </div>
                        <div className="text-sm">
                            {option.members.map((m) => (
                                <div key={m.id}>{m.name} <span className="text-gray-400">({m.experienceLevel})</span></div>
                            ))}
                        </div>
                        <div className="mt-2 font-bold">£{option.totalDayRate}/day</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
