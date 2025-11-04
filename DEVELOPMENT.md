# Developer Guide

## Project Structure

```
cuddly-parakeet/
├── app/                    # Next.js App Router
│   ├── api/mail/          # API routes for mail operations
│   │   ├── fetch/         # Fetch emails endpoint
│   │   ├── send/          # Send email endpoint
│   │   └── folders/       # Fetch folders endpoint
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main page component
│   └── globals.css        # Global styles with CSS variables
├── components/            # React components
│   ├── ui/               # Reusable UI components (shadcn/ui style)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── textarea.tsx
│   ├── account-setup.tsx # Account configuration UI
│   ├── compose-email.tsx # Email composition modal
│   └── mailbox.tsx       # Main mailbox interface
├── lib/                  # Utility libraries
│   ├── mail-client.ts    # IMAP client wrapper (imapflow)
│   ├── mail-sender.ts    # SMTP sender wrapper (nodemailer)
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Helper functions (cn utility)
├── database/             # Database related files
│   └── schema.sql        # PostgreSQL schema
└── public/               # Static assets
```

## Tech Stack

### Core
- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type safety

### Styling
- **TailwindCSS**: Utility-first CSS framework
- **@tailwindcss/postcss**: TailwindCSS v4 PostCSS plugin
- **CSS Variables**: For theming

### Mail Libraries
- **imapflow**: Modern IMAP client for Node.js
- **nodemailer**: SMTP email sending

### UI Components
- **shadcn/ui patterns**: Component architecture
- **RadixUI**: Accessible component primitives (via class-variance-authority)
- **Lucide React**: Icons

### Database
- **PostgreSQL**: Primary database (optional)
- **pg**: PostgreSQL client for Node.js

## Key Concepts

### Mail Client Architecture

The application uses a wrapper architecture around mail protocols:

1. **MailClient** (`lib/mail-client.ts`)
   - Wraps imapflow for IMAP operations
   - Handles connection management
   - Provides methods for fetching emails, folders, and managing messages

2. **MailSender** (`lib/mail-sender.ts`)
   - Wraps nodemailer for SMTP operations
   - Handles email sending

3. **API Routes** (`app/api/mail/*`)
   - Expose mail operations as HTTP endpoints
   - Handle authentication and error responses

### State Management

Currently using React's built-in state management:
- `useState` for component state
- Props for data passing
- No external state management library (keeps it simple)

### Type Safety

All mail-related types are defined in `lib/types.ts`:
- `MailAccount`: Email account configuration
- `Email`: Email message structure
- `MailFolder`: Mailbox folder information

## Development Workflow

### Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm run start
```

### Code Style

- **Components**: Use functional components with hooks
- **Styling**: Use Tailwind utility classes
- **Types**: Always use TypeScript types, avoid `any`
- **Imports**: Use absolute imports with `@/` prefix

### Adding New Features

#### Adding a New UI Component

1. Create component file in `components/ui/`
2. Use the existing component patterns (shadcn/ui style)
3. Export from the file
4. Use in your feature component

Example:
```typescript
// components/ui/badge.tsx
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", className)} {...props} />
  );
}
```

#### Adding a New Mail Feature

1. Add method to `MailClient` or `MailSender` in `lib/`
2. Create API route in `app/api/mail/`
3. Add UI component in `components/`
4. Integrate into main mailbox component

#### Adding Database Models

1. Update `database/schema.sql` with new tables
2. Create migration if needed
3. Add types to `lib/types.ts`
4. Create database utilities in `lib/`

## Testing

Currently, there's no test infrastructure. To add tests:

### Unit Tests (Recommended: Vitest)

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### Integration Tests (Recommended: Playwright)

Already available if you want to add tests:

```bash
npm install -D @playwright/test
```

## Common Development Tasks

### Adding a New Email Provider Preset

Edit `components/account-setup.tsx` and add to `handleProviderChange`:

```typescript
else if (selectedProvider === 'outlook') {
  setImapHost('outlook.office365.com');
  setImapPort('993');
  setSmtpHost('smtp.office365.com');
  setSmtpPort('587');
}
```

### Customizing Theme Colors

Edit `app/globals.css` CSS variables:

```css
:root {
  --primary: 221.2 83.2% 53.3%; /* HSL color */
  /* ... other variables */
}
```

### Adding Email Attachments Support

1. Update `Email` type in `lib/types.ts`
2. Modify `MailClient.getEmailContent()` to parse attachments
3. Update `ComposeEmail` component to handle file uploads
4. Modify send API route to process attachments

## Performance Considerations

### Email Fetching
- Limit fetched emails (currently 50)
- Use pagination for large mailboxes
- Cache email list in component state

### IMAP Connections
- Reuse connections when possible
- Always disconnect after operations
- Use connection pooling for multiple operations

### Build Size
- TailwindCSS purges unused styles
- Next.js optimizes bundle size automatically
- Use dynamic imports for heavy components

## Security Best Practices

### Credentials
- Never log passwords or tokens
- Store credentials encrypted in database
- Use environment variables for sensitive config

### Input Validation
- Validate email addresses
- Sanitize user inputs
- Prevent XSS in email content display

### API Security
- Add rate limiting (future enhancement)
- Implement proper authentication (future enhancement)
- Validate all API inputs

## Deployment

### Environment Variables

Production environment should have:
```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

### Build Optimization

```bash
# Build with production optimizations
npm run build

# Analyze bundle size
npm install -D @next/bundle-analyzer
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Future Enhancements

- [ ] User authentication system
- [ ] Multi-account support
- [ ] Email search
- [ ] Attachment handling
- [ ] Email filters and rules
- [ ] Contact management
- [ ] Dark mode toggle
- [ ] Mobile responsive improvements
- [ ] Offline support with service workers
- [ ] Email caching with background sync
