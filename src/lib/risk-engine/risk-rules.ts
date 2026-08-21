export interface RiskRule {
  id: string;
  name: string;
  weight: number;
  description: string;
}

export const MORTALITY_RULES = {
  CRITICAL_THRESHOLD: 0.01, // 1% of flock in one day (e.g. 100 out of 10000)
  HIGH_THRESHOLD: 0.003,    // 0.3% of flock in one day
  MEDIUM_THRESHOLD: 0.001,  // 0.1% of flock in one day
  
  scores: {
    CRITICAL: 60,
    HIGH: 40,
    MEDIUM: 20
  }
};

export const SYMPTOM_RULES: Record<string, { severity: 'CRITICAL' | 'MAJOR' | 'MILD'; score: number }> = {
  'Sudden death': { severity: 'CRITICAL', score: 45 },
  'Breathing difficulty': { severity: 'MAJOR', score: 25 },
  'Fever': { severity: 'MAJOR', score: 20 },
  'Diarrhea': { severity: 'MILD', score: 15 },
  'Cough': { severity: 'MILD', score: 10 },
  'Loss of appetite': { severity: 'MILD', score: 10 }
};

export const BIOSECURITY_RULES = {
  POOR_COMPLIANCE_THRESHOLD: 50, // < 50%
  MODERATE_COMPLIANCE_THRESHOLD: 80, // < 80%
  
  scores: {
    POOR: 25,
    MODERATE: 12
  }
};

export const VISITOR_RULES = {
  UNSANITIZED_VEHICLE_SCORE: 15,
  ACTIVE_VISITOR_THRESHOLD: 2,
  ACTIVE_VISITOR_SCORE: 8
};
