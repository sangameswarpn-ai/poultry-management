'use client';

import { Building2, MapPin, CheckCircle, Scale, Calendar } from 'lucide-react';
import { mockFarms } from '@/mock-data';

export default function FarmProfilePage() {
  const farm = mockFarms[0]; // Sri Murugan Layer Farm

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight">My Farm Profile</h2>
        <p className="text-xs text-muted-foreground">Manage your physical asset configurations and GIS coordinates</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Core Farm Details */}
        <div className="bg-card border border-border rounded-xl p-5 md:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary p-2.5 rounded-lg">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base">{farm.name}</h3>
              <p className="text-xs text-muted-foreground">ID: {farm.id}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-xs border-t border-border pt-4">
            <div>
              <p className="text-muted-foreground font-semibold">Farmer Registered Name</p>
              <p className="font-bold mt-0.5 text-foreground">{farm.farmerName}</p>
            </div>
            
            <div>
              <p className="text-muted-foreground font-semibold">Contact Mobile</p>
              <p className="font-bold mt-0.5 text-foreground">{farm.farmerPhone}</p>
            </div>

            <div>
              <p className="text-muted-foreground font-semibold">District Region</p>
              <p className="font-bold mt-0.5 text-foreground">{farm.district}</p>
            </div>

            <div>
              <p className="text-muted-foreground font-semibold">State Jurisdiction</p>
              <p className="font-bold mt-0.5 text-foreground">{farm.state}</p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-muted-foreground font-semibold">Farm Address Location</p>
              <p className="font-bold mt-0.5 text-foreground">{farm.address}</p>
            </div>
          </div>
        </div>

        {/* GIS Coordinates & Satellite Card */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-sm flex items-center gap-1.5 text-foreground">
            <MapPin size={16} className="text-primary" />
            GIS Positioning Data
          </h3>

          <div className="space-y-3 bg-secondary/50 p-3 rounded-lg border border-border text-xs font-mono">
            <div>
              <span className="text-[10px] text-muted-foreground block">LATITUDE</span>
              <span className="font-bold text-foreground">{farm.lat.toFixed(6)}</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block">LONGITUDE</span>
              <span className="font-bold text-foreground">{farm.lng.toFixed(6)}</span>
            </div>
            <div className="bg-green-500/10 text-green-700 dark:text-green-400 p-2 rounded text-[10px] font-sans font-semibold flex items-center gap-1.5">
              <CheckCircle size={12} />
              GPS Coordinates Locked
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground leading-relaxed">
            GIS tags link directly to District Outbreak Maps. If location data shifts during local audits, contact your Veterinary Officer.
          </p>
        </div>

        {/* Flock Details */}
        <div className="bg-card border border-border rounded-xl p-5 md:col-span-3 space-y-4">
          <h3 className="font-bold text-sm">Poultry Species Allocation</h3>
          
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { type: "Layers (Egg Production)", count: "8,500 birds", age: "28 Weeks", health: "Healthy" },
              { type: "Chicks (Brooding)", count: "1,500 birds", age: "2 Weeks", health: "Under Watch" },
              { type: "Feed Type In Use", count: "Pre-Lay Mesh", age: "N/A", health: "Sanitized Feed" }
            ].map((spec, i) => (
              <div key={i} className="border border-border rounded-lg p-4 bg-secondary/20 space-y-2 text-xs">
                <p className="font-bold text-foreground">{spec.type}</p>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Flock Count:</span>
                  <span className="font-semibold text-foreground">{spec.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Flock Age:</span>
                  <span className="font-semibold text-foreground">{spec.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Health Status:</span>
                  <span className={`font-semibold ${spec.health === 'Healthy' ? 'text-risk-low' : 'text-risk-medium'}`}>{spec.health}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
