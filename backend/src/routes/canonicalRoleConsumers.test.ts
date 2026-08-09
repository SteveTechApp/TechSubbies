import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import request from 'supertest';

const TEST_DB = path.join(process.cwd(), 'data', 'test-canonical-role-consumers.db');
fs.rmSync(TEST_DB, { force: true });
process.env.DB_FILE = TEST_DB;
process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';

const { createApp } = await import('../app.js');
const { markEmailVerified } = await import('../lib/db.js');
const app = createApp();
let accountNumber = 0;

async function registerCompany() {
  accountNumber += 1;
  const response = await request(app).post('/api/auth/register').send({
    email: `canonical-company-${accountNumber}@example.com`,
    password: 'correcthorsebattery',
    role: 'Company',
    name: `Canonical Company ${accountNumber}`,
    profileData: {},
  });
  markEmailVerified(response.body.user.id);
  return { id: response.body.user.id as string, token: response.body.token as string };
}

function jobPayload(jobRole: string) {
  return {
    title: 'Canonical role project',
    description: 'A test project with enough detail for canonical role persistence.',
    location: 'London',
    dayRate: '450',
    duration: '3 days',
    currency: '£',
    startDate: '2026-09-01',
    jobType: 'Contract',
    experienceLevel: 'Senior',
    jobRole,
    skillRequirements: [],
    deliveryContext: 'independent',
    projectScale: 'medium',
  };
}

describe('published taxonomy catalogue', () => {
  it('is readable without authentication for signup and project-intake bootstrap', async () => {
    const response = await request(app).get('/api/taxonomy/published');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ versions: [] });
  });
});

describe('canonical role persistence', () => {
  it('canonicalizes legacy responsibility IDs on create and update', async () => {
    const company = await registerCompany();

    const created = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${company.token}`)
      .send(jobPayload('junior-av-installer'));

    expect(created.status).toBe(201);
    expect(created.body.canonicalRoleId).toBe('av-installation-engineer');
    expect(created.body.deliveryContext).toBe('independent');
    expect(created.body.projectScale).toBe('medium');

    const updated = await request(app)
      .patch(`/api/jobs/${created.body.id}`)
      .set('Authorization', `Bearer ${company.token}`)
      .send({ jobRole: 'senior-av-installer', deliveryContext: 'lead', projectScale: 'large' });

    expect(updated.status).toBe(200);
    expect(updated.body.canonicalRoleId).toBe('av-lead-engineer-site-manager');
    expect(updated.body.deliveryContext).toBe('lead');
    expect(updated.body.projectScale).toBe('large');
  });

  it('rejects an unrecognized role when a listing role is changed', async () => {
    const company = await registerCompany();
    const created = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${company.token}`)
      .send(jobPayload('av-installation-engineer'));

    const updated = await request(app)
      .patch(`/api/jobs/${created.body.id}`)
      .set('Authorization', `Bearer ${company.token}`)
      .send({ jobRole: 'Totally Invented Role' });

    expect(updated.status).toBe(400);
    expect(updated.body.error).toMatch(/recognized canonical role/i);
  });

  it('rejects invalid evidence context values instead of persisting free text', async () => {
    const company = await registerCompany();
    const response = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${company.token}`)
      .send({ ...jobPayload('av-installation-engineer'), deliveryContext: 'hero', projectScale: 'massive' });

    expect(response.status).toBe(400);
  });
});
