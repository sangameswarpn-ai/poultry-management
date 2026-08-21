'use client';

import { FileText, TestTube, TrendingUp, AlertTriangle } from 'lucide-react';

export default function AdminReportsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Title */}
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight">Consolidated State Bulletins</h2>
        <p className="text-xs text-muted-foreground">Access state-wide biosecurity audit aggregations and active quarantine reports</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        
        {/* State Bulletins */}
        <div className="bg-card border border-border rounded-xl p-5 md:col-span-2 space-y-4">
          <h3 className="font-bold text-sm flex items-center gap-1.5">
            <FileText size={16} className="text-primary" />
            Consolidated Reports Archive
          </h3>

          <div className="space-y-4 text-xs">
            {[
              { title: "Monthly Biosecurity Compliance Summary", district: "All Districts", date: "Aug 2026", status: "Published", size: "1.4 MB" },
              { title: "Avian Influenza Sentinel Outbreak Report", district: "Namakkal Zone B", date: "Aug 20, 2026", status: "Active Quarantine", size: "450 KB" },
              { title: "State Hatcheries Health Audit", district: "Tamil Nadu Region", date: "July 2026", status: "Archive", size: "3.2 MB" }
            ].map((report, i) => (
              <div key={i} className="border border-border rounded-xl p-4 bg-secondary/15 flex justify-between items-center gap-4">
                <div>
                  <p className="font-bold text-sm text-foreground">{report.title}</p>
                  <p className="text-muted-foreground font-semibold">Scope: {report.district} • Size: {report.size}</p>
                  <span className="text-[10px] text-muted-foreground font-mono">Date: {report.date}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  report.status === 'Active Quarantine' 
                    ? 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20' 
                    : 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
                }`}>
                  {report.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* State Summary Stats */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-sm flex items-center gap-1.5">
            <TrendingUp size={16} className="text-primary" />
            Active Containments
          </h3>
          
          <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
            <div className="border-b border-border pb-3">
              <p className="font-bold text-foreground mb-1">Erumapatty Surveillance Area</p>
              <p className="text-[11px]">Surveillance radius: 10km. 5 farms active under daily swab checks.</p>
            </div>
            
            <div>
              <p className="font-bold text-foreground mb-1">Vellore Border Post</p>
              <p className="text-[11px]">Strict vehicle disinfection checkpoints active on State highways.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
