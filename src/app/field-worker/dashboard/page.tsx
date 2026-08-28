'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, Check, AlertTriangle, Cloud, 
  CloudOff, RefreshCw, ClipboardCheck, HeartPulse, 
  MapPin, Calendar, Plus, Save, Clock, ArrowRight, ShieldAlert 
} from 'lucide-react';

interface QueuedReport {
  id: string;
  village: string;
  animalType: string;
  sickCount: number;
  mortalityCount: number;
  symptoms: string[];
  notes: string;
  timestamp: string;
  status: 'PENDING' | 'SYNCED' | 'FAILED';
}

export default function FieldWorkerDashboard() {
  // Navigation / Tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'report' | 'vaccination' | 'treatment'>('dashboard');
  
  // Offline Simulation State
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [syncQueue, setSyncQueue] = useState<QueuedReport[]>([]);
  const [syncing, setSyncing] = useState(false);

  // Form states - Report
  const [village, setVillage] = useState('Keerambur');
  const [animalType, setAnimalType] = useState('POULTRY');
  const [sickCount, setSickCount] = useState('0');
  const [mortalityCount, setMortalityCount] = useState('0');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [reportedSuccessfully, setReportedSuccessfully] = useState(false);

  // Form states - Vaccination
  const [vacFarm, setVacFarm] = useState("Sri Murugan Layer Farm");
  const [vacName, setVacName] = useState("Avian Influenza Vaccine");
  const [vacDose, setVacDose] = useState("0.5 mL");
  const [vacBatch, setVacBatch] = useState("AI-2026-B12");
  const [vacSuccess, setVacSuccess] = useState(false);
  const [vaccineLogs, setVaccineLogs] = useState<any[]>([]);

  // Form states - Treatment
  const [trtFarm, setTrtFarm] = useState("Karthik Broiler Farm");
  const [trtDiag, setTrtDiag] = useState("Respiratory infection");
  const [trtMeds, setTrtMeds] = useState("Enrofloxacin");
  const [trtSuccess, setTrtSuccess] = useState(false);
  const [treatmentLogs, setTreatmentLogs] = useState<any[]>([]);

  const symptomsList = [
    "Sudden death", "Breathing difficulty", "High fever", "Diarrhea", "Cough", "Loss of appetite", "Lameness"
  ];

  const villages = ["Keerambur", "Lathuvadi", "Mohanur", "Sendamangalam", "Paramathi"];

  useEffect(() => {
    // Load offline queue from localstorage
    const savedQueue = localStorage.getItem('sih_offline_sync_queue');
    if (savedQueue) {
      try {
        setSyncQueue(JSON.parse(savedQueue));
      } catch (e) {
        console.error('Sync queue parse error:', e);
      }
    }

    // Fetch vaccinations and treatments
    fetch('/api/vaccinations')
      .then(res => res.json())
      .then(data => setVaccineLogs(data.records || []))
      .catch(e => console.error(e));

    fetch('/api/treatments')
      .then(res => res.json())
      .then(data => setTreatmentLogs(data.records || []))
      .catch(e => console.error(e));
  }, []);

  const saveQueueToStorage = (newQueue: QueuedReport[]) => {
    setSyncQueue(newQueue);
    localStorage.setItem('sih_offline_sync_queue', JSON.stringify(newQueue));
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportedSuccessfully(false);

    const reportData: QueuedReport = {
      id: `rep-fw-${Date.now()}`,
      village,
      animalType,
      sickCount: parseInt(sickCount) || 0,
      mortalityCount: parseInt(mortalityCount) || 0,
      symptoms: selectedSymptoms,
      notes,
      timestamp: new Date().toISOString(),
      status: isOfflineMode ? 'PENDING' : 'SYNCED'
    };

    if (isOfflineMode) {
      // Offline mode: store in local storage queue
      const updated = [reportData, ...syncQueue];
      saveQueueToStorage(updated);
      setReportedSuccessfully(true);
      clearReportForm();
      setTimeout(() => setReportedSuccessfully(false), 4000);
      return;
    }

    // Online mode: Post directly to health logs API
    try {
      const res = await fetch('/api/health-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmId: 'frm-sandbox-direct',
          totalAnimals: 100,
          healthyCount: 100 - (parseInt(sickCount) || 0) - (parseInt(mortalityCount) || 0),
          sickCount: parseInt(sickCount) || 0,
          mortalityCount: parseInt(mortalityCount) || 0,
          symptoms: selectedSymptoms,
          notes: `[Village Report: ${village}] ${notes}`,
          species: animalType
        })
      });

      if (res.ok) {
        setReportedSuccessfully(true);
        clearReportForm();
        setTimeout(() => setReportedSuccessfully(false), 4000);
      } else {
        // Handle failed post by pushing to sync queue
        reportData.status = 'FAILED';
        saveQueueToStorage([reportData, ...syncQueue]);
      }
    } catch (err) {
      reportData.status = 'FAILED';
      saveQueueToStorage([reportData, ...syncQueue]);
    }
  };

  const clearReportForm = () => {
    setSickCount('0');
    setMortalityCount('0');
    setSelectedSymptoms([]);
    setNotes('');
  };

  const handleSyncNow = async () => {
    if (syncQueue.filter(q => q.status !== 'SYNCED').length === 0) return;
    setSyncing(true);

    // Simulate sending queue to API
    setTimeout(() => {
      const synced = syncQueue.map(item => ({
        ...item,
        status: 'SYNCED' as const
      }));
      saveQueueToStorage(synced);
      setSyncing(false);
    }, 2000);
  };

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]
    );
  };

  const handleVaccinationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVacSuccess(false);

    const payload = {
      farmId: 'frm-1',
      vaccineName: vacName,
      dose: vacDose,
      date: new Date().toISOString(),
      nextDueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      administeredBy: "Field Worker Agent",
      batchNumber: vacBatch,
      status: "COMPLETED"
    };

    try {
      const res = await fetch('/api/vaccinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setVaccineLogs([data.record, ...vaccineLogs]);
      setVacSuccess(true);
      setVacBatch(`AI-2026-B${Math.floor(10 + Math.random() * 89)}`);
      setTimeout(() => setVacSuccess(false), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTreatmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrtSuccess(false);

    const payload = {
      farmId: 'frm-1',
      diagnosis: trtDiag,
      treatment: "Medical Therapy",
      medicine: trtMeds,
      date: new Date().toISOString(),
      veterinarian: "Dr. Amit Patel",
      outcome: "UNDER_TREATMENT"
    };

    try {
      const res = await fetch('/api/treatments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setTreatmentLogs([data.record, ...treatmentLogs]);
      setTrtSuccess(true);
      setTimeout(() => setTrtSuccess(false), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      {/* Simulation Banner */}
      <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          {isOfflineMode ? (
            <CloudOff className="text-destructive shrink-0 animate-bounce" size={20} />
          ) : (
            <Cloud className="text-primary shrink-0" size={20} />
          )}
          <div className="text-xs">
            <p className="font-bold text-foreground">
              {isOfflineMode ? 'Offline Sandbox Mode Active' : 'Online Surveillance Connected'}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {isOfflineMode ? 'Reports will queue locally' : 'Syncing live telemetry'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="checkbox"
            id="offlineSimToggle"
            checked={isOfflineMode}
            onChange={() => setIsOfflineMode(!isOfflineMode)}
            className="w-4 h-4 text-primary bg-secondary rounded border-border focus:ring-primary cursor-pointer"
          />
          <label htmlFor="offlineSimToggle" className="text-[11px] font-bold text-muted-foreground select-none cursor-pointer">
            Go Offline
          </label>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="grid grid-cols-4 gap-1.5 bg-secondary/60 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`py-2 rounded-lg text-center text-[10px] font-bold transition-all cursor-pointer ${activeTab === 'dashboard' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`py-2 rounded-lg text-center text-[10px] font-bold transition-all cursor-pointer ${activeTab === 'report' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Quick Report
        </button>
        <button
          onClick={() => setActiveTab('vaccination')}
          className={`py-2 rounded-lg text-center text-[10px] font-bold transition-all cursor-pointer ${activeTab === 'vaccination' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Vaccine
        </button>
        <button
          onClick={() => setActiveTab('treatment')}
          className={`py-2 rounded-lg text-center text-[10px] font-bold transition-all cursor-pointer ${activeTab === 'treatment' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Treatment
        </button>
      </div>

      {/* Tab Content: Dashboard Overview */}
      {activeTab === 'dashboard' && (
        <div className="space-y-5">
          {/* Active Outbreak Alert Warning */}
          <div className="bg-risk-critical/10 border border-risk-critical/20 rounded-xl p-4 flex gap-3">
            <ShieldAlert className="text-risk-critical shrink-0 mt-0.5" size={20} />
            <div className="text-xs">
              <h4 className="font-bold text-foreground">Suspected Outbreak Warning</h4>
              <p className="text-muted-foreground leading-relaxed mt-0.5">
                Cluster detected around **Keerambur village**. Restrict cattle and avian movements immediately.
              </p>
            </div>
          </div>

          {/* Assigned grid */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Assigned Surveillance Villages</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {villages.map(v => (
                <div key={v} className="bg-secondary/40 border border-border p-2.5 rounded-lg flex items-center gap-2">
                  <MapPin size={12} className="text-primary shrink-0" />
                  <span className="font-semibold text-foreground truncate">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Offline Sync Queue */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Save size={14} className="text-primary" />
                Offline Report Sync Queue
              </h3>
              {syncQueue.filter(q => q.status !== 'SYNCED').length > 0 && (
                <button
                  onClick={handleSyncNow}
                  disabled={syncing}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-2.5 py-1 rounded text-[10px] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw size={10} className={syncing ? 'animate-spin' : ''} />
                  {syncing ? 'Syncing...' : 'Sync Now'}
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {syncQueue.length === 0 ? (
                <p className="text-center text-[10px] text-muted-foreground py-4">No local reports queued.</p>
              ) : (
                syncQueue.map(item => (
                  <div key={item.id} className="border border-border rounded-lg p-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-foreground">
                        {item.village} • <span className="text-[10px] text-muted-foreground">{item.animalType === 'POULTRY' ? 'Birds' : item.animalType === 'CATTLE' ? 'Cattle' : 'Goat'}</span>
                      </p>
                      <p className="text-[9px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Clock size={10} />
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Sickness: {item.sickCount} • Mortality: {item.mortalityCount}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                      item.status === 'PENDING' 
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20' 
                        : item.status === 'FAILED'
                        ? 'bg-destructive/10 text-destructive border-destructive/20'
                        : 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Quick Report Form */}
      {activeTab === 'report' && (
        <form onSubmit={handleReportSubmit} className="bg-card border border-border rounded-xl p-5 space-y-4 text-xs">
          <h3 className="font-bold text-sm flex items-center gap-1.5 text-foreground">
            <FileText size={16} className="text-primary" />
            Regional Disease Telemetry Report
          </h3>

          {reportedSuccessfully && (
            <p className="p-3 bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 rounded-lg font-bold flex items-center gap-2">
              <Check size={14} />
              {isOfflineMode 
                ? 'Report saved to offline queue. Sync when online.' 
                : 'Report synced successfully with Surveillance Grid.'}
            </p>
          )}

          {/* Select Village */}
          <div className="space-y-1">
            <label className="text-muted-foreground font-semibold">Surveillance Village</label>
            <select
              value={village}
              onChange={e => setVillage(e.target.value)}
              className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 font-semibold text-foreground focus:outline-none cursor-pointer"
            >
              {villages.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Select Animal Category */}
          <div>
            <label className="text-muted-foreground font-semibold block mb-1.5">Livestock Category</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['POULTRY', 'CATTLE', 'GOAT', 'PIG'] as const).map((t) => {
                const isSel = animalType === t;
                const getLabel = (ft: string) => {
                  switch (ft) {
                    case 'CATTLE': return '🐄 Cows';
                    case 'GOAT': return '🐐 Goats';
                    case 'PIG': return '🐖 Pigs';
                    default: return '🐓 Birds';
                  }
                };
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setAnimalType(t)}
                    className={`py-2 rounded-lg border text-center text-[10px] font-bold cursor-pointer transition-all ${
                      isSel 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-border text-muted-foreground bg-card hover:bg-secondary/40'
                    }`}
                  >
                    {getLabel(t)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sickness & Mortality Count */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-muted-foreground font-semibold">Animals Sick Count</label>
              <input
                type="number"
                required
                value={sickCount}
                onChange={e => setSickCount(e.target.value)}
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2 font-semibold text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground font-semibold">Deaths Count Today</label>
              <input
                type="number"
                required
                value={mortalityCount}
                onChange={e => setMortalityCount(e.target.value)}
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2 font-semibold text-foreground focus:outline-none"
              />
            </div>
          </div>

          {/* Symptoms List */}
          <div>
            <label className="text-muted-foreground font-semibold block mb-2">Select Symptoms</label>
            <div className="grid grid-cols-2 gap-1.5">
              {symptomsList.map(sym => {
                const isSel = selectedSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => toggleSymptom(sym)}
                    className={`p-2 border rounded-lg text-left font-bold cursor-pointer flex justify-between items-center transition-colors ${
                      isSel ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-muted-foreground hover:bg-secondary/40'
                    }`}
                  >
                    <span>{sym}</span>
                    {isSel && <Check size={10} className="text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-muted-foreground font-semibold">Observations</label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Enter details..."
              className="w-full bg-secondary border border-border rounded-xl p-3 text-xs leading-relaxed focus:outline-none focus:border-primary"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/95 transition-colors shadow shadow-primary/10 cursor-pointer"
          >
            {isOfflineMode ? 'Save to Sync Queue' : 'Submit Outbreak Report'}
          </button>
        </form>
      )}

      {/* Tab Content: Vaccination Registry */}
      {activeTab === 'vaccination' && (
        <div className="space-y-5">
          <form onSubmit={handleVaccinationSubmit} className="bg-card border border-border rounded-xl p-5 space-y-4 text-xs">
            <h3 className="font-bold text-sm flex items-center gap-1.5 text-foreground">
              <ClipboardCheck size={16} className="text-primary" />
              Log Vaccination Dose
            </h3>

            {vacSuccess && (
              <p className="p-3 bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 rounded-lg font-bold flex items-center gap-2">
                <Check size={14} /> Vaccination details added to record card database.
              </p>
            )}

            <div className="space-y-1">
              <label className="text-muted-foreground font-semibold">Select Farm</label>
              <select
                value={vacFarm}
                onChange={e => setVacFarm(e.target.value)}
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 font-semibold text-foreground focus:outline-none cursor-pointer"
              >
                <option value="Sri Murugan Layer Farm">Sri Murugan Layer Farm</option>
                <option value="Karthik Broiler Farm">Karthik Broiler Farm</option>
                <option value="Selvam Breeder Poultry">Selvam Breeder Poultry</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">Vaccine Name</label>
                <input
                  type="text"
                  required
                  value={vacName}
                  onChange={e => setVacName(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">Batch Number</label>
                <input
                  type="text"
                  required
                  value={vacBatch}
                  onChange={e => setVacBatch(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 font-semibold text-foreground focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/95 transition-colors cursor-pointer"
            >
              Log Vaccination Dose
            </button>
          </form>

          {/* Vaccination logs list */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recent Vaccination Activity</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {vaccineLogs.map((l, i) => (
                <div key={i} className="border border-border rounded-lg p-2.5 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-foreground">{l.vaccineName}</p>
                    <p className="text-[10px] text-muted-foreground">{l.farm?.name || "Local Herd"} • Batch: {l.batchNumber}</p>
                  </div>
                  <span className="bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                    {l.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Treatment Registry */}
      {activeTab === 'treatment' && (
        <div className="space-y-5">
          <form onSubmit={handleTreatmentSubmit} className="bg-card border border-border rounded-xl p-5 space-y-4 text-xs">
            <h3 className="font-bold text-sm flex items-center gap-1.5 text-foreground">
              <HeartPulse size={16} className="text-primary" />
              Log Veterinary Medical Treatment
            </h3>

            {trtSuccess && (
              <p className="p-3 bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 rounded-lg font-bold flex items-center gap-2">
                <Check size={14} /> Medical treatment details recorded in health files.
              </p>
            )}

            <div className="space-y-1">
              <label className="text-muted-foreground font-semibold">Select Farm</label>
              <select
                value={trtFarm}
                onChange={e => setTrtFarm(e.target.value)}
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 font-semibold text-foreground focus:outline-none cursor-pointer"
              >
                <option value="Sri Murugan Layer Farm">Sri Murugan Layer Farm</option>
                <option value="Karthik Broiler Farm">Karthik Broiler Farm</option>
                <option value="Selvam Breeder Poultry">Selvam Breeder Poultry</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">Diagnosis</label>
                <input
                  type="text"
                  required
                  value={trtDiag}
                  onChange={e => setTrtDiag(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">Medication Spray/Tablet</label>
                <input
                  type="text"
                  required
                  value={trtMeds}
                  onChange={e => setTrtMeds(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 font-semibold text-foreground focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/95 transition-colors cursor-pointer"
            >
              Log Treatment Details
            </button>
          </form>

          {/* Treatment logs list */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recent Treatment Logs</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {treatmentLogs.map((l, i) => (
                <div key={i} className="border border-border rounded-lg p-2.5 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-foreground">{l.diagnosis}</p>
                    <p className="text-[10px] text-muted-foreground">{l.farm?.name || "Local Herd"} • Meds: {l.medicine}</p>
                  </div>
                  <span className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                    {l.outcome}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
