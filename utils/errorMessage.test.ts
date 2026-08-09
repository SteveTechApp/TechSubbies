import { describe, expect, it } from 'vitest';
import { errorMessage } from './errorMessage';

describe('errorMessage', () => {
  it('uses an Error message and safely falls back for unknown thrown values', () => {
    expect(errorMessage(new Error('Registration failed.'), 'Fallback')).toBe('Registration failed.');
    expect(errorMessage({ message: 'untrusted shape' }, 'Fallback')).toBe('Fallback');
    expect(errorMessage(null, 'Fallback')).toBe('Fallback');
  });
});
