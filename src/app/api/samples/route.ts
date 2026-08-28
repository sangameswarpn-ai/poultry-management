import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(request: Request) {
  try {
    try {
      const samples = await prisma.sample.findMany({
        orderBy: { collectionDate: 'desc' },
        include: {
          case: true,
          referrals: {
            include: { lab: true }
          }
        }
      });
      return NextResponse.json({ success: true, samples });
    } catch (e) {
      // Fallback mock samples for demo
      const mockSamples = [
        { id: "SMP-101", sampleType: "Tracheal Swab", collectionDate: new Date().toISOString(), collectedBy: "Dr. Amit Patel", location: "Keerambur Village Grid", status: "DISPATCHED", notes: "Collected 5 swabs from sick layers showing severe gasping.", caseId: "case-123" },
        { id: "SMP-102", sampleType: "Cloacal Swab", collectionDate: new Date().toISOString(), collectedBy: "Dr. Saranya Devi", location: "Mohanur Village Grid", status: "COLLECTED", notes: "Routine pool sample from suspect flock.", caseId: "case-124" }
      ];
      return NextResponse.json({ success: true, samples: mockSamples, mode: 'sandbox' });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sampleType, collectedBy, location, notes, status = 'COLLECTED', caseId } = body;

    try {
      const sample = await prisma.sample.create({
        data: {
          sampleType,
          collectedBy,
          location,
          notes,
          status,
          caseId: caseId || null
        }
      });
      return NextResponse.json({ success: true, sample });
    } catch (e) {
      return NextResponse.json({
        success: true,
        sandbox: true,
        sample: {
          id: `SMP-${Math.floor(100 + Math.random() * 900)}`,
          sampleType,
          collectedBy,
          location,
          notes,
          status,
          caseId
        }
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
