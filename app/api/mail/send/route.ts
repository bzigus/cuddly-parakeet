import { NextRequest, NextResponse } from 'next/server';
import { MailSender } from '@/lib/mail-sender';
import type { MailAccount } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { account, credentials, to, subject, text, html, cc, bcc } = body;

    if (!account || !credentials || !to || !subject) {
      return NextResponse.json(
        { error: 'Account, credentials, to, and subject are required' },
        { status: 400 }
      );
    }

    const mailSender = new MailSender(account as MailAccount, credentials);
    const result = await mailSender.sendEmail({
      to,
      subject,
      text,
      html,
      cc,
      bcc,
    });

    return NextResponse.json({ success: true, messageId: result.messageId });
  } catch (error) {
    console.error('Send email error:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
