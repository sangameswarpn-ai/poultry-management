'use client';

import { useState, useEffect } from 'react';
import { HeartPulse, Plus, Minus, Check, ClipboardCheck, Mic, Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { mockFarms } from '@/mock-data';
import { useLanguage } from '@/components/language-provider';

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

  const { language } = useLanguage();
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceStep, setVoiceStep] = useState<number>(0);
  const [voiceMessage, setVoiceMessage] = useState('');
  const [listening, setListening] = useState(false);

  const speakText = (text: string, callback?: () => void) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'ta' ? 'ta-IN' : 'en-US';
      utterance.onend = () => {
        if (callback) callback();
      };
      window.speechSynthesis.speak(utterance);
    } else {
      if (callback) callback();
    }
  };

  const listenSpeech = (callback: (text: string) => void) => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'ta' ? 'ta-IN' : 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        
        recognition.onstart = () => {
          setListening(true);
        };
        
        recognition.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          callback(text);
        };
        
        recognition.onerror = (err: any) => {
          console.error("Speech recognition error:", err);
          setListening(false);
          setError(language === 'ta' ? 'குரல் அங்கீகாரம் தோல்வியடைந்தது. தெளிவாகப் பேசவும்.' : 'Speech recognition failed. Try speaking clearly.');
          setVoiceActive(false);
        };
        
        recognition.onend = () => {
          setListening(false);
        };
        
        recognition.start();
      } else {
        setError(language === 'ta' ? 'உங்கள் உலாவியில் குரல் அங்கீகாரம் ஆதரிக்கப்படவில்லை.' : 'Browser Speech Recognition not supported.');
        setVoiceActive(false);
      }
    }
  };

  const parseNumber = (text: string): number => {
    const cleaned = text.toLowerCase().trim();
    const wordsMap: Record<string, number> = {
      'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
      'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
      'பூஜ்ஜியம்': 0, 'ஒன்று': 1, 'இரண்டு': 2, 'மூன்று': 3, 'நான்கு': 4, 'ஐந்து': 5,
      'ஆறு': 6, 'ஏழு': 7, 'எட்டு': 8, 'ஒன்பது': 9, 'பத்து': 10
    };

    if (wordsMap[cleaned] !== undefined) {
      return wordsMap[cleaned];
    }
    const match = cleaned.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const startVoiceAssistant = () => {
    setError(null);
    setVoiceActive(true);
    setVoiceStep(1);
    
    const welcomeText = language === 'ta'
      ? 'குரல் உதவிக்கு வரவேற்கிறோம். இன்று பண்ணையில் எத்தனை இறப்புகள் ஏற்பட்டுள்ளன?'
      : 'Welcome to Voice Assistant. How many animal deaths occurred today?';
    
    setVoiceMessage(welcomeText);
    speakText(welcomeText, () => {
      listenSpeech((transcript) => {
        handleVoiceInput(1, transcript);
      });
    });
  };

  const handleVoiceInput = (stepNum: number, input: string) => {
    console.log(`Step ${stepNum} received input:`, input);
    
    if (stepNum === 1) {
      const val = parseNumber(input);
      setDeathsCount(val);
      setHealthyCount(totalAnimals - sickCount - val);

      setVoiceStep(2);
      const qText = language === 'ta'
        ? `பதிவு செய்யப்பட்டது. இன்று எத்தனை விலங்குகள் நோய்வாய்ப்பட்டுள்ளன?`
        : `Recorded ${val} deaths. How many sick animals did you observe today?`;
      
      setVoiceMessage(qText);
      speakText(qText, () => {
        listenSpeech((transcript) => {
          handleVoiceInput(2, transcript);
        });
      });
    } else if (stepNum === 2) {
      const val = parseNumber(input);
      setSickCount(val);
      setHealthyCount(totalAnimals - val - deathsCount);

      setVoiceStep(3);
      const qText = language === 'ta'
        ? `நோய்வாய்ப்பட்டவை பதிவு செய்யப்பட்டன. சளி, காய்ச்சல் அல்லது வயிற்றுப்போக்கு போன்ற அறிகுறிகள் ஏதேனும் உள்ளதா?`
        : `Recorded ${val} sick cases. Please list any observed symptoms like coughing, diarrhea, or fever.`;
      
      setVoiceMessage(qText);
      speakText(qText, () => {
        listenSpeech((transcript) => {
          handleVoiceInput(3, transcript);
        });
      });
    } else if (stepNum === 3) {
      const cleaned = input.toLowerCase();
      const matched: string[] = [];
      const currentSymptomsList = getSymptomsList();

      currentSymptomsList.forEach((sym) => {
        const key = sym.toLowerCase();
        if (cleaned.includes(key)) {
          matched.push(sym);
        }
      });

      if (language === 'ta') {
        if (cleaned.includes('சளி') || cleaned.includes('இருமல்')) matched.push('Cough');
        if (cleaned.includes('காய்ச்சல்')) matched.push('Fever');
        if (cleaned.includes('வயிற்றுப்போக்கு')) matched.push('Diarrhea');
      }

      setSymptoms(matched);
      
      const confirmText = language === 'ta'
        ? `அறிகுறிகள் பதிவு செய்யப்பட்டன. உங்கள் தினசரி சுகாதாரத் தகவல் சமர்ப்பிக்கத் தயாராக உள்ளது. தயவுசெய்து சமர்ப்பி பொத்தானை அழுத்தவும்.`
        : `Thank you. Symptoms recorded. Your daily health log is compiled and ready to submit. Please click the submit button.`;

      setVoiceMessage(confirmText);
      speakText(confirmText);
      setVoiceActive(false);
      setVoiceStep(0);
    }
  };

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
      const customFarmId = localStorage.getItem('sih_custom_farm_id');
      const customSpecies = localStorage.getItem('sih_selected_species');
      const targetFarmId = (customFarmId && customSpecies === selectedSpecies)
        ? customFarmId
        : activeFarm.id;

      const res = await fetch('/api/health-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmId: targetFarmId,
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

      {/* Voice Assistant Panel */}
      <div className="bg-card border border-border p-4 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary p-2.5 rounded-xl">
            <Mic size={20} className={listening ? 'animate-pulse text-red-500' : ''} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground">
              {language === 'ta' ? 'குரல் வழிகாட்டி உதவி' : 'Voice Assistant Logger'}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {language === 'ta' 
                ? 'உங்கள் குரல் மூலம் நேரடியாக தகவல்களைப் பதிவு செய்ய மைக் ஐகானை அழுத்தவும்.' 
                : 'Speak to answer simple questions and auto-populate this log form.'}
            </p>
          </div>
        </div>
        
        <button
          type="button"
          onClick={startVoiceAssistant}
          disabled={voiceActive || listening}
          className="bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/95 transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50 shrink-0"
        >
          <Sparkles size={14} className="animate-spin" />
          {language === 'ta' ? 'பேசத் தொடங்கு' : 'Start Talking'}
        </button>
      </div>

      {voiceActive && (
        <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-primary">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            {listening ? (language === 'ta' ? 'மைக் ஆன் செய்யப்பட்டுள்ளது - பேசவும்...' : 'Microphone Listening...') : (language === 'ta' ? 'உதவியாளர் பேசுகிறார்...' : 'Assistant Speaking...')}
          </div>
          <p className="text-xs font-semibold text-foreground leading-relaxed">
            {voiceMessage}
          </p>
        </div>
      )}
      
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
