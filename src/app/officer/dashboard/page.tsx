'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  ShieldAlert, CheckCircle, MapPin, Users, CalendarRange, 
  Eye, AlertCircle, Sparkles, Database, FileText, FlaskConical, 
  Volume2, CloudSun, Languages, ArrowRight, Play, Check 
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

interface SimulatedReport {
  id: string;
  lat: number;
  lng: number;
  village: string;
  district: string;
  symptoms: string[];
  sickCount: number;
  mortalityCount: number;
  date: string;
  status: string;
}

interface SimulatedCluster {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'SUSPECTED' | 'FIELD_INVESTIGATION' | 'CONTAINMENT' | 'RESOLVED';
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  villages: string[];
  reportsCount: number;
  sickCount: number;
  mortalityCount: number;
  explainabilityFactors: string[];
}

const villages = ["Keerambur", "Lathuvadi", "Mohanur", "Sendamangalam", "Paramathi"];

export default function OfficerDashboard() {
  const [activeTab, setActiveTab] = useState<'map' | 'clusters' | 'ivr'>('map');

  // Simulation Sandbox State Hooks
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [showBuffers, setShowBuffers] = useState(true);
  const [simMortality, setSimMortality] = useState(1);
  const [simCompliance, setSimCompliance] = useState(92);

  // Outbreak & Demo State Management
  const [demoStep, setDemoStep] = useState(0);
  const [activeClusters, setActiveClusters] = useState<SimulatedCluster[]>([]);
  const [activeReports, setActiveReports] = useState<SimulatedReport[]>([]);
  const [samplesList, setSamplesList] = useState<any[]>([]);
  const [referralsList, setReferralsList] = useState<any[]>([]);
  const [advisoriesList, setAdvisoriesList] = useState<any[]>([]);

  // Lab modal logs
  const [selectedClusterForInvestigate, setSelectedClusterForInvestigate] = useState<string | null>(null);
  const [selectedSampleType, setSelectedSampleType] = useState('Tracheal Swab');
  const [selectedLab, setSelectedLab] = useState('Namakkal Diagnostic Center');
  const [showSampleModal, setShowSampleModal] = useState(false);
  
  // IVR Simulator
  const [ivrStep, setIvrStep] = useState(0);
  const [ivrLanguage, setIvrLanguage] = useState('Tamil');
  const [ivrSymptoms, setIvrSymptoms] = useState<string[]>([]);
  const [ivrVillage, setIvrVillage] = useState('Keerambur');
  const [ivrDeaths, setIvrDeaths] = useState(5);
  const [ivrSubmittedReportId, setIvrSubmittedReportId] = useState('');

  // Initial load
  useEffect(() => {
    // Weather context defaults
    fetch('/api/outbreaks/clusters')
      .then(res => res.json())
      .then(data => {
        // Feed initial cluster
        if (data.clusters) {
          setActiveClusters(data.clusters);
        }
      })
      .catch(e => console.error(e));
  }, []);

  // Demo Script Handler
  const advanceDemoStep = () => {
    const nextStep = demoStep + 1;
    setDemoStep(nextStep);

    if (nextStep === 1) {
      // Step 1: Report 1 from Keerambur Village
      const r1: SimulatedReport = {
        id: "rep-demo-1",
        lat: 11.2215,
        lng: 78.1560,
        village: "Keerambur",
        district: "Namakkal",
        symptoms: ["Sudden death", "Breathing difficulty"],
        sickCount: 15,
        mortalityCount: 6,
        date: new Date().toISOString(),
        status: "SUBMITTED"
      };
      setActiveReports([r1]);
    } else if (nextStep === 2) {
      // Step 2: Report 2 from Lathuvadi Village (within 15km, 48h)
      const r2: SimulatedReport = {
        id: "rep-demo-2",
        lat: 11.2310,
        lng: 78.1620,
        village: "Lathuvadi",
        district: "Namakkal",
        symptoms: ["Sudden death", "Diarrhea"],
        sickCount: 12,
        mortalityCount: 5,
        date: new Date().toISOString(),
        status: "SUBMITTED"
      };
      setActiveReports(prev => [...prev, r2]);
    } else if (nextStep === 3) {
      // Step 3: Report 3 from Mohanur Village (within 15km, 48h)
      const r3: SimulatedReport = {
        id: "rep-demo-3",
        lat: 11.2150,
        lng: 78.1480,
        village: "Mohanur",
        district: "Namakkal",
        symptoms: ["Breathing difficulty", "Cough"],
        sickCount: 14,
        mortalityCount: 4,
        date: new Date().toISOString(),
        status: "SUBMITTED"
      };
      setActiveReports(prev => [...prev, r3]);
    } else if (nextStep === 4) {
      // Step 4: Spatiotemporal engine groups reports and flags Outbreak Cluster CL-004
      const cl: SimulatedCluster = {
        id: "CL-004",
        name: "Outbreak Cluster (Poultry Influenza)",
        lat: 11.2225,
        lng: 78.1553,
        status: "SUSPECTED",
        riskScore: 78,
        riskLevel: "CRITICAL",
        villages: ["Keerambur", "Lathuvadi", "Mohanur"],
        reportsCount: 3,
        sickCount: 41,
        mortalityCount: 15,
        explainabilityFactors: [
          "3 clinical reports filed within 12km radius",
          "Reports occurred within a 24-hour time window",
          "15 animal deaths recorded",
          "Similar respiratory symptom patterns flagged by AI Diagnostic"
        ]
      };
      setActiveClusters([cl]);
      setActiveTab('clusters'); // Auto-switch tab to highlight Outbreak Dashboard!
    } else if (nextStep === 5) {
      // Step 5: Start Field Investigation
      setActiveClusters(prev => prev.map(c => c.id === 'CL-004' ? { ...c, status: 'FIELD_INVESTIGATION' } : c));
    } else if (nextStep === 6) {
      // Step 6: Log sample collection
      const s = {
        id: "SMP-104",
        caseId: "CL-004",
        sampleType: "Tracheal Swab",
        collectionDate: new Date().toLocaleDateString(),
        collectedBy: "Dr. Amit Patel",
        location: "Keerambur Farm Grid",
        status: "COLLECTED"
      };
      setSamplesList([s]);
    } else if (nextStep === 7) {
      // Step 7: Dispatch lab referral
      setSamplesList(prev => prev.map(s => s.id === 'SMP-104' ? { ...s, status: 'DISPATCHED' } : s));
      const ref = {
        id: "REF-905",
        sampleId: "SMP-104",
        lab: "State Veterinary Diagnostics Lab, Chennai",
        status: "SENT",
        result: null,
        referredAt: new Date().toLocaleDateString()
      };
      setReferralsList([ref]);
    } else if (nextStep === 8) {
      // Step 8: Confirm Disease in Lab
      setReferralsList(prev => prev.map(r => r.id === 'REF-905' ? { ...r, status: 'COMPLETED', result: 'Confirmed: Highly Pathogenic Avian Influenza (H5N1)' } : r));
      setActiveClusters(prev => prev.map(c => c.id === 'CL-004' ? { ...c, status: 'CONTAINMENT', riskScore: 95 } : c));
    } else if (nextStep === 9) {
      // Step 9: Publish Advisory Alert
      const advisory = {
        id: "ADV-01",
        title: "RESTRICT POULTRY MOVEMENT: AFFECTED ZONE",
        message: "H5N1 Bird Flu confirmed in Keerambur grid. Isolate all poultry birds. Disinfect vehicles at gates.",
        severity: "CRITICAL",
        villages: ["Keerambur", "Lathuvadi", "Mohanur"]
      };
      setAdvisoriesList([advisory]);
    } else if (nextStep === 10) {
      // Step 10: Containment & Resolution
      setActiveClusters(prev => prev.map(c => c.id === 'CL-004' ? { ...c, status: 'RESOLVED', riskLevel: 'LOW', riskScore: 10 } : c));
      setDemoStep(11);
    }
  };

  const resetDemo = () => {
    setDemoStep(0);
    setActiveClusters([]);
    setActiveReports([]);
    setSamplesList([]);
    setReferralsList([]);
    setAdvisoriesList([]);
  };

  // Investigate handler
  const triggerInvestigation = (clusterId: string) => {
    setSelectedClusterForInvestigate(clusterId);
    setShowSampleModal(true);
  };

  const handleSaveSample = () => {
    const sId = `SMP-${Math.floor(100 + Math.random() * 900)}`;
    const newSample = {
      id: sId,
      caseId: selectedClusterForInvestigate || "CL-004",
      sampleType: selectedSampleType,
      collectionDate: new Date().toLocaleDateString(),
      collectedBy: "Dr. Amit Patel",
      location: "District Grid Center",
      status: "COLLECTED"
    };

    setSamplesList([newSample, ...samplesList]);
    
    // Auto-create referral
    const newReferral = {
      id: `REF-${Math.floor(100 + Math.random() * 900)}`,
      sampleId: sId,
      lab: selectedLab,
      status: "SENT",
      result: null,
      referredAt: new Date().toLocaleDateString()
    };
    setReferralsList([newReferral, ...referralsList]);
    
    // Update cluster status to Field Investigation
    setActiveClusters(prev => prev.map(c => c.id === selectedClusterForInvestigate ? { ...c, status: 'FIELD_INVESTIGATION' } : c));

    setShowSampleModal(false);
  };

  // IVR Simulator Submit
  const handleIvrSubmit = () => {
    const repId = `rep-ivr-${Date.now()}`;
    const newRep: SimulatedReport = {
      id: repId,
      lat: 11.1890,
      lng: 78.2040,
      village: ivrVillage,
      district: "Namakkal",
      symptoms: ivrSymptoms.length > 0 ? ivrSymptoms : ["Sudden death"],
      sickCount: 20,
      mortalityCount: ivrDeaths,
      date: new Date().toISOString(),
      status: "SUBMITTED"
    };

    setActiveReports([newRep, ...activeReports]);
    setIvrSubmittedReportId(repId);
    setIvrStep(4);
  };

  // Metrics
  const totalFarmsCount = mockFarms.length;
  const criticalCount = mockFarms.filter(f => f.riskLevel === 'CRITICAL').length + activeClusters.filter(c => c.riskLevel === 'CRITICAL').length;
  const highCount = mockFarms.filter(f => f.riskLevel === 'HIGH').length + activeClusters.filter(c => c.riskLevel === 'HIGH').length;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border pb-4 bg-gradient-to-r from-emerald-500/10 to-amber-500/5 p-4 rounded-xl border">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Livestock Disease Surveillance & Response Grid</h2>
          <p className="text-xs text-muted-foreground">
            Welcome, <span className="font-semibold text-foreground">Dr. Amit Patel</span> (District Veterinary Surgeon)
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/officer/inspections"
            className="flex items-center gap-1.5 text-xs font-bold bg-primary text-primary-foreground px-3.5 py-2 rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <CalendarRange size={14} />
            Schedule Vaccination / Visit
          </Link>
        </div>
      </div>

      {/* PRESENTATION DEMO CONTROL PANEL */}
      <div className="bg-card border-2 border-primary/30 p-5 rounded-2xl shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h3 className="font-bold text-sm flex items-center gap-2 text-foreground">
            <Sparkles className="text-primary animate-pulse" size={18} />
            Presentation Scenario Control Panel
          </h3>
          <button
            onClick={resetDemo}
            className="text-[10px] bg-secondary hover:bg-secondary/80 font-bold border border-border px-3 py-1 rounded cursor-pointer"
          >
            Reset Script Flow
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {[
            { step: 1, label: "Fever Report Keerambur" },
            { step: 2, label: "Cough Report Lathuvadi" },
            { step: 3, label: "Diarrhea Report Mohanur" },
            { step: 4, label: "Cluster Detected" },
            { step: 5, label: "Field Investigation" },
            { step: 6, label: "Sample Collected" },
            { step: 7, label: "Refer to Lab" },
            { step: 8, label: "Confirm H5N1 Flu" },
            { step: 9, label: "Advisories Sent" },
            { step: 10, label: "Containment & Resolve" }
          ].map((s) => {
            const isActive = demoStep === s.step;
            const isCompleted = demoStep > s.step;
            return (
              <button
                key={s.step}
                disabled={demoStep !== s.step - 1}
                onClick={advanceDemoStep}
                className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                  isActive 
                    ? 'bg-primary text-primary-foreground border-primary animate-pulse scale-105 shadow shadow-primary/20'
                    : isCompleted
                    ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
                    : 'bg-secondary text-muted-foreground border-border opacity-50 cursor-not-allowed'
                }`}
              >
                {isCompleted && <Check size={10} />}
                Step {s.step}: {s.label}
              </button>
            );
          })}
        </div>

        <div className="bg-secondary/40 p-3 rounded-lg border border-border">
          <p className="text-xs font-semibold leading-relaxed flex items-center gap-1.5">
            <Play size={12} className="text-primary animate-bounce shrink-0" />
            <span className="text-muted-foreground font-medium">Active Presentation State:</span>
            {demoStep === 0 && "Ready. Click 'Step 1: Fever Report Keerambur' to start the surveillance scenario."}
            {demoStep === 1 && "Fever and mortality reported in village Keerambur. Standing by for additional regional telemetry."}
            {demoStep === 2 && "Second report filed in adjacent village Lathuvadi (within 10km grid)."}
            {demoStep === 3 && "Third report filed in Mohanur village. Spatiotemporal patterns align."}
            {demoStep === 4 && "Clustering Engine ran! 🔴 Detected Outbreak Cluster CL-004. District warnings generated."}
            {demoStep === 5 && "Officer Dr. Amit Patel dispatched to containment zone for active field investigation."}
            {demoStep === 6 && "Tracheal swabs and tissue sample SMP-104 collected from infected pen."}
            {demoStep === 7 && "Sample SMP-104 packed and referred to regional State Veterinary Diagnostics Laboratory."}
            {demoStep === 8 && "Laboratory confirmed H5N1 Highly Pathogenic Avian Influenza. Regional risk escalates."}
            {demoStep === 9 && "Multilingual alerts published. Farmers in surrounding Namakkal grids receive alerts."}
            {demoStep === 10 && "Quarantines enforced and cluster resolved successfully."}
            {demoStep > 10 && "Demo script sequence completed successfully. Click Reset to start again."}
          </p>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-secondary/50 p-1.5 rounded-xl border border-border/80 text-xs">
        <button
          onClick={() => setActiveTab('map')}
          className={`py-2 rounded-lg text-center font-bold transition-all cursor-pointer ${activeTab === 'map' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Overview GIS Map
        </button>
        <button
          onClick={() => setActiveTab('clusters')}
          className={`py-2 rounded-lg text-center font-bold transition-all cursor-pointer ${activeTab === 'clusters' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Outbreak Surveillance ({activeClusters.length} active)
        </button>
        <button
          onClick={() => setActiveTab('ivr')}
          className={`py-2 rounded-lg text-center font-bold transition-all cursor-pointer ${activeTab === 'ivr' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          IVR Telephony Reporting Simulator
        </button>
      </div>

      {/* TAB CONTENT 1: GIS Map View */}
      {activeTab === 'map' && (
        <div className="grid gap-6 md:grid-cols-4">
          <div className="bg-card border border-border rounded-xl p-5 md:col-span-3 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-border/60">
              <h3 className="font-bold text-sm flex items-center gap-1.5 text-foreground">
                <MapPin size={16} className="text-primary" />
                Spatiotemporal Surveillance & Outbreak GIS Map
              </h3>
              <span className="text-[10px] bg-secondary border border-border px-2.5 py-0.5 rounded font-mono">
                Active Outbreak Zones Rendered
              </span>
            </div>
            <RiskMap 
              filterRisk={filterRisk}
              showBuffers={showBuffers}
              simMortality={simMortality}
              simCompliance={simCompliance}
              highlightClusters={activeClusters}
              diseaseReports={activeReports}
            />
          </div>
          
          {/* Weather Context & Quick Map Legend */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-1.5 border-b border-border pb-2">
              <CloudSun className="text-primary" size={16} />
              Surveillance Environment
            </h3>
            
            {/* Environment details */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-secondary/35 p-2 rounded-lg">
                <span className="text-muted-foreground">Ambient Temp:</span>
                <span className="font-bold">32.4°C (Elevated)</span>
              </div>
              <div className="flex justify-between items-center bg-secondary/35 p-2 rounded-lg">
                <span className="text-muted-foreground">Relative Humidity:</span>
                <span className="font-bold text-blue-500">76% (High Risk)</span>
              </div>
              <div className="flex justify-between items-center bg-secondary/35 p-2 rounded-lg">
                <span className="text-muted-foreground">Rainfall Trend:</span>
                <span className="font-bold text-primary">Intermittent Monsoon</span>
              </div>
            </div>

            <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg text-[10px] leading-relaxed text-muted-foreground">
              ⚠️ <b>Weather Outbreak Indicator:</b> High humidity combined with 32°C temp increases avian virus incubation rates by 40%. Vector control alerts sent.
            </div>

            <div className="border-t border-border pt-3">
              <h4 className="font-bold text-[10px] uppercase text-muted-foreground mb-2">GIS MAP Legend</h4>
              <div className="space-y-2 text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-red-500 opacity-80 inline-block"></span>
                  <span>Critical Risk Farm</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-purple-500 inline-block"></span>
                  <span>Village Telemetry Report (FW)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full border border-dashed border-red-500 bg-red-500/10 inline-block"></span>
                  <span>Active Outbreak Cluster Zone</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: Outbreak Surveillance Dashboard */}
      {activeTab === 'clusters' && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            
            {/* Clusters List */}
            <div className="bg-card border border-border rounded-xl p-5 md:col-span-2 space-y-4">
              <h3 className="font-bold text-sm flex items-center gap-1.5 text-foreground border-b border-border pb-2">
                <ShieldAlert className="text-risk-critical" size={16} />
                Suspected & Confirmed Outbreak Clusters
              </h3>

              {activeClusters.length === 0 ? (
                <div className="text-center py-10 text-xs text-muted-foreground">
                  No active outbreak clusters detected. Ensure you trigger step 4 in the demo panel above.
                </div>
              ) : (
                <div className="space-y-4">
                  {activeClusters.map((cl) => (
                    <div key={cl.id} className="border border-border/80 bg-secondary/15 rounded-xl p-4 space-y-4 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-sm flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-risk-critical/10 text-risk-critical border border-risk-critical/20">
                              {cl.id}
                            </span>
                            {cl.name}
                          </h4>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            Affected villages: **{cl.villages.join(', ')}**
                          </p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded font-extrabold uppercase text-[9px] border ${
                          cl.status === 'RESOLVED'
                            ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
                            : 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 animate-pulse'
                        }`}>
                          {cl.status}
                        </span>
                      </div>

                      {/* Cluster Statistics */}
                      <div className="grid grid-cols-3 gap-3 text-center border-y border-border py-2.5 bg-card rounded-lg">
                        <div>
                          <p className="text-muted-foreground text-[10px] font-semibold">Proximity Reports</p>
                          <p className="text-sm font-bold text-foreground mt-0.5">{cl.reportsCount}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-[10px] font-semibold">Active Sick Animals</p>
                          <p className="text-sm font-bold text-amber-500 mt-0.5">{cl.sickCount}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-[10px] font-semibold">Total Deaths today</p>
                          <p className="text-sm font-bold text-risk-critical mt-0.5">{cl.mortalityCount}</p>
                        </div>
                      </div>

                      {/* Explainability Section */}
                      <div className="space-y-1.5">
                        <h5 className="font-extrabold text-[10px] uppercase text-muted-foreground tracking-wide">Explainability (Why was this flagged?)</h5>
                        <ul className="list-disc pl-4 space-y-1 text-[10px] text-muted-foreground leading-relaxed">
                          {cl.explainabilityFactors.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Response Action Triggers */}
                      {cl.status !== 'RESOLVED' && (
                        <div className="flex gap-2 justify-end border-t border-border pt-3">
                          <button
                            onClick={() => triggerInvestigation(cl.id)}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <FlaskConical size={12} />
                            Collect Swab Sample
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Diagnostics and Lab referrals sidebar */}
            <div className="space-y-5">
              
              {/* Lab Referrals Tracker */}
              <div className="bg-card border border-border rounded-xl p-5 space-y-4 text-xs">
                <h3 className="font-bold text-sm flex items-center gap-1.5 border-b border-border pb-2">
                  <FlaskConical className="text-primary" size={16} />
                  Laboratory Referrals Log
                </h3>

                <div className="space-y-3">
                  {referralsList.length === 0 ? (
                    <p className="text-center text-muted-foreground text-[10px] py-4">No referrals dispatched.</p>
                  ) : (
                    referralsList.map(r => (
                      <div key={r.id} className="border border-border rounded-lg p-3 bg-secondary/20 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-foreground">{r.id} • <span className="text-[10px] text-muted-foreground">{r.sampleId}</span></span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold ${r.status === 'COMPLETED' ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'}`}>
                            {r.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium">Lab: {r.lab}</p>
                        {r.result && (
                          <div className="p-2 bg-destructive/10 border border-destructive/20 text-destructive rounded font-bold text-[9px] mt-1 leading-normal">
                            🔬 {r.result}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Published advisories */}
              <div className="bg-card border border-border rounded-xl p-5 space-y-4 text-xs">
                <h3 className="font-bold text-sm flex items-center gap-1.5 border-b border-border pb-2">
                  <Languages className="text-primary" size={16} />
                  Active Disease Advisories
                </h3>

                <div className="space-y-3">
                  {advisoriesList.length === 0 ? (
                    <p className="text-center text-muted-foreground text-[10px] py-4">No warnings published.</p>
                  ) : (
                    advisoriesList.map(a => (
                      <div key={a.id} className="border border-risk-critical/20 rounded-lg p-3 bg-risk-critical/5 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-risk-critical text-[10px] uppercase">{a.title}</span>
                          <span className="text-[9px] text-muted-foreground font-mono">{a.id}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-foreground font-semibold">{a.message}</p>
                        <p className="text-[9px] text-muted-foreground italic mt-1">Sent to: {a.villages.join(', ')}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* TAB CONTENT 3: Telephony IVR Simulator */}
      {activeTab === 'ivr' && (
        <div className="bg-card border border-border rounded-xl p-6 max-w-lg mx-auto text-xs space-y-5 shadow-sm">
          <div className="border-b border-border pb-3 flex items-center gap-2">
            <Volume2 className="text-primary shrink-0" size={20} />
            <div>
              <h3 className="font-bold text-sm">Interactive Telephony (IVR) Reporting Tree</h3>
              <p className="text-[10px] text-muted-foreground">Voice reporting bridge simulation for non-internet users</p>
            </div>
          </div>

          <div className="bg-secondary/40 border border-border p-4 rounded-xl space-y-4">
            <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-lg border border-border">
              <span className="h-2 w-2 bg-green-500 rounded-full animate-ping"></span>
              <p className="font-bold font-mono text-[10px]">IVR Call Status: In Progress...</p>
            </div>

            {ivrStep === 0 && (
              <div className="space-y-4">
                <p className="italic text-muted-foreground font-medium text-center">
                  "Vanakkam. Welcome to Animal Health Telephony portal. Please select your reporting language."
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {["Tamil", "Hindi", "English"].map(lang => (
                    <button
                      key={lang}
                      onClick={() => {
                        setIvrLanguage(lang);
                        setIvrStep(1);
                      }}
                      className="py-2.5 bg-card hover:bg-secondary border border-border rounded-lg font-bold text-center cursor-pointer"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {ivrStep === 1 && (
              <div className="space-y-4">
                <p className="italic text-muted-foreground font-medium text-center">
                  "Please enter your Village Grid Location."
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {villages.map(v => (
                    <button
                      key={v}
                      onClick={() => {
                        setIvrVillage(v);
                        setIvrStep(2);
                      }}
                      className="py-2.5 bg-card hover:bg-secondary border border-border rounded-lg font-bold text-center cursor-pointer"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {ivrStep === 2 && (
              <div className="space-y-4">
                <p className="italic text-muted-foreground font-medium text-center">
                  "Select the clinical symptoms you have noticed (Select all that apply)."
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {["Sudden death", "Breathing difficulty", "High fever", "Diarrhea"].map(sym => {
                    const isSel = ivrSymptoms.includes(sym);
                    return (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => {
                          setIvrSymptoms(prev => 
                            prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]
                          );
                        }}
                        className={`py-2 px-3 border rounded-lg font-bold text-center cursor-pointer ${
                          isSel ? 'border-primary bg-primary/10 text-primary' : 'bg-card border-border'
                        }`}
                      >
                        {sym}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setIvrStep(3)}
                  className="w-full py-2 bg-primary text-primary-foreground font-bold rounded-lg mt-2 cursor-pointer"
                >
                  Confirm Symptoms
                </button>
              </div>
            )}

            {ivrStep === 3 && (
              <div className="space-y-4">
                <p className="italic text-muted-foreground font-medium text-center">
                  "Select number of animal deaths noticed in last 24 hours."
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 5, 10, 20].map(val => (
                    <button
                      key={val}
                      onClick={() => setIvrDeaths(val)}
                      className={`py-2 border rounded-lg font-bold text-center cursor-pointer ${
                        ivrDeaths === val ? 'border-primary bg-primary/10 text-primary' : 'bg-card border-border'
                      }`}
                    >
                      {val} deaths
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleIvrSubmit}
                  className="w-full py-2.5 bg-primary text-primary-foreground font-bold rounded-xl mt-4 cursor-pointer"
                >
                  Submit Voice Report
                </button>
              </div>
            )}

            {ivrStep === 4 && (
              <div className="space-y-3 text-center">
                <p className="text-green-600 dark:text-green-400 font-bold">✓ Call Completed Successfully</p>
                <p className="text-muted-foreground text-[10px]">
                  Voice report compiled and registered. Report ID: **{ivrSubmittedReportId}**
                </p>
                <button
                  onClick={() => {
                    setIvrStep(0);
                    setIvrSymptoms([]);
                    setIvrSubmittedReportId('');
                  }}
                  className="mt-3 bg-secondary px-4 py-2 border border-border rounded-lg font-bold cursor-pointer hover:bg-secondary/80"
                >
                  Place Another Call
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SAMPLE COLLECTION MODAL */}
      {showSampleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 space-y-4 shadow-lg text-xs">
            <h3 className="font-bold text-sm flex items-center gap-1.5 text-foreground border-b border-border pb-2">
              <FlaskConical className="text-primary" size={16} />
              Dispatch Lab Referral: {selectedClusterForInvestigate}
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">Sample Type</label>
                <select
                  value={selectedSampleType}
                  onChange={e => setSelectedSampleType(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 cursor-pointer font-semibold text-foreground focus:outline-none"
                >
                  <option value="Tracheal Swab">Tracheal Swab</option>
                  <option value="Cloacal Swab">Cloacal Swab</option>
                  <option value="Blood Serum">Blood Serum</option>
                  <option value="Fecal Sample">Fecal Sample</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">Select Testing Laboratory</label>
                <select
                  value={selectedLab}
                  onChange={e => setSelectedLab(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 cursor-pointer font-semibold text-foreground focus:outline-none"
                >
                  <option value="Namakkal Disease Diagnostics Center">Namakkal Disease Diagnostics Center</option>
                  <option value="Coimbatore Regional Veterinary Lab">Coimbatore Regional Veterinary Lab</option>
                  <option value="State Diagnostics Center, Chennai">State Diagnostics Center, Chennai</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 justify-end border-t border-border pt-4 mt-2">
              <button
                onClick={() => setShowSampleModal(false)}
                className="bg-secondary text-muted-foreground font-bold px-4 py-2 border border-border rounded-lg cursor-pointer hover:bg-secondary/80"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSample}
                className="bg-primary text-primary-foreground font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-primary/95"
              >
                Dispatch Sample
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
