import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email/EmailTemplate';

// Get API key and log it for debugging (without exposing the full key)
const apiKey = process.env.RESEND_API_KEY;
console.log('API Key availability:', apiKey ? `Found (starts with ${apiKey.substring(0, 5)}...)` : 'Not found');

// Initialize Resend with API key
// If environment variable isn't loading, use the hardcoded key temporarily for testing
const resend = new Resend(apiKey || 're_Bvpuw7Xg_FY6K47yhVkVRPF57Z1KX8XGz');

// The recipient email address where waitlist signups will be sent
const RECIPIENT_EMAIL = 'phantomcoder74@yahoo.com'; // Email where waitlist signups will be received

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const email = body.email;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // For debugging
    console.log('Sending email with:', { email, to: RECIPIENT_EMAIL });

    try {
      // Send the email using Resend
      const { data, error } = await resend.emails.send({
        from: 'Levercast Waitlist <onboarding@resend.dev>',
        to: RECIPIENT_EMAIL,
        subject: 'New Levercast Waitlist Signup',
        react: EmailTemplate({ email }) as React.ReactElement,
      });

      if (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
          { error: 'Failed to send email', details: error },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { success: true, data },
        { status: 200 }
      );
    } catch (resendError) {
      console.error('Resend API error:', resendError);
      return NextResponse.json(
        { error: 'Email service error', details: String(resendError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
} 