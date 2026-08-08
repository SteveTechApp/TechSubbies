import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import request from 'supertest';

const TEST_DB = path.join(process.cwd(), 'data', 'test-commercial-validation-routes.db');
fs.rmSync(TEST_DB, { force: true });
process.env.DB_FILE = TEST_DB;
process.env.JWT_SECRET = 'commercial-validation-test-secret';
process.env.NODE_ENV = 'test';

const { createApp } = await import('../app.js');
const { createUser, markEmailVerified } = await import('../lib/db.js');
const { signToken } = await import('../middleware/auth.js');
const app = createApp();

function authenticatedUser(role: 'Admin' | 'Company', email: string) {
  const user = createUser({ email, password: 'hash', role, name: role, profile: '{}' });
  markEmailVerified(user.id);
  return { user, token: signToken(user.id) };
}

describe('commercial validation routes', () => {
  it('keeps validation evidence and decisions Admin-only', async () => {
    const company = authenticatedUser('Company', 'commercial-company@example.com');
    const admin = authenticatedUser('Admin', 'commercial-admin@example.com');

    const denied = await request(app)
      .get('/api/admin/commercial-validation/summary')
      .set('Authorization', `Bearer ${company.token}`);
    expect(denied.status).toBe(403);

    const allowed = await request(app)
      .get('/api/admin/commercial-validation/summary')
      .set('Authorization', `Bearer ${admin.token}`);
    expect(allowed.status).toBe(200);
    expect(allowed.body.validation.roles).toHaveLength(3);
  });

  it('records a package hypothesis without changing live pricing', async () => {
    const admin = authenticatedUser('Admin', 'commercial-admin-2@example.com');
    const created = await request(app)
      .post('/api/admin/commercial-validation/decisions')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({
        accountRole: 'Engineer',
        packageName: 'Engineer pilot package',
        candidateMonthlyPrice: 15,
        candidateAnnualPrice: 150,
        valueDrivers: ['better-matching'],
      });

    expect(created.status).toBe(201);
    expect(created.body.decision.status).toBe('draft');
    expect(created.body.decision.candidateMonthlyPrice).toBe(15);

    const approval = await request(app)
      .patch(`/api/admin/commercial-validation/decisions/${created.body.decision.id}/status`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ status: 'approved-for-cohort' });
    expect(approval.status).toBe(409);
    expect(approval.body.error).toMatch(/has not met the controlled-cohort evidence gate/i);
  });
});
