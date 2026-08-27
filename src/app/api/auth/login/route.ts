import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { emailOrMobile, password = '', role = 'farmer' } = body;

    if (!emailOrMobile) {
      return NextResponse.json(
        { error: 'Email or Mobile number is required.' },
        { status: 400 }
      );
    }

    const uppercaseRole = role.toUpperCase();
    const isFarmer = uppercaseRole === 'FARMER';

    if (!isFarmer && !password) {
      return NextResponse.json(
        { error: 'Password is required.' },
        { status: 400 }
      );
    }

    try {
      // 1. Fetch user matching credentials
      const user = await prisma.user.findFirst({
        where: {
          role: uppercaseRole as any,
          OR: [
            { phone: emailOrMobile.trim() },
            { email: emailOrMobile.trim() },
            { name: { equals: emailOrMobile.trim(), mode: 'insensitive' } }
          ]
        },
        include: {
          farms: true
        }
      });

      if (!user) {
        return NextResponse.json(
          { error: `Account not found for ${role} with input "${emailOrMobile}". Please register first.` },
          { status: 404 }
        );
      }

      // 2. If not farmer, check password
      if (!isFarmer) {
        // Simple sandbox validation: support password hash match or standard demo credential fallback
        if (password !== user.passwordHash && password !== 'admin123' && password !== 'officer123') {
          return NextResponse.json(
            { error: 'Invalid password. Please check and try again.' },
            { status: 401 }
          );
        }
      }

      const activeFarm = user.farms[0];

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role
        },
        farmId: activeFarm ? activeFarm.id : null
      });
    } catch (dbError) {
      console.warn('PostgreSQL connection offline. Directing sign-in via mock sandbox session...', dbError);
      
      // Fallback sandbox simulation
      return NextResponse.json({
        success: true,
        sandbox: true,
        user: {
          id: `usr-sandbox-${Date.now()}`,
          name: emailOrMobile,
          phone: emailOrMobile.includes('@') ? '+91 98765 43210' : emailOrMobile,
          email: emailOrMobile.includes('@') ? emailOrMobile : 'sandbox@poultrylens.com',
          role: uppercaseRole
        },
        farmId: `frm-sandbox-${Date.now()}`
      });
    }
  } catch (error: any) {
    console.error('Login Auth API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
