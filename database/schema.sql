-- PostgreSQL Database Schema for Superior Mail Application

-- Create database
CREATE DATABASE mail_db;

\c mail_db;

-- Users table for authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mail accounts table
CREATE TABLE mail_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    provider VARCHAR(50) NOT NULL, -- 'gmail', 'mailcow', 'other'
    imap_host VARCHAR(255) NOT NULL,
    imap_port INTEGER NOT NULL,
    imap_secure BOOLEAN DEFAULT true,
    smtp_host VARCHAR(255) NOT NULL,
    smtp_port INTEGER NOT NULL,
    smtp_secure BOOLEAN DEFAULT true,
    encrypted_password TEXT NOT NULL, -- Encrypted credentials
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, email)
);

-- User preferences table
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    theme VARCHAR(20) DEFAULT 'light', -- 'light', 'dark'
    emails_per_page INTEGER DEFAULT 50,
    auto_refresh_interval INTEGER DEFAULT 300, -- seconds
    signature TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Local email cache (optional, for offline access)
CREATE TABLE email_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES mail_accounts(id) ON DELETE CASCADE,
    email_uid INTEGER NOT NULL,
    folder VARCHAR(255) NOT NULL,
    from_address VARCHAR(255),
    from_name VARCHAR(255),
    subject TEXT,
    date TIMESTAMP,
    body_text TEXT,
    body_html TEXT,
    flags TEXT[], -- Array of flags like '\Seen', '\Flagged'
    cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(account_id, folder, email_uid)
);

-- Indexes for performance
CREATE INDEX idx_mail_accounts_user_id ON mail_accounts(user_id);
CREATE INDEX idx_email_cache_account_id ON email_cache(account_id);
CREATE INDEX idx_email_cache_folder ON email_cache(folder);
CREATE INDEX idx_email_cache_date ON email_cache(date DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mail_accounts_updated_at BEFORE UPDATE ON mail_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
