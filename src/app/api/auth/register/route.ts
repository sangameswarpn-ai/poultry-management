import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { Role, Species } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, farmType = 'POULTRY', district = 'Namakkal', password = '', role = 'farmer' } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and Phone number are required.' },
        { status: 400 }
      );
    }

    const uppercaseRole = role.toUpperCase() as Role;
    const finalEmail = email ? email.trim() : `${phone.trim()}@poultrylens.com`;

    try {
      // 1. Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { phone: phone.trim() },
            { email: finalEmail }
          ]
        }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'A user with this phone number or email already exists.' },
          { status: 400 }
        );
      }

      // 2. Create the User record
      const newUser = await prisma.user.create({
        data: {
          name: name.trim(),
          phone: phone.trim(),
          email: finalEmail,
          passwordHash: password ? password : 'no_password_needed_for_farmers',
          role: uppercaseRole,
          district: district,
          state: 'Tamil Nadu'
        }
      });

      let farmId = '';
      
      // 3. If Role is Farmer, create a linked Farm record automatically
      if (uppercaseRole === 'FARMER') {
        const districtCoords: Record<string, { lat: number; lng: number }> = {
          Namakkal: { lat: 11.2215, lng: 78.1560 },
          Coimbatore: { lat: 11.0168, lng: 76.9558 },
          Salem: { lat: 11.6643, lng: 78.1460 },
          Vellore: { lat: 12.9165, lng: 79.1325 },
          Erode: { lat: 11.3410, lng: 77.7172 }
        };
        const coords = districtCoords[district] || { lat: 11.2215, lng: 78.1560 };

        const categoryLabel = farmType === 'POULTRY' ? 'Poultry' : farmType === 'CATTLE' ? 'Cattle' : farmType === 'GOAT' ? 'Goat' : 'Swine';

        const newFarm = await prisma.farm.create({
          data: {
            name: `${name.trim()}'s ${categoryLabel} Farm`,
            farmerId: newUser.id,
            lat: coords.lat,
            lng: coords.lng,
            address: `${district} Grid, Tamil Nadu`,
            district,
            state: 'Tamil Nadu',
            species: farmType as Species,
            biosecurityScore: 100.0,
            riskLevel: 'LOW'
          }
        });
        
        farmId = newFarm.id;

        // Initialize a starting health log for the farm
        await prisma.healthRecord.create({
          data: {
            farmId: newFarm.id,
            totalAnimals: 100,
            healthyCount: 100,
            sickCount: 0,
            mortalityCount: 0,
            species: farmType as Species,
            notes: 'Initial starting registration health record.'
          }
        });
      }

      return NextResponse.json({
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          phone: newUser.phone,
          email: newUser.email,
          role: newUser.role
        },
        farmId
      });
    } catch (dbError: any) {
      console.warn('PostgreSQL database offline during registration. Falling back to sandbox response...', dbError);
      
      return NextResponse.json({
        success: true,
        sandbox: true,
        user: {
          id: `usr-sandbox-${Date.now()}`,
          name: name.trim(),
          phone: phone.trim(),
          email: finalEmail,
          role: role.toUpperCase()
        },
        farmId: `frm-sandbox-${Date.now()}`
      });
    }
  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
