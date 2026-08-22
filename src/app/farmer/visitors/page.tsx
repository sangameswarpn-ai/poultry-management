'use client';

import { useState, useEffect } from 'react';
import { Users, QrCode, Truck, UserPlus, History, Clock, Camera } from 'lucide-react';
import { mockVisitors } from '@/mock-data';

export default function VisitorsLogPage() {
  const [visitors, setVisitors] = useState(mockVisitors);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('None');
  const [disinfection, setDisinfection] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [cameraActive, setCameraActive] = useState(false);
  const [scanFeedback, setScanFeedback] = useState<string | null>(null);

  useEffect(() => {
    let html5QrcodeScanner: any = null;
    
    if (cameraActive) {
      // Dynamically import the browser-only scanner module to bypass SSR window errors
      import('html5-qrcode').then((module) => {
        const Html5QrcodeScanner = module.Html5QrcodeScanner;
        html5QrcodeScanner = new Html5QrcodeScanner(
          "reader",
          { fps: 10, qrbox: { width: 250, height: 250 } },
          /* verbose= */ false
        );

        const onScanSuccess = (decodedText: string) => {
          try {
            // Attempt to parse QR code as a structured visitor JSON pass
            const data = JSON.parse(decodedText);
            setName(data.name || '');
            setPhone(data.phone || '');
            setPurpose(data.purpose || '');
            setPlateNumber(data.plateNumber || '');
            setVehicleType(data.vehicleType || 'None');
            setDisinfection(data.disinfectionStatus || false);
            setScanFeedback('✓ QR Pass Scanned! Form fields auto-populated.');
          } catch {
            // Fallback for simple plaintext QR passes
            setName(decodedText);
            setPurpose('QR Audited Entry');
            setScanFeedback('✓ QR Scanned! Plaintext Name auto-populated.');
          }

          // Shutdown scanner on success
          if (html5QrcodeScanner) {
            html5QrcodeScanner.clear().catch((err: any) => console.warn('Clear scanner warning:', err));
          }
          setCameraActive(false);
          setTimeout(() => setScanFeedback(null), 5000);
        };

        const onScanError = (errorMessage: string) => {
          // Fail silently on standard check-frame failures
        };

        html5QrcodeScanner.render(onScanSuccess, onScanError);
      }).catch((err) => console.error('Error importing html5-qrcode:', err));
    }

    return () => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch((err: any) => console.warn('Cleanup scanner warning:', err));
      }
    };
  }, [cameraActive]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVisitor = {
      id: `vis-${Date.now()}`,
      farmId: "frm-1",
      name,
      phone,
      purpose,
      entryTime: new Date().toISOString(),
      qrCode: `QR_VIS_${name.toUpperCase().replace(/\s+/g, '_')}`,
      status: 'ACTIVE' as const,
      plateNumber: plateNumber || undefined,
      vehicleType: vehicleType !== 'None' ? vehicleType : undefined,
      disinfectionStatus: disinfection
    };

    setVisitors([newVisitor, ...visitors]);
    setName('');
    setPhone('');
    setPurpose('');
    setPlateNumber('');
    setVehicleType('None');
    setDisinfection(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleMarkExit = (id: string) => {
    setVisitors(prev =>
      prev.map(v =>
        v.id === id
          ? { ...v, status: 'EXITED' as const, exitTime: new Date().toISOString() }
          : v
      )
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight">Visitor & Vehicle Tracing</h2>
        <p className="text-xs text-muted-foreground">Manage visitors and vehicle disinfection checkposts for disease tracing</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Farm Gate QR Code */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4 flex flex-col items-center justify-center text-center">
          <h3 className="font-bold text-sm flex items-center gap-1.5 self-start text-foreground">
            <QrCode size={16} className="text-primary" />
            Gate Check-in QR Code
          </h3>
          
          <div className="bg-white p-3 rounded-lg border border-border inline-block my-2">
            {/* Draw a gorgeous SVG mock QR code */}
            <svg width="150" height="150" viewBox="0 0 29 29" className="text-black">
              <path fill="currentColor" d="M0 0h7v7H0zm1 1v5h5V1zm8 0h1v1H9zm1 0h2v1h-2zm3 0h1v1h-1zm1 0h1v3h-1v-2h-1v-1zm4 0h7v7h-7zm1 1v5h5V2zm-9 2h1v1H9zm1 1h1v1h-1zm3 0h1v1H9zm5 0h1v1h-1zm1 0h2v1h-2zm-6 2h1v1H9zm2 0h1v1h-1zm2 0h1v1zm-4 1h1v1H9zm1 1h1v1h-1zm2 0h1v1zm1 0h1v1h-1zm4 1h1v1zm1 0h1v2h-1zm-6 1h2v1h-2zm6 1h1v1h-1zm1 0h1v1h-1zm-10 1h2v1H9zm4 0h1v1h-1zm1 0h1v1h-1zm-1 1h1v2h-1zm6 0h1v1h-1zm1 0h1v1h-1zm-8 1h1v1H9zm2 0h1v1h-1zm6 0h2v1h-2zm-8 1h1v1H9zm4 0h1v1h-1zm1 0h1v1h-1zm-10 1h7v7H9zm1 1v5h5v-5zm10 0h1v1zm1 0h1v1zm-2 1h1v1zm4 0h1v1zm-3 1h1v1zm2 0h1v1zm-2 1h1v1zm4 0h2v1zm-6 1h1v1zm2 0h1v1zm-2 1h1v1zm3 0h1v1zm-9-2h1v1H9zm1 1h1v1h-1zm3 0h1v1H9zm-5 1h1v1H9zm3 0h1v1H9zm-5 1h1v1H9" />
            </svg>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs font-bold text-foreground">Scan at Farm Gate</p>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Instruct drivers and visitors to scan this QR code on entry to auto-register via mobile browsers.
            </p>
          </div>
        </div>

        {/* Entry Log Form */}
        <div className="bg-card border border-border rounded-xl p-5 md:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-3">
            <h3 className="font-bold text-sm flex items-center gap-1.5 text-foreground">
              <UserPlus size={16} className="text-primary" />
              Manual Visitor Log-in
            </h3>
            
            <button
              type="button"
              onClick={() => setCameraActive(!cameraActive)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-extrabold bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Camera size={12} />
              {cameraActive ? 'Close Scanner' : 'Scan Visitor QR Pass'}
            </button>
          </div>

          {scanFeedback && (
            <p className="text-[10px] text-green-600 dark:text-green-400 font-bold bg-green-500/10 p-2.5 rounded border border-green-500/20">
              {scanFeedback}
            </p>
          )}

          {cameraActive && (
            <div className="space-y-2 py-2">
              <div id="reader" className="w-full max-w-sm mx-auto overflow-hidden border border-border rounded-xl shadow-inner bg-secondary/20 p-2"></div>
              <p className="text-[9px] text-center text-muted-foreground leading-relaxed">
                Hold the visitor pass QR code in front of the camera.
                <span className="block mt-0.5 font-semibold text-primary">JSON format: name, phone, purpose, plateNumber, vehicleType, disinfectionStatus</span>
              </p>
            </div>
          )}

          {submitted && (
            <p className="text-[10px] text-green-600 dark:text-green-400 font-bold bg-green-500/10 p-2 rounded border border-green-500/20">
              ✓ Visitor checked in. Log appended below.
            </p>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 text-xs">
            <div>
              <label className="text-muted-foreground font-semibold block mb-1">Visitor Full Name</label>
              <input
                required
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="E.g., Anbu Selvan"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
              />
            </div>
            
            <div>
              <label className="text-muted-foreground font-semibold block mb-1">Phone Number</label>
              <input
                required
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="E.g., +91 99999 88888"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-muted-foreground font-semibold block mb-1">Visit Purpose</label>
              <input
                required
                type="text"
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                placeholder="E.g., Egg pickup / feed loader"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-muted-foreground font-semibold block mb-1">Vehicle Type</label>
              <select
                value={vehicleType}
                onChange={e => setVehicleType(e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
              >
                <option value="None">None (Pedestrian)</option>
                <option value="Two Wheeler">Two Wheeler</option>
                <option value="Car / Jeep">Car / Jeep</option>
                <option value="Mini Truck / Pickup">Mini Truck / Pickup</option>
                <option value="Heavy Truck">Heavy Truck</option>
              </select>
            </div>

            {vehicleType !== 'None' && (
              <>
                <div>
                  <label className="text-muted-foreground font-semibold block mb-1">Vehicle License Plate</label>
                  <input
                    type="text"
                    value={plateNumber}
                    onChange={e => setPlateNumber(e.target.value)}
                    placeholder="E.g., TN-28-AB-1234"
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  />
                </div>
                
                <div className="flex items-center gap-2 mt-5">
                  <input
                    type="checkbox"
                    id="disinfection"
                    checked={disinfection}
                    onChange={e => setDisinfection(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                  <label htmlFor="disinfection" className="font-bold text-foreground cursor-pointer">
                    Vehicle Disinfected at Gate
                  </label>
                </div>
              </>
            )}

            <button
              type="submit"
              className="sm:col-span-2 bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-2.5 rounded-lg transition-colors text-center"
            >
              Register & Check-In
            </button>
          </form>
        </div>

        {/* Visitor log List */}
        <div className="bg-card border border-border rounded-xl p-5 md:col-span-3 space-y-4">
          <h3 className="font-bold text-sm flex items-center gap-1.5 text-foreground">
            <History size={16} className="text-primary" />
            Today's Logbook & Contact Tracing Grid
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold">
                  <th className="pb-2">Visitor</th>
                  <th className="pb-2">Purpose</th>
                  <th className="pb-2">Vehicle</th>
                  <th className="pb-2">Sanitization</th>
                  <th className="pb-2">Entry Time</th>
                  <th className="pb-2">Exit Time</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {visitors.map((vis) => (
                  <tr key={vis.id} className="hover:bg-secondary/20">
                    <td className="py-3">
                      <p className="font-bold text-foreground">{vis.name}</p>
                      <p className="text-[10px] text-muted-foreground">{vis.phone}</p>
                    </td>
                    <td className="py-3 text-muted-foreground">{vis.purpose}</td>
                    <td className="py-3">
                      {vis.vehicleType ? (
                        <span className="flex items-center gap-1">
                          <Truck size={12} className="text-muted-foreground" />
                          {vis.plateNumber} ({vis.vehicleType})
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">Pedestrian</span>
                      )}
                    </td>
                    <td className="py-3">
                      {vis.vehicleType ? (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          vis.disinfectionStatus
                            ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                            : 'bg-red-500/10 text-red-700 dark:text-red-400'
                        }`}>
                          {vis.disinfectionStatus ? 'Disinfected' : 'No Spray'}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-3 font-mono text-[10px]">
                      {new Date(vis.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 font-mono text-[10px]">
                      {vis.exitTime ? (
                        new Date(vis.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      ) : (
                        <span className="text-orange-500 font-sans flex items-center gap-1 font-semibold">
                          <Clock size={10} className="animate-spin" /> Inside Farm
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {vis.status === 'ACTIVE' ? (
                        <button
                          onClick={() => handleMarkExit(vis.id)}
                          className="px-2 py-1 rounded bg-secondary hover:bg-primary hover:text-primary-foreground border border-border text-[10px] font-bold transition-colors"
                        >
                          Mark Exit
                        </button>
                      ) : (
                        <span className="text-[10px] text-muted-foreground font-semibold">Logged Out</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
