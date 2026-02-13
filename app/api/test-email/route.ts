import { NextRequest, NextResponse } from 'next/server';
import { sendPasswordResetEmail } from '@/lib/utils/email';

/**
 * Test endpoint to verify email sending works
 * GET /api/test-email?email=your@email.com
 */
export async function GET(request: NextRequest) {
  try {
    // Get email from query params or use default
    const { searchParams } = new URL(request.url);
    const testEmail = searchParams.get('email') || 'chsudip29@gmail.com';
    const testLink = `http://localhost:3000/auth/reset-password?token=TEST123&email=${testEmail}`;
    
    console.log('[EMAIL] Testing email service...');
    console.log('[EMAIL] Sending to:', testEmail);
    console.log('[EMAIL] EMAIL_USER:', process.env.EMAIL_USER);
    console.log('[EMAIL] EMAIL_PASS:', process.env.EMAIL_PASS ? '***SET***' : 'NOT SET');
    
    await sendPasswordResetEmail(testEmail, testLink);
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Test email sent successfully!',
        sentTo: testEmail
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[ERROR] Test email error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        details: error.toString()
      },
      { status: 500 }
    );
  }
}
