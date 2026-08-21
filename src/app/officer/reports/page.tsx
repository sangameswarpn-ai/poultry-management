'use client';

import { FileText, Award, Calendar, TestTube, Check } from 'lucide-react';
import { mockDiseaseReports } from '@/mock-data';

export default function OfficerReportsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Title */}
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight">Epidemic & Laboratory Reports</h2>
        <p className="text-xs text-muted-foreground">Access state diagnostic laboratory swab reports and regional health bulletins</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Lab swab Test reports */}
        <div className="bg-card border border-border rounded-xl p-5 md:col-span-2 space-y-4">
          <h3 className="font-bold text-sm flex items-center gap-1.5">
            <TestTube size={16} className="text-primary" />
            Diagnostic Lab Swab Diagnostics
          </h3>

          <div className="space-y-4">
            {[
              { farm: "Ponni Poultry Farm", sample: "Oropharyngeal swab", test: "PCR - Avian Influenza (H5N1)", result: "DETECTED (POS)", date: "Aug 20, 2026", status: "CRITICAL" },
              { farm: "Selvam Breeder Poultry", sample: "Cloacal swab", test: "PCR - Newcastle Disease Virus", result: "NOT DETECTED (NEG)", date: "Aug 19, 2026", status: "NORMAL" },
              { farm: "Green Valley Country Chicken", sample: "Feed culture test", test: "Salmonella enteritidis screen", result: "DETECTED (POS)", date: "Aug 17, 2026", status: "HIGH" }
            ].map((lab, i) => (
              <div key={i} className="border border-border rounded-xl p-4 bg-secondary/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <p className="font-bold text-sm text-foreground">{lab.farm}</p>
                  <p className="text-muted-foreground font-semibold">Test: {lab.test} ({lab.sample})</p>
                  <div className="flex gap-4 text-[10px] text-muted-foreground font-mono">
                    <span>Date: {lab.date}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold border ${
                    lab.status === 'CRITICAL' 
                      ? 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20' 
                      : lab.status === 'HIGH'
                      ? 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/20'
                      : 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20'
                  }`}>
                    {lab.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Bulletins */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-sm flex items-center gap-1.5">
            <FileText size={16} className="text-primary" />
            Epidemic Bulletins
          </h3>

          <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
            <div className="border-b border-border pb-3">
              <p className="font-bold text-foreground mb-1">State Health Advisory (H5N1)</p>
              <p className="text-[11px]">Strict enforcement of 10km surveillance zones surrounding detection nodes in Erumapatty.</p>
              <span className="text-[9px] text-muted-foreground font-mono block mt-1">Released: Today</span>
            </div>
            
            <div className="pb-3">
              <p className="font-bold text-foreground mb-1">Weekly Feed Safety Bulletin</p>
              <p className="text-[11px]">Salmonella trace detected in imported soybean feed batches. Review supplier registers.</p>
              <span className="text-[9px] text-muted-foreground font-mono block mt-1">Released: Aug 18, 2026</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
