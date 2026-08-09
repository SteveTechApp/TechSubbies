import { describe, it, expect } from 'vitest';
import { isAvailableForRange, meetsNoticePeriod, isEngineerAvailable } from './availability';

describe('isAvailableForRange', () => {
  it('is available when there is no availability date or unavailable ranges set', () => {
    expect(isAvailableForRange({ availability: undefined as any }, '2026-08-01')).toBe(true);
  });

  it('is unavailable before the "available from" date', () => {
    const profile = { availability: '2026-09-01' };
    expect(isAvailableForRange(profile, '2026-08-15')).toBe(false);
    expect(isAvailableForRange(profile, '2026-09-01')).toBe(true);
    expect(isAvailableForRange(profile, '2026-09-15')).toBe(true);
  });

  it('is unavailable on a date inside a marked unavailable range', () => {
    const profile = {
      availability: '2026-01-01',
      unavailableDates: [{ start: new Date('2026-08-10'), end: new Date('2026-08-20'), reason: 'Holiday' }],
    };
    expect(isAvailableForRange(profile, '2026-08-15')).toBe(false);
    expect(isAvailableForRange(profile, '2026-08-09')).toBe(true);
    expect(isAvailableForRange(profile, '2026-08-21')).toBe(true);
  });

  it('treats a requested range as unavailable if it overlaps a blocked range at all', () => {
    const profile = {
      availability: '2026-01-01',
      unavailableDates: [{ start: new Date('2026-08-10'), end: new Date('2026-08-20') }],
    };
    // Requested job runs 2026-08-18 to 2026-08-25 - overlaps the last 3 days of the block.
    expect(isAvailableForRange(profile, '2026-08-18', '2026-08-25')).toBe(false);
    // Requested job runs entirely before the block.
    expect(isAvailableForRange(profile, '2026-08-01', '2026-08-09')).toBe(true);
  });
});

describe('meetsNoticePeriod', () => {
  it('is fine with any date when no notice period is set', () => {
    expect(meetsNoticePeriod({ availability: new Date() }, new Date())).toBe(true);
  });

  it('rejects a start date sooner than the required notice', () => {
    const profile = { availability: new Date(), noticePeriodDays: 14 };
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(meetsNoticePeriod(profile, tomorrow)).toBe(false);
  });

  it('accepts a start date at or beyond the required notice', () => {
    const profile = { availability: new Date(), noticePeriodDays: 14 };
    const inThreeWeeks = new Date();
    inThreeWeeks.setDate(inThreeWeeks.getDate() + 21);
    expect(meetsNoticePeriod(profile, inThreeWeeks)).toBe(true);
  });
});

describe('isEngineerAvailable', () => {
  it('combines the date-range and notice-period checks', () => {
    const profile = {
      availability: '2026-01-01',
      unavailableDates: [{ start: new Date('2026-08-10'), end: new Date('2026-08-20') }],
      noticePeriodDays: 5,
    };
    // Inside the blocked range - fails regardless of notice.
    expect(isEngineerAvailable(profile, '2026-08-15')).toBe(false);

    // Free date, but far enough in the future to satisfy any notice period check
    // (using a fixed far-future date so this test doesn't depend on "today").
    expect(isEngineerAvailable(profile, '2099-01-01')).toBe(true);
  });
});
