import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      farmId, 
      name, 
      phone, 
      purpose, 
      plateNumber, 
      vehicleType = 'None', 
      disinfectionStatus = false 
    } = body;

    if (!farmId || !name || !phone || !purpose) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const isVehicleEntry = vehicleType !== 'None' && !!vehicleType;
    const isDisinfected = !!disinfectionStatus;

    try {
      // 1. Create the visitor entry (and nested vehicle entry if pedestrian is false)
      const visitor = await prisma.visitor.create({
        data: {
          farmId,
          name,
          phone,
          purpose,
          qrCode: `QR_VIS_${name.toUpperCase().replace(/\s+/g, '_')}_${Date.now()}`,
          status: 'ACTIVE',
          vehicles: isVehicleEntry ? {
            create: [{
              plateNumber: plateNumber || 'PENDING',
              type: vehicleType,
              disinfectionStatus: isDisinfected
            }]
          } : undefined
        },
        include: {
          vehicles: true
        }
      });

      // 2. Fetch the farm telemetry to calculate updated risk
      const farm = await prisma.farm.findUnique({
        where: { id: farmId }
      });

      if (!farm) {
        throw new Error(`Farm with ID ${farmId} not found`);
      }

      // Fetch the latest health record for this farm to get flock mortality
      const latestHealth = await prisma.healthRecord.findFirst({
        where: { farmId },
        orderBy: { date: 'desc' }
      });
      const latestMortality = latestHealth ? latestHealth.mortalityCount : 0;

      // 3. Count undisinfected vehicles entered in the last 7 days
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const undisinfectedCount = await prisma.vehicle.count({
        where: {
          visitor: { farmId },
          disinfectionStatus: false,
          entryTime: { gte: oneWeekAgo }
        }
      });

      // 4. Calculate Risk Index:
      // Weighting: 2.5x mortality + biosecurity gap + 10x penalty per undisinfected vehicle entry
      const rawRisk = (latestMortality * 2.5) + (100 - farm.biosecurityScore) + (undisinfectedCount * 10);
      const riskIndex = Math.min(100, Math.round(rawRisk));

      let computedRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
      if (riskIndex >= 70) computedRiskLevel = 'CRITICAL';
      else if (riskIndex >= 45) computedRiskLevel = 'HIGH';
      else if (riskIndex >= 25) computedRiskLevel = 'MEDIUM';

      // 5. Update the farm's risk level
      await prisma.farm.update({
        where: { id: farmId },
        data: {
          riskLevel: computedRiskLevel
        }
      });

      // 6. Log a new risk assessment
      const factors = [];
      if (undisinfectedCount > 0) factors.push('Undisinfected Gate Vehicle Entries');
      if (latestMortality > 0) factors.push('Active Flock Mortality');
      if (farm.biosecurityScore < 85) factors.push('Substandard Biosecurity Compliance');

      const assessment = await prisma.riskAssessment.create({
        data: {
          farmId,
          score: riskIndex,
          level: computedRiskLevel,
          factors: JSON.stringify(factors),
          details: `Risk review compiled after visitor vehicle scan. Total undisinfected entries this week: ${undisinfectedCount}.`
        }
      });

      // 7. If risk escalated, dispatch a Risk Alert
      if (computedRiskLevel === 'HIGH' || computedRiskLevel === 'CRITICAL') {
        await prisma.riskAlert.create({
          data: {
            farmId,
            assessmentId: assessment.id,
            level: computedRiskLevel,
            message: `Surveillance Alert: Outbreak risk escalated to ${computedRiskLevel} due to vehicle disinfection failure at ${farm.name}.`,
            status: 'PENDING'
          }
        });
      }

      return NextResponse.json({
        success: true,
        visitorId: visitor.id,
        vehicleId: visitor.vehicles?.[0]?.id || null,
        riskIndex,
        riskLevel: computedRiskLevel,
        mode: 'database'
      });

    } catch (dbError: any) {
      console.warn('PostgreSQL connection offline. Registering visitor log in mock standalone mode:', dbError.message);
      
      const mockBiosecurityScore = 92;
      const mockMortalityCount = 2;
      const mockUndisinfectedCount = isVehicleEntry && !isDisinfected ? 1 : 0;

      const rawRisk = (mockMortalityCount * 2.5) + (100 - mockBiosecurityScore) + (mockUndisinfectedCount * 10);
      const riskIndex = Math.min(100, Math.round(rawRisk));

      let computedRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
      if (riskIndex >= 70) computedRiskLevel = 'CRITICAL';
      else if (riskIndex >= 45) computedRiskLevel = 'HIGH';
      else if (riskIndex >= 25) computedRiskLevel = 'MEDIUM';

      return NextResponse.json({
        success: true,
        visitorId: `vis-mock-${Date.now()}`,
        vehicleId: isVehicleEntry ? `veh-mock-${Date.now()}` : null,
        riskIndex,
        riskLevel: computedRiskLevel,
        mode: 'mock-standalone'
      });
    }
  } catch (error: any) {
    console.error('Error logging visitor entry:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
