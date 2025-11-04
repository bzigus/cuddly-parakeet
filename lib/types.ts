export interface MailAccount {
  id: string;
  email: string;
  provider: 'gmail' | 'mailcow' | 'other';
  imap: {
    host: string;
    port: number;
    secure: boolean;
  };
  smtp: {
    host: string;
    port: number;
    secure: boolean;
  };
}

export interface Email {
  id: string;
  uid: number;
  from: {
    name?: string;
    address: string;
  };
  to: Array<{
    name?: string;
    address: string;
  }>;
  subject: string;
  date: Date;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    contentType: string;
    size: number;
  }>;
  flags: string[];
  folder: string;
}

export interface MailFolder {
  path: string;
  name: string;
  specialUse?: string;
  messages: number;
  unseen: number;
}
