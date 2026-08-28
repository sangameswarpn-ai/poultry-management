export type OutbreakSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface OutbreakThresholds {
  severity: OutbreakSeverity;
  minReportsCount: number;
  minMortalityCount: number;
  minSickCount: number;
}

export const OUTBREAK_THRESHOLDS: OutbreakThresholds[] = [
  {
    severity: 'CRITICAL',
    minReportsCount: 6,
    minMortalityCount: 20,
    minSickCount: 50
  },
  {
    severity: 'HIGH',
    minReportsCount: 4,
    minMortalityCount: 10,
    minSickCount: 25
  },
  {
    severity: 'MEDIUM',
    minReportsCount: 2,
    minMortalityCount: 3,
    minSickCount: 10
  },
  {
    severity: 'LOW',
    minReportsCount: 1,
    minMortalityCount: 0,
    minSickCount: 0
  }
];

export function getOutbreakSeverityLevel(
  reportsCount: number,
  mortalityCount: number,
  sickCount: number
): OutbreakSeverity {
  for (const threshold of OUTBREAK_THRESHOLDS) {
    if (
      reportsCount >= threshold.minReportsCount ||
      mortalityCount >= threshold.minMortalityCount ||
      sickCount >= threshold.minSickCount
    ) {
      return threshold.severity;
    }
  }
  return 'LOW';
}
