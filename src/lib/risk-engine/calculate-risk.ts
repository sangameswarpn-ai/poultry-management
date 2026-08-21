import { RiskLevel, RISK_LEVELS } from './risk-levels';
import { MORTALITY_RULES, SYMPTOM_RULES, BIOSECURITY_RULES, VISITOR_RULES } from './risk-rules';

export interface RiskInput {
  totalAnimals: number;
  mortalityCount: number;
  symptoms: string[];
  biosecurityComplianceRate: number;
  visitors: Array<{
    disinfectionStatus?: boolean;
    status: 'ACTIVE' | 'EXITED';
  }>;
}

export interface RiskOutput {
  score: number;
  level: RiskLevel;
  factors: string[];
  details: string;
}

export function calculateRisk(input: RiskInput): RiskOutput {
  let score = 0;
  const factors: string[] = [];
  
  const { totalAnimals, mortalityCount, symptoms, biosecurityComplianceRate, visitors } = input;
  
  // 1. Mortality Rate Check
  if (totalAnimals > 0) {
    const mortalityRate = mortalityCount / totalAnimals;
    
    if (mortalityRate >= MORTALITY_RULES.CRITICAL_THRESHOLD) {
      score += MORTALITY_RULES.scores.CRITICAL;
      factors.push(`Critical Mortality Spike: ${(mortalityRate * 100).toFixed(2)}% in 24 hours (${mortalityCount} deaths)`);
    } else if (mortalityRate >= MORTALITY_RULES.HIGH_THRESHOLD) {
      score += MORTALITY_RULES.scores.HIGH;
      factors.push(`High Mortality Level: ${(mortalityRate * 100).toFixed(2)}% in 24 hours (${mortalityCount} deaths)`);
    } else if (mortalityRate >= MORTALITY_RULES.MEDIUM_THRESHOLD) {
      score += MORTALITY_RULES.scores.MEDIUM;
      factors.push(`Elevated Mortality Rate: ${(mortalityRate * 100).toFixed(2)}% in 24 hours (${mortalityCount} deaths)`);
    }
  }
  
  // 2. Symptoms Check
  let highestSymptomSeverity = 0;
  symptoms.forEach(symptom => {
    const rule = SYMPTOM_RULES[symptom];
    if (rule) {
      score += rule.score;
      factors.push(`Symptom Detected: ${symptom} (${rule.severity} risk factor)`);
      if (rule.severity === 'CRITICAL') highestSymptomSeverity = 3;
      else if (rule.severity === 'MAJOR' && highestSymptomSeverity < 2) highestSymptomSeverity = 2;
      else if (rule.severity === 'MILD' && highestSymptomSeverity < 1) highestSymptomSeverity = 1;
    }
  });

  // 3. Biosecurity Compliance Check
  if (biosecurityComplianceRate < BIOSECURITY_RULES.POOR_COMPLIANCE_THRESHOLD) {
    score += BIOSECURITY_RULES.scores.POOR;
    factors.push(`Poor Biosecurity Compliance: ${biosecurityComplianceRate}%`);
  } else if (biosecurityComplianceRate < BIOSECURITY_RULES.MODERATE_COMPLIANCE_THRESHOLD) {
    score += BIOSECURITY_RULES.scores.MODERATE;
    factors.push(`Moderate Biosecurity Compliance Lapses: ${biosecurityComplianceRate}%`);
  }
  
  // 4. Visitors Check
  const activeUnsanitizedVisitors = visitors.filter(
    v => v.status === 'ACTIVE' && v.disinfectionStatus === false
  ).length;
  
  if (activeUnsanitizedVisitors > 0) {
    score += VISITOR_RULES.UNSANITIZED_VEHICLE_SCORE;
    factors.push(`Unsanitized visitor/vehicle entry on farm`);
  }
  
  if (visitors.length >= VISITOR_RULES.ACTIVE_VISITOR_THRESHOLD) {
    score += VISITOR_RULES.ACTIVE_VISITOR_SCORE;
    factors.push(`High visitor volume (${visitors.length} entries recorded)`);
  }
  
  // Cap score to 100
  score = Math.min(100, Math.max(0, score));
  
  // Determine risk level based on score
  let level: RiskLevel = 'LOW';
  if (score >= RISK_LEVELS.CRITICAL.minScore) {
    level = 'CRITICAL';
  } else if (score >= RISK_LEVELS.HIGH.minScore) {
    level = 'HIGH';
  } else if (score >= RISK_LEVELS.MEDIUM.minScore) {
    level = 'MEDIUM';
  }
  
  // Formulate details / recommendations
  let details = '';
  if (level === 'CRITICAL') {
    details = 'CRITICAL HEALTH DANGER: Immediate lockdown of poultry houses. Halt all movements of birds, litter, and equipment. Contact regional Veterinary Officer immediately.';
  } else if (level === 'HIGH') {
    details = 'HIGH RISK: Isolate sick animals immediately. Initiate thorough disinfection of all footbaths, tools, and vehicle checkpoints. Request veterinary consult.';
  } else if (level === 'MEDIUM') {
    details = 'MEDIUM RISK: Increase sanitation monitoring. Check water supply lines and ensure proper disinfection. Re-evaluate biosecurity checklists.';
  } else {
    details = 'LOW RISK: All parameters normal. Continue daily biosecurity protocols and maintain records.';
  }
  
  return {
    score,
    level,
    factors,
    details
  };
}
