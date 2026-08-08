import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { Role } from '../types';

describe('AuthContext', () => {
  it('throws when useAuth is called outside an AuthProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const preventExpectedError = (event: ErrorEvent) => event.preventDefault();
    window.addEventListener('error', preventExpectedError);

    try {
      expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within an AuthProvider');
    } finally {
      window.removeEventListener('error', preventExpectedError);
      consoleError.mockRestore();
    }
  });

  it('starts with no logged-in user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    expect(result.current.user).toBeNull();
  });

  it('exposes session restoration progress before resolving signed-out state', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    expect(result.current.isAuthLoading).toBe(true);
    await waitFor(() => expect(result.current.isAuthLoading).toBe(false));
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
