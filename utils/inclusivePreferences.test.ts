import { describe, expect, it } from 'vitest';
import type { EngineerProfile } from '../types';
import {
  hasInclusivePreferences,
  matchesWorkPreference,
  readInclusivePreferences,
} from './inclusivePreferences';

function profile(inclusivePreferences?: unknown): EngineerProfile {
  return ({ inclusivePreferences } as unknown) as EngineerProfile;
}

describe('inclusive profile preferences', () => {
  it('uses form defaults without pretending a legacy profile has declared them', () => {
    const engineer = profile(undefined);
    expect(hasInclusivePreferences(engineer)).toBe(false);
    expect(readInclusivePreferences(engineer)).toMatchObject({
      languages: ['English'],
      workModes: ['on-site'],
    });
    expect(matchesWorkPreference(engineer, { workMode: 'any', language: '' })).toBe(true);
    expect(matchesWorkPreference(engineer, { workMode: 'on-site', language: '' })).toBe(false);
    expect(matchesWorkPreference(engineer, { workMode: 'any', language: 'English' })).toBe(false);
  });

  it('normalizes languages, work modes and supported alternative evidence routes', () => {
    const result = readInclusivePreferences(profile({
      languages: [' English ', 'english', 'Polish'],
      workModes: ['remote', 'invented', 'hybrid'],
      alternativeEvidenceRoutes: ['portfolio', 'invented', 'peer-validation'],
      accessibility: {
        needsAdjustments: true,
        shareWithCompanies: false,
        adjustments: [' Seated work where practical ', 'Seated work where practical'],
        note: 'Practical note',
      },
    }));

    expect(result.languages).toEqual(['english', 'Polish']);
    expect(result.workModes).toEqual(['remote', 'hybrid']);
    expect(result.alternativeEvidenceRoutes).toEqual(['portfolio', 'peer-validation']);
    expect(result.accessibility.adjustments).toEqual(['Seated work where practical']);
  });

  it('matches only declared work modes and languages', () => {
    const engineer = profile({
      languages: ['English', 'Polish'],
      workModes: ['remote', 'hybrid'],
      alternativeEvidenceRoutes: [],
      accessibility: {},
    });

    expect(matchesWorkPreference(engineer, { workMode: 'remote', language: 'pol' })).toBe(true);
    expect(matchesWorkPreference(engineer, { workMode: 'on-site', language: '' })).toBe(false);
    expect(matchesWorkPreference(engineer, { workMode: 'any', language: 'French' })).toBe(false);
  });
});
