// Shared rule for "does this role need a lead/supervisor confirmed before
// it's booked?" - used both when a company posts a job
// (components/JobPost/JobPostStep1.tsx, a soft nudge at intake) and again,
// for real, when a contract is actually created
// (components/CreateContractModal.tsx, the point where a booking becomes
// binding). Keeping the rule in one place means the two checks can't
// silently drift apart.

export interface RoleDescription {
    jobRole?: string;
    title?: string;
    experienceLevel?: string;
}

const SUPPORT_ROLE_KEYWORDS = ['labour', 'helper', 'assistant', 'site support'];

// True when the role described looks like a junior/labour/support role that
// shouldn't be booked without a qualified engineer or lead present.
export function requiresLeadSupervision(role: RoleDescription): boolean {
    const jobRole = String(role.jobRole || '').toLowerCase();
    const title = String(role.title || '').toLowerCase();
    const level = String(role.experienceLevel || '').toLowerCase();

    if (level === 'junior') return true;
    return SUPPORT_ROLE_KEYWORDS.some((keyword) => jobRole.includes(keyword) || title.includes(keyword));
}

export interface SupervisionConfirmation {
    supervisionArrangement?: string;
    supervisionDisclaimerAccepted?: boolean;
}

const CONFIRMED_ARRANGEMENTS = ['supervised', 'lead_engineer_present', 'qualified_engineer_present'];

// True when a real lead/supervisor arrangement has actually been declared -
// not just that the role needed one.
export function hasLeadSupervisionConfirmed(confirmation: SupervisionConfirmation): boolean {
    const value = String(confirmation.supervisionArrangement || '').toLowerCase();
    return CONFIRMED_ARRANGEMENTS.includes(value) && Boolean(confirmation.supervisionDisclaimerAccepted);
}
