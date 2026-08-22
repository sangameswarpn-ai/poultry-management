'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  ShieldAlert, 
  CheckCircle, 
  MapPin, 
  Users, 
  CalendarRange, 
  Eye,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { mockFarms, mockRiskAlerts } from '@/mock-data';

// Dynamically import the RiskMap with ssr: false to prevent document error on compile
const RiskMap = dynamic(() => import('@/components/maps/risk-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] bg-secondary/20 rounded-xl border border-border animate-pulse flex items-center justify-center text-xs text-muted-foreground">
      Loading GIS Map module...
    </div>
  )
});

export default function OfficerDashboard() {
  // Simulation Sandbox State Hooks
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [showBuffers, setShowBuffers] = useState(true);
  const [simMortality, setSimMortality] = useState(20);
  const [simCompliance, setSimCompliance] = useState(92);
  // Count farms by risk level
  const totalFarms = mockFarms.length;
  const criticalCount = mockFarms.filter(f => f.riskLevel === 'CRITICAL').length;
  const highCount = mockFarms.filter(f => f.riskLevel === 'HIGH').length;
  const mediumCount = mockFarms.filter(f => f.riskLevel === 'MEDIUM').length;
  const lowCount = mockFarms.filter(f => f.riskLevel === 'LOW').length;

  // Active pending alerts
  const pendingAlerts = mockRiskAlerts.filter(a => a.status === 'PENDING');

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-risk-critical';
      case 'HIGH': return 'text-risk-high';
      case 'MEDIUM': return 'text-risk-medium';
      default: return 'text-risk-low';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Regional Veterinary Grid</h2>
          <p className="text-xs text-muted-foreground">
            Welcome, <span className="font-semibold text-foreground">Dr. Amit Patel</span> (Namakkal District Health Officer)
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/officer/inspections"
            className="flex items-center gap-1.5 text-xs font-bold bg-primary text-primary-foreground px-3.5 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <CalendarRange size={14} />
            Schedule Inspection
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-5 text-xs">
        {[
          { label: "Total Farms Under Watch", value: totalFarms, color: "text-primary" },
          { label: "Critical Anomalies", value: criticalCount, color: "text-risk-critical font-extrabold" },
          { label: "High Alerts", value: highCount, color: "text-risk-high font-bold" },
          { label: "Medium Alerts", value: mediumCount, color: "text-risk-medium font-bold" },
          { label: "Pending Investigations", value: pendingAlerts.length, color: "text-blue-500 font-bold" }
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between shadow-sm">
            <span className="text-muted-foreground font-semibold">{stat.label}</span>
            <span className={`text-xl font-bold tracking-tight mt-2 ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* GIS Mapping Grid with Simulation Sandbox */}
      <div className="grid gap-6 md:grid-cols-4">
        {/* Left 3 cols: Map */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-3 md:col-span-3">
          <div className="flex justify-between items-center pb-2 border-b border-border/60">
            <h3 className="font-bold text-sm flex items-center gap-1.5 text-foreground">
              <MapPin size={16} className="text-primary" />
              GIS Outbreak & Infection Distribution Grid
            </h3>
            <span className="text-[10px] bg-secondary border border-border px-2 py-0.5 rounded font-mono">
              Centred on Namakkal, TN
            </span>
          </div>
          <RiskMap 
            filterRisk={filterRisk}
            showBuffers={showBuffers}
            simMortality={simMortality}
            simCompliance={simCompliance}
          />
        </div>
        
        {/* Right 1 col: Simulation Controls Panel */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm flex items-center gap-1.5 text-foreground border-b border-border/60 pb-2">
              <Sparkles size={16} className="text-accent animate-pulse" />
              GIS Sandbox Simulator
            </h3>
            
            {/* Risk Level Filter */}
            <div className="space-y-1.5 text-xs mt-4">
              <label className="text-muted-foreground font-semibold">Filter Map Nodes</label>
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="ALL">All Nodes</option>
                <option value="LOW">Low Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="HIGH">High Risk</option>
                <option value="CRITICAL">Critical Risk</option>
              </select>
            </div>

            {/* Containment Ring Toggle */}
            <div className="flex items-center justify-between text-xs p-2.5 border border-border rounded-xl bg-secondary/30 mt-4">
              <label htmlFor="buffers-toggle" className="font-bold text-foreground cursor-pointer">
                Show GIS Buffers
              </label>
              <input
                type="checkbox"
                id="buffers-toggle"
                checked={showBuffers}
                onChange={(e) => setShowBuffers(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer shrink-0"
              />
            </div>

            {/* Sliders for Sri Murugan Farm simulation */}
            <div className="space-y-4 border-t border-border pt-4 mt-4">
              <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-primary">Simulate Farm-1 (Sri Murugan)</h4>

              {/* Mortality Rate Slider */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-muted-foreground">Flock Mortality</span>
                  <span className="text-risk-critical">{simMortality} birds</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={simMortality}
                  onChange={(e) => setSimMortality(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Compliance Slider */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-muted-foreground">Biosecurity Compliance</span>
                  <span className="text-primary">{simCompliance}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={simCompliance}
                  onChange={(e) => setSimCompliance(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-secondary/40 p-2.5 rounded-lg border border-border/80">
            <p className="text-[9px] text-muted-foreground leading-relaxed font-mono">
              <span className="font-bold text-foreground block mb-0.5">Sandbox Instructions:</span>
              Sliders trigger threat engines and dynamically render containment circles on the map.
            </p>
          </div>
        </div>
      </div>

      {/* Two columns: Alerts & Quick Action list */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Active Alerts queue */}
        <div className="bg-card border border-border rounded-xl p-5 md:col-span-2 space-y-4">
          <h3 className="font-bold text-sm flex items-center gap-1.5 text-foreground">
            <ShieldAlert size={16} className="text-risk-critical animate-pulse" />
            Critical Outbreak Alerts Queue
          </h3>

          <div className="divide-y divide-border/60">
            {pendingAlerts.map((alert) => (
              <div key={alert.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground hover:underline cursor-pointer">{alert.farmName}</span>
                    <span className={`px-2 py-0.2 rounded text-[8px] font-extrabold border ${
                      alert.level === 'CRITICAL' ? 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20' : 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20'
                    }`}>
                      {alert.level}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">{alert.message}</p>
                  <p className="text-[9px] text-muted-foreground font-mono">Region: {alert.district} • Dispatched: Just now</p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/officer/inspections?farmId=${alert.farmId}`}
                    className="px-2.5 py-1 bg-primary text-primary-foreground font-bold rounded text-[10px] hover:bg-primary/95 transition-colors"
                  >
                    Inspect
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Contacts / Regional Resources */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-sm flex items-center gap-1.5">
            <Users size={16} className="text-primary" />
            Regional Resources
          </h3>

          <div className="space-y-3 text-xs">
            <div className="bg-secondary/40 p-3 rounded-lg border border-border space-y-1">
              <p className="font-bold">Coimbatore Bio-Lab Depot</p>
              <p className="text-[10px] text-muted-foreground">Emergency diagnostic kits supply</p>
              <p className="text-[10px] font-bold text-primary mt-1">+91 422 234891</p>
            </div>
            
            <div className="bg-secondary/40 p-3 rounded-lg border border-border space-y-1">
              <p className="font-bold">Namakkal Vaccine Stores</p>
              <p className="text-[10px] text-muted-foreground">Flock vaccination doses availability</p>
              <p className="text-[10px] font-bold text-primary mt-1">+91 4286 28731</p>
            </div>

            <div className="bg-secondary/40 p-3 rounded-lg border border-border space-y-1">
              <p className="font-bold">State Quarantine Control</p>
              <p className="text-[10px] text-muted-foreground">Outbreak quarantine containment cell</p>
              <p className="text-[10px] font-bold text-primary mt-1">1800-425-3431</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
