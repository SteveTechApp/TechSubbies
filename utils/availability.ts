import { EngineerProfile, UnavailableDateRange } from '../types';

// The subset of EngineerProfile this module actually needs - lets callers
// (tests, matching code) build a minimal object instead of a full profile.
export interface AvailabilityInput {
    availability: Date | string;
    unavailableDates?: UnavailableDateRange[];
    noticePeriodDays?: number;
}

function toValidDate(value: Date | string | undefined | null): Date | null {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
}

// True when `a`-`b` (inclusive) overlaps `c`-`d` (inclusive) at all.
function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
    return aStart <= bEnd && aEnd >= bStart;
}

// Whether the engineer is free for the given date range, considering both
// their "available from" date and any specific unavailable ranges they've
// marked (holiday, already booked, etc). A single day can be checked by
// passing the same date as both start and end.
export function isAvailableForRange(
    profile: AvailabilityInput,
    rangeStart: Date | string,
    rangeEnd: Date | string = rangeStart
): boolean {
    const start = toValidDate(rangeStart);
    const end = toValidDate(rangeEnd) || start;
    if (!start || !end) return true; // Nothing meaningful to check against.

    const availableFrom = toValidDate(profile.availability);
    if (availableFrom && start < availableFrom) return false;

    const unavailable = profile.unavailableDates || [];
    return !unavailable.some((range) => {
        const rStart = toValidDate(range.start);
        const rEnd = toValidDate(range.end);
        if (!rStart || !rEnd) return false;
        return rangesOverlap(start, end, rStart, rEnd);
    });
}

// Whether a booking could realistically start on `requestedStartDate` given
// the engineer's minimum notice period from today.
export function meetsNoticePeriod(profile: AvailabilityInput, requestedStartDate: Date | string): boolean {
    const start = toValidDate(requestedStartDate);
    if (!start || !profile.noticePeriodDays) return true;

    const earliestPossible = new Date();
    earliestPossible.setDate(earliestPossible.getDate() + profile.noticePeriodDays);
    // Compare by day only, not time-of-day.
    earliestPossible.setHours(0, 0, 0, 0);
    const startOfDay = new Date(start);
    startOfDay.setHours(0, 0, 0, 0);

    return startOfDay >= earliestPossible;
}

// Combined check used by search/filter and matching code: is this engineer
// a realistic option for a job running from `startDate` to `endDate`?
export function isEngineerAvailable(
    profile: AvailabilityInput,
    startDate: Date | string,
    endDate: Date | string = startDate
): boolean {
    return isAvailableForRange(profile, startDate, endDate) && meetsNoticePeriod(profile, startDate);
}
