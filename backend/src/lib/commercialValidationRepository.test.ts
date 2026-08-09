import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';

const TEST_DB = path.join(process.cwd(), 'data', 'test-commercial-validation.db');
fs.rmSync(TEST_DB, { force: true });
process.env.DB_FILE = TEST_DB;
process.env.NODE_ENV = 'test';

const { createUser, db } = await import('./db.js');
const { upsertPricingResearchResponse } = await import('./pricingResearchRepository.js');
const { reconcileSubscription } = await import('./billingRepository.js');
await import('./marketplaceAnalyticsRepository.js');
const {
  createCommercialDecision,
  getCommercialValidationSummary,
  updateCommercialDecisionStatus,
} = await import('./commercialValidationRepository.js');

function createTestUser(role: 'Engineer' | 'Company' | 'Resourcing Company' | 'Admin', suffix: string) {
  return createUser({
    email: `${suffix}@commercial-validation.test`,
    password: 'hash',
    role,
    name: suffix,
    profile: '{}',
  });
}

const researchInput = {
  valueScore: 4,
  likelihoodToPay: 4,
  priceTooCheap: 5,
  priceGoodValue: 15,
  priceExpensive: 30,
  priceTooExpensive: 50,
  preferredBilling: 'monthly' as const,
  valueDrivers: ['better-matching'] as const,
  primaryBlocker: 'none' as const,
};

describe('commercialValidationRepository', () => {
  beforeEach(() => {
    db.prepare('DELETE FROM commercial_validation_decisions').run();
    db.prepare('DELETE FROM pricing_research_responses').run();
    db.prepare('DELETE FROM subscription_billing').run();
    db.prepare('DELETE FROM marketplace_analytics_events').run();
    db.prepare('DELETE FROM contracts').run();
    db.prepare('DELETE FROM applications').run();
    db.prepare('DELETE FROM jobs').run();
    db.prepare('DELETE FROM users').run();
  });

  it('marks an engineer cohort as observed-evidence-ready only after all evidence gates are met', () => {
    const engineers = Array.from({ length: 10 }, (_, index) => createTestUser('Engineer', `eng-${index}`));
    engineers.forEach((engineer) => upsertPricingResearchResponse(engineer.id, 'Engineer', {
      ...researchInput,
      valueDrivers: [...researchInput.valueDrivers],
    }));

    const now = new Date().toISOString();
    engineers.slice(0, 5).forEach((engineer, index) => {
      db.prepare(`
        INSERT INTO applications (id, jobId, engineerId, status, reviewed, createdAt, updatedAt)
        VALUES (?, ?, ?, 'Applied', 0, ?, ?)
      `).run(`app-${index}`, `job-${index}`, engineer.id, now, now);
    });

    engineers.slice(0, 3).forEach((engineer, index) => {
      reconcileSubscription({
        userId: engineer.id,
        customerId: `cus-${index}`,
        subscriptionId: `sub-${index}`,
        priceId: `price-${index}`,
        tier: 'Silver',
        status: 'active',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      });
    });

    const summary = getCommercialValidationSummary();
    const engineer = summary.roles.find((entry) => entry.role === 'Engineer')!;
    const company = summary.roles.find((entry) => entry.role === 'Company')!;

    expect(engineer.gates).toEqual({
      researchSample: true,
      marketplaceUsage: true,
      statedIntent: true,
      observedBilling: true,
    });
    expect(engineer.readyForCohortTest).toBe(true);
    expect(engineer.stage).toBe('observed-evidence-ready');
    expect(engineer.researchPriceBand).toEqual({ lowerMonthly: 15, upperMonthly: 30 });
    expect(company.billing.capabilityAvailable).toBe(false);
    expect(company.gates.observedBilling).toBeNull();
  });

  it('blocks cohort approval until the target role meets the evidence gate and snapshots evidence on approval', () => {
    const admin = createTestUser('Admin', 'admin');
    const companyDecision = createCommercialDecision({
      accountRole: 'Company',
      packageName: 'Buyer cohort',
      candidateMonthlyPrice: 40,
      valueDrivers: ['faster-hiring'],
      createdBy: admin.id,
    });

    expect(() => updateCommercialDecisionStatus({
      id: companyDecision.id,
      status: 'approved-for-cohort',
      decidedBy: admin.id,
    })).toThrow(/has not met the controlled-cohort evidence gate/i);

    const engineers = Array.from({ length: 10 }, (_, index) => createTestUser('Engineer', `ready-eng-${index}`));
    engineers.forEach((engineer) => upsertPricingResearchResponse(engineer.id, 'Engineer', {
      ...researchInput,
      valueDrivers: [...researchInput.valueDrivers],
    }));
    const now = new Date().toISOString();
    engineers.slice(0, 5).forEach((engineer, index) => {
      db.prepare(`
        INSERT INTO applications (id, jobId, engineerId, status, reviewed, createdAt, updatedAt)
        VALUES (?, ?, ?, 'Applied', 0, ?, ?)
      `).run(`ready-app-${index}`, `ready-job-${index}`, engineer.id, now, now);
    });

    const engineerDecision = createCommercialDecision({
      accountRole: 'Engineer',
      packageName: 'Engineer cohort',
      candidateMonthlyPrice: 15,
      valueDrivers: ['better-matching'],
      createdBy: admin.id,
    });
    const approved = updateCommercialDecisionStatus({
      id: engineerDecision.id,
      status: 'approved-for-cohort',
      decidedBy: admin.id,
    });

    expect(approved.status).toBe('approved-for-cohort');
    expect(approved.evidenceSnapshot?.role).toBe('Engineer');
    expect(approved.evidenceSnapshot?.readyForCohortTest).toBe(true);
  });
});
