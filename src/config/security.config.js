/**
 * Land Lots Enterprise Security & Admin Governance Configuration
 * Compliant with SOC2, ISO27001, and OWASP Top 10 Guidelines.
 */

export const SECURITY_CONFIG = {
  // Password Complexity Standards (NIST SP 800-63B)
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
    specialCharPattern: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    maxConsecutiveFailedAttempts: 5,
    lockoutDurationMinutes: 5,
  },

  // Session & Token Governance
  session: {
    tokenExpirationHours: 2,
    idleTimeoutMinutes: 30,
    storagePrefix: 'landlots_',
    tokenIssuer: 'landlots.co/security/v1',
    hashAlgorithm: 'SHA-256',
  },

  // Role-Based Access Control (RBAC) Permission Matrix
  roles: {
    SUPER_ADMIN: {
      id: 'super_admin',
      label: 'Master Admin & Principal',
      permissions: [
        'VIEW_DASHBOARD',
        'MANAGE_STAFF',
        'VIEW_FINANCIALS',
        'APPROVE_TRANSACTIONS',
        'EDIT_INVENTORY',
        'DELETE_INVENTORY',
        'EXPORT_DATA',
        'VIEW_AUDIT_LOGS',
        'EDIT_SECURITY_CONFIG'
      ],
      allowedBranches: ['All Branches', 'Vijayawada HQ', 'Hyderabad Corporate']
    },
    SALES_LEAD: {
      id: 'sales',
      label: 'Senior Sales Lead',
      permissions: [
        'VIEW_DASHBOARD',
        'VIEW_LEADS',
        'ASSIGN_LEADS',
        'UPDATE_LEAD_STATUS',
        'BOOK_SITE_VISIT',
        'VIEW_INVENTORY'
      ],
      allowedBranches: ['Vijayawada - Bandar Road', 'Guntur Hub', 'Amaravati Central']
    },
    MARKETING_LEAD: {
      id: 'marketing',
      label: 'Head of Growth & Campaigns',
      permissions: [
        'VIEW_DASHBOARD',
        'VIEW_CAMPAIGNS',
        'CREATE_UTM_LINKS',
        'VIEW_LEAD_ANALYTICS',
        'EXPORT_MARKETING_REPORTS'
      ],
      allowedBranches: ['Hyderabad Corporate', 'Vijayawada HQ']
    },
    ACCOUNTS_CONTROLLER: {
      id: 'finance_accounts',
      label: 'Office Accounts & Finance Controller',
      permissions: [
        'VIEW_DASHBOARD',
        'VIEW_FINANCIALS',
        'RECORD_TOKEN_ADVANCE',
        'PROCESS_BROKERAGE_SPLIT',
        'GENERATE_TAX_INVOICE',
        'EXPORT_FINANCIAL_CSV'
      ],
      allowedBranches: ['Vijayawada HQ', 'Hyderabad Corporate']
    },
    PUBLIC_BUYER: {
      id: 'buyer',
      label: 'Verified Buyer / Investor',
      permissions: [
        'BROWSE_PROPERTIES',
        'CALCULATE_EMI',
        'BOOK_SITE_VISIT',
        'DOWNLOAD_RERA_BROCHURE',
        'SUBMIT_INQUIRY'
      ],
      allowedBranches: ['Public Portal']
    }
  },

  // Input Sanitization RegEx Patterns
  sanitization: {
    sqlInjectionPattern: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|EXEC)\b)|(--)/i,
    xssPattern: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    phonePattern: /^[6-9]\d{9}$/,
    reraPattern: /^[A-Z]{2}\/RERA\/[A-Z]{2}\/\d{4}\/\d{5}$/
  },

  // System Audit Events
  auditEvents: {
    AUTH_SUCCESS: 'AUTH_SUCCESS',
    AUTH_FAILURE: 'AUTH_FAILURE',
    AUTH_LOCKOUT: 'AUTH_LOCKOUT',
    TOKEN_GENERATED: 'TOKEN_GENERATED',
    SESSION_EXPIRED: 'SESSION_EXPIRED',
    INVENTORY_MODIFIED: 'INVENTORY_MODIFIED',
    FINANCIAL_RECORD_ADDED: 'FINANCIAL_RECORD_ADDED',
    STAFF_PROVISIONED: 'STAFF_PROVISIONED',
    LEAD_EXPORTED: 'LEAD_EXPORTED',
    SECURITY_CHECK_PASSED: 'SECURITY_CHECK_PASSED'
  }
};
