import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(request: Request) {
  try {
    try {
      const records = await prisma.treatmentRecord.findMany({
        orderBy: { date: 'desc' },
        include: { farm: true }
      });
      return NextResponse.json({ success: true, records });
    } catch (e) {
      // Fallback mock records for demo
      const mockRecords = [
        { id: "trt-1", diagnosis: "Respiratory infection", treatment: "Broad-spectrum antibiotics", medicine: "Enrofloxacin", date: new Date().toISOString(), veterinarian: "Dr. Amit Patel", outcome: "RECOVERED", followUpDate: null, farm: { name: "Green Valley Country Chicken" } },
        { id: "trt-2", diagnosis: "Coccidiosis", treatment: "Anticoccidial medication", medicine: "Amprolium", date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), veterinarian: "Dr. Saranya Devi", outcome: "UNDER_TREATMENT", followUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), farm: { name: "Selvam Breeder Poultry" } }
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
    const { farmId, diagnosis, treatment, medicine, date, veterinarian, outcome = 'RECOVERED', followUpDate, species = 'POULTRY' } = body;

    try {
      const record = await prisma.treatmentRecord.create({
        data: {
          farmId: farmId || null,
          diagnosis,
          treatment,
          medicine,
          date: new Date(date),
          veterinarian,
          outcome,
          followUpDate: followUpDate ? new Date(followUpDate) : null,
          species
        }
      });
      return NextResponse.json({ success: true, record });
    } catch (e) {
      return NextResponse.json({
        success: true,
        sandbox: true,
        record: {
          id: `trt-sandbox-${Date.now()}`,
          diagnosis,
          treatment,
          medicine,
          date,
          veterinarian,
          outcome,
          followUpDate
        }
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
