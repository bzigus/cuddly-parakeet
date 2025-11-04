'use client';

import { useState, useEffect } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ComposeEmail from '@/components/compose-email';
import type { MailAccount, Email, MailFolder } from '@/lib/types';

interface MailboxProps {
  account: MailAccount;
  credentials: { user: string; pass: string };
  onLogout: () => void;
}

export default function Mailbox({ account, credentials, onLogout }: MailboxProps) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [folders, setFolders] = useState<MailFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState('INBOX');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFolders();
  }, []);

  useEffect(() => {
    loadEmails();
  }, [selectedFolder]);

  const loadFolders = async () => {
    try {
      const response = await fetch('/api/mail/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account, credentials }),
      });

      const data = await response.json();
      if (response.ok) {
        setFolders(data.folders);
      }
    } catch (err) {
      console.error('Failed to load folders:', err);
    }
  };

  const loadEmails = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/mail/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account,
          credentials,
          folder: selectedFolder,
          limit: 50,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch emails');
      }

      setEmails(data.emails);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load emails');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (days < 7) {
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Superior Mail</h1>
          <p className="text-sm text-gray-600 truncate">{account.email}</p>
        </div>

        <div className="p-4">
          <Button onClick={() => setShowCompose(true)} className="w-full">
            Compose
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-2">
            <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Folders</p>
            {folders.map((folder) => (
              <button
                key={folder.path}
                onClick={() => setSelectedFolder(folder.path)}
                className={`w-full text-left px-3 py-2 rounded text-sm flex justify-between items-center ${
                  selectedFolder === folder.path
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{folder.name}</span>
                {folder.unseen > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                    {folder.unseen}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <Button variant="outline" onClick={onLogout} className="w-full">
            Logout
          </Button>
        </div>
      </div>

      {/* Email List */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">{selectedFolder}</h2>
          <p className="text-sm text-gray-600">{emails.length} messages</p>
        </div>

        {error && (
          <div className="m-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-500">Loading emails...</div>
            </div>
          ) : emails.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-500">No emails found</div>
            </div>
          ) : (
            <div>
              {emails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                    selectedEmail?.id === email.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm text-gray-900 truncate flex-1">
                      {email.from.name || email.from.address}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatDate(email.date)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-900 mb-1 truncate">
                    {email.subject}
                  </div>
                  {!email.flags.includes('\\Seen') && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-xs text-blue-600">Unread</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 bg-white overflow-y-auto">
        {selectedEmail ? (
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedEmail.subject}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-semibold">From:</span>{' '}
                  {selectedEmail.from.name || selectedEmail.from.address}
                </div>
                <div>
                  <span className="font-semibold">Date:</span>{' '}
                  {new Date(selectedEmail.date).toLocaleString()}
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                <span className="font-semibold">To:</span>{' '}
                {selectedEmail.to.map((t) => t.address).join(', ')}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              {selectedEmail.html ? (
                <div dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(selectedEmail.html, {
                    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre', 'img', 'div', 'span', 'table', 'tr', 'td', 'th', 'thead', 'tbody'],
                    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
                    ALLOW_DATA_ATTR: false,
                  })
                }} />
              ) : (
                <div className="whitespace-pre-wrap">{selectedEmail.text}</div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-lg">Select an email to read</p>
            </div>
          </div>
        )}
      </div>

      {showCompose && (
        <ComposeEmail
          account={account}
          credentials={credentials}
          onClose={() => setShowCompose(false)}
          onSent={() => {
            setShowCompose(false);
            // Optionally refresh email list
          }}
        />
      )}
    </div>
  );
}
