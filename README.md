# Superior Mail - Advanced Email Client

A modern, feature-rich email client built with Next.js, supporting Gmail and Mailcow email providers.

## Features

- 🚀 **Modern Stack**: Built with Next.js 14, React, and TypeScript
- 🎨 **Beautiful UI**: TailwindCSS + shadcn/ui components for a polished interface
- 📧 **Multi-Provider Support**: Works with Gmail, Mailcow, and custom IMAP/SMTP servers
- 🔐 **Secure**: Support for SSL/TLS connections
- 📨 **Full Email Features**: Read, compose, send, and manage emails
- 📁 **Folder Management**: Browse all your mail folders
- 💾 **PostgreSQL Storage**: Store user preferences and cache emails locally
- 🎯 **Real-time Updates**: Auto-refresh capabilities
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui (RadixUI-based)
- **Icons**: Lucide React

### Backend
- **API**: Next.js API Routes
- **Mail Client**: imapflow (IMAP)
- **Mail Sending**: nodemailer (SMTP)
- **Database**: PostgreSQL

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (optional, for storing preferences)
- Email account credentials (Gmail or Mailcow)

### Gmail Setup

For Gmail accounts, you need to use an **App Password** instead of your regular password:

1. Enable 2-Factor Authentication on your Google account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password for "Mail"
4. Use this app password in the application

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bzigus/cuddly-parakeet.git
   cd cuddly-parakeet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and configure your database URL:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/mail_db"
   ```

4. **Set up the database (optional)**
   
   If you want to use PostgreSQL for storing user preferences and email cache:
   ```bash
   psql -U postgres -f database/schema.sql
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Setting Up Your Email Account

1. When you first open the application, you'll see the account setup screen
2. Select your email provider (Gmail, Mailcow, or Other)
3. Enter your email address and password (or app password for Gmail)
4. For Gmail, the IMAP/SMTP settings are pre-configured
5. For Mailcow or custom servers, enter your IMAP and SMTP server details
6. Click "Connect" to access your mailbox

### Reading Emails

- Browse your folders in the left sidebar
- Click on any folder to view its emails
- Select an email from the middle pane to read its content
- Unread emails are marked with a blue dot

### Composing Emails

1. Click the "Compose" button in the sidebar
2. Enter the recipient's email address
3. Add a subject and write your message
4. Click "Send" to send the email

### Logging Out

Click the "Logout" button at the bottom of the sidebar to disconnect and return to the account setup screen.

## Email Provider Configuration

### Gmail
- **IMAP Host**: imap.gmail.com
- **IMAP Port**: 993
- **SMTP Host**: smtp.gmail.com
- **SMTP Port**: 465
- **Security**: SSL/TLS enabled
- **Authentication**: Use app password (not regular password)

### Mailcow
- **IMAP Host**: Your Mailcow server hostname
- **IMAP Port**: 993 (typically)
- **SMTP Host**: Your Mailcow server hostname
- **SMTP Port**: 465 or 587
- **Security**: SSL/TLS enabled

### Other Providers
Configure the IMAP and SMTP settings according to your email provider's documentation.

## Development

### Project Structure

```
cuddly-parakeet/
├── app/
│   ├── api/mail/          # Mail API routes
│   │   ├── fetch/         # Fetch emails endpoint
│   │   ├── send/          # Send email endpoint
│   │   └── folders/       # Fetch folders endpoint
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── textarea.tsx
│   ├── account-setup.tsx  # Account setup component
│   ├── compose-email.tsx  # Email composer
│   └── mailbox.tsx        # Main mailbox view
├── lib/
│   ├── mail-client.ts     # IMAP client wrapper
│   ├── mail-sender.ts     # SMTP sender wrapper
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utility functions
├── database/
│   └── schema.sql         # PostgreSQL schema
└── public/                # Static assets
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Self-Hosting on Dedicated Server

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set up PostgreSQL database**
   ```bash
   psql -U postgres -f database/schema.sql
   ```

3. **Configure environment variables**
   
   Create `.env.local` with your production settings

4. **Start the server**
   ```bash
   npm run start
   ```

5. **Set up a reverse proxy** (optional)
   
   Use Nginx or Apache to proxy requests to the Next.js server

### Using PM2 for Process Management

```bash
npm install -g pm2
pm2 start npm --name "superior-mail" -- start
pm2 save
pm2 startup
```

## Security Considerations

- **Never commit credentials**: The `.env.local` file is gitignored
- **Use app passwords**: For Gmail, always use app passwords, not your main password
- **SSL/TLS**: Always use secure connections for IMAP and SMTP
- **Database encryption**: Consider encrypting sensitive data in the database
- **HTTPS**: Use HTTPS in production to protect credentials in transit

## Future Enhancements

- [ ] User authentication and multi-user support
- [ ] Email search functionality
- [ ] Attachment handling
- [ ] Email filters and rules
- [ ] Dark mode toggle
- [ ] Email signatures
- [ ] Contact management
- [ ] Calendar integration
- [ ] Multiple account management
- [ ] Offline mode with email caching
- [ ] Push notifications
- [ ] Mobile app

## Troubleshooting

### Gmail Authentication Errors

- Make sure 2FA is enabled on your Google account
- Use an app password, not your regular password
- Check that IMAP access is enabled in Gmail settings

### Connection Timeouts

- Verify your IMAP/SMTP server addresses and ports
- Check your firewall settings
- Ensure your email provider allows IMAP/SMTP access

### Build Errors

- Clear the `.next` directory: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.