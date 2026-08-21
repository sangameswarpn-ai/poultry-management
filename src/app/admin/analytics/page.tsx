'use client';

import { BarChart3, TrendingUp, Sparkles, PieChart } from 'lucide-react';

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight">Statistical Deep-Dives</h2>
        <p className="text-xs text-muted-foreground">Monitor district mortality anomalies and biosecurity correlations</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Chart 1: District Mortality Volumes */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xs flex items-center gap-1.5">
              <BarChart3 size={14} className="text-primary" />
              Mortality Volumes by District (Today)
            </h3>
            <span className="text-[9px] text-muted-foreground">Total: 279 deaths</span>
          </div>

          <div className="w-full h-48 bg-secondary/10 rounded-lg p-3 flex items-end justify-between gap-6 relative">
            {/* Draw a gorgeous SVG bar chart */}
            <div className="flex flex-col items-center flex-1 space-y-2">
              <div className="w-full bg-risk-critical rounded-t-md h-36 flex items-center justify-center text-[10px] font-bold text-white">184</div>
              <span className="text-[10px] text-muted-foreground font-bold">Namakkal</span>
            </div>
            
            <div className="flex flex-col items-center flex-1 space-y-2">
              <div className="w-full bg-risk-critical rounded-t-md h-16 flex items-center justify-center text-[10px] font-bold text-white">70</div>
              <span className="text-[10px] text-muted-foreground font-bold">Vellore</span>
            </div>

            <div className="flex flex-col items-center flex-1 space-y-2">
              <div className="w-full bg-risk-critical rounded-t-md h-6 flex items-center justify-center text-[10px] font-bold text-white">15</div>
              <span className="text-[10px] text-muted-foreground font-bold">Salem</span>
            </div>

            <div className="flex flex-col items-center flex-1 space-y-2">
              <div className="w-full bg-risk-critical rounded-t-md h-2 flex items-center justify-center text-[10px] font-bold text-white">5</div>
              <span className="text-[10px] text-muted-foreground font-bold">Coimbatore</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Correlation Analysis */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xs flex items-center gap-1.5">
              <TrendingUp size={14} className="text-primary" />
              Biosecurity Score vs Outbreak Risk Index
            </h3>
            <span className="text-[9px] text-muted-foreground">Logarithmic Correlation</span>
          </div>

          <div className="w-full h-48 bg-secondary/10 rounded-lg p-3 flex items-end justify-between gap-6 relative">
            {/* Draw a gorgeous SVG line showing correlation: lower biosecurity = higher risk */}
            <svg className="w-full h-full" viewBox="0 0 400 130" preserveAspectRatio="none">
              <line x1="20" y1="10" x2="20" y2="110" stroke="var(--border)" />
              <line x1="20" y1="110" x2="380" y2="110" stroke="var(--border)" />
              
              {/* Correlation curve */}
              <path
                d="M 25 15 Q 120 40 220 90 T 375 105"
                fill="none"
                stroke="var(--ring)"
                strokeWidth="2.5"
              />

              {/* Data points */}
              <circle cx="25" cy="15" r="4" fill="var(--risk-critical)">
                <title>Critical Farm (30% comp, 95% risk)</title>
              </circle>
              <circle cx="120" cy="40" r="4" fill="var(--risk-high)">
                <title>High Farm (54% comp, 74% risk)</title>
              </circle>
              <circle cx="220" cy="90" r="4" fill="var(--risk-medium)">
                <title>Medium Farm (72% comp, 45% risk)</title>
              </circle>
              <circle cx="350" cy="103" r="4" fill="var(--risk-low)">
                <title>Low Farm (92% comp, 12% risk)</title>
              </circle>

              {/* Text labels */}
              <text x="350" y="125" fill="var(--muted-foreground)" className="text-[9px]" textAnchor="middle">100% Comp.</text>
              <text x="25" y="125" fill="var(--muted-foreground)" className="text-[9px]" textAnchor="middle">0% Comp.</text>
            </svg>
          </div>
        </div>

      </div>

    </div>
  );
}
