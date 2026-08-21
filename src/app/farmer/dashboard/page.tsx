'use client';

import Link from 'next/link';
import { 
  Sprout, 
  HeartPulse, 
  ShieldAlert, 
  Users, 
  FileText, 
  ClipboardCheck, 
  TrendingUp, 
  ChevronRight, 
  Activity 
} from 'lucide-react';
import { mockFarms, mockRiskAssessments } from '@/mock-data';

export default function FarmerDashboard() {
  // Use first mock farm for the logged in farmer
  const farm = mockFarms[0]; // Sri Murugan Layer Farm, Ramesh Kumar, LOW risk
  const criticalFarm = mockFarms[4]; // Ponni Poultry Farm, Ram Swaroop, CRITICAL risk (for references)
  
  // Find risk assessment for this farm
  const assessment = mockRiskAssessments.find(r => r.farmId === farm.id) || {
    score: 12,
    level: 'LOW',
    factors: ["Minimal mortality within norms", "Excellent biosecurity score (92%)"],
    details: "All parameters are standard. Keep maintaining disinfection protocols."
  };

  const getRiskBadgeStyles = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-risk-critical/15 text-risk-critical border-risk-critical/30';
      case 'HIGH': return 'bg-risk-high/15 text-risk-high border-risk-high/30';
      case 'MEDIUM': return 'bg-risk-medium/15 text-risk-medium border-risk-medium/30';
      default: return 'bg-risk-low/15 text-risk-low border-risk-low/30';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Vanakkam, {farm.farmerName}!</h2>
          <p className="text-xs text-muted-foreground">
            Monitoring profile for <span className="font-semibold text-foreground">{farm.name}</span> (ID: {farm.id})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">District Grid:</span>
          <span className="bg-secondary text-foreground text-xs font-semibold px-2.5 py-1 rounded-md border border-border">
            {farm.district}, {farm.state}
          </span>
        </div>
      </div>

      {/* Grid: Health Status & Risk Card */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Risk Assessment Card */}
        <div className="bg-card border border-border rounded-xl p-5 md:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm">Farm Risk Level</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getRiskBadgeStyles(assessment.level)}`}>
              {assessment.level} Risk
            </span>
          </div>

          <div className="my-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight">{assessment.score}</span>
            <span className="text-xs text-muted-foreground">/ 100 Risk Index</span>
          </div>

          <div className="space-y-2 border-t border-border pt-4">
            <p className="text-xs font-semibold text-foreground">Scoring Factors:</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
              {assessment.factors.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>
          
          <div className="mt-4 bg-muted/50 p-2.5 rounded-lg border border-border/60">
            <p className="text-[10px] text-muted-foreground leading-relaxed font-mono">
              <span className="font-bold text-foreground block mb-0.5">Recommendations:</span>
              {assessment.details}
            </p>
          </div>
        </div>

        {/* Live Counters */}
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between">
          <h3 className="font-bold text-sm">Daily Flock Metrics</h3>
          
          <div className="space-y-4 my-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <HeartPulse size={16} className="text-primary" />
                <span className="text-xs text-muted-foreground">Total Flock Size</span>
              </div>
              <span className="text-sm font-bold">{farm.totalAnimals.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} className="text-risk-medium" />
                <span className="text-xs text-muted-foreground">Sick Birds Today</span>
              </div>
              <span className="text-sm font-bold text-risk-medium">{farm.sickCount}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} className="text-risk-critical" />
                <span className="text-xs text-muted-foreground">Deaths Today</span>
              </div>
              <span className="text-sm font-bold text-risk-critical">{farm.mortalityCount}</span>
            </div>
          </div>

          <div className="bg-secondary p-3 rounded-lg border border-border text-center">
            <span className="text-[10px] text-muted-foreground block">Today's Biosecurity Compliance</span>
            <span className="text-lg font-extrabold text-primary">{farm.biosecurityScore}%</span>
          </div>
        </div>
      </div>

      {/* Quick Action Touches */}
      <div>
        <h3 className="text-sm font-bold mb-3">Daily Tasks & Operations</h3>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Link
            href="/farmer/biosecurity"
            className="bg-card border border-border hover:border-primary p-4 rounded-xl flex flex-col items-center text-center justify-between transition-colors cursor-pointer group"
          >
            <div className="bg-primary/10 text-primary p-2.5 rounded-lg mb-2">
              <ClipboardCheck size={20} />
            </div>
            <div>
              <p className="text-xs font-bold">Biosecurity Checklist</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Disinfection log</p>
            </div>
            <span className="text-[10px] text-primary font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Log Task →
            </span>
          </Link>

          <Link
            href="/farmer/health"
            className="bg-card border border-border hover:border-primary p-4 rounded-xl flex flex-col items-center text-center justify-between transition-colors cursor-pointer group"
          >
            <div className="bg-red-500/10 text-red-600 dark:text-red-400 p-2.5 rounded-lg mb-2">
              <HeartPulse size={20} />
            </div>
            <div>
              <p className="text-xs font-bold">Log Sickness/Deaths</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Flock health inputs</p>
            </div>
            <span className="text-[10px] text-primary font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Add Log →
            </span>
          </Link>

          <Link
            href="/farmer/reports"
            className="bg-card border border-border hover:border-primary p-4 rounded-xl flex flex-col items-center text-center justify-between transition-colors cursor-pointer group"
          >
            <div className="bg-orange-500/10 text-orange-600 dark:text-orange-400 p-2.5 rounded-lg mb-2">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-xs font-bold">Report Suspected Disease</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Vet alert trigger</p>
            </div>
            <span className="text-[10px] text-primary font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Submit →
            </span>
          </Link>

          <Link
            href="/farmer/visitors"
            className="bg-card border border-border hover:border-primary p-4 rounded-xl flex flex-col items-center text-center justify-between transition-colors cursor-pointer group"
          >
            <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 p-2.5 rounded-lg mb-2">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs font-bold">Log Visitor QR Code</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Contact tracing scan</p>
            </div>
            <span className="text-[10px] text-primary font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Scan now →
            </span>
          </Link>
        </div>
      </div>

      {/* SVG Historical Chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm">Flock Mortality & Sickness Curve</h3>
          <span className="text-[10px] text-muted-foreground">Last 7 Days logs</span>
        </div>
        
        {/* Responsive inline SVG chart for zero bundle dependency/SSR friendliness */}
        <div className="w-full h-48 bg-secondary/20 rounded-lg p-2 flex items-center justify-center relative">
          <svg className="w-full h-full" viewBox="0 0 600 180" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="50" y1="20" x2="550" y2="20" stroke="var(--border)" strokeDasharray="4 4" />
            <line x1="50" y1="70" x2="550" y2="70" stroke="var(--border)" strokeDasharray="4 4" />
            <line x1="50" y1="120" x2="550" y2="120" stroke="var(--border)" strokeDasharray="4 4" />
            <line x1="50" y1="150" x2="550" y2="150" stroke="var(--border)" />
            
            {/* Left Axis Labels */}
            <text x="15" y="24" fill="var(--muted-foreground)" className="text-[10px]" textAnchor="middle">100</text>
            <text x="15" y="74" fill="var(--muted-foreground)" className="text-[10px]" textAnchor="middle">50</text>
            <text x="15" y="124" fill="var(--muted-foreground)" className="text-[10px]" textAnchor="middle">10</text>
            <text x="15" y="154" fill="var(--muted-foreground)" className="text-[10px]" textAnchor="middle">0</text>

            {/* Sickness Line (Blue) - Data points: 30, 28, 25, 23, 22, 21, 20 */}
            <path
              d="M 50 100 L 133 103 L 216 108 L 299 110 L 382 112 L 465 113 L 550 115"
              fill="none"
              stroke="var(--ring)"
              strokeWidth="2.5"
            />
            {/* Mortality Line (Red) - Data points: 5, 3, 2, 2, 1, 1, 1 */}
            <path
              d="M 50 142 L 133 145 L 216 147 L 299 147 L 382 149 L 465 149 L 550 149"
              fill="none"
              stroke="var(--risk-critical)"
              strokeWidth="2.5"
            />

            {/* Data circles for endpoints */}
            <circle cx="550" cy="115" r="4" fill="var(--ring)" />
            <circle cx="550" cy="149" r="4" fill="var(--risk-critical)" />

            {/* Bottom Labels (Days) */}
            <text x="50" y="170" fill="var(--muted-foreground)" className="text-[9px]" textAnchor="middle">Aug 15</text>
            <text x="133" y="170" fill="var(--muted-foreground)" className="text-[9px]" textAnchor="middle">Aug 16</text>
            <text x="216" y="170" fill="var(--muted-foreground)" className="text-[9px]" textAnchor="middle">Aug 17</text>
            <text x="299" y="170" fill="var(--muted-foreground)" className="text-[9px]" textAnchor="middle">Aug 18</text>
            <text x="382" y="170" fill="var(--muted-foreground)" className="text-[9px]" textAnchor="middle">Aug 19</text>
            <text x="465" y="170" fill="var(--muted-foreground)" className="text-[9px]" textAnchor="middle">Aug 20</text>
            <text x="550" y="170" fill="var(--muted-foreground)" className="text-[9px]" textAnchor="middle">Today</text>
          </svg>
        </div>
        <div className="flex gap-4 mt-2 justify-end text-[10px] font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Sick Count</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span>Mortality Count</span>
          </div>
        </div>
      </div>

    </div>
  );
}
