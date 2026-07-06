import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { Role } from '../types';

describe('AuthContext', () => {
  it('throws when useAuth is called outside an AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within an AuthProvider');
  });

  it('starts with no logged-in user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    expect(result.current.user).toBeNull();
  });

  it('logs in the mock user for the requested role', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    act(() => {
      result.current.login(Role.ENGINEER);
    });

    expect(result.current.user?.role).toBe(Role.ENGINEER);
  });

  it('logs the user out', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    act(() => {
      result.current.login(Role.COMPANY);
    });
    expect(result.current.user).not.toBeNull();

    act(() => {
      result.current.logout();
    });
    expect(result.current.user).toBeNull();
  });
});
