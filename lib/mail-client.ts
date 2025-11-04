import { ImapFlow } from 'imapflow';
import type { MailAccount, Email, MailFolder } from './types';

export class MailClient {
  private client: ImapFlow | null = null;
  private account: MailAccount;
  private credentials: { user: string; pass: string };

  constructor(account: MailAccount, credentials: { user: string; pass: string }) {
    this.account = account;
    this.credentials = credentials;
  }

  async connect() {
    if (this.client) {
      return;
    }

    this.client = new ImapFlow({
      host: this.account.imap.host,
      port: this.account.imap.port,
      secure: this.account.imap.secure,
      auth: this.credentials,
      logger: false,
    });

    await this.client.connect();
  }

  async disconnect() {
    if (this.client) {
      await this.client.logout();
      this.client = null;
    }
  }

  async getFolders(): Promise<MailFolder[]> {
    await this.connect();
    if (!this.client) throw new Error('Not connected');

    const mailboxes = await this.client.list();
    const folders: MailFolder[] = [];

    for (const mailbox of mailboxes) {
      const status = await this.client.status(mailbox.path, {
        messages: true,
        unseen: true,
      });

      folders.push({
        path: mailbox.path,
        name: mailbox.name,
        specialUse: mailbox.specialUse,
        messages: status.messages || 0,
        unseen: status.unseen || 0,
      });
    }

    return folders;
  }

  async getEmails(folder: string = 'INBOX', limit: number = 50): Promise<Email[]> {
    await this.connect();
    if (!this.client) throw new Error('Not connected');

    const lock = await this.client.getMailboxLock(folder);
    const emails: Email[] = [];

    try {
      const messages = this.client.fetch('1:*', {
        envelope: true,
        bodyStructure: true,
        flags: true,
        uid: true,
      }, {
        uid: true,
      });

      const emailList: Email[] = [];
      for await (const message of messages) {
        if (message.envelope) {
          emailList.push({
            id: `${message.uid}`,
            uid: message.uid,
            from: {
              name: message.envelope.from?.[0]?.name,
              address: message.envelope.from?.[0]?.address || '',
            },
            to: message.envelope.to?.map(addr => ({
              name: addr.name,
              address: addr.address || '',
            })) || [],
            subject: message.envelope.subject || '(No Subject)',
            date: message.envelope.date || new Date(),
            flags: message.flags ? Array.from(message.flags) : [],
            folder,
          });
        }
      }

      // Sort by date descending and limit
      emailList.sort((a, b) => b.date.getTime() - a.date.getTime());
      return emailList.slice(0, limit);
    } finally {
      lock.release();
    }
  }

  async getEmailContent(folder: string, uid: number): Promise<Email | null> {
    await this.connect();
    if (!this.client) throw new Error('Not connected');

    const lock = await this.client.getMailboxLock(folder);

    try {
      const message = await this.client.fetchOne(String(uid), {
        envelope: true,
        bodyStructure: true,
        source: true,
        flags: true,
      }, {
        uid: true,
      });

      if (!message || !message.envelope) {
        return null;
      }

      // Parse email body - simplified version
      const text = message.source?.toString() || '';
      
      return {
        id: `${uid}`,
        uid,
        from: {
          name: message.envelope.from?.[0]?.name,
          address: message.envelope.from?.[0]?.address || '',
        },
        to: message.envelope.to?.map(addr => ({
          name: addr.name,
          address: addr.address || '',
        })) || [],
        subject: message.envelope.subject || '(No Subject)',
        date: message.envelope.date || new Date(),
        text,
        flags: message.flags ? Array.from(message.flags) : [],
        folder,
      };
    } finally {
      lock.release();
    }
  }

  async markAsRead(folder: string, uid: number) {
    await this.connect();
    if (!this.client) throw new Error('Not connected');

    const lock = await this.client.getMailboxLock(folder);
    try {
      await this.client.messageFlagsAdd(String(uid), ['\\Seen'], { uid: true });
    } finally {
      lock.release();
    }
  }

  async deleteEmail(folder: string, uid: number) {
    await this.connect();
    if (!this.client) throw new Error('Not connected');

    const lock = await this.client.getMailboxLock(folder);
    try {
      await this.client.messageFlagsAdd(String(uid), ['\\Deleted'], { uid: true });
      // Expunge deleted messages
      await this.client.mailboxClose();
    } finally {
      lock.release();
    }
  }
}
