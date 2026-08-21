'use client';

import { Landmark, ArrowUpRight, Award, ShieldAlert, Activity } from 'lucide-react';

export default function AdminDistrictsPage() {
  const districtsData = [
    { name: "Namakkal", activeFarms: 12, compliance: "80.4%", deathsToday: 184, risk: "HIGH", color: "text-risk-high", responseRate: "94%" },
    { name: "Coimbatore", activeFarms: 1, compliance: "82.0%", deathsToday: 5, risk: "LOW", color: "text-risk-low", responseRate: "100%" },
    { name: "Vellore", activeFarms: 1, compliance: "50.0%", deathsToday: 70, risk: "HIGH", color: "text-risk-high", responseRate: "60%" },
    { name: "Salem", activeFarms: 1, compliance: "70.0%", deathsToday: 15, risk: "MEDIUM", color: "text-risk-medium", responseRate: "85%" }
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight">District Telemetry Comparison</h2>
        <p className="text-xs text-muted-foreground">Compare biosecurity levels and containment responses across state zones</p>
      </div>

      {/* Overview stats cards */}
      <div className="grid gap-4 sm:grid-cols-3 text-xs">
        <div className="bg-card border border-border p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-muted-foreground font-semibold">Highest Compliance Zone</span>
            <span className="text-lg font-bold block text-risk-low mt-1">Coimbatore (82%)</span>
          </div>
          <Award className="text-risk-low" size={20} />
        </div>
        
        <div className="bg-card border border-border p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-muted-foreground font-semibold">High Outbreak Alert Zone</span>
            <span className="text-lg font-bold block text-risk-critical mt-1">Namakkal (184 dead)</span>
          </div>
          <ShieldAlert className="text-risk-critical" size={20} />
        </div>

        <div className="bg-card border border-border p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-muted-foreground font-semibold">Mean Containment Speed</span>
            <span className="text-lg font-bold block text-primary mt-1">84.7 Hours Avg</span>
          </div>
          <Activity className="text-primary" size={20} />
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold">
              <th className="p-4">District Jurisdiction</th>
              <th className="p-4">Active Farms</th>
              <th className="p-4">Biosecurity Avg</th>
              <th className="p-4">Flock Deaths Today</th>
              <th className="p-4">Outbreak Threat</th>
              <th className="p-4 text-right">Investigation speed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {districtsData.map((d, i) => (
              <tr key={i} className="hover:bg-secondary/15">
                <td className="p-4 font-bold text-foreground flex items-center gap-1.5">
                  <Landmark size={14} className="text-muted-foreground" />
                  {d.name}
                </td>
                <td className="p-4 text-muted-foreground">{d.activeFarms} registered</td>
                <td className="p-4 font-bold text-primary">{d.compliance}</td>
                <td className="p-4 font-mono font-bold text-risk-critical">{d.deathsToday} dead</td>
                <td className="p-4">
                  <span className={`font-extrabold ${d.color}`}>{d.risk}</span>
                </td>
                <td className="p-4 text-right font-mono font-semibold text-foreground">
                  {d.responseRate} compliance
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
