'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { MailAccount } from '@/lib/types';

interface AccountSetupProps {
  onAccountSetup: (account: MailAccount, credentials: { user: string; pass: string }) => void;
}

export default function AccountSetup({ onAccountSetup }: AccountSetupProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [provider, setProvider] = useState<'gmail' | 'mailcow' | 'other'>('gmail');
  const [imapHost, setImapHost] = useState('');
  const [imapPort, setImapPort] = useState('993');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('465');
  const [loading, setLoading] = useState(false);

  const handleProviderChange = (selectedProvider: 'gmail' | 'mailcow' | 'other') => {
    setProvider(selectedProvider);
    
    if (selectedProvider === 'gmail') {
      setImapHost('imap.gmail.com');
      setImapPort('993');
      setSmtpHost('smtp.gmail.com');
      setSmtpPort('465');
    } else if (selectedProvider === 'mailcow') {
      setImapHost('');
      setImapPort('993');
      setSmtpHost('');
      setSmtpPort('465');
    } else {
      setImapHost('');
      setImapPort('993');
      setSmtpHost('');
      setSmtpPort('465');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const account: MailAccount = {
      id: `${email}-${Date.now()}`,
      email,
      provider,
      imap: {
        host: imapHost,
        port: parseInt(imapPort, 10),
        secure: true,
      },
      smtp: {
        host: smtpHost,
        port: parseInt(smtpPort, 10),
        secure: true,
      },
    };

    const credentials = {
      user: email,
      pass: password,
    };

    try {
      onAccountSetup(account, credentials);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Setup Mail Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Provider</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={provider === 'gmail' ? 'default' : 'outline'}
                  onClick={() => handleProviderChange('gmail')}
                  className="flex-1"
                >
                  Gmail
                </Button>
                <Button
                  type="button"
                  variant={provider === 'mailcow' ? 'default' : 'outline'}
                  onClick={() => handleProviderChange('mailcow')}
                  className="flex-1"
                >
                  Mailcow
                </Button>
                <Button
                  type="button"
                  variant={provider === 'other' ? 'default' : 'outline'}
                  onClick={() => handleProviderChange('other')}
                  className="flex-1"
                >
                  Other
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">IMAP Host</label>
                <Input
                  type="text"
                  value={imapHost}
                  onChange={(e) => setImapHost(e.target.value)}
                  placeholder="imap.example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">IMAP Port</label>
                <Input
                  type="number"
                  value={imapPort}
                  onChange={(e) => setImapPort(e.target.value)}
                  placeholder="993"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">SMTP Host</label>
                <Input
                  type="text"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  placeholder="smtp.example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">SMTP Port</label>
                <Input
                  type="number"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  placeholder="465"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Connecting...' : 'Connect'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
