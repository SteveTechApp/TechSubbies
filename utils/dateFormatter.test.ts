import { describe, it, expect } from 'vitest';
import { formatDisplayDate, formatTimeAgo } from './dateFormatter';

describe('formatDisplayDate', () => {
  it('returns "TBD" when no date is provided', () => {
    expect(formatDisplayDate(null)).toBe('TBD');
    expect(formatDisplayDate(undefined)).toBe('TBD');
  });

  it('formats a valid date string', () => {
    expect(formatDisplayDate('2026-01-15')).toBe('15 Jan 2026');
  });

  it('returns "Invalid Date" for unparsable input', () => {
    expect(formatDisplayDate('not-a-date')).toBe('Invalid Date');
  });
});

describe('formatTimeAgo', () => {
  it('shows a clock time (not a relative string) for anything earlier today', () => {
    const fiveSecondsAgo = new Date(Date.now() - 5000);
    expect(formatTimeAgo(fiveSecondsAgo)).toMatch(/^\d{2}:\d{2}$/);
  });

  it('shows "Yesterday" for a date roughly one day ago', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(yesterday.getHours() - 3);
    expect(formatTimeAgo(yesterday)).toBe('Yesterday');
  });

  it('shows a short month/day for dates more than two days ago', () => {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - 5);
    expect(formatTimeAgo(daysAgo)).not.toBe('Yesterday');
    expect(formatTimeAgo(daysAgo)).not.toMatch(/ago$/);
  });
});
