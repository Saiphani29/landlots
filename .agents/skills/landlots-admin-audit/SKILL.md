---
name: landlots-admin-audit
description: >-
  Audits the Land Lots real estate platform for admin security flaws, password policy compliance, RBAC authorization, session token validity, and sub-page completeness. Use when asked to audit or check admin, security, or platform configurations.
---

# Land Lots Admin & Security Audit Skill 🛡️

A comprehensive security, authorization, and configuration verification runbook for the Land Lots platform.

## Objectives
1. **Password & Credential Audit**: Validate that no raw plaintext passwords bypass NIST SP 800-63B standards (minimum 8 characters, mixed case, numbers, special characters) and verify SHA-256 salted digest hashing.
2. **Brute-Force & Lockout Audit**: Ensure automatic lockout activates after 5 consecutive failed login attempts with a 5-minute cooldown.
3. **RBAC Authorization Matrix**: Confirm role boundaries for `super_admin`, `sales`, `marketing`, `finance_accounts`, and `buyer`.
4. **Session Token Expiration**: Confirm JWT-like session tokens expire within 2 hours and clear cleanly upon logout or tampering.
5. **Sub-Page Navigation Coverage**: Validate that all 12 platform sub-pages (Terms, Privacy, Refund, RERA, EC Guide, Contact, Residential Plots, Agro Farms, Land Area Converter, EMI Tool, Verified Advisors, Live Security Audit) render rich, error-free interactive UI without dead links or broken placeholders.
6. **Financial Data Integrity**: Audit that office token advances and commission splits correctly calculate GMV, escrow retention, and sales representative brokerage.

---

## Audit Execution Procedures

### Step 1: Run the Automated Audit Test Suite
Execute the built-in Node.js audit verification script:

```powershell
node .agents/skills/landlots-admin-audit/scripts/run_audit.mjs
```

Expected Output:
```text
[PASS] Security Config Validated (NIST 800-63B Standards)
[PASS] Office Accounts Hash Check Passed
[PASS] Brute-Force Lockout Guard Configured (Max 5 Attempts)
[PASS] Session Token 2-Hour TTL Enforced
[PASS] RBAC Permission Matrix Verified (5 Roles Defined)
[PASS] All 12 Policy & Navigation Pages Implemented
[PASS] Financial Ledger Calculation Logic Audited
[PASS] Zero Unsanitized Input Leaks Detected
Result: 8/8 CHECKS PASSED (100% HEALTHY)
```

---

### Step 2: Manual Code Inspection Checklist

| Check Item | File Location | Validation Rule |
| :--- | :--- | :--- |
| **Password Policy** | `src/config/security.config.js` | `minLength >= 8`, uppercase, lowercase, numbers, and symbols required. |
| **Crypto Hashing** | `src/context/AuthContext.jsx` | Uses Web Crypto API SHA-256 salted digest. |
| **Lockout Protection** | `src/context/AuthContext.jsx` | `failedAttempts >= 5` triggers `isLockedOut` state. |
| **Route Protection** | `src/App.jsx` | `currentView === 'admin_dashboard'` redirects unauthenticated users. |
| **Audit Logging** | `src/context/AuthContext.jsx` | Audit logs capture `timestamp`, `event`, `user`, and `ip`. |
| **Legal Pages** | `src/components/pages/PolicyPages.jsx` | Covers all statutory RERA & MeeSeva EC guidance. |
| **Quick Link Pages** | `src/components/pages/PolicyPages.jsx` | Dedicated interactive views for Converter, EMI, Advisors, and Lands. |

---

### Step 3: Admin Dashboard Verification
1. Open `http://localhost:5174/` in the browser.
2. In the top navigation bar, click **"Office Staff Login"**.
3. Verify that the login screen displays the animated **Prakasam Barrage** and **Sri Kanakadurga Temple** vector artwork.
4. Test with invalid password to ensure the brute-force counter increments.
5. Log in with master credentials (`admin@landlots.co` / `Admin@LandLots2026!`).
6. Navigate to the **"Live Security Audit"** tab inside the dashboard or legal center to view real-time system health metrics.

---

### Step 4: Remediation Plan for Discovered Issues
- **If password strength fails**: Check `SECURITY_CONFIG.passwordPolicy` in `src/config/security.config.js` and ensure regex patterns match.
- **If dead link occurs**: Add matching route key into `src/components/pages/PolicyPages.jsx` and `src/App.jsx`.
- **If session token fails**: Clear `localStorage.removeItem('landlots_session_token')` and re-authenticate.
