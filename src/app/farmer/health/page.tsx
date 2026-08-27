'use client';

import { useState, useEffect } from 'react';
import { HeartPulse, Plus, Minus, Check, ClipboardCheck } from 'lucide-react';
import { mockFarms } from '@/mock-data';

export default function FlockHealthPage() {
  const [selectedSpecies, setSelectedSpecies] = useState<'POULTRY' | 'CATTLE' | 'GOAT' | 'PIG'>('POULTRY');

  const activeFarm = selectedSpecies === 'CATTLE'
    ? (mockFarms.find(f => f.id === 'frm-7') || mockFarms[0])
    : selectedSpecies === 'GOAT'
    ? (mockFarms.find(f => f.id === 'frm-13') || mockFarms[0])
    : selectedSpecies === 'PIG'
    ? (mockFarms.find(f => f.id === 'frm-16') || mockFarms[0])
    : mockFarms[0];
  
  const [totalAnimals, setTotalAnimals] = useState(activeFarm.totalAnimals);
  const [healthyCount, setHealthyCount] = useState(activeFarm.healthyCount);
  const [sickCount, setSickCount] = useState(activeFarm.sickCount);
  const [deathsCount, setDeathsCount] = useState(activeFarm.mortalityCount);
  
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [riskResult, setRiskResult] = useState<{ recordId: string; riskIndex: number; riskLevel: string; mode: string } | null>(null);

  useEffect(() => {
    setTotalAnimals(activeFarm.totalAnimals);
    setHealthyCount(activeFarm.healthyCount);
    setSickCount(activeFarm.sickCount);
    setDeathsCount(activeFarm.mortalityCount);
    setSymptoms([]);
    setNotes('');
  }, [selectedSpecies, activeFarm]);

  const toggleSymptom = (symptom: string) => {
    setSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleUpdate = (type: 'sick' | 'death', action: 'add' | 'sub') => {
    if (type === 'sick') {
      setSickCount(prev => {
        const val = action === 'add' ? prev + 1 : prev - 1;
        const newSick = Math.max(0, val);
        // Automatically adjust healthy count based on changes
        setHealthyCount(totalAnimals - newSick - deathsCount);
        return newSick;
      });
    } else {
      setDeathsCount(prev => {
        const val = action === 'add' ? prev + 1 : prev - 1;
        const newDeaths = Math.max(0, val);
        // Automatically adjust healthy count based on changes
        setHealthyCount(totalAnimals - sickCount - newDeaths);
        return newDeaths;
      });
    }
  };

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'total' | 'sick' | 'deaths') => {
    const val = parseInt(e.target.value) || 0;
    if (type === 'total') {
      setTotalAnimals(val);
      setHealthyCount(val - sickCount - deathsCount);
    } else if (type === 'sick') {
      setSickCount(val);
      setHealthyCount(totalAnimals - val - deathsCount);
    } else if (type === 'deaths') {
      setDeathsCount(val);
      setHealthyCount(totalAnimals - sickCount - val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setRiskResult(null);

    try {
      const res = await fetch('/api/health-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmId: activeFarm.id,
          totalAnimals,
          healthyCount,
          sickCount,
          mortalityCount: deathsCount,
          symptoms,
          notes,
          species: selectedSpecies
        })
      });

      if (!res.ok) throw new Error('Failed to record daily health logs');
      const data = await res.json();
      setRiskResult(data);
      setSubmitted(true);
      
      // Clear symptoms and notes on success
      setSymptoms([]);
      setNotes('');
      
      setTimeout(() => {
        setSubmitted(false);
      }, 7000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Server connection issue');
    } finally {
      setSubmitting(false);
    }
  };

  const getSymptomsList = () => {
    switch (selectedSpecies) {
      case 'CATTLE':
        return ["Mouth lesions", "Excessive salivation", "Milk yield drop", "Lameness", "Bloating", "High fever"];
      case 'GOAT':
        return ["Skin lesions", "Cough", "Respiratory discharge", "Diarrhea", "Weight loss"];
      case 'PIG':
        return ["Skin blotches", "High fever", "Lethargy", "Breathing difficulty", "Diarrhea"];
      default:
        return ["Cough", "Fever", "Diarrhea", "Breathing difficulty", "Loss of appetite", "Sudden death"];
    }
  };
  const symptomsList = getSymptomsList();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* Title */}
      <div className="border-b border-border pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Record Daily {selectedSpecies === 'POULTRY' ? 'Flock' : selectedSpecies === 'CATTLE' ? 'Cattle' : selectedSpecies === 'GOAT' ? 'Goat' : 'Swine'} Health & Mortality
          </h2>
          <p className="text-xs text-muted-foreground">Log mortality anomalies and clinical symptoms for the Risk Engine</p>
        </div>
        
        {/* Category Switcher Tabs */}
        <div className="grid grid-cols-4 gap-1.5 border border-border bg-card p-1 rounded-xl shrink-0 self-start">
          {(['POULTRY', 'CATTLE', 'GOAT', 'PIG'] as const).map((sp) => {
            const isActive = selectedSpecies === sp;
            const getSpeciesInfo = (s: string) => {
              switch (s) {
                case 'CATTLE': return { label: 'Cows', icon: '🐄' };
                case 'GOAT': return { label: 'Goats', icon: '🐐' };
                case 'PIG': return { label: 'Pigs', icon: '🐖' };
                default: return { label: 'Birds', icon: '🐓' };
              }
            };
            const info = getSpeciesInfo(sp);
            return (
              <button
                key={sp}
                type="button"
                onClick={() => setSelectedSpecies(sp)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                }`}
              >
                <span>{info.icon}</span>
                <span>{info.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {submitted && riskResult && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 p-4 rounded-xl flex items-center gap-3 text-xs">
          <Check size={18} className="shrink-0 animate-bounce" />
          <div>
            <p className="font-bold">Health Log Saved! ({riskResult.mode === 'database' ? 'Live DB' : 'Standalone Mode'})</p>
            <p className="mt-0.5">
              Record ID: <span className="font-mono font-bold text-foreground">{riskResult.recordId}</span>. 
              Calculated Outbreak Risk Level: <span className="font-bold text-risk-critical">{riskResult.riskLevel}</span> (Risk Index: {riskResult.riskIndex}/100).
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 p-4 rounded-xl text-xs">
          <p className="font-bold">Error Dispatching Health Telemetry</p>
          <p className="mt-0.5 leading-relaxed">{error}</p>
        </div>
      )}

      {/* Main Health Form */}
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-6">
        
        {/* Counter Display for Deaths */}
        <div className="grid gap-6 sm:grid-cols-2">
          
          {/* Deaths Counter Widget */}
          <div className="border border-border rounded-xl p-5 bg-secondary/30 flex flex-col items-center justify-between text-center">
            <span className="text-xs font-bold text-muted-foreground">
              {selectedSpecies === 'POULTRY' ? 'Deaths Today' : selectedSpecies === 'CATTLE' ? 'Cattle Deaths Today' : selectedSpecies === 'GOAT' ? 'Goat Deaths Today' : 'Pig Deaths Today'}
            </span>
            
            <div className="my-4 flex items-center gap-6">
              <button
                type="button"
                onClick={() => handleUpdate('death', 'sub')}
                className="w-10 h-10 rounded-full border border-border hover:border-primary flex items-center justify-center bg-card text-foreground hover:text-primary transition-colors"
                title="Decrease"
              >
                <Minus size={18} />
              </button>
              
              <span className="text-4xl font-extrabold text-foreground w-12">{deathsCount}</span>
              
              <button
                type="button"
                onClick={() => handleUpdate('death', 'add')}
                className="w-10 h-10 rounded-full border border-border hover:border-primary flex items-center justify-center bg-card text-foreground hover:text-primary transition-colors"
                title="Increase"
              >
                <Plus size={18} />
              </button>
            </div>
            
            <span className="text-[10px] text-muted-foreground font-medium">Use taps to adjust count</span>
          </div>

          {/* Sickness Counter Widget */}
          <div className="border border-border rounded-xl p-5 bg-secondary/30 flex flex-col items-center justify-between text-center">
            <span className="text-xs font-bold text-muted-foreground">
              {selectedSpecies === 'POULTRY' ? 'Sick Birds Today' : selectedSpecies === 'CATTLE' ? 'Sick Cows Today' : selectedSpecies === 'GOAT' ? 'Sick Goats Today' : 'Sick Pigs Today'}
            </span>
            
            <div className="my-4 flex items-center gap-6">
              <button
                type="button"
                onClick={() => handleUpdate('sick', 'sub')}
                className="w-10 h-10 rounded-full border border-border hover:border-primary flex items-center justify-center bg-card text-foreground hover:text-primary transition-colors"
                title="Decrease"
              >
                <Minus size={18} />
              </button>
              
              <span className="text-4xl font-extrabold text-foreground w-12">{sickCount}</span>
              
              <button
                type="button"
                onClick={() => handleUpdate('sick', 'add')}
                className="w-10 h-10 rounded-full border border-border hover:border-primary flex items-center justify-center bg-card text-foreground hover:text-primary transition-colors"
                title="Increase"
              >
                <Plus size={18} />
              </button>
            </div>
            
            <span className="text-[10px] text-muted-foreground font-medium">Use taps to adjust count</span>
          </div>

        </div>

        {/* Technical Form fields */}
        <div className="grid gap-4 sm:grid-cols-3 border-t border-border pt-6">
          <div>
            <label className="text-xs font-bold text-muted-foreground block mb-1">
              {selectedSpecies === 'POULTRY' ? 'Total Birds' : selectedSpecies === 'CATTLE' ? 'Total Cows' : selectedSpecies === 'GOAT' ? 'Total Goats' : 'Total Pigs'}
            </label>
            <input
              type="number"
              value={totalAnimals}
              onChange={(e) => handleManualChange(e, 'total')}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground block mb-1">Sick Count</label>
            <input
              type="number"
              value={sickCount}
              onChange={(e) => handleManualChange(e, 'sick')}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground block mb-1">Healthy Count</label>
            <input
              type="number"
              disabled
              value={healthyCount}
              className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground focus:outline-none"
            />
          </div>
        </div>

        {/* Symptoms checklist */}
        <div className="border-t border-border pt-6">
          <label className="text-xs font-bold text-muted-foreground block mb-3">Observable Symptoms</label>
          <div className="grid gap-2 grid-cols-2 sm:grid-cols-3">
            {symptomsList.map((sym) => (
              <button
                type="button"
                key={sym}
                onClick={() => toggleSymptom(sym)}
                className={`p-2.5 border rounded-lg text-[11px] font-bold text-left transition-colors cursor-pointer flex items-center justify-between ${
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

        {/* Additional Observations */}
        <div className="border-t border-border pt-6 text-xs">
          <label className="text-xs font-bold text-muted-foreground block mb-2">Additional Observations / Clinical Notes</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe flock feeding levels, water consumption anomalies, comb or feather discoloration..."
            className="w-full bg-secondary border border-border rounded-lg p-3 focus:outline-none focus:border-primary text-xs leading-relaxed"
          ></textarea>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-3 rounded-xl text-sm transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></span>
              Dispatching Daily Logs...
            </>
          ) : (
            'Submit Daily Telemetry'
          )}
        </button>

      </form>

    </div>
  );
}
