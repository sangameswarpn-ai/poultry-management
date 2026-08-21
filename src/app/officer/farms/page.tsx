'use client';

import { useState } from 'react';
import { Building2, Search, Filter, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';
import { mockFarms } from '@/mock-data';
import Link from 'next/link';


export default function OfficerFarmsRegistryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');

  const filteredFarms = mockFarms.filter((farm) => {
    const matchesSearch =
      farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farm.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farm.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = filterRisk === 'ALL' || farm.riskLevel === filterRisk;

    return matchesSearch && matchesRisk;
  });

  const getRiskBadgeStyles = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-risk-critical/10 text-risk-critical border-risk-critical/20';
      case 'HIGH': return 'bg-risk-high/10 text-risk-high border-risk-high/20';
      case 'MEDIUM': return 'bg-risk-medium/10 text-risk-medium border-risk-medium/20';
      default: return 'bg-risk-low/10 text-risk-low border-risk-low/20';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight">Registered Poultry Farms</h2>
        <p className="text-xs text-muted-foreground">Audit biosecurity logs, risk indices, and geographic nodes</p>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search farm name, farmer, or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-muted-foreground" />
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="bg-card border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary font-medium"
          >
            <option value="ALL">Filter by Risk (All)</option>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="CRITICAL">Critical Risk</option>
          </select>
        </div>
      </div>

      {/* Farm Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredFarms.map((farm) => (
          <div
            key={farm.id}
            className="bg-card border border-border rounded-xl p-5 hover:shadow-sm transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="bg-primary/10 text-primary p-2 rounded-lg">
                  <Building2 size={16} />
                </div>
                
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${getRiskBadgeStyles(farm.riskLevel)}`}>
                  {farm.riskLevel}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-foreground truncate">{farm.name}</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">ID: {farm.id} • {farm.district}, {farm.state}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] bg-secondary/30 p-2.5 rounded-lg border border-border/60">
                <div>
                  <span className="text-muted-foreground block font-medium">Compliance Rate</span>
                  <span className="font-bold text-foreground text-xs">{farm.biosecurityScore}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Flock Size</span>
                  <span className="font-bold text-foreground text-xs">{farm.totalAnimals.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Sick Birds</span>
                  <span className="font-bold text-risk-medium text-xs">{farm.sickCount}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Deaths Today</span>
                  <span className="font-bold text-risk-critical text-xs">{farm.mortalityCount}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 mt-4 flex items-center justify-between text-[11px]">
              <div>
                <span className="text-muted-foreground">Farmer: </span>
                <span className="font-bold text-foreground">{farm.farmerName}</span>
              </div>
              
              <Link
                href={`/officer/inspections?farmId=${farm.id}`}
                className="flex items-center gap-1 font-bold text-primary hover:underline"
              >
                Schedule Visit
                <ArrowRight size={12} />
              </Link>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
