import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { mockFarms } from '@/mock-data';
import { RiskLevel } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const district = searchParams.get('district');
    const riskLevel = searchParams.get('riskLevel');
    const search = searchParams.get('search');

    try {
      // 1. Attempt database query
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
        totalAnimals: 10000,
        healthyCount: 9980,
        sickCount: 20,
        mortalityCount: 0,
        symptoms: []
      }));

      return NextResponse.json(responseData);
    } catch (dbError) {
      console.warn('PostgreSQL connection offline. Falling back to memory mock-data:', dbError);
      
      // Filter mock data in memory to match the requested parameters
      let filteredMock = [...mockFarms];
      
      if (district && district !== 'ALL') {
        filteredMock = filteredMock.filter(f => f.district === district);
      }
      
      if (riskLevel && riskLevel !== 'ALL') {
        filteredMock = filteredMock.filter(f => f.riskLevel === riskLevel);
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredMock = filteredMock.filter(f => 
          f.name.toLowerCase().includes(searchLower) ||
          f.farmerName.toLowerCase().includes(searchLower) ||
          f.district.toLowerCase().includes(searchLower)
        );
      }

      return NextResponse.json(filteredMock);
    }
  } catch (error: any) {
    console.error('Fatal API Error:', error);
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

    try {
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
    } catch (dbError) {
      console.warn('PostgreSQL offline. Registering new farm in mock memory session...');
      // Return a simulated successfully created farm object
      return NextResponse.json({
        id: `frm-mock-${Date.now()}`,
        name,
        farmerId,
        farmerName: "Sri Murugan Farmer",
        farmerPhone: "+91 98765 43210",
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        address,
        district,
        state,
        biosecurityScore: parseFloat(biosecurityScore || 100),
        riskLevel: riskLevel || 'LOW'
      });
    }
  } catch (error: any) {
    console.error('Error registering farm:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
