export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RiskLevelConfig {
  level: RiskLevel;
  minScore: number;
  maxScore: number;
  color: string; // CSS class token or hex
  description: string;
}

export const RISK_LEVELS: Record<RiskLevel, RiskLevelConfig> = {
  LOW: {
    level: 'LOW',
    minScore: 0,
    maxScore: 29,
    color: 'var(--risk-low)',
    description: 'Farm is within normal health parameters. Standard biosecurity compliance maintained.'
  },
  MEDIUM: {
    level: 'MEDIUM',
    minScore: 30,
    maxScore: 59,
    color: 'var(--risk-medium)',
    description: 'Minor anomalies detected. Early symptoms or biosecurity lapses. Requires increased vigilance.'
  },
  HIGH: {
    level: 'HIGH',
    minScore: 60,
    maxScore: 84,
    color: 'var(--risk-high)',
    description: 'Significant health anomalies or severe biosecurity failures. Vet investigation recommended.'
  },
  CRITICAL: {
    level: 'CRITICAL',
    minScore: 85,
    maxScore: 100,
    color: 'var(--risk-critical)',
    description: 'Severe mortality spike or critical symptoms detected. Immediate quarantine and field inspection required.'
  }
};
