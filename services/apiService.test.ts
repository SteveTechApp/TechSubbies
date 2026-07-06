import { describe, it, expect } from 'vitest';
import apiService from './apiService';
import { Role } from '../types';

describe('apiService.loginWithCredentials', () => {
  it('returns a user and token for a role that exists in the mock data', async () => {
    const { user, token } = await apiService.loginWithCredentials('anyone@example.com', Role.ENGINEER);

    expect(user.role).toBe(Role.ENGINEER);
    expect(token).toContain(user.id);
  });

  it('throws when no mock user matches the requested role', async () => {
    await expect(
      apiService.loginWithCredentials('nobody@example.com', 'Not A Real Role' as Role)
    ).rejects.toThrow('Invalid credentials');
  });
});

describe('apiService.createEngineer', () => {
  it('creates a new engineer user with sensible defaults', async () => {
    const newUser: any = await apiService.createEngineer({ name: 'Test Engineer', email: 'test@example.com' });

    expect(newUser.role).toBe(Role.ENGINEER);
    expect(newUser.profile.name).toBe('Test Engineer');
    expect(newUser.profile.contact.email).toBe('test@example.com');
  });
});
