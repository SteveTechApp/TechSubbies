// Single source of truth for how a 0-100 skill rating maps to a human
// readable band. Used by every skill-rating input/display across the app
// (engineer skill profiles, job posting required levels, matching, etc)
// so the scale and labels never drift apart between screens.

export interface SkillBand {
  label: string;
  min: number;
  max: number; // inclusive
  bg: string;
  text: string;
  accent: string;
}

// 0-15 Beginner, 15-34 Average, 35-59 Good, 60-79 Excellent, 80-100 Expert.
export const SKILL_BANDS: SkillBand[] = [
  { label: 'Beginner', min: 0, max: 14, bg: 'bg-gray-100', text: 'text-gray-700', accent: 'accent-gray-500' },
  { label: 'Average', min: 15, max: 34, bg: 'bg-yellow-100', text: 'text-yellow-800', accent: 'accent-yellow-500' },
  { label: 'Good', min: 35, max: 59, bg: 'bg-blue-100', text: 'text-blue-800', accent: 'accent-blue-500' },
  { label: 'Excellent', min: 60, max: 79, bg: 'bg-green-100', text: 'text-green-800', accent: 'accent-green-500' },
  { label: 'Expert', min: 80, max: 100, bg: 'bg-purple-100', text: 'text-purple-800', accent: 'accent-purple-500' },
];

// New skills default to an "Average" level rather than the middle of the
// scale, matching how most engineers would honestly rate a skill they use
// day to day but aren't a specialist in.
export const DEFAULT_SKILL_RATING = 25;

export function getSkillBand(rating: number): SkillBand {
  const clamped = Math.max(0, Math.min(100, rating));
  return SKILL_BANDS.find((band) => clamped >= band.min && clamped <= band.max) || SKILL_BANDS[0];
}

export function getSkillBandLabel(rating: number): string {
  return getSkillBand(rating).label;
}

// Meets-or-exceeds check used for matching an engineer's rating against a
// company's required level for a skill.
export function meetsRequiredLevel(engineerRating: number, requiredLevel: number): boolean {
  return engineerRating >= requiredLevel;
}
