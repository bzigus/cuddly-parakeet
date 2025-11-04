import nodemailer from 'nodemailer';
import type { MailAccount } from './types';

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export class MailSender {
  private account: MailAccount;
  private credentials: { user: string; pass: string };

  constructor(account: MailAccount, credentials: { user: string; pass: string }) {
    this.account = account;
    this.credentials = credentials;
  }

  async sendEmail(params: SendEmailParams) {
    const transporter = nodemailer.createTransport({
      host: this.account.smtp.host,
      port: this.account.smtp.port,
      secure: this.account.smtp.secure,
      auth: {
        user: this.credentials.user,
        pass: this.credentials.pass,
      },
    });

    const info = await transporter.sendMail({
      from: this.credentials.user,
      to: params.to,
      cc: params.cc,
      bcc: params.bcc,
      subject: params.subject,
      text: params.text,
      html: params.html,
      attachments: params.attachments,
    });

    return info;
  }
}
