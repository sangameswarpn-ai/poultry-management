import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { RiskLevel } from '@prisma/client';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const farm = await prisma.farm.findUnique({
      where: { id },
      include: {
        farmer: {
          select: {
            name: true,
            phone: true,
            email: true
          }
        },
        healthLogs: {
          orderBy: { date: 'desc' },
          take: 7
        },
        biosecurityLogs: {
          orderBy: { date: 'desc' },
          take: 7
        }
      }
    });

    if (!farm) {
      return NextResponse.json(
        { error: 'Farm not found' },
        { status: 404 }
      );
    }

    // Resolve latest health log details
    const latestHealthLog = farm.healthLogs[0] || {
      totalAnimals: 10000,
      healthyCount: 9980,
      sickCount: 20,
      mortalityCount: 0
    };

    return NextResponse.json({
      id: farm.id,
      name: farm.name,
      farmerId: farm.farmerId,
      farmerName: farm.farmer.name,
      farmerPhone: farm.farmer.phone,
      lat: farm.lat,
      lng: farm.lng,
      address: farm.address,
      district: farm.district,
      state: farm.state,
      biosecurityScore: farm.biosecurityScore,
      riskLevel: farm.riskLevel,
      totalAnimals: latestHealthLog.totalAnimals,
      healthyCount: latestHealthLog.healthyCount,
      sickCount: latestHealthLog.sickCount,
      mortalityCount: latestHealthLog.mortalityCount,
      symptoms: []
    });
  } catch (error: any) {
    console.error('Error fetching farm details:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { biosecurityScore, riskLevel } = body;

    const updateData: any = {};
    if (biosecurityScore !== undefined) updateData.biosecurityScore = parseFloat(biosecurityScore);
    if (riskLevel !== undefined) updateData.riskLevel = riskLevel as RiskLevel;

    const updatedFarm = await prisma.farm.update({
      where: { id },
      data: updateData,
      include: {
        farmer: true
      }
    });

    return NextResponse.json({
      id: updatedFarm.id,
      name: updatedFarm.name,
      farmerId: updatedFarm.farmerId,
      farmerName: updatedFarm.farmer.name,
      farmerPhone: updatedFarm.farmer.phone,
      lat: updatedFarm.lat,
      lng: updatedFarm.lng,
      address: updatedFarm.address,
      district: updatedFarm.district,
      state: updatedFarm.state,
      biosecurityScore: updatedFarm.biosecurityScore,
      riskLevel: updatedFarm.riskLevel
    });
  } catch (error: any) {
    console.error('Error updating farm:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
