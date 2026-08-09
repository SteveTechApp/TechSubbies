export type PilotFunnelSnapshot = {
  jobsPosted: number;
  applicationsSubmitted: number;
  contractsCreated: number;
};

export const PILOT_CONVERSION_TARGETS = {
  applicationsPerJob: 2,
  jobToContractPercent: 30,
  applicationToContractPercent: 15,
} as const;

export type PilotConversionMetric = {
  id: keyof typeof PILOT_CONVERSION_TARGETS;
  label: string;
  actual: number;
  target: number;
  format: 'ratio' | 'percent';
  met: boolean;
};

const roundToOneDecimal = (value: number) => Math.round(value * 10) / 10;

const safeRatio = (numerator: number, denominator: number, multiplier = 1) => {
  if (denominator <= 0) return 0;
  return roundToOneDecimal((numerator / denominator) * multiplier);
};

export function getPilotConversionMetrics(funnel: PilotFunnelSnapshot): PilotConversionMetric[] {
  const applicationsPerJob = safeRatio(funnel.applicationsSubmitted, funnel.jobsPosted);
  const jobToContractPercent = safeRatio(funnel.contractsCreated, funnel.jobsPosted, 100);
  const applicationToContractPercent = safeRatio(funnel.contractsCreated, funnel.applicationsSubmitted, 100);

  return [
    {
      id: 'applicationsPerJob',
      label: 'Applications per job',
      actual: applicationsPerJob,
      target: PILOT_CONVERSION_TARGETS.applicationsPerJob,
      format: 'ratio',
      met: applicationsPerJob >= PILOT_CONVERSION_TARGETS.applicationsPerJob,
    },
    {
      id: 'jobToContractPercent',
      label: 'Job to contract',
      actual: jobToContractPercent,
      target: PILOT_CONVERSION_TARGETS.jobToContractPercent,
      format: 'percent',
      met: jobToContractPercent >= PILOT_CONVERSION_TARGETS.jobToContractPercent,
    },
    {
      id: 'applicationToContractPercent',
      label: 'Application to contract',
      actual: applicationToContractPercent,
      target: PILOT_CONVERSION_TARGETS.applicationToContractPercent,
      format: 'percent',
      met: applicationToContractPercent >= PILOT_CONVERSION_TARGETS.applicationToContractPercent,
    },
  ];
}

export function formatPilotConversionMetric(metric: PilotConversionMetric): string {
  return metric.format === 'percent' ? `${metric.actual}%` : metric.actual.toFixed(1);
}

export function formatPilotConversionTarget(metric: PilotConversionMetric): string {
  return metric.format === 'percent' ? `${metric.target}%` : metric.target.toFixed(1);
}
