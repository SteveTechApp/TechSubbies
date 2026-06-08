import { defaultDemoJourneyId, demoJourneys } from "../data/demoJourneys";
import type { DemoAudienceType, DemoJourney, DemoJourneyStep } from "../types/demoJourney";

export function getDemoJourneys(): DemoJourney[] {
  return demoJourneys;
}

export function getDefaultDemoJourney(): DemoJourney {
  return getDemoJourney(defaultDemoJourneyId);
}

export function getDemoJourney(id: DemoAudienceType): DemoJourney {
  const found = demoJourneys.find((journey) => journey.id === id);

  if (found) {
    return found;
  }

  return demoJourneys[0];
}

export function getStepByIndex(journey: DemoJourney, index: number): DemoJourneyStep {
  const safeIndex = Math.max(0, Math.min(index, journey.steps.length - 1));
  return journey.steps[safeIndex];
}

export function getNextStepIndex(journey: DemoJourney, index: number): number {
  if (index >= journey.steps.length - 1) {
    return 0;
  }

  return index + 1;
}

export function getPreviousStepIndex(journey: DemoJourney, index: number): number {
  if (index <= 0) {
    return journey.steps.length - 1;
  }

  return index - 1;
}

export function getProgressPercent(journey: DemoJourney, index: number): number {
  if (journey.steps.length <= 1) {
    return 100;
  }

  return Math.round(((index + 1) / journey.steps.length) * 100);
}