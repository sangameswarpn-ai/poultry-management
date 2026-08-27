import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber, language = 'en' } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Missing phoneNumber parameter' },
        { status: 400 }
      );
    }

    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    const speechText = language === 'ta'
      ? `வணக்கம். உங்கள் பண்ணை மேலாண்மை உதவியாளர் பேசுகிறேன். இந்த வார தினசரி சுகாதாரத் தகவல்களை நீங்கள் இன்னும் பதிவு செய்யவில்லை. தயவுசெய்து உடனே பதிவு செய்யவும். நன்றி.`
      : `Hello. This is your farm biosecurity assistant calling. We noticed you have not logged your weekly daily health records. Please log in to your dashboard to complete your logs. Thank you.`;

    if (sid && token && fromNumber) {
      console.log(`Twilio outbound call sequence triggered for ${phoneNumber}...`);
      
      // Twilio voice TwiML instructions
      const twiml = `<Response><Say voice="alice" language="${language === 'ta' ? 'ta-IN' : 'en-US'}">${speechText}</Say></Response>`;
      
      // Trigger outbound call using basic auth & fetch
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Calls.json`;
      const auth = Buffer.from(`${sid}:${token}`).toString('base64');
      
      const formData = new URLSearchParams();
      formData.append('To', phoneNumber);
      formData.append('From', fromNumber);
      formData.append('Twiml', twiml);

      const res = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Twilio dispatch failure: ${errorText}`);
      }

      const data = await res.json();
      return NextResponse.json({
        success: true,
        mode: 'real',
        message: 'Outbound voice call placed successfully via Twilio.',
        sid: data.sid
      });
    } else {
      console.log(`Demo Mode: Simulated automated call reminder to ${phoneNumber}: "${speechText}"`);
      return NextResponse.json({
        success: true,
        mode: 'simulated',
        message: 'Simulated automated reminder call triggered successfully.',
        speechText
      });
    }
  } catch (error: any) {
    console.error('Error placing voice call:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
