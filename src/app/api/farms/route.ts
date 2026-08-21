import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { RiskLevel } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const district = searchParams.get('district');
    const riskLevel = searchParams.get('riskLevel');
    const search = searchParams.get('search');

    // Build filter query
    const where: any = {};

    if (district && district !== 'ALL') {
      where.district = district;
    }

    if (riskLevel && riskLevel !== 'ALL') {
      where.riskLevel = riskLevel as RiskLevel;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { farmer: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const farms = await prisma.farm.findMany({
      where,
      include: {
        farmer: {
          select: {
            name: true,
            phone: true,
            email: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Map database structures to match mock-data specifications expected by components
    const responseData = farms.map(farm => ({
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
      // Default placeholder fields since this is a GET overview
      totalAnimals: 10000,
      healthyCount: 9980,
      sickCount: 20,
      mortalityCount: 0,
      symptoms: []
    }));

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error('Error fetching farms:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, farmerId, lat, lng, address, district, state, biosecurityScore, riskLevel } = body;

    if (!name || !farmerId || lat === undefined || lng === undefined || !district || !state) {
      return NextResponse.json(
        { error: 'Missing mandatory fields' },
        { status: 400 }
      );
    }

    const newFarm = await prisma.farm.create({
      data: {
        name,
        farmerId,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        address,
        district,
        state,
        biosecurityScore: parseFloat(biosecurityScore || 100),
        riskLevel: (riskLevel as RiskLevel) || 'LOW'
      },
      include: {
        farmer: true
      }
    });

    return NextResponse.json({
      id: newFarm.id,
      name: newFarm.name,
      farmerId: newFarm.farmerId,
      farmerName: newFarm.farmer.name,
      farmerPhone: newFarm.farmer.phone,
      lat: newFarm.lat,
      lng: newFarm.lng,
      address: newFarm.address,
      district: newFarm.district,
      state: newFarm.state,
      biosecurityScore: newFarm.biosecurityScore,
      riskLevel: newFarm.riskLevel
    });
  } catch (error: any) {
    console.error('Error registering farm:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
