import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import request from 'supertest';

const TEST_DB = path.join(process.cwd(), 'data', 'test-marketplace-analytics-routes.db');
fs.rmSync(TEST_DB, { force: true });
process.env.DB_FILE = TEST_DB;
process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';

const { createApp } = await import('../app.js');
const { createUser, markEmailVerified } = await import('../lib/db.js');
const { signToken } = await import('../middleware/auth.js');
const app = createApp();

async function register(role: 'Company' | 'Engineer', email: string) {
  const response = await request(app).post('/api/auth/register').send({
    email,
    password: 'correcthorsebattery',
    role,
    name: `${role} Analytics`,
    profileData: {},
  });
  markEmailVerified(response.body.user.id);
  return response;
}

function createAdminToken() {
  const admin = createUser({
    email: 'analytics-admin@example.com',
    password: 'not-used-in-this-test',
    role: 'Admin',
    name: 'Analytics Admin',
    profile: JSON.stringify({ name: 'Analytics Admin' }),
  });
  markEmailVerified(admin.id);
  return signToken(admin.id);
}

describe('marketplace analytics routes', () => {
  it('accepts company discovery events and rejects engineer-authored search events', async () => {
    const company = await register('Company', 'analytics-company@example.com');
    const engineer = await register('Engineer', 'analytics-engineer@example.com');

    const companyEvent = await request(app)
      .post('/api/marketplace-analytics/events')
      .set('Authorization', `Bearer ${company.body.token}`)
      .send({ eventType: 'search.performed' });
    expect(companyEvent.status).toBe(202);

    const engineerEvent = await request(app)
      .post('/api/marketplace-analytics/events')
      .set('Authorization', `Bearer ${engineer.body.token}`)
      .send({ eventType: 'search.performed' });
    expect(engineerEvent.status).toBe(403);
  });

  it('keeps aggregate analytics Admin-only', async () => {
    const company = await register('Company', 'analytics-company-2@example.com');
    const adminToken = createAdminToken();

    const denied = await request(app)
      .get('/api/admin/marketplace-analytics?window=30')
      .set('Authorization', `Bearer ${company.body.token}`);
    expect(denied.status).toBe(403);

    const allowed = await request(app)
      .get('/api/admin/marketplace-analytics?window=30')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(allowed.status).toBe(200);
    expect(allowed.body.analytics.stages).toBeDefined();
  });
});
