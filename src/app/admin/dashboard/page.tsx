'use client';

import { Sprout, ShieldAlert, Award, Landmark, Map, BarChart3, Users, ChevronRight } from 'lucide-react';
import { mockFarms, mockRiskAlerts } from '@/mock-data';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const totalFarms = mockFarms.length;
  const criticalCount = mockFarms.filter(f => f.riskLevel === 'CRITICAL').length;
  const highCount = mockFarms.filter(f => f.riskLevel === 'HIGH').length;
  const mediumCount = mockFarms.filter(f => f.riskLevel === 'MEDIUM').length;
  const lowCount = mockFarms.filter(f => f.riskLevel === 'LOW').length;

  const averageCompliance = Math.round(
    mockFarms.reduce((acc, f) => acc + f.biosecurityScore, 0) / totalFarms
  );

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">State Monitoring Board</h2>
          <p className="text-xs text-muted-foreground">State Director Office • Department of Animal Husbandry</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground font-medium">State Scope:</span>
          <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-md border border-primary/20">
            TAMIL NADU GRID
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
        {[
          { label: "State registered Farms", value: totalFarms, icon: Sprout, sub: "Across 4 active districts" },
          { label: "Active Critical Incidents", value: criticalCount, icon: ShieldAlert, sub: "Awaiting field actions", alert: true },
          { label: "Mean Biosecurity Compliance", value: `${averageCompliance}%`, icon: Award, sub: "State-wide target is 85%" },
          { label: "Active Districts", value: "3 Districts", icon: Landmark, sub: "Namakkal, Coimbatore, Vellore" }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-card border border-border p-5 rounded-xl flex flex-col justify-between shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground font-semibold">{stat.label}</span>
                <Icon size={16} className={stat.alert ? 'text-risk-critical animate-pulse' : 'text-primary'} />
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight block">{stat.value}</span>
                <span className="text-[10px] text-muted-foreground block mt-1">{stat.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: Risk distribution & Analytical graph */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Risk Distribution Breakdown */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-sm">Territorial Risk Breakdown</h3>
          
          <div className="space-y-3">
            {[
              { label: "CRITICAL", count: criticalCount, color: "bg-risk-critical", width: `${(criticalCount/totalFarms)*100}%` },
              { label: "HIGH", count: highCount, color: "bg-risk-high", width: `${(highCount/totalFarms)*100}%` },
              { label: "MEDIUM", count: mediumCount, color: "bg-risk-medium", width: `${(mediumCount/totalFarms)*100}%` },
              { label: "LOW", count: lowCount, color: "bg-risk-low", width: `${(lowCount/totalFarms)*100}%` }
            ].map((risk, i) => (
              <div key={i} className="text-xs space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-muted-foreground font-bold">{risk.label}</span>
                  <span className="text-foreground">{risk.count} farms</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full ${risk.color}`} style={{ width: risk.width }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SVG State Anomaly Trends */}
        <div className="bg-card border border-border rounded-xl p-5 md:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm flex items-center gap-1.5">
              <BarChart3 size={16} className="text-primary" />
              State-wide Mortality & Biosecurity Trends
            </h3>
            <span className="text-[9px] text-muted-foreground">Updated hourly</span>
          </div>

          <div className="w-full h-44 bg-secondary/20 rounded-lg p-2 flex items-center justify-center relative">
            <svg className="w-full h-full" viewBox="0 0 600 150" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="50" y1="20" x2="550" y2="20" stroke="var(--border)" strokeDasharray="4 4" />
              <line x1="50" y1="80" x2="550" y2="80" stroke="var(--border)" strokeDasharray="4 4" />
              <line x1="50" y1="130" x2="550" y2="130" stroke="var(--border)" />

              {/* Compliance Curve (Green) */}
              <path
                d="M 50 60 L 133 55 L 216 48 L 299 45 L 382 40 L 465 38 L 550 35"
                fill="none"
                stroke="var(--risk-low)"
                strokeWidth="2"
              />
              {/* Mortality curve (Red) */}
              <path
                d="M 50 120 L 133 118 L 216 112 L 299 110 L 382 105 L 465 95 L 550 85"
                fill="none"
                stroke="var(--risk-critical)"
                strokeWidth="2"
              />

              <circle cx="550" cy="35" r="4" fill="var(--risk-low)" />
              <circle cx="550" cy="85" r="4" fill="var(--risk-critical)" />
            </svg>
          </div>
          
          <div className="flex gap-4 mt-2 justify-end text-[10px] font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              <span>Avg Biosecurity Score</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span>Regional Mortality Count</span>
            </div>
          </div>
        </div>

      </div>

      {/* District quick list */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm">District Surveillance Status</h3>
          <Link href="/admin/districts" className="text-xs text-primary font-semibold hover:underline flex items-center gap-0.5">
            Full districts grid <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 text-xs">
          {[
            { district: "Namakkal", farms: 11, compliance: "80.4%", risk: "HIGH", color: "text-risk-high" },
            { district: "Coimbatore", farms: 1, compliance: "82.0%", risk: "LOW", color: "text-risk-low" },
            { district: "Vellore", farms: 1, compliance: "50.0%", risk: "HIGH", color: "text-risk-high" }
          ].map((dist, i) => (
            <div key={i} className="border border-border p-4 rounded-lg space-y-2 bg-secondary/15">
              <h4 className="font-bold text-sm">{dist.district}</h4>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Farms:</span>
                <span className="font-semibold">{dist.farms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Compliance:</span>
                <span className="font-semibold text-primary">{dist.compliance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Surveillance Alert:</span>
                <span className={`font-extrabold ${dist.color}`}>{dist.risk}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
