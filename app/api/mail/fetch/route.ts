import { NextRequest, NextResponse } from 'next/server';
import { MailClient } from '@/lib/mail-client';
import type { MailAccount } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { account, credentials, folder, limit } = body;

    if (!account || !credentials) {
      return NextResponse.json(
        { error: 'Account and credentials are required' },
        { status: 400 }
      );
    }

    const mailClient = new MailClient(account as MailAccount, credentials);
    const emails = await mailClient.getEmails(folder || 'INBOX', limit || 50);
    await mailClient.disconnect();

    return NextResponse.json({ emails });
  } catch (error) {
    console.error('Fetch emails error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
