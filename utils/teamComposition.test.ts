import { describe, it, expect } from 'vitest';
import { buildTeamCompositions, isSeniorLevel, isJuniorLevel } from './teamComposition';

const senior = { id: 'sen-1', name: 'Sam Senior', dayRate: 400, experienceLevel: 'Senior', matchScore: 90 };
const expert = { id: 'exp-1', name: 'Eddie Expert', dayRate: 550, experienceLevel: 'Expert', matchScore: 95 };
const junior = { id: 'jun-1', name: 'Jamie Junior', dayRate: 150, experienceLevel: 'Junior', matchScore: 70 };
const midLevel = { id: 'mid-1', name: 'Morgan Mid', dayRate: 300, experienceLevel: 'Mid-level', matchScore: 80 };

describe('isSeniorLevel / isJuniorLevel', () => {
  it('recognises senior, expert and lead as senior-level', () => {
    expect(isSeniorLevel('Senior')).toBe(true);
    expect(isSeniorLevel('Expert')).toBe(true);
    expect(isSeniorLevel('Lead')).toBe(true);
    expect(isSeniorLevel('Mid-level')).toBe(false);
  });

  it('recognises only junior as junior-level', () => {
    expect(isJuniorLevel('Junior')).toBe(true);
    expect(isJuniorLevel('Mid-level')).toBe(false);
  });
});

describe('buildTeamCompositions', () => {
  it('builds a solo option for every senior/expert candidate', () => {
    const options = buildTeamCompositions([senior, expert, midLevel]);
    const soloOptions = options.filter(o => o.type === 'solo');
    expect(soloOptions).toHaveLength(2);
    expect(soloOptions.map(o => o.members[0].id).sort()).toEqual(['exp-1', 'sen-1']);
  });

  it('pairs every junior with every senior/expert candidate', () => {
    const options = buildTeamCompositions([senior, expert, junior]);
    const paired = options.filter(o => o.type === 'junior-plus-lead');
    expect(paired).toHaveLength(2); // junior+senior, junior+expert
    expect(paired.every(o => o.members[0].id === 'jun-1')).toBe(true);
    const pairedWithSenior = paired.find(o => o.members[1].id === 'sen-1')!;
    expect(pairedWithSenior.totalDayRate).toBe(550); // 150 + 400
  });

  it('does not build any composition purely from mid-level candidates', () => {
    const options = buildTeamCompositions([midLevel]);
    expect(options).toHaveLength(0);
  });

  it('ranks options by combined skill score regardless of budget', () => {
    const options = buildTeamCompositions([senior, expert, junior]);
    // Expert (score 95) should outrank Senior (score 90) as a solo option,
    // and both should outrank the diluted junior+lead pairings.
    expect(options[0].members[0].id).toBe('exp-1');
    expect(options[1].members[0].id).toBe('sen-1');
  });

  it('labels compositions within and outside a stated budget, without filtering either out', () => {
    const options = buildTeamCompositions([senior, expert, junior], 500);
    const soloExpert = options.find(o => o.type === 'solo' && o.members[0].id === 'exp-1')!;
    const soloSenior = options.find(o => o.type === 'solo' && o.members[0].id === 'sen-1')!;
    const juniorPlusSenior = options.find(o => o.type === 'junior-plus-lead' && o.members[1].id === 'sen-1')!;
    const juniorPlusExpert = options.find(o => o.type === 'junior-plus-lead' && o.members[1].id === 'exp-1')!;

    expect(soloExpert.withinBudget).toBe(false); // 550 > 500
    expect(soloSenior.withinBudget).toBe(true); // 400 <= 500
    expect(juniorPlusSenior.withinBudget).toBe(false); // 150 + 400 = 550 > 500
    expect(juniorPlusExpert.withinBudget).toBe(false); // 150 + 550 = 700 > 500

    // All options are still present - none hidden for being over budget.
    expect(options).toHaveLength(4);
  });

  it('leaves withinBudget as null when no budget ceiling is given', () => {
    const options = buildTeamCompositions([senior]);
    expect(options[0].withinBudget).toBeNull();
  });
});
