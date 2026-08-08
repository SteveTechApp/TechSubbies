import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import request from 'supertest';

const TEST_DB = path.join(process.cwd(), 'data', 'test-pricing-research-routes.db');
fs.rmSync(TEST_DB, { force: true });
process.env.DB_FILE = TEST_DB;
process.env.JWT_SECRET = 'pricing-research-test-secret';
process.env.NODE_ENV = 'test';

const { createApp } = await import('../app.js');
const { createUser, markEmailVerified } = await import('../lib/db.js');
const { signToken } = await import('../middleware/auth.js');
const app = createApp();

async function register(role: 'Engineer' | 'Company' | 'Resourcing Company', email: string) {
  const response = await request(app).post('/api/auth/register').send({
    email,
    password: 'correcthorsebattery',
    role,
    name: `${role} Pricing Research`,
    profileData: {},
  });
  markEmailVerified(response.body.user.id);
  return response;
}

const validResponse = {
  valueScore: 4,
  likelihoodToPay: 4,
  priceTooCheap: 5,
  priceGoodValue: 15,
  priceExpensive: 35,
  priceTooExpensive: 60,
  preferredBilling: 'monthly',
  valueDrivers: ['better-matching', 'verified-talent'],
  primaryBlocker: 'need-proof-of-value',
};

describe('pricing research routes', () => {
  it('lets commercial account types save and update one response', async () => {
    const company = await register('Company', 'pricing-route-company@example.com');
    const token = company.body.token;

    const first = await request(app)
      .put('/api/pricing-research/me')
      .set('Authorization', `Bearer ${token}`)
      .send(validResponse);
    expect(first.status).toBe(200);
    expect(first.body.response.accountRole).toBe('Company');

    const second = await request(app)
      .put('/api/pricing-research/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validResponse, likelihoodToPay: 5 });
    expect(second.status).toBe(200);
    expect(second.body.response.id).toBe(first.body.response.id);
    expect(second.body.response.likelihoodToPay).toBe(5);
  });

  it('rejects contradictory price thresholds', async () => {
    const engineer = await register('Engineer', 'pricing-route-engineer@example.com');
    const response = await request(app)
      .put('/api/pricing-research/me')
      .set('Authorization', `Bearer ${engineer.body.token}`)
      .send({ ...validResponse, priceGoodValue: 40, priceExpensive: 20 });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/thresholds must increase/i);
  });

  it('keeps aggregate results Admin-only', async () => {
    const company = await register('Company', 'pricing-route-company-2@example.com');
    const denied = await request(app)
      .get('/api/admin/pricing-research')
      .set('Authorization', `Bearer ${company.body.token}`);
    expect(denied.status).toBe(403);

    const admin = createUser({
      email: 'pricing-route-admin@example.com',
      password: 'hash',
      role: 'Admin',
      name: 'Pricing Admin',
      profile: '{}',
    });
    markEmailVerified(admin.id);
    const adminToken = signToken(admin.id);
    const allowed = await request(app)
      .get('/api/admin/pricing-research')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(allowed.status).toBe(200);
    expect(allowed.body.summary.segments).toHaveLength(3);
  });
});
