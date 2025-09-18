// FIX: Added a triple-slash directive to include Jest's type definitions.
/// <reference types="jest" />

import { formatDisplayDate, formatTimeAgo } from './dateFormatter';

describe('formatDisplayDate', () => {
  it('formats a valid date string correctly', () => {
    expect(formatDisplayDate('2024-08-01T10:00:00Z')).toBe('01 Aug 2024');
  });

  it('formats a Date object correctly', () => {
    expect(formatDisplayDate(new Date('2024-09-15T12:00:00Z'))).toBe('15 Sep 2024');
  });

  it('returns "TBD" for null or undefined input', () => {
    expect(formatDisplayDate(null)).toBe('TBD');
    expect(formatDisplayDate(undefined)).toBe('TBD');
  });

  it('returns "Invalid Date" for an invalid date string', () => {
    expect(formatDisplayDate('not a date')).toBe('Invalid Date');
  });
});

describe('formatTimeAgo', () => {
    const now = new Date();
    
    it('returns time in HH:mm format for a date on the same day', () => {
        const dateToday = new Date();
        dateToday.setHours(dateToday.getHours() - 1);
        const expectedTime = dateToday.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        expect(formatTimeAgo(dateToday)).toBe(expectedTime);
    });

    it('returns "Yesterday" for a date from the previous day (between 24 and 48 hours ago)', () => {
        const dateYesterday = new Date(now.getTime() - (36 * 60 * 60 * 1000));
        expect(formatTimeAgo(dateYesterday)).toBe('Yesterday');
    });

    it('returns formatted date for dates older than 2 days', () => {
        const dateOlder = new Date(now.getTime() - (72 * 60 * 60 * 1000));
        const expectedFormat = dateOlder.toLocaleDateString([], { month: 'short', day: 'numeric' });
        expect(formatTimeAgo(dateOlder)).toBe(expectedFormat);
    });
});