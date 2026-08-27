'use client';

import { useState } from 'react';
import { FileText, Check, AlertCircle, Camera, Mic, Volume2, Sparkles } from 'lucide-react';
import { mockDiseaseReports } from '@/mock-data';

export default function ReportDiseasePage() {
  const [reports, setReports] = useState(mockDiseaseReports);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [photoProof, setPhotoProof] = useState(false);
  const [voiceProof, setVoiceProof] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleSymptom = (sym: string) => {
    setSymptoms(prev =>
      prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport = {
      id: `rep-${Date.now()}`,
      farmId: "frm-1",
      farmName: "Sri Murugan Layer Farm",
      reportedBy: "Ramesh Kumar",
      symptoms,
      notes,
      status: 'SUBMITTED' as const,
      date: new Date().toISOString(),
      species: 'POULTRY' as const
    };

    setReports([newReport, ...reports]);
    setSymptoms([]);
    setNotes('');
    setPhotoProof(false);
    setVoiceProof(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const getDiagnosis = () => {
    if (symptoms.length === 0) return null;
    
    let scores = [
      { 
        disease: "Highly Pathogenic Avian Influenza (Bird Flu)", 
        matchCount: 0,
        symptoms: ["Sudden death", "Breathing difficulty", "Fever", "Loss of appetite"],
        action: "CRITICAL: Immediately isolate the flock. No personnel entry. Trigger alert to Veterinary Board for emergency vaccination and depopulation."
      },
      { 
        disease: "Newcastle Disease (Ranikhet Disease)", 
        matchCount: 0,
        symptoms: ["Breathing difficulty", "Cough", "Diarrhea", "Loss of appetite"],
        action: "HIGH: Quarantine infected pen. Administer supportive vitamins. Restrict farm gate traffic immediately."
      },
      { 
        disease: "Avian Coccidiosis", 
        matchCount: 0,
        symptoms: ["Diarrhea", "Fever", "Loss of appetite"],
        action: "MEDIUM: Check feed/litter moisture. Administer anticoccidials in water supply. Disinfect house gates."
      },
      { 
        disease: "Infectious Bronchitis (IB)", 
        matchCount: 0,
        symptoms: ["Cough", "Breathing difficulty", "Loss of appetite"],
        action: "MEDIUM: Improve ventilation. Spray virucidal disinfectant aerosols. Notify veterinary doctor."
      }
    ];

    const mapped = scores.map(s => {
      const match = s.symptoms.filter(sym => symptoms.includes(sym)).length;
      return {
        ...s,
        matchCount: match,
        percentage: Math.round((match / s.symptoms.length) * 100)
      };
    });

    mapped.sort((a, b) => b.percentage - a.percentage);
    return mapped.filter(s => s.matchCount > 0);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RESOLVED': return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
      case 'INVESTIGATION': return 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20';
      case 'UNDER_REVIEW': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
      default: return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
    }
  };

  const symptomsList = [
    "Sudden death", "Breathing difficulty", "Fever", "Diarrhea", "Cough", "Loss of appetite"
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight">Report Suspected Outbreak</h2>
        <p className="text-xs text-muted-foreground">Directly alert District Veterinary Officers of clinical symptoms for rapid action</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Reporting Form */}
        <div className="bg-card border border-border rounded-xl p-5 md:col-span-2 space-y-4">
          <h3 className="font-bold text-sm flex items-center gap-1.5 text-foreground">
            <FileText size={16} className="text-primary" />
            File Suspected Outbreak Report
          </h3>

          {submitted && (
            <p className="text-xs text-green-600 dark:text-green-400 font-bold bg-green-500/10 p-3 rounded-lg border border-green-500/20 flex items-center gap-2">
              <Check size={14} /> Report dispatched. District Vet Officer notified via SMS system.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            
            {/* Symptoms checks */}
            <div>
              <label className="text-muted-foreground font-semibold block mb-2">Select Symptoms Noticed</label>
              <div className="grid gap-2 grid-cols-2 sm:grid-cols-3">
                {symptomsList.map((sym) => (
                  <button
                    type="button"
                    key={sym}
                    onClick={() => toggleSymptom(sym)}
                    className={`p-2.5 border rounded-lg text-left transition-colors cursor-pointer flex items-center justify-between font-bold ${
                      symptoms.includes(sym)
                        ? 'border-primary bg-primary/5 text-foreground'
                        : 'border-border bg-card text-muted-foreground hover:bg-secondary/40'
                    }`}
                  >
                    {sym}
                    {symptoms.includes(sym) && <Check size={12} className="text-primary" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="text-muted-foreground font-semibold block mb-1">Additional Observations / Notes</label>
              <textarea
                required
                rows={4}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="E.g., Comb discoloration noticed in flock house B. Water consumption down by 40%..."
                className="w-full bg-secondary border border-border rounded-lg p-3 focus:outline-none focus:border-primary text-xs leading-relaxed"
              ></textarea>
            </div>

            {/* Media Upload (Photo & Audio) */}
            <div className="grid gap-4 sm:grid-cols-2 border-t border-border pt-4">
              <div>
                <label className="text-muted-foreground font-semibold block mb-2">Photo Upload</label>
                <button
                  type="button"
                  onClick={() => setPhotoProof(true)}
                  className="flex w-full items-center justify-center gap-2 border border-dashed border-border hover:border-primary p-3 rounded-lg font-semibold hover:bg-secondary/40 transition-colors"
                >
                  <Camera size={14} />
                  {photoProof ? '✓ symptom_image.jpg attached' : 'Capture Symptom'}
                </button>
              </div>

              <div>
                <label className="text-muted-foreground font-semibold block mb-2">Voice Description (Accessibility-ready)</label>
                <button
                  type="button"
                  onClick={() => setVoiceProof(true)}
                  className="flex w-full items-center justify-center gap-2 border border-dashed border-border hover:border-primary p-3 rounded-lg font-semibold hover:bg-secondary/40 transition-colors"
                >
                  <Mic size={14} />
                  {voiceProof ? '✓ voice_record.wav saved' : 'Record Audio notes'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-3 rounded-xl transition-colors text-sm shadow-sm"
            >
              Dispatch Outbreak Alert
            </button>
          </form>
        </div>

        {/* Right Column: AI Diagnostic Panel & History Queue */}
        <div className="space-y-6">
          
          {/* AI Diagnostic Panel */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4 colorful-card-accent">
            <h3 className="font-bold text-sm flex items-center gap-1.5 text-foreground">
              <Sparkles size={16} className="text-accent animate-pulse" />
              Symptom Diagnostic Analyzer
            </h3>

            {symptoms.length === 0 ? (
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Select clinical symptoms on the left. The local diagnostic engine will calculate match confidence for common infectious outbreaks.
              </p>
            ) : (
              <div className="space-y-4">
                {getDiagnosis()?.map((diag, index) => (
                  <div key={index} className="border border-border/80 p-3 rounded-lg bg-secondary/20 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground text-[11px] truncate max-w-[150px]">{diag.disease}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${diag.percentage >= 70 ? 'bg-risk-critical/10 text-risk-critical' : diag.percentage >= 40 ? 'bg-risk-medium/10 text-risk-medium' : 'bg-risk-low/10 text-risk-low'}`}>
                        {diag.percentage}% Match
                      </span>
                    </div>
                    <div className="w-full bg-border/40 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${diag.percentage >= 70 ? 'bg-risk-critical' : diag.percentage >= 40 ? 'bg-risk-medium' : 'bg-risk-low'}`} 
                        style={{ width: `${diag.percentage}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-muted-foreground leading-relaxed mt-1 font-mono">
                      <span className="font-bold text-foreground block">Containment:</span>
                      {diag.action}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dispatched Report Queue */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="font-bold text-sm">Dispatched Report Queue</h3>

            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
              {reports.map((rep) => (
                <div key={rep.id} className="border border-border p-3 rounded-lg space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {new Date(rep.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getStatusBadge(rep.status)}`}>
                      {rep.status}
                    </span>
                  </div>
                  
                  <p className="font-bold text-foreground truncate">
                    Symptoms: {rep.symptoms.join(', ') || 'General Lapses'}
                  </p>
                  
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-mono truncate">
                    {rep.notes}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
