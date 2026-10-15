import React, { useState } from 'react';
import { ShieldCheck, Send, Check } from 'lucide-react';

export default function Footer({ onNavigateToPage }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info with Official Logo */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <img 
                src="/logo.svg" 
                alt="Land Lots Official Logo" 
                style={{ height: '48px', width: 'auto', display: 'block' }}
              />
              <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', background: '#eafaf0', border: '1px solid #b7f0cb', padding: '4px 10px', borderRadius: '6px' }}>
                Verified Real Estate
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: '1.65', marginBottom: '16px', color: '#64748b' }}>
              India’s dedicated marketplace for verified open plots, agricultural farm lands, gated layouts, and commercial real estate with 100% DTCP, APCRDA &amp; HMDA title validation.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#eafaf0', border: '1px solid #b7f0cb', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', color: '#15ab47', fontWeight: 700 }}>
              <ShieldCheck size={16} color="#15ab47" /> RERA Agent Reg: AP/RERA/AG/2024/09812
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <button 
                  onClick={() => onNavigateToPage('terms')} 
                  className="footer-link" 
                  style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', font: 'inherit' }}
                >
                  Home / Overview
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToPage('residential_plots')} 
                  className="footer-link" 
                  style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', font: 'inherit' }}
                >
                  Residential Plots
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToPage('agro_farms')} 
                  className="footer-link" 
                  style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', font: 'inherit' }}
                >
                  Agro &amp; Farm Lands
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToPage('converter')} 
                  className="footer-link" 
                  style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', font: 'inherit' }}
                >
                  Land Area Converter
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToPage('emi_tool')} 
                  className="footer-link" 
                  style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', font: 'inherit' }}
                >
                  Home Loan EMI Tool
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToPage('advisors')} 
                  className="footer-link" 
                  style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', font: 'inherit' }}
                >
                  Verified Advisors
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div>
            <h4 className="footer-heading">Legal &amp; Compliance</h4>
            <ul className="footer-links">
              <li>
                <button 
                  onClick={() => onNavigateToPage('terms')} 
                  className="footer-link" 
                  style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', font: 'inherit' }}
                >
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToPage('privacy')} 
                  className="footer-link" 
                  style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', font: 'inherit' }}
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToPage('refund')} 
                  className="footer-link" 
                  style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', font: 'inherit' }}
                >
                  Cancellation &amp; Refund Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToPage('rera')} 
                  className="footer-link" 
                  style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', font: 'inherit' }}
                >
                  RERA Legal Due Diligence
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToPage('ec_guide')} 
                  className="footer-link" 
                  style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', font: 'inherit' }}
                >
                  Encumbrance Search Guide
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToPage('contact')} 
                  className="footer-link" 
                  style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', font: 'inherit' }}
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToPage('security_audit')} 
                  className="footer-link" 
                  style={{ background: '#eef7fd', color: '#0A8DDD', border: '1px solid #bae2fa', padding: '4px 10px', borderRadius: '6px', textAlign: 'left', cursor: 'pointer', font: 'inherit', fontWeight: 700, marginTop: '4px' }}
                >
                  🛡️ Live Admin &amp; Security Audit
                </button>
              </li>
            </ul>
          </div>

          {/* Plot Launch Alerts */}
          <div>
            <h4 className="footer-heading">Plot Launch Alerts</h4>
            <p style={{ fontSize: '0.85rem', marginBottom: '14px', color: '#64748b' }}>
              Get notifications when new DTCP-approved layouts are released in Vijayawada &amp; Hyderabad.
            </p>

            {subscribed ? (
              <div style={{ background: '#eafaf0', border: '1px solid #b7f0cb', color: '#15ab47', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={16} /> You're on the VIP Launch List!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '6px' }}>
                <input 
                  type="email" 
                  placeholder="Enter email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ 
                    padding: '10px 14px', 
                    borderRadius: '8px', 
                    border: '1.5px solid #cbd5e1', 
                    background: 'white', 
                    color: '#0f172a',
                    fontSize: '0.88rem',
                    flex: 1
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 16px' }} title="Subscribe">
                  <Send size={16} />
                </button>
              </form>
            )}

            <div style={{ marginTop: '18px', fontSize: '0.82rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>📞 Sales: <strong>1800-200-9999</strong></div>
              <div>✉️ Support: <strong>care@landlots.co</strong></div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} Land Lots Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ color: '#15ab47', fontWeight: 600 }}>● 100% DTCP / RERA Verified</span>
            <span>● Clear Titles</span>
            <span>● Spot Registration</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
