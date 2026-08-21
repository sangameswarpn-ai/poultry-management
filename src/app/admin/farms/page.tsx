'use client';

import { useState } from 'react';
import { Search, Filter, ShieldAlert, CheckCircle, Landmark, Building2 } from 'lucide-react';
import { mockFarms } from '@/mock-data';

export default function AdminFarmsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');

  const filteredFarms = mockFarms.filter(f => {
    const matchesSearch = 
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.farmerName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDistrict = districtFilter === 'ALL' || f.district === districtFilter;
    
    return matchesSearch && matchesDistrict;
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-risk-critical';
      case 'HIGH': return 'text-risk-high';
      case 'MEDIUM': return 'text-risk-medium';
      default: return 'text-risk-low';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight">State Farm Registry</h2>
        <p className="text-xs text-muted-foreground">Comprehensive census and diagnostic database of all territorial entities</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search farm name or farmer..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-muted-foreground" />
          <select
            value={districtFilter}
            onChange={e => setDistrictFilter(e.target.value)}
            className="bg-card border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary font-medium"
          >
            <option value="ALL">All Districts</option>
            <option value="Namakkal">Namakkal</option>
            <option value="Coimbatore">Coimbatore</option>
            <option value="Vellore">Vellore</option>
            <option value="Salem">Salem</option>
          </select>
        </div>
      </div>

      {/* Table listing */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold">
                <th className="p-4">Farm Details</th>
                <th className="p-4">Farmer Operator</th>
                <th className="p-4">District</th>
                <th className="p-4">Biosecurity Score</th>
                <th className="p-4">Risk Level</th>
                <th className="p-4 text-right">Flock Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredFarms.map((farm) => (
                <tr key={farm.id} className="hover:bg-secondary/15">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-primary shrink-0" />
                      <div>
                        <p className="font-bold text-foreground">{farm.name}</p>
                        <p className="text-[10px] text-muted-foreground">ID: {farm.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-foreground">{farm.farmerName}</p>
                    <p className="text-[10px] text-muted-foreground">{farm.farmerPhone}</p>
                  </td>
                  <td className="p-4 font-medium text-muted-foreground">{farm.district}</td>
                  <td className="p-4 font-bold text-primary">{farm.biosecurityScore}%</td>
                  <td className="p-4">
                    <span className={`font-extrabold flex items-center gap-1 ${getRiskColor(farm.riskLevel)}`}>
                      <span className="w-2 h-2 rounded-full bg-current"></span>
                      {farm.riskLevel}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-foreground">
                    {farm.totalAnimals.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
