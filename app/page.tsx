'use client';

import { useState } from 'react';
import AccountSetup from '@/components/account-setup';
import Mailbox from '@/components/mailbox';
import type { MailAccount } from '@/lib/types';

export default function Home() {
  const [account, setAccount] = useState<MailAccount | null>(null);
  const [credentials, setCredentials] = useState<{ user: string; pass: string } | null>(null);

  const handleAccountSetup = (newAccount: MailAccount, newCredentials: { user: string; pass: string }) => {
    setAccount(newAccount);
    setCredentials(newCredentials);
  };

  const handleLogout = () => {
    setAccount(null);
    setCredentials(null);
  };

  if (!account || !credentials) {
    return <AccountSetup onAccountSetup={handleAccountSetup} />;
  }

  return <Mailbox account={account} credentials={credentials} onLogout={handleLogout} />;
}
