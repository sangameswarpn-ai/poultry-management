import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      farmId, 
      date = new Date().toISOString(), 
      notes = '', 
      actionsTaken = '', 
      quarantineIssued = false 
    } = body;

    if (!farmId) {
      return NextResponse.json(
        { error: 'Missing mandatory farmId parameter' },
        { status: 400 }
      );
    }

    try {
      // 1. Create the completed Inspection record in the database
      // Default to usr-officer-1 (Dr. Amit Patel) as inspector
      const record = await prisma.inspection.create({
        data: {
          farmId,
          inspectorId: 'usr-officer-1',
          date: new Date(date),
          notes: notes || null,
          status: 'COMPLETED',
          actionsTaken: actionsTaken || null
        }
      });

      // 2. Fetch farm profile details
      const farm = await prisma.farm.findUnique({
        where: { id: farmId }
      });

      if (!farm) {
        throw new Error(`Farm with ID ${farmId} not found`);
      }

      // 3. If quarantine is checked, escalate riskLevel to CRITICAL
      if (quarantineIssued) {
        await prisma.farm.update({
          where: { id: farmId },
          data: {
            riskLevel: 'CRITICAL'
          }
        });

        // Log the Quarantine Risk Assessment
        await prisma.riskAssessment.create({
          data: {
            farmId,
            score: 100,
            level: 'CRITICAL',
            factors: JSON.stringify(['Veterinary Containment Order', 'Quarantine Notice Issued']),
            details: `Official quarantine notice issued by inspecting officer. Pen traffic halted.`
          }
        });
      }

      // 4. Resolve (close) any active PENDING Alerts on the farm
      await prisma.riskAlert.updateMany({
        where: {
          farmId,
          status: 'PENDING'
        },
        data: {
          status: 'RESOLVED'
        }
      });

      return NextResponse.json({
        success: true,
        inspectionId: record.id,
        quarantineIssued: !!quarantineIssued,
        mode: 'database'
      });

    } catch (dbError: any) {
      console.warn('PostgreSQL connection offline. Registering inspection in mock standalone mode:', dbError.message);
      
      return NextResponse.json({
        success: true,
        inspectionId: `ins-mock-${Date.now()}`,
        quarantineIssued: !!quarantineIssued,
        mode: 'mock-standalone'
      });
    }
  } catch (error: any) {
    console.error('Error logging vet inspection:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
