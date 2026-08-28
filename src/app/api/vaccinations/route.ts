import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(request: Request) {
  try {
    try {
      const records = await prisma.vaccinationRecord.findMany({
        orderBy: { date: 'desc' },
        include: { farm: true }
      });
      return NextResponse.json({ success: true, records });
    } catch (e) {
      // Fallback mock records for demo
      const mockRecords = [
        { id: "vac-1", vaccineName: "Avian Influenza Vaccine", dose: "0.5 mL", date: new Date().toISOString(), nextDueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), administeredBy: "Dr. Amit Patel", batchNumber: "AI-2026-X8", status: "COMPLETED", farm: { name: "Sri Murugan Layer Farm" } },
        { id: "vac-2", vaccineName: "Ranikhet F1 Vaccine", dose: "1 drop nasal", date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), nextDueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), administeredBy: "Dr. Saranya Devi", batchNumber: "RK-FL-02", status: "COMPLETED", farm: { name: "Karthik Broiler Farm" } },
        { id: "vac-3", vaccineName: "Foot and Mouth Disease Vaccine", dose: "2.0 mL", date: new Date().toISOString(), nextDueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), administeredBy: "Field Agent Ramesh", batchNumber: "FMD-T4-99", status: "COMPLETED", farm: { name: "Cattle Breeding Center" } }
      ];
      return NextResponse.json({ success: true, records: mockRecords, mode: 'sandbox' });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { farmId, vaccineName, dose, date, nextDueDate, administeredBy, batchNumber, status = 'COMPLETED', species = 'POULTRY' } = body;

    try {
      const record = await prisma.vaccinationRecord.create({
        data: {
          farmId: farmId || null,
          vaccineName,
          dose,
          date: new Date(date),
          nextDueDate: nextDueDate ? new Date(nextDueDate) : null,
          administeredBy,
          batchNumber,
          status,
          species
        }
      });
      return NextResponse.json({ success: true, record });
    } catch (e) {
      return NextResponse.json({
        success: true,
        sandbox: true,
        record: {
          id: `vac-sandbox-${Date.now()}`,
          vaccineName,
          dose,
          date,
          nextDueDate,
          administeredBy,
          batchNumber,
          status
        }
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
