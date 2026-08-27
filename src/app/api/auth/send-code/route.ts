import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { emailOrMobile, role, farmType } = body;

    if (!emailOrMobile) {
      return NextResponse.json(
        { error: 'Missing emailOrMobile parameter' },
        { status: 400 }
      );
    }

    // 1. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Check for Resend API Key
    const apiKey = process.env.RESEND_API_KEY;
    const isEmail = emailOrMobile.includes('@');

    if (apiKey && isEmail) {
      console.log(`Sending real verification email to ${emailOrMobile}...`);
      const resend = new Resend(apiKey);
      
      const { data, error } = await resend.emails.send({
        from: 'SIH Portal <onboarding@resend.dev>',
        to: emailOrMobile,
        subject: 'SIH25006 - Your Portal Verification Code',
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; rounded: 12px;">
            <h2 style="color: #10b981; font-size: 20px; font-weight: bold; margin-bottom: 16px;">SIH25006 Portal Authentication</h2>
            <p style="font-size: 14px; color: #4b5563; line-height: 1.5;">You are attempting to sign in to the digital farm surveillance grid.</p>
            
            <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
              <span style="font-size: 11px; text-transform: uppercase; color: #9ca3af; font-weight: bold; display: block; margin-bottom: 4px;">Role: ${role.toUpperCase()} ${farmType ? `(${farmType})` : ''}</span>
              <strong style="font-size: 32px; letter-spacing: 4px; color: #111827; font-family: monospace;">${otp}</strong>
            </div>

            <p style="font-size: 11px; color: #9ca3af; margin-top: 24px; text-align: center; border-t: 1px solid #e5e7eb; padding-top: 16px;">
              This is an automated security broadcast from PoultryLens AI. Do not share this code.
            </p>
          </div>
        `
      });

      if (error) {
        console.error('Resend API Error:', error);
        return NextResponse.json({ success: true, otp, sent: false, error: error.message });
      }

      return NextResponse.json({ success: true, otp, sent: true, data });
    } else {
      console.log(`Demo Mode: Simulated OTP ${otp} for ${emailOrMobile}`);
      return NextResponse.json({ success: true, otp, sent: false });
    }
  } catch (error: any) {
    console.error('Error sending code:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
