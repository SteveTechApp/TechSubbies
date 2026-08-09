import type { EngineerProfile } from '../types';

export type WorkModePreference = 'on-site' | 'remote' | 'hybrid';
export type AlternativeEvidenceRoute =
  | 'supervisor-reference'
  | 'client-reference'
  | 'portfolio'
  | 'work-sample'
  | 'practical-assessment'
  | 'manufacturer-training'
  | 'peer-validation';

export type AccessibilityPreferences = {
  needsAdjustments: boolean;
  shareWithCompanies: boolean;
  adjustments: string[];
  note: string;
};

export type InclusivePreferences = {
  languages: string[];
  workModes: WorkModePreference[];
  accessibility: AccessibilityPreferences;
  alternativeEvidenceRoutes: AlternativeEvidenceRoute[];
};

export const DEFAULT_INCLUSIVE_PREFERENCES: InclusivePreferences = {
  languages: ['English'],
  workModes: ['on-site'],
  accessibility: {
    needsAdjustments: false,
    shareWithCompanies: false,
    adjustments: [],
    note: '',
  },
  alternativeEvidenceRoutes: [],
};

const workModes = new Set<WorkModePreference>(['on-site', 'remote', 'hybrid']);
const evidenceRoutes = new Set<AlternativeEvidenceRoute>([
  'supervisor-reference',
  'client-reference',
  'portfolio',
  'work-sample',
  'practical-assessment',
  'manufacturer-training',
  'peer-validation',
]);

function rawInclusivePreferences(profile: EngineerProfile | Record<string, unknown>): Record<string, unknown> | undefined {
  const raw = (profile as Record<string, unknown>).inclusivePreferences;
  return raw && typeof raw === 'object' ? raw as Record<string, unknown> : undefined;
}

export function hasInclusivePreferences(profile: EngineerProfile | Record<string, unknown>): boolean {
  return Boolean(rawInclusivePreferences(profile));
}

function strings(value: unknown, max = 20): string[] {
  if (!Array.isArray(value)) return [];
  const deduped = new Map<string, string>();
  for (const item of value) {
    if (typeof item !== 'string') continue;
    const clean = item.trim();
    if (!clean) continue;
    deduped.set(clean.toLowerCase(), clean.slice(0, 120));
    if (deduped.size >= max) break;
  }
  return [...deduped.values()];
}

export function readInclusivePreferences(profile: EngineerProfile | Record<string, unknown>): InclusivePreferences {
  const record = rawInclusivePreferences(profile);
  if (!record) return structuredClone(DEFAULT_INCLUSIVE_PREFERENCES);
  const rawAccessibility = record.accessibility && typeof record.accessibility === 'object'
    ? record.accessibility as Record<string, unknown>
    : {};

  const languages = strings(record.languages, 12);
  const selectedWorkModes = strings(record.workModes, 3).filter((value): value is WorkModePreference => workModes.has(value as WorkModePreference));
  const selectedRoutes = strings(record.alternativeEvidenceRoutes, 7)
    .filter((value): value is AlternativeEvidenceRoute => evidenceRoutes.has(value as AlternativeEvidenceRoute));

  return {
    languages: languages.length ? languages : ['English'],
    workModes: selectedWorkModes.length ? selectedWorkModes : ['on-site'],
    accessibility: {
      needsAdjustments: rawAccessibility.needsAdjustments === true,
      shareWithCompanies: rawAccessibility.shareWithCompanies === true,
      adjustments: strings(rawAccessibility.adjustments, 20),
      note: typeof rawAccessibility.note === 'string' ? rawAccessibility.note.slice(0, 1000) : '',
    },
    alternativeEvidenceRoutes: selectedRoutes,
  };
}

export function matchesWorkPreference(
  profile: EngineerProfile,
  filter: { workMode?: WorkModePreference | 'any'; language?: string }
): boolean {
  const requestedWorkMode = filter.workMode && filter.workMode !== 'any';
  const requestedLanguage = Boolean((filter.language || '').trim());
  if ((requestedWorkMode || requestedLanguage) && !hasInclusivePreferences(profile)) return false;

  const preferences = readInclusivePreferences(profile);
  const workModeMatches = !requestedWorkMode || preferences.workModes.includes(filter.workMode as WorkModePreference);
  const language = (filter.language || '').trim().toLowerCase();
  const languageMatches = !language || preferences.languages.some(item => item.toLowerCase().includes(language));
  return workModeMatches && languageMatches;
}

export const ALTERNATIVE_EVIDENCE_LABELS: Record<AlternativeEvidenceRoute, string> = {
  'supervisor-reference': 'Supervisor reference',
  'client-reference': 'Client reference',
  portfolio: 'Portfolio / project examples',
  'work-sample': 'Work sample',
  'practical-assessment': 'Practical assessment',
  'manufacturer-training': 'Manufacturer training',
  'peer-validation': 'Peer validation',
};
