import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';

const TEST_DB = path.join(process.cwd(), 'data', 'test-pricing-research.db');
fs.rmSync(TEST_DB, { force: true });
process.env.DB_FILE = TEST_DB;
process.env.NODE_ENV = 'test';

const { createUser, db } = await import('./db.js');
const {
  findPricingResearchResponse,
  getPricingResearchSummary,
  upsertPricingResearchResponse,
} = await import('./pricingResearchRepository.js');

const input = (overrides: Partial<Parameters<typeof upsertPricingResearchResponse>[2]> = {}) => ({
  valueScore: 4,
  likelihoodToPay: 4,
  priceTooCheap: 5,
  priceGoodValue: 15,
  priceExpensive: 35,
  priceTooExpensive: 60,
  preferredBilling: 'monthly' as const,
  valueDrivers: ['better-matching', 'verified-talent'] as const,
  primaryBlocker: 'need-proof-of-value' as const,
  ...overrides,
});

function user(role: 'Engineer' | 'Company' | 'Resourcing Company', email: string) {
  return createUser({ email, password: 'hash', role, name: email, profile: '{}' });
}

describe('pricingResearchRepository', () => {
  beforeEach(() => {
    db.prepare('DELETE FROM pricing_research_responses').run();
    db.prepare('DELETE FROM users').run();
  });

  it('keeps one current response per account and preserves creation time when updated', () => {
    const engineer = user('Engineer', 'pricing-engineer@example.com');
    const first = upsertPricingResearchResponse(engineer.id, 'Engineer', input());
    const second = upsertPricingResearchResponse(engineer.id, 'Engineer', input({ likelihoodToPay: 5, priceGoodValue: 20 }));

    expect(second.id).toBe(first.id);
    expect(second.createdAt).toBe(first.createdAt);
    expect(second.likelihoodToPay).toBe(5);
    expect(second.priceGoodValue).toBe(20);
    expect(findPricingResearchResponse(engineer.id)?.valueDrivers).toEqual(['better-matching', 'verified-talent']);
    const count = db.prepare('SELECT COUNT(*) AS total FROM pricing_research_responses').get() as { total: number };
    expect(Number(count.total)).toBe(1);
  });

  it('segments medians and stated payment intent by account role', () => {
    const engineerA = user('Engineer', 'pricing-eng-a@example.com');
    const engineerB = user('Engineer', 'pricing-eng-b@example.com');
    const company = user('Company', 'pricing-company@example.com');

    upsertPricingResearchResponse(engineerA.id, 'Engineer', input({ priceGoodValue: 10, likelihoodToPay: 5 }));
    upsertPricingResearchResponse(engineerB.id, 'Engineer', input({ priceGoodValue: 20, likelihoodToPay: 2, primaryBlocker: 'price' }));
    upsertPricingResearchResponse(company.id, 'Company', input({ priceGoodValue: 50, likelihoodToPay: 4, valueDrivers: ['faster-hiring'] }));

    const summary = getPricingResearchSummary();
    const engineers = summary.segments.find((segment) => segment.role === 'Engineer')!;
    const companies = summary.segments.find((segment) => segment.role === 'Company')!;

    expect(summary.totalResponses).toBe(3);
    expect(engineers.responses).toBe(2);
    expect(engineers.medianPriceGoodValue).toBe(15);
    expect(engineers.likelyToPayResponses).toBe(1);
    expect(engineers.likelyToPayRate).toBe(0.5);
    expect(companies.responses).toBe(1);
    expect(companies.medianPriceGoodValue).toBe(50);
    expect(companies.topValueDrivers[0]).toEqual({ driver: 'faster-hiring', responses: 1 });
  });
});
