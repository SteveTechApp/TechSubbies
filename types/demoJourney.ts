export type DemoAudienceType =
  | "engineer"
  | "hiring_company"
  | "resourcing_company";

export type DemoStepStatus =
  | "setup"
  | "action"
  | "matching"
  | "review"
  | "result";

export interface DemoMiniMetric {
  label: string;
  value: string;
  detail: string;
}

export interface DemoMockPanel {
  title: string;
  lines: string[];
}

export interface DemoJourneyStep {
  id: string;
  status: DemoStepStatus;
  pageName: string;
  povTitle: string;
  userAction: string;
  platformResponse: string;
  expectedResult: string;
  description: string;
  metrics: DemoMiniMetric[];
  mockPanels: DemoMockPanel[];
}

export interface DemoJourney {
  id: DemoAudienceType;
  label: string;
  shortLabel: string;
  headline: string;
  summary: string;
  primaryOutcome: string;
  steps: DemoJourneyStep[];
}