// FIX: Added a triple-slash directive to include Jest's type definitions.
/// <reference types="jest" />

import apiService from './apiService';
import { Role } from '../types';

describe('apiService', () => {
    
    it('getInitialData should return a comprehensive set of mock data', async () => {
        const data = await apiService.getInitialData();

        expect(data).toHaveProperty('engineers');
        expect(data).toHaveProperty('companies');
        expect(data).toHaveProperty('jobs');
        expect(data.engineers.length).toBeGreaterThan(0);
        expect(data.companies.length).toBeGreaterThan(0);
        expect(data.jobs.length).toBeGreaterThan(0);
    });

    it('loginWithCredentials should return a user for a valid role', async () => {
        const { user, token } = await apiService.loginWithCredentials('test@example.com', Role.ENGINEER);

        expect(user).toBeDefined();
        expect(user.role).toBe(Role.ENGINEER);
        expect(token).toContain('mock-jwt-token');
    });

    it('loginWithCredentials should throw an error for an invalid role', async () => {
        // A role that is not in MOCK_USERS
        await expect(apiService.loginWithCredentials('test@example.com', 'InvalidRole' as Role))
            .rejects.toThrow("Invalid credentials or user role not found.");
    });
    
    it('createEngineer should add a new engineer and return a user object', async () => {
        const initialData = await apiService.getInitialData();
        const initialCount = initialData.engineers.length;

        const newEngineerData = {
            name: 'Test Engineer',
            email: 'test@engineer.com',
            discipline: 'AV',
        };

        const newUser = await apiService.createEngineer(newEngineerData);

        expect(newUser.role).toBe(Role.ENGINEER);
        expect(newUser.profile.name).toBe('Test Engineer');

        const updatedData = await apiService.getInitialData();
        expect(updatedData.engineers.length).toBe(initialCount + 1);
    });

});