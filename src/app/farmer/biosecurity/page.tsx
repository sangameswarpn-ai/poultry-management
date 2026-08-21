'use client';

import { useState } from 'react';
import { ClipboardCheck, Sparkles, AlertCircle, Camera, Check } from 'lucide-react';

export default function BiosecurityChecklistPage() {
  const [checklist, setChecklist] = useState({
    disinfection: false,
    footbath: false,
    quarantine: false,
    ppe: false,
    otherChecks: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [photoProof, setPhotoProof] = useState<string | null>(null);

  // Compute compliance rate dynamically (20% per item)
  const totalChecked = Object.values(checklist).filter(Boolean).length;
  const complianceScore = totalChecked * 20;

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePhotoUpload = () => {
    // Mock photo upload
    setPhotoProof('/images/mock-disinfection-uploaded.jpg');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* Title */}
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight">Daily Biosecurity Logging</h2>
        <p className="text-xs text-muted-foreground">Maintain daily compliance standards to minimize regional transmission score</p>
      </div>

      {submitted && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 p-4 rounded-xl flex items-center gap-3 text-xs">
          <Check size={18} className="shrink-0" />
          <div>
            <p className="font-bold">Checklist Submitted Successfully!</p>
            <p className="mt-0.5">Biosecurity Score updated to {complianceScore}% on the central dashboard database.</p>
          </div>
        </div>
      )}

      {/* Main Checklist Card */}
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-6">
        
        {/* Compliance Meter */}
        <div className="bg-secondary p-4 rounded-xl flex items-center justify-between border border-border">
          <div className="flex items-center gap-2">
            <ClipboardCheck size={20} className="text-primary" />
            <div>
              <p className="text-xs font-bold">Calculated Compliance</p>
              <p className="text-[10px] text-muted-foreground">Calculated dynamically</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-extrabold ${complianceScore >= 80 ? 'text-risk-low' : complianceScore >= 40 ? 'text-risk-medium' : 'text-risk-critical'}`}>
              {complianceScore}%
            </span>
          </div>
        </div>

        {/* Checks Checklist */}
        <div className="space-y-4">
          {[
            { key: 'disinfection', label: 'Disinfection of incoming vehicles', desc: 'Used sprayers to clean tires, undercarriage, and wheel arches of all incoming vehicles.' },
            { key: 'footbath', label: 'Renewed footbath chemicals', desc: 'Placed fresh virucidal solution in entry trays at the gate and individual house doors.' },
            { key: 'quarantine', label: 'Active quarantine checking', desc: 'Ensured recently introduced birds are isolated from the main egg-laying houses.' },
            { key: 'ppe', label: 'Use of personal protective wear', desc: 'Staff wore farm-specific boots, fresh gloves, and sanitized aprons in active houses.' },
            { key: 'otherChecks', label: 'Rodent & wild bird exclusions checked', desc: 'Inspected feed silos and netting mesh for holes. No wild birds present in shelter.' }
          ].map((item) => (
            <button
              type="button"
              key={item.key}
              onClick={() => toggleCheck(item.key as keyof typeof checklist)}
              className={`w-full flex items-start gap-4 p-4 border rounded-xl text-left transition-colors cursor-pointer ${
                checklist[item.key as keyof typeof checklist]
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-secondary/40'
              }`}
            >
              <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                checklist[item.key as keyof typeof checklist]
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-border bg-card'
              }`}>
                {checklist[item.key as keyof typeof checklist] && <Check size={14} />}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-foreground">{item.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Photo Upload Simulation */}
        <div className="border-t border-border pt-6">
          <p className="text-xs font-bold mb-3">Attach Photo Proof (Required for 100% compliance audit)</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handlePhotoUpload}
              className="flex items-center gap-2 border border-dashed border-border hover:border-primary p-3 rounded-lg text-xs font-semibold hover:bg-secondary/40 transition-colors"
            >
              <Camera size={16} />
              Take/Upload Photo
            </button>
            {photoProof ? (
              <span className="text-[10px] text-green-600 dark:text-green-400 font-semibold">
                ✓ Photo-proof_disinfection.jpg uploaded
              </span>
            ) : (
              <span className="text-[10px] text-muted-foreground">
                No image attached (optional for quick-logs)
              </span>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-3 rounded-xl text-sm transition-colors shadow-sm"
        >
          Submit Daily Verification
        </button>

      </form>

    </div>
  );
}
