'use client';

import { useState } from 'react';
import { Settings, Save, Check } from 'lucide-react';

export default function AdminSettingsPage() {
  const [quarantineRadius, setQuarantineRadius] = useState(10);
  const [autoSmsAlerts, setAutoSmsAlerts] = useState(true);
  const [auditFrequencyDays, setAuditFrequencyDays] = useState(7);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* Title */}
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight">Admin System Preferences</h2>
        <p className="text-xs text-muted-foreground">Configure state-wide quarantine radius parameters and default audit cadences</p>
      </div>

      {saved && (
        <p className="text-xs text-green-600 dark:text-green-400 font-bold bg-green-500/10 p-3 rounded-lg border border-green-500/20 flex items-center gap-2">
          <Check size={14} /> System preferences saved and applied to the regional risk engine nodes.
        </p>
      )}

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-6 text-xs">
        
        {/* Epidemic parameters */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-foreground">Epidemic Containment Parameters</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-muted-foreground font-semibold block mb-1">Standard Quarantine Radius (km)</label>
              <input
                type="number"
                value={quarantineRadius}
                onChange={e => setQuarantineRadius(parseInt(e.target.value) || 0)}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-xs"
              />
            </div>
            
            <div>
              <label className="text-muted-foreground font-semibold block mb-1">Mandatory Audit Recurrence (days)</label>
              <input
                type="number"
                value={auditFrequencyDays}
                onChange={e => setAuditFrequencyDays(parseInt(e.target.value) || 0)}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-xs"
              />
            </div>
          </div>
        </div>

        {/* Global Dispatch triggers */}
        <div className="border-t border-border pt-6 space-y-4">
          <h3 className="font-bold text-sm text-foreground">Global Dispatch Control</h3>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="auto-sms"
              checked={autoSmsAlerts}
              onChange={e => setAutoSmsAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary"
            />
            <label htmlFor="auto-sms" className="font-bold text-foreground cursor-pointer">
              Automatically broadcast SMS alerts to all farmers inside a 10km radius of any confirmed outbreak
            </label>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-3 rounded-xl text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <Save size={16} />
          Save System Rules
        </button>

      </form>

    </div>
  );
}
