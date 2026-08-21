'use client';

import { useState } from 'react';
import { CalendarRange, ClipboardCheck, Clock, FileText, Check, Plus } from 'lucide-react';
import { mockInspections, mockFarms } from '@/mock-data';

export default function OfficerInspectionsPage() {
  const [inspections, setInspections] = useState(mockInspections);
  const [selectedFarmId, setSelectedFarmId] = useState(mockFarms[0].id);
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Interactive Complete modal state
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [actionsTaken, setActionsTaken] = useState('');

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const farm = mockFarms.find(f => f.id === selectedFarmId)!;
    const newInspection = {
      id: `ins-${Date.now()}`,
      farmId: selectedFarmId,
      farmName: farm.name,
      officerName: "Dr. Amit Patel",
      date: new Date(date).toISOString(),
      notes,
      status: 'SCHEDULED' as const
    };

    setInspections([newInspection, ...inspections]);
    setDate('');
    setNotes('');
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 3000);
  };

  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingId) return;

    setInspections(prev =>
      prev.map(i =>
        i.id === completingId
          ? { ...i, status: 'COMPLETED' as const, actionsTaken }
          : i
      )
    );
    setCompletingId(null);
    setActionsTaken('');
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight">Field Inspections & Logs</h2>
        <p className="text-xs text-muted-foreground">Schedule diagnostic farm visits, record lab collections, and issue advisory actions</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Schedule Visit Form */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-sm flex items-center gap-1.5 text-foreground">
            <CalendarRange size={16} className="text-primary" />
            Schedule Diagnostic Visit
          </h3>

          {submitting && (
            <p className="text-xs text-green-600 dark:text-green-400 font-bold bg-green-500/10 p-2.5 rounded border border-green-500/20">
              ✓ Inspection scheduled successfully. Notification sent to Farmer.
            </p>
          )}

          <form onSubmit={handleSchedule} className="space-y-4 text-xs">
            <div>
              <label className="text-muted-foreground font-semibold block mb-1">Select Poultry Farm</label>
              <select
                value={selectedFarmId}
                onChange={e => setSelectedFarmId(e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary text-xs"
              >
                {mockFarms.map(f => (
                  <option key={f.id} value={f.id}>{f.name} ({f.riskLevel} Risk)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-muted-foreground font-semibold block mb-1">Inspection Date & Time</label>
              <input
                required
                type="datetime-local"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-xs"
              />
            </div>

            <div>
              <label className="text-muted-foreground font-semibold block mb-1">Diagnostic Visit Purpose / Notes</label>
              <textarea
                required
                rows={4}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="E.g., Conduct swab testing for Avian Influenza. Audit vehicle spraying station..."
                className="w-full bg-secondary border border-border rounded-lg p-3 focus:outline-none focus:border-primary text-xs leading-relaxed"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-2.5 rounded-lg transition-colors text-center"
            >
              Add Schedule
            </button>
          </form>
        </div>

        {/* Inspections List */}
        <div className="bg-card border border-border rounded-xl p-5 md:col-span-2 space-y-4">
          <h3 className="font-bold text-sm flex items-center gap-1.5">
            <ClipboardCheck size={16} className="text-primary" />
            Inspection Registry & Actions Log
          </h3>

          {/* Complete Inspection Modal overlay */}
          {completingId && (
            <div className="bg-secondary/60 border border-primary/20 p-4 rounded-xl space-y-3">
              <p className="font-bold text-xs">Mark Inspection Completed & Log Actions Taken</p>
              <form onSubmit={handleCompleteSubmit} className="space-y-3 text-xs">
                <textarea
                  required
                  rows={3}
                  value={actionsTaken}
                  onChange={e => setActionsTaken(e.target.value)}
                  placeholder="E.g., Administered antibiotics. Enforced absolute quarantine. Instructed feed disinfection..."
                  className="w-full bg-card border border-border rounded-lg p-2.5 focus:outline-none focus:border-primary text-xs"
                ></textarea>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setCompletingId(null)}
                    className="px-2.5 py-1.5 rounded border border-border text-[10px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-2.5 py-1.5 rounded bg-primary text-primary-foreground font-bold text-[10px]"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
            {inspections.map((ins) => (
              <div
                key={ins.id}
                className="border border-border p-4 rounded-xl space-y-3 text-xs bg-secondary/10"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{ins.farmName}</h4>
                    <p className="text-[10px] text-muted-foreground">Inspector: {ins.officerName}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                    ins.status === 'COMPLETED'
                      ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
                      : 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20'
                  }`}>
                    {ins.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs border-l-2 border-primary/20 pl-3">
                  <p className="text-muted-foreground"><span className="font-bold text-foreground">Objective:</span> {ins.notes}</p>
                  <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                    <Clock size={11} /> {new Date(ins.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>

                {ins.status === 'COMPLETED' && ins.actionsTaken && (
                  <div className="bg-green-500/5 border border-green-500/10 p-2.5 rounded-lg">
                    <p className="text-[10px] text-green-700 dark:text-green-400 leading-relaxed font-mono">
                      <span className="font-bold block text-foreground mb-0.5">Actions Applied:</span>
                      {ins.actionsTaken}
                    </p>
                  </div>
                )}

                {ins.status === 'SCHEDULED' && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setCompletingId(ins.id)}
                      className="px-2.5 py-1 rounded bg-primary text-primary-foreground text-[10px] font-bold transition-colors hover:bg-primary/95"
                    >
                      Complete & Log Action
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
