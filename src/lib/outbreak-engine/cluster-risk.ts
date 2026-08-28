import { getOutbreakSeverityLevel, OutbreakSeverity } from './outbreak-levels';

export interface ClusterRiskAssessment {
  riskScore: number; // 0 to 100
  riskLevel: OutbreakSeverity;
  explainabilityFactors: string[];
}

export function calculateClusterRisk(
  reportsCount: number,
  mortalityCount: number,
  sickCount: number,
  affectedVillagesCount: number
): ClusterRiskAssessment {
  // Simple risk formula: reports count * 8 + mortality * 3 + sick count * 1.5
  let rawScore = reportsCount * 8 + mortalityCount * 3 + sickCount * 1.5;
  if (affectedVillagesCount > 1) {
    rawScore += (affectedVillagesCount - 1) * 15; // Spread factor penalty
  }

  const riskScore = Math.min(100, Math.round(rawScore));
  const riskLevel = getOutbreakSeverityLevel(reportsCount, mortalityCount, sickCount);

  const explainabilityFactors: string[] = [];
  explainabilityFactors.push(`${reportsCount} clinical reports filed in proximity`);
  if (mortalityCount > 0) {
    explainabilityFactors.push(`${mortalityCount} animal deaths recorded within time window`);
  }
  if (sickCount > 0) {
    explainabilityFactors.push(`${sickCount} active animal sickness logs`);
  }
  if (affectedVillagesCount > 1) {
    explainabilityFactors.push(`Outbreak spreading across ${affectedVillagesCount} villages`);
  }

  return {
    riskScore,
    riskLevel,
    explainabilityFactors
  };
}
