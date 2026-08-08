import { describe, expect, it } from 'vitest';
import {
  formatPilotConversionMetric,
  formatPilotConversionTarget,
  getPilotConversionMetrics,
} from './pilotConversionTargets';

describe('pilot conversion targets', () => {
  it('calculates controlled-pilot conversion rates from funnel events', () => {
    const metrics = getPilotConversionMetrics({
      jobsPosted: 4,
      applicationsSubmitted: 3,
      contractsCreated: 1,
    });

    expect(metrics).toEqual([
      expect.objectContaining({ id: 'applicationsPerJob', actual: 0.8, target: 2, met: false }),
      expect.objectContaining({ id: 'jobToContractPercent', actual: 25, target: 30, met: false }),
      expect.objectContaining({ id: 'applicationToContractPercent', actual: 33.3, target: 15, met: true }),
    ]);
    expect(formatPilotConversionMetric(metrics[0])).toBe('0.8');
    expect(formatPilotConversionTarget(metrics[1])).toBe('30%');
  });

  it('returns zero instead of invalid values when the funnel is empty', () => {
    const metrics = getPilotConversionMetrics({
      jobsPosted: 0,
      applicationsSubmitted: 0,
      contractsCreated: 0,
    });

    expect(metrics.map((metric) => metric.actual)).toEqual([0, 0, 0]);
    expect(metrics.every((metric) => metric.met === false)).toBe(true);
  });
});
