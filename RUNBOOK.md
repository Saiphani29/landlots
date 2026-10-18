# Land Lots Commercial Real Estate Platform 🏢
## Production Operations Runbook & System Architecture Guide

> **Live Local Services:**
> - 🌐 **Commercial Web Portal**: [http://localhost:5174/](http://localhost:5174/)
> - ⚡ **Backend API Gateway**: [http://localhost:5001/api/health](http://localhost:5001/api/health)
> - 📁 **Production PostgreSQL DDL**: [`server/schema.sql`](file:///c:/Users/Sai%20Phanindra/Music/land/server/schema.sql)
> - ⚙️ **Active Configuration**: [`.env`](file:///c:/Users/Sai%20Phanindra/Music/land/.env)

---

## 1. System Requirements & Prerequisites

Before running the application, ensure your environment meets the following specifications:

| Requirement | Supported Version | Notes |
| :--- | :--- | :--- |
| **Node.js** | `v20.x` or higher (tested on Node.js 20+) | Required for native `node:sqlite` WAL database and ES Modules |
| **npm** | `v10.x` or higher | Package management and script orchestration |
| **Terminal / Shell** | PowerShell (Windows), Bash (macOS/Linux) | UTF-8 enabled |
| **Browser** | Chrome, Edge, Firefox, Brave | Modern browser with Web Crypto API support |

---

## 2. Quick Start: How to Run the Application

The application is architected with a decoupled frontend (React 19 + Vite) and backend API gateway (Express.js + SQLite/PostgreSQL).

### Option A: Run Both Services (Recommended for Full-Stack)

Open two terminal tabs in the project root:

#### Terminal 1 — Start the Backend API Gateway:
```powershell
npm run server
```
- **Port**: `5001`
- **Health Check**: `http://localhost:5001/api/health`
- **Features**: JWT HS256 authentication, brute-force IP lockout protection (5 attempts / 5 mins), database query layer.

#### Terminal 2 — Start the Frontend Commercial Portal:
```powershell
npm run dev
```
- **Port**: `http://localhost:5174/` (or `http://localhost:5173/`)
- Automatically connects to the backend on `http://localhost:5001/api`.

---

## 3. Environment Variables Configuration (`.env`)

Configuration is externalized per Twelve-Factor App guidelines into [`.env`](file:///c:/Users/Sai%20Phanindra/Music/land/.env). A template is maintained in [`.env.example`](file:///c:/Users/Sai%20Phanindra/Music/land/.env.example).

```env
# =========================================================================
# Server & Security Configuration
# =========================================================================
PORT=5001
# Do NOT put NODE_ENV in .env — Vite would turn `npm run build` into a dev build.
# Set NODE_ENV=production in the host environment for deployments.
# REQUIRED in production: 32+ random chars (server refuses to start without it)
JWT_SECRET=<generate: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))">
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174

# =========================================================================
# Database Configuration (Leave blank for local SQLite fallback)
# =========================================================================
DATABASE_URL=

# =========================================================================
# Frontend Client Configuration
# =========================================================================
# Optional; leave unset in production so the app calls same-origin /api
# VITE_API_URL=http://localhost:5001/api
```

---

## 4. Free Cloud PostgreSQL Setup (Supabase & Neon DB)

The platform is designed to connect to zero-cost cloud PostgreSQL databases without paying for infrastructure:

### Provider 1: Neon DB (Serverless PostgreSQL — Free Tier)
1. Sign up for free at [neon.tech](https://neon.tech).
2. Create a new project: `landlots-prod`.
3. In your Neon dashboard, copy the **Connection string**:
   ```env
   DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-sample-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
4. Paste the connection string into your [`.env`](file:///c:/Users/Sai%20Phanindra/Music/land/.env) file.
5. In the Neon **SQL Editor**, open [`server/schema.sql`](file:///c:/Users/Sai%20Phanindra/Music/land/server/schema.sql), paste its entire content, and click **Run**.

### Provider 2: Supabase (Managed PostgreSQL — Free Tier)
1. Sign up for free at [supabase.com](https://supabase.com).
2. Create a new organization and project.
3. In **Project Settings > Database > Connection String (URI)**, copy the PostgreSQL URI.
4. Paste into [`.env`](file:///c:/Users/Sai%20Phanindra/Music/land/.env).
5. In the Supabase **SQL Editor**, paste and run [`server/schema.sql`](file:///c:/Users/Sai%20Phanindra/Music/land/server/schema.sql).

> **Dual-Engine Graceful Fallback**: If `DATABASE_URL` is blank or the cloud network is offline, the server runs automatically using local SQLite 3 in WAL mode (`server/landlots.db`). No configuration is required.

---

## 5. User Roles, Portals & Security Separation

The system enforces strict role-based privilege isolation to protect customer PII and internal financial data:

```
                  ┌─────────────────────────────────────┐
                  │           AUTHENTICATION            │
                  └──────────────────┬──────────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 │                                       │
     Role: 'buyer'                       Roles: 'super_admin', 'sales',
 (Google / Email Login)                         'marketing', 'finance'
                 │                                       │
                 ▼                                       ▼
  ┌──────────────────────────────┐        ┌──────────────────────────────┐
  │   BUYER & INVESTOR PORTAL    │        │    ENTERPRISE OFFICE CONSOLE │
  ├──────────────────────────────┤        ├──────────────────────────────┤
  │ • Saved / Shortlisted Plots  │        │ • Office Ledger & Token GMV  │
  │ • Chauffeur Site Visit Live  │        │ • Master CRM Leads Pipeline  │
  │ • Official Booking Receipts  │        │ • Marketing UTM Attribution  │
  │ • Certified 30-Yr EC & Deeds │        │ • Staff Account Provisioning │
  │ • Direct Advisor WhatsApp    │        │ • Real-Time Security Audit   │
  └──────────────────────────────┘        └──────────────────────────────┘
```

### Access Matrix & Verified Test Credentials

> **Sign-in is verified by the API server only** — keep `npm run server` running alongside `npm run dev`.
> These are seed credentials for local development. They were previously shipped in the public JS bundle,
> so **change every staff password before going live**. A first sign-in from an unknown email creates a buyer
> account with that password (bcrypt-hashed); later sign-ins must use the same password.

| Portal / View | Allowed Roles | Default Account | Password (NIST SP 800-63B) |
| :--- | :--- | :--- | :--- |
| **Buyer & Investor Portal** | `buyer` | `buyer@gmail.com` or Google SSO | `Buyer@LandLots2026!` (6+ chars) |
| **Office Console (Full)** | `super_admin` | `admin@landlots.co` | `Admin@LandLots2026!` |
| **Office Accounts & Ledger** | `finance_accounts` | `accounts@landlots.co` | `Accounts@LandLots2026!` |
| **Sales Leads CRM** | `sales` | `sales@landlots.co` | `Sales@LandLots2026!` |
| **Growth & UTM Analytics** | `marketing` | `marketing@landlots.co` | `Marketing@LandLots2026!` |

---

## 6. Verification & Audit Testing

To verify security standards, password complexity, and authorization matrix, run the automated test suite:

```powershell
node .agents/skills/landlots-admin-audit/scripts/run_audit.mjs
```

Expected output:
```text
======================================================
  LAND LOTS ENTERPRISE SECURITY & ADMIN AUDIT SUITE   
======================================================

[PASS] Security Configuration Integrity - Verified NIST SP 800-63B standards and 5 RBAC roles in security.config.js
[PASS] Auth Engine & Token Expiration - Brute-force lockout and signed session token verification confirmed in AuthContext
[PASS] Sub-Page Coverage (Legal & Knowledge Center) - All 6 statutory legal policies verified
[PASS] Office Accounts & Ledger Accounting - Office ledger, token advances, brokerage splits, and CSV exports verified
[PASS] Admin Login Landmark Vector Art & SSO - Animated Prakasam Barrage, Sri Kanakadurga Temple SVG art & Google SSO validated

------------------------------------------------------
 AUDIT RESULT: 5/5 CHECKS PASSED (100%)
------------------------------------------------------
```

---

## 7. Production Build Verification

To compile the production bundle for deployment:
```powershell
npm run build
```
- Assets compiled to `dist/` with zero linting or bundling errors.
- Preview production build locally: `npm run preview`.
