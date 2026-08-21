'use client';

import { useState } from 'react';
import { ShieldAlert, Check, X, Clock, HelpCircle, Eye } from 'lucide-react';
import { mockRiskAlerts } from '@/mock-data';

export default function OfficerAlertsPage() {
  const [alerts, setAlerts] = useState(mockRiskAlerts);

  const handleUpdateStatus = (id: string, newStatus: 'INVESTIGATED' | 'RESOLVED') => {
    setAlerts(prev =>
      prev.map(a =>
        a.id === id ? { ...a, status: newStatus } : a
      )
    );
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
      
      {/* Title */}
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight">Active Epidemic Alerts</h2>
        <p className="text-xs text-muted-foreground">Manage and resolve threat flags dispatched by regional risk calculations</p>
      </div>

      {/* Grid List */}
      <div className="space-y-4 max-w-4xl">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`border rounded-xl p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 text-xs bg-card`}
          >
            <div className="flex gap-3">
              <ShieldAlert size={22} className={alert.level === 'CRITICAL' ? 'text-risk-critical mt-0.5 animate-pulse' : 'text-risk-high mt-0.5'} />
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-tight text-foreground">{alert.farmName}</span>
                  <span className={`px-2 py-0.2 rounded text-[8px] font-extrabold border ${getRiskBadgeStyles(alert.level)}`}>
                    {alert.level}
                  </span>
                  
                  {/* Status Indicator */}
                  <span className={`px-1.5 py-0.2 rounded-[4px] text-[8px] font-bold ${
                    alert.status === 'RESOLVED' 
                      ? 'bg-green-500/10 text-green-700 dark:text-green-400' 
                      : alert.status === 'INVESTIGATED'
                      ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
                      : 'bg-orange-500/10 text-orange-700 dark:text-orange-400 animate-pulse'
                  }`}>
                    {alert.status}
                  </span>
                </div>
                
                <p className="text-muted-foreground leading-relaxed text-[11px]">{alert.message}</p>
                
                <div className="flex gap-4 text-[10px] text-muted-foreground font-mono">
                  <span>Region: {alert.district}</span>
                  <span>Flagged: {new Date(alert.date).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="flex items-center gap-2 md:self-center shrink-0">
              {alert.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(alert.id, 'INVESTIGATED')}
                    className="px-2.5 py-1.5 rounded bg-secondary hover:bg-muted border border-border text-[10px] font-bold text-foreground transition-colors"
                  >
                    Mark Investigating
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(alert.id, 'RESOLVED')}
                    className="px-2.5 py-1.5 rounded bg-primary text-primary-foreground text-[10px] font-bold transition-colors hover:bg-primary/95"
                  >
                    Resolve Alert
                  </button>
                </>
              )}
              {alert.status === 'INVESTIGATED' && (
                <button
                  onClick={() => handleUpdateStatus(alert.id, 'RESOLVED')}
                  className="px-2.5 py-1.5 rounded bg-primary text-primary-foreground text-[10px] font-bold transition-colors hover:bg-primary/95"
                >
                  Resolve Alert
                </button>
              )}
              {alert.status === 'RESOLVED' && (
                <span className="text-[10px] text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                  <Check size={12} /> Resolved
                </span>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
