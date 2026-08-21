'use client';

import { ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import { mockRiskAlerts } from '@/mock-data';

export default function FarmerAlertsPage() {
  // Filters for farmer alerts (associated with frm-1, or general state alerts)
  const alerts = mockRiskAlerts.filter(a => a.farmId === 'frm-5' || a.farmId === 'frm-1');

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* Title */}
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight">Active Farm Risk Alerts</h2>
        <p className="text-xs text-muted-foreground">Monitor real-time threat levels flagged by the automated Risk Engine</p>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`border rounded-xl p-5 flex gap-4 text-xs ${
              alert.level === 'CRITICAL' 
                ? 'bg-red-500/10 border-red-500/30 text-foreground' 
                : 'bg-orange-500/10 border-orange-500/30 text-foreground'
            }`}
          >
            <ShieldAlert size={24} className={alert.level === 'CRITICAL' ? 'text-risk-critical shrink-0 mt-0.5 animate-pulse' : 'text-risk-high shrink-0 mt-0.5'} />
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">{alert.farmName}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                  alert.level === 'CRITICAL' ? 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/10' : 'bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/10'
                }`}>
                  {alert.level}
                </span>
              </div>
              
              <p className="text-muted-foreground leading-relaxed">{alert.message}</p>
              
              <div className="flex gap-4 text-[10px] font-semibold text-muted-foreground">
                <span>Date: {new Date(alert.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span>Status: <span className="text-primary font-bold uppercase">{alert.status}</span></span>
              </div>
            </div>
          </div>
        ))}

        {/* Global Advisory Alert */}
        <div className="border border-border rounded-xl p-5 flex gap-4 text-xs bg-secondary/30">
          <Info size={24} className="text-primary shrink-0 mt-0.5" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight">Government Biosecurity Advisory</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/10 uppercase">
                INFO
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              High density of migratory waterfowl observed near Salem and Namakkal border reservoirs. Farmers are advised to secure net ceilings and check disinfection chemicals in the entry footbaths.
            </p>
            <p className="text-[10px] font-semibold text-muted-foreground">Date: Aug 18, 2026</p>
          </div>
        </div>
      </div>

    </div>
  );
}
