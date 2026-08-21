'use client';

import { useState } from 'react';
import { Settings, ShieldAlert, Check, Save } from 'lucide-react';

export default function OfficerSettingsPage() {
  const [district, setDistrict] = useState('Namakkal');
  const [minAlertRisk, setMinAlertRisk] = useState('MEDIUM');
  const [smsNotification, setSmsNotification] = useState(true);
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
        <h2 className="text-xl font-bold tracking-tight">Officer Preferences</h2>
        <p className="text-xs text-muted-foreground">Manage your jurisdiction territory and SMS alert routing triggers</p>
      </div>

      {saved && (
        <p className="text-xs text-green-600 dark:text-green-400 font-bold bg-green-500/10 p-3 rounded-lg border border-green-500/20 flex items-center gap-2">
          <Check size={14} /> Regional parameters updated in local officer profile cache.
        </p>
      )}

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-6 text-xs">
        
        {/* Territory Profile */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-foreground">Jurisdiction Configuration</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-muted-foreground font-semibold block mb-1">Active District</label>
              <select
                value={district}
                onChange={e => setDistrict(e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-xs"
              >
                <option value="Namakkal">Namakkal District</option>
                <option value="Coimbatore">Coimbatore District</option>
                <option value="Salem">Salem District</option>
                <option value="Vellore">Vellore District</option>
              </select>
            </div>
            
            <div>
              <label className="text-muted-foreground font-semibold block mb-1">State Jurisdiction</label>
              <input
                type="text"
                disabled
                value="Tamil Nadu"
                className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Alert Dispatch parameters */}
        <div className="border-t border-border pt-6 space-y-4">
          <h3 className="font-bold text-sm text-foreground">Risk Engine Alerts Routing</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-muted-foreground font-semibold block mb-1">Alert Threshold</label>
              <select
                value={minAlertRisk}
                onChange={e => setMinAlertRisk(e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-xs"
              >
                <option value="LOW">Low (Log all parameters)</option>
                <option value="MEDIUM">Medium (Recommended)</option>
                <option value="HIGH">High (Anomalies only)</option>
                <option value="CRITICAL">Critical (Immediate Outbreaks)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 mt-5">
              <input
                type="checkbox"
                id="sms"
                checked={smsNotification}
                onChange={e => setSmsNotification(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <label htmlFor="sms" className="font-bold text-foreground cursor-pointer">
                Route Critical Alerts directly to SMS & WhatsApp
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-3 rounded-xl text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <Save size={16} />
          Save Jurisdiction Rules
        </button>

      </form>

    </div>
  );
}
