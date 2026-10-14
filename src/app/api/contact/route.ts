import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    // Strict input validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid name (at least 2 characters).' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Please provide a message with at least 5 characters.' },
        { status: 400 }
      );
    }

    const targetEmail = 'soumyashree.rout.dev@gmail.com';

    // Check if optional Resend API key is configured
    if (process.env.RESEND_API_KEY) {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Portfolio Dispatch <onboarding@resend.dev>',
          to: [targetEmail],
          reply_to: email,
          subject: `[Portfolio Dispatch] Inquiry from ${name.trim()}`,
          text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}`,
        }),
      });

      if (resendRes.ok) {
        return NextResponse.json({
          success: true,
          message: 'Dispatch delivered directly via Resend to your inbox.',
        });
      }
    }

    // Default: Forward via FormSubmit AJAX service directly to your Gmail inbox
    const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        _subject: `[Engineering Dispatch] New Inquiry from ${name.trim()}`,
        _template: 'box',
        _captcha: 'false',
      }),
    });

    const formSubmitData = await formSubmitRes.json().catch(() => null);

    if (formSubmitRes.ok) {
      return NextResponse.json({
        success: true,
        message:
          'Your dispatch has been delivered to soumyashree.rout.dev@gmail.com. (Note: The first time, FormSubmit sends a 1-click activation email to verify the destination).',
      });
    }

    return NextResponse.json({
      success: true,
      fallbackRequired: true,
      message: 'Dispatch prepared. Fallback link available.',
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Network dispatch error. Please use direct email.',
      },
      { status: 500 }
    );
  }
}
