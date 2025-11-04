import { NextRequest, NextResponse } from 'next/server';
import { MailSender } from '@/lib/mail-sender';
import type { MailAccount } from '@/lib/types';

// Simple email validation - not using complex regex to avoid ReDoS
function validateEmail(email: string): boolean {
  if (!email || email.length > 320) return false; // RFC 5321 max length
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || !domain || local.length > 64 || domain.length > 255) return false;
  if (!domain.includes('.')) return false;
  // Simple character validation
  const validLocalChars = /^[a-zA-Z0-9._%-]+$/;
  const validDomainChars = /^[a-zA-Z0-9.-]+$/;
  return validLocalChars.test(local) && validDomainChars.test(domain);
}

function validateEmails(emails: string | string[]): boolean {
  const emailArray = Array.isArray(emails) ? emails : [emails];
  return emailArray.every(email => validateEmail(email.trim()));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { account, credentials, to, subject, text, html, cc, bcc } = body;

    // Validate required fields
    if (!account || !credentials || !to || !subject) {
      return NextResponse.json(
        { error: 'Account, credentials, to, and subject are required' },
        { status: 400 }
      );
    }

    // Validate email addresses
    if (!validateEmails(to)) {
      return NextResponse.json(
        { error: 'Invalid recipient email address' },
        { status: 400 }
      );
    }

    if (cc && !validateEmails(cc)) {
      return NextResponse.json(
        { error: 'Invalid CC email address' },
        { status: 400 }
      );
    }

    if (bcc && !validateEmails(bcc)) {
      return NextResponse.json(
        { error: 'Invalid BCC email address' },
        { status: 400 }
      );
    }

    // Validate subject length
    if (subject.length > 500) {
      return NextResponse.json(
        { error: 'Subject is too long (max 500 characters)' },
        { status: 400 }
      );
    }

    // Validate content length
    if (text && text.length > 100000) {
      return NextResponse.json(
        { error: 'Email content is too long (max 100KB)' },
        { status: 400 }
      );
    }

    if (html && html.length > 100000) {
      return NextResponse.json(
        { error: 'Email HTML is too long (max 100KB)' },
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
