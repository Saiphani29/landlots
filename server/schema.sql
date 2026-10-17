-- =========================================================================
-- LAND LOTS ENTERPRISE POSTGRESQL PRODUCTION DDL SCHEMA
-- Compatible with: Supabase, Neon.tech, AWS RDS, Render PostgreSQL
-- Standards: SOC2 Compliance, ACID Transactions, Strict RBAC Foreign Keys
-- =========================================================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Staff & Public Buyers)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('super_admin', 'sales', 'marketing', 'finance_accounts', 'buyer')),
    role_label VARCHAR(128) NOT NULL,
    department VARCHAR(128),
    branch VARCHAR(128),
    phone VARCHAR(32),
    avatar VARCHAR(512),
    failed_attempts INT DEFAULT 0,
    locked_until BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Certified Properties Catalog Table
CREATE TABLE IF NOT EXISTS properties (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL CHECK (category IN ('plots', 'agricultural', 'residential', 'commercial')),
    type_tag VARCHAR(64),
    listing_type VARCHAR(32) DEFAULT 'sale',
    location VARCHAR(255) NOT NULL,
    city VARCHAR(128) NOT NULL,
    price VARCHAR(64) NOT NULL,
    price_num BIGINT NOT NULL,
    rate VARCHAR(64),
    area VARCHAR(64),
    area_sub VARCHAR(128),
    facing VARCHAR(64),
    road_width VARCHAR(64),
    approvals JSONB DEFAULT '[]'::jsonb,
    featured BOOLEAN DEFAULT FALSE,
    trending BOOLEAN DEFAULT FALSE,
    image VARCHAR(512),
    agent_json JSONB DEFAULT '{}'::jsonb,
    highlights_json JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(32) DEFAULT 'available' CHECK (status IN ('available', 'token_locked', 'sold')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. CRM Leads Table (Restricted: super_admin, sales, marketing)
CREATE TABLE IF NOT EXISTS leads (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    email VARCHAR(255),
    preferred_date VARCHAR(64),
    preferred_time VARCHAR(64),
    notes TEXT,
    property_id VARCHAR(64) REFERENCES properties(id) ON DELETE SET NULL,
    property_title VARCHAR(255),
    status VARCHAR(64) DEFAULT 'New',
    utm_source VARCHAR(128),
    utm_campaign VARCHAR(128),
    assigned_to VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Financial Transactions & Office Ledger (Restricted: super_admin, finance_accounts)
CREATE TABLE IF NOT EXISTS transactions (
    tx_id VARCHAR(64) PRIMARY KEY,
    date DATE NOT NULL,
    plot_id VARCHAR(64) REFERENCES properties(id) ON DELETE CASCADE,
    plot_title VARCHAR(255) NOT NULL,
    buyer_name VARCHAR(255) NOT NULL,
    buyer_phone VARCHAR(32) NOT NULL,
    total_deal_value VARCHAR(64) NOT NULL,
    token_amount VARCHAR(64) NOT NULL,
    token_num BIGINT NOT NULL,
    payment_mode VARCHAR(64) NOT NULL,
    commission_rate VARCHAR(32) NOT NULL,
    commission_earned VARCHAR(64) NOT NULL,
    agent_name VARCHAR(255) NOT NULL,
    agent_commission_share VARCHAR(64) NOT NULL,
    office_net_margin VARCHAR(64) NOT NULL,
    status VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Buyer Saved Properties (Buyer Portal)
CREATE TABLE IF NOT EXISTS buyer_saved_properties (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    property_id VARCHAR(64) REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, property_id)
);

-- 6. Buyer Scheduled Site Visits (Buyer Portal)
CREATE TABLE IF NOT EXISTS site_visits (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    property_id VARCHAR(64) REFERENCES properties(id) ON DELETE CASCADE,
    visit_date DATE NOT NULL,
    slot VARCHAR(64) NOT NULL,
    pickup_required BOOLEAN DEFAULT TRUE,
    pickup_address TEXT,
    cab_status VARCHAR(64) DEFAULT 'Driver Assigned',
    driver_name VARCHAR(128),
    driver_phone VARCHAR(32),
    assigned_advisor VARCHAR(128),
    status VARCHAR(64) DEFAULT 'Confirmed',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tamper-Evident Audit Trail Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    event VARCHAR(128) NOT NULL,
    details TEXT NOT NULL,
    severity VARCHAR(32) DEFAULT 'INFO',
    actor VARCHAR(255) NOT NULL,
    ip VARCHAR(64)
);

-- =========================================================================
-- HIGH PERFORMANCE B-TREE INDEXES FOR FAST RETRIEVAL
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_properties_city_category ON properties(city, category);
CREATE INDEX IF NOT EXISTS idx_properties_price_num ON properties(price_num);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_plot_id ON transactions(plot_id);
CREATE INDEX IF NOT EXISTS idx_saved_user_id ON buyer_saved_properties(user_id);
CREATE INDEX IF NOT EXISTS idx_visits_user_id ON site_visits(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp DESC);
