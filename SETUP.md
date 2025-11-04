# Superior Mail - Quick Start Guide

This guide will help you get started with Superior Mail, a modern email client that works with Gmail, Mailcow, and other IMAP/SMTP providers.

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment (Optional)

If you want to use PostgreSQL for storing user preferences and email cache:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set your database connection string:

```
DATABASE_URL="postgresql://user:password@localhost:5432/mail_db"
```

### 3. Set Up Database (Optional)

If using PostgreSQL, run the schema:

```bash
psql -U postgres -f database/schema.sql
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Using Superior Mail

### Setting Up Gmail

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate an App Password**:
   - Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
   - Create a new app password for "Mail"
   - Copy the generated password
3. **In Superior Mail**:
   - Click the "Gmail" button (settings are pre-configured)
   - Enter your Gmail address
   - Paste the app password (not your regular password)
   - Click "Connect"

### Setting Up Mailcow

1. Click the "Mailcow" button
2. Enter your email address
3. Enter your password
4. Fill in your Mailcow server details:
   - IMAP Host: Your Mailcow server (e.g., `mail.yourdomain.com`)
   - IMAP Port: Usually `993`
   - SMTP Host: Your Mailcow server (e.g., `mail.yourdomain.com`)
   - SMTP Port: Usually `465` or `587`
5. Click "Connect"

### Setting Up Custom IMAP/SMTP

1. Click the "Other" button
2. Enter your email address and password
3. Enter your IMAP and SMTP server details
4. Click "Connect"

## Features

### Reading Emails

- **Browse Folders**: Click on folders in the left sidebar to view emails
- **Read Emails**: Click on any email in the middle pane to read its content
- **Unread Indicator**: Unread emails are marked with a blue dot

### Composing Emails

1. Click the "Compose" button in the sidebar
2. Enter recipient email address
3. Add subject and message
4. Click "Send"

### Managing Folders

The application automatically loads all your mail folders (Inbox, Sent, Drafts, etc.) when you connect your account.

## Troubleshooting

### Gmail "Sign-in attempt prevented"

You need to use an **App Password**, not your regular Gmail password. Follow the Gmail setup instructions above.

### Connection Timeouts

- Verify your IMAP/SMTP server addresses and ports
- Check that your firewall allows connections to mail servers
- Ensure IMAP/SMTP access is enabled in your email provider settings

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

### 1. Build the Application

```bash
npm run build
```

### 2. Start Production Server

```bash
npm run start
```

### 3. Using PM2 (Recommended for production)

```bash
npm install -g pm2
pm2 start npm --name "superior-mail" -- start
pm2 save
pm2 startup
```

### 4. Set Up Reverse Proxy

Use Nginx or Apache to proxy requests to the Next.js server running on port 3000.

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name mail.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Security Notes

- **Never commit credentials**: The `.env.local` file is gitignored
- **Use HTTPS in production**: Credentials are transmitted during login
- **Use app passwords**: For Gmail, always use app passwords
- **Keep dependencies updated**: Run `npm audit` regularly

## Support

For issues or questions, please open an issue on GitHub.
