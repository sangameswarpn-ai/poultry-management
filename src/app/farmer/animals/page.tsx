'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  HeartPulse, 
  ShieldAlert, 
  Users, 
  FileText, 
  ClipboardCheck, 
  Activity,
  AlertCircle
} from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useLanguage } from '@/components/language-provider';

interface FarmData {
  id: string;
  name: string;
  farmerName: string;
  farmerPhone: string;
  lat: number;
  lng: number;
  address: string;
  district: string;
  state: string;
  biosecurityScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  totalAnimals: number;
  healthyCount: number;
  sickCount: number;
  mortalityCount: number;
}

export default function LivestockDashboard() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [selectedSpecies, setSelectedSpecies] = useState<'CATTLE' | 'GOAT' | 'PIG'>('CATTLE');
  const [farm, setFarm] = useState<FarmData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [advisory, setAdvisory] = useState<{ title: string; message: string; severity: string; date: string } | null>(null);

  const speciesFarms = {
    CATTLE: 'frm-7',
    GOAT: 'frm-13',
    PIG: 'frm-16'
  };

  useEffect(() => {
    const saved = localStorage.getItem('sih_emergency_advisory');
    if (saved) {
      try {
        setAdvisory(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing local advisory:', e);
      }
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const farmId = speciesFarms[selectedSpecies];
    fetch(`/api/farms/${farmId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load farm details');
        return res.json();
      })
      .then(data => {
        setFarm(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [selectedSpecies]);

  const getRiskBadgeStyles = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-risk-critical text-white border-risk-critical';
      case 'HIGH': return 'bg-risk-high text-white border-risk-high';
      case 'MEDIUM': return 'bg-risk-medium text-foreground border-risk-medium';
      default: return 'bg-risk-low text-white border-risk-low';
    }
  };

  const getSpeciesLabels = () => {
    const isTa = language === 'ta';
    switch (selectedSpecies) {
      case 'CATTLE':
        return {
          metrics: isTa ? "தினசரி கால்நடை அளவீடுகள் (மாடுகள்)" : "Daily Cattle Metrics",
          size: isTa ? "மொத்த மாடுகள்" : "Total Herd Size",
          sick: isTa ? "இன்றைய நோய்வாய்ப்பட்டவை" : "Sick Cows Today",
          deaths: isTa ? "இன்றைய இறப்புகள்" : "Cattle Deaths Today",
          curveTitle: isTa ? "கால்நடை இறப்பு மற்றும் நோய் வளைவு" : "Cattle Mortality & Sickness Curve"
        };
      case 'GOAT':
        return {
          metrics: isTa ? "தினசரி ஆடு அளவீடுகள்" : "Daily Goat Metrics",
          size: isTa ? "மொத்த ஆடுகள்" : "Total Herd Size",
          sick: isTa ? "இன்றைய நோய்வாய்ப்பட்டவை" : "Sick Goats Today",
          deaths: isTa ? "இன்றைய இறப்புகள்" : "Goat Deaths Today",
          curveTitle: isTa ? "ஆடு இறப்பு மற்றும் நோய் வளைவு" : "Goat Mortality & Sickness Curve"
        };
      default:
        return {
          metrics: isTa ? "தினசரி பன்றி அளவீடுகள்" : "Daily Pig Metrics",
          size: isTa ? "மொத்த பன்றிகள்" : "Total Swine Size",
          sick: isTa ? "இன்றைய நோய்வாய்ப்பட்டவை" : "Sick Pigs Today",
          deaths: isTa ? "இன்றைய இறப்புகள்" : "Pig Deaths Today",
          curveTitle: isTa ? "பன்றி இறப்பு மற்றும் நோய் வளைவு" : "Swine Mortality & Sickness Curve"
        };
    }
  };

  const speciesLabels = getSpeciesLabels();

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'CRITICAL': return t.critical;
      case 'HIGH': return t.high;
      case 'MEDIUM': return t.medium;
      default: return t.low;
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-xs text-muted-foreground animate-pulse">
        Querying database for livestock farm records...
      </div>
    );
  }

  if (error || !farm) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl text-xs max-w-md mx-auto">
        <p className="font-bold flex items-center gap-1.5"><AlertCircle size={14} /> Database Connection Failure</p>
        <p className="mt-1 text-[11px] leading-relaxed">Could not establish contact with route for species. Details: {error || 'Record empty'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Broadcast Advisory Marquee Bar */}
      {advisory && (
        <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold gap-4 overflow-hidden relative shadow-sm ${
          advisory.severity === 'CRITICAL' 
            ? 'bg-risk-critical/15 text-risk-critical border-risk-critical/30' 
            : advisory.severity === 'HIGH'
            ? 'bg-risk-high/15 text-risk-high border-risk-high/30'
            : 'bg-risk-low/15 text-risk-low border-risk-low/30'
        }`}>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`animate-ping w-2 h-2 rounded-full ${
              advisory.severity === 'CRITICAL' ? 'bg-risk-critical' : advisory.severity === 'HIGH' ? 'bg-risk-high' : 'bg-risk-low'
            }`}></span>
            <span className="uppercase tracking-wider font-extrabold text-[10px] bg-card border border-current px-2 py-0.5 rounded">
              {advisory.title || 'Emergency Advisory'}
            </span>
          </div>
          
          {/* Marquee Text */}
          <div className="flex-1 overflow-hidden relative h-5">
            <div className="animate-marquee whitespace-nowrap absolute font-semibold text-[11px] mt-0.5 text-foreground">
              {advisory.message} — Published on {advisory.date}
            </div>
          </div>

          <button 
            type="button"
            onClick={() => {
              localStorage.removeItem('sih_emergency_advisory');
              setAdvisory(null);
            }}
            className="text-muted-foreground hover:text-foreground hover:scale-110 transition-transform text-[10px] font-bold border border-border bg-card px-2 py-0.5 rounded shrink-0 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}
      
      {/* Welcome Banner */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border pb-4 bg-gradient-to-r from-emerald-500/10 to-amber-500/5 p-4 rounded-xl border">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{language === 'ta' ? 'வணக்கம்' : 'Vanakkam'}, {farm.farmerName}! 👋</h2>
          <p className="text-xs text-muted-foreground">
            {language === 'ta' ? 'கண்காணிப்பு சுயவிவரம்:' : 'Monitoring profile for'} <span className="font-bold text-primary">{farm.name}</span> (ID: {farm.id})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-semibold">{t.districtGrid}:</span>
          <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-lg border border-primary shadow-sm shadow-primary/20">
            {farm.district}, {farm.state}
          </span>
        </div>
      </div>

      {/* Dynamic Livestock Species Switcher */}
      <div className="grid grid-cols-3 gap-3 select-none">
        {(['CATTLE', 'GOAT', 'PIG'] as const).map((sp) => {
          const isActive = selectedSpecies === sp;
          const getSpeciesInfo = (s: string) => {
            const isTa = language === 'ta';
            switch (s) {
              case 'CATTLE': return { label: isTa ? 'மாடு / கால்நடை' : 'Cows / Cattle', icon: '🐄', color: 'border-emerald-500 text-emerald-500 bg-emerald-500/5' };
              case 'GOAT': return { label: isTa ? 'ஆடு' : 'Goats', icon: '🐐', color: 'border-emerald-500 text-emerald-500 bg-emerald-500/5' };
              default: return { label: isTa ? 'பன்றி' : 'Pigs', icon: '🐖', color: 'border-emerald-500 text-emerald-500 bg-emerald-500/5' };
            }
          };
          const info = getSpeciesInfo(sp);
          return (
            <button
              key={sp}
              type="button"
              onClick={() => setSelectedSpecies(sp)}
              className={`p-3 rounded-xl border-2 text-xs font-bold text-center flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm active:scale-95 ${
                isActive 
                  ? `${info.color} border-primary text-primary` 
                  : 'border-border bg-card text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
              }`}
            >
              <span className="text-base">{info.icon}</span>
              <span className="truncate">{info.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid: Health Status & Risk Card */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Risk Assessment Card */}
        <div className="bg-card border border-border rounded-xl p-5 md:col-span-2 flex flex-col justify-between colorful-card-primary relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground">{t.farmRiskLevel}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${getRiskBadgeStyles(farm.riskLevel)}`}>
              {getRiskLabel(farm.riskLevel)}
            </span>
          </div>

          <div className="my-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-foreground">
              {farm.riskLevel === 'CRITICAL' ? 95 : farm.riskLevel === 'HIGH' ? 74 : farm.riskLevel === 'MEDIUM' ? 45 : 12}
            </span>
            <span className="text-xs text-muted-foreground">/ 100 {t.riskIndex}</span>
          </div>

          <div className="space-y-2 border-t border-border pt-4">
            <p className="text-xs font-bold text-foreground">{t.scoringFactors}:</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
              <li>{language === 'ta' ? 'விதிமுறைகளுக்குள் குறைந்த இறப்பு விகிதம்' : 'Minimal mortality within norms'}</li>
              <li>{language === 'ta' ? 'சிறந்த உயிரி பாதுகாப்பு இணக்க வீதம்' : 'Excellent biosecurity compliance'} ({farm.biosecurityScore}%)</li>
            </ul>
          </div>
          
          <div className="mt-4 bg-secondary/40 p-3 rounded-lg border border-border">
            <p className="text-[10px] text-secondary-foreground leading-relaxed font-mono">
              <span className="font-bold block mb-0.5">{t.recommendations}:</span>
              {t.recomNormal}
            </p>
          </div>
        </div>

        {/* Live Counters */}
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between colorful-card-accent relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full pointer-events-none" />
          
          <h3 className="font-bold text-sm text-foreground">{speciesLabels.metrics}</h3>
          
          <div className="space-y-4 my-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <div className="flex items-center gap-2">
                <HeartPulse size={16} className="text-primary" />
                <span className="text-xs text-muted-foreground">{speciesLabels.size}</span>
              </div>
              <span className="text-sm font-bold text-foreground">{farm.totalAnimals.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} className="text-risk-medium animate-pulse" />
                <span className="text-xs text-muted-foreground">{speciesLabels.sick}</span>
              </div>
              <span className="text-sm font-bold text-risk-medium">{farm.sickCount}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} className="text-risk-critical" />
                <span className="text-xs text-muted-foreground">{speciesLabels.deaths}</span>
              </div>
              <span className="text-sm font-bold text-risk-critical">{farm.mortalityCount}</span>
            </div>
          </div>

          <div className="bg-primary/10 p-3 rounded-lg border border-primary/20 text-center shadow-inner">
            <span className="text-[10px] text-primary font-bold block">{t.todayCompliance}</span>
            <span className="text-xl font-extrabold text-primary">{farm.biosecurityScore}%</span>
          </div>
        </div>
      </div>

      {/* Quick Action Touches */}
      <div>
        <h3 className="text-sm font-bold mb-3 text-foreground">{t.dailyTasks}</h3>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Link
            href="/farmer/biosecurity"
            className="bg-card border border-border hover:border-primary p-4 rounded-xl flex flex-col items-center text-center justify-between transition-all cursor-pointer group shadow-sm hover:shadow-md"
          >
            <div className="bg-primary/10 text-primary p-2.5 rounded-xl mb-2 group-hover:scale-110 transition-transform">
              <ClipboardCheck size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">{t.biosecurity}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{t.biosecurityDesc}</p>
            </div>
            <span className="text-[10px] text-primary font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {t.logTask} →
            </span>
          </Link>
 
          <Link
            href="/farmer/health"
            className="bg-card border border-border hover:border-primary p-4 rounded-xl flex flex-col items-center text-center justify-between transition-all cursor-pointer group shadow-sm hover:shadow-md"
          >
            <div className="bg-red-500/10 text-red-600 dark:text-red-400 p-2.5 rounded-xl mb-2 group-hover:scale-110 transition-transform">
              <HeartPulse size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">{t.healthLog}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{t.logSicknessDesc}</p>
            </div>
            <span className="text-[10px] text-primary font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {t.addLog} →
            </span>
          </Link>
 
          <Link
            href="/farmer/reports"
            className="bg-card border border-border hover:border-primary p-4 rounded-xl flex flex-col items-center text-center justify-between transition-all cursor-pointer group shadow-sm hover:shadow-md"
          >
            <div className="bg-orange-500/10 text-orange-600 dark:text-orange-400 p-2.5 rounded-xl mb-2 group-hover:scale-110 transition-transform">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">{t.reportDisease}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{t.reportSuspectDesc}</p>
            </div>
            <span className="text-[10px] text-primary font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {t.submit} →
            </span>
          </Link>
 
          <Link
            href="/farmer/visitors"
            className="bg-card border border-border hover:border-primary p-4 rounded-xl flex flex-col items-center text-center justify-between transition-all cursor-pointer group shadow-sm hover:shadow-md"
          >
            <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 p-2.5 rounded-xl mb-2 group-hover:scale-110 transition-transform">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">{t.visitorsLog}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{t.logVisitorDesc}</p>
            </div>
            <span className="text-[10px] text-primary font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {t.scanNow} →
            </span>
          </Link>
        </div>
      </div>

      {/* SVG Historical Chart */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-foreground">{speciesLabels.curveTitle}</h3>
          <span className="text-[10px] text-muted-foreground">{t.last7Days}</span>
        </div>
        
        <div className="w-full h-48 bg-secondary/10 rounded-lg p-2 flex items-center justify-center relative">
          <svg className="w-full h-full" viewBox="0 0 600 180" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="50" y1="20" x2="550" y2="20" stroke="var(--border)" strokeDasharray="4 4" />
            <line x1="50" y1="70" x2="550" y2="70" stroke="var(--border)" strokeDasharray="4 4" />
            <line x1="50" y1="120" x2="550" y2="120" stroke="var(--border)" strokeDasharray="4 4" />
            <line x1="50" y1="150" x2="550" y2="150" stroke="var(--border)" />
            
            {/* Left Axis Labels */}
            <text x="15" y="24" fill="var(--muted-foreground)" className="text-[10px]" textAnchor="middle">
              {selectedSpecies === 'CATTLE' ? '20' : '50'}
            </text>
            <text x="15" y="74" fill="var(--muted-foreground)" className="text-[10px]" textAnchor="middle">
              {selectedSpecies === 'CATTLE' ? '10' : '25'}
            </text>
            <text x="15" y="124" fill="var(--muted-foreground)" className="text-[10px]" textAnchor="middle">
              {selectedSpecies === 'CATTLE' ? '5' : '10'}
            </text>
            <text x="15" y="154" fill="var(--muted-foreground)" className="text-[10px]" textAnchor="middle">0</text>

            {/* Sickness Line (Blue) */}
            <path
              d="M 50 100 L 133 103 L 216 108 L 299 110 L 382 112 L 465 113 L 550 115"
              fill="none"
              stroke="var(--ring)"
              strokeWidth="2.5"
            />
            {/* Mortality Line (Red) */}
            <path
              d="M 50 142 L 133 145 L 216 147 L 299 147 L 382 149 L 465 149 L 550 149"
              fill="none"
              stroke="var(--risk-critical)"
              strokeWidth="2.5"
            />

            <circle cx="550" cy="115" r="4" fill="var(--ring)" />
            <circle cx="550" cy="149" r="4" fill="var(--risk-critical)" />

            {/* Bottom Labels */}
            <text x="50" y="170" fill="var(--muted-foreground)" className="text-[9px]" textAnchor="middle">Aug 15</text>
            <text x="133" y="170" fill="var(--muted-foreground)" className="text-[9px]" textAnchor="middle">Aug 16</text>
            <text x="216" y="170" fill="var(--muted-foreground)" className="text-[9px]" textAnchor="middle">Aug 17</text>
            <text x="299" y="170" fill="var(--muted-foreground)" className="text-[9px]" textAnchor="middle">Aug 18</text>
            <text x="382" y="170" fill="var(--muted-foreground)" className="text-[9px]" textAnchor="middle">Aug 19</text>
            <text x="465" y="170" fill="var(--muted-foreground)" className="text-[9px]" textAnchor="middle">Aug 20</text>
            <text x="550" y="170" fill="var(--muted-foreground)" className="text-[9px]" textAnchor="middle">Today</text>
          </svg>
        </div>
        <div className="flex gap-4 mt-2 justify-end text-[10px] font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
            <span>Sick Count</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span>Mortality Count</span>
          </div>
        </div>
      </div>

    </div>
  );
}
