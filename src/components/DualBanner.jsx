import React from 'react';
import { ArrowRight, ShieldCheck, TrendingUp, PhoneCall } from 'lucide-react';

export default function DualBanner({ onOpenLeadModal }) {
  return (
    <div className="container">
      <div className="dual-banner-section">
        <div className="dual-banner-inner">
          <div className="dual-banner-content">
            <span style={{ 
              background: '#eef7fd', 
              color: '#0A8DDD', 
              border: '1px solid #ddecfa',
              padding: '6px 14px', 
              borderRadius: '9999px', 
              fontSize: '0.8rem', 
              fontWeight: 700, 
              display: 'inline-block', 
              marginBottom: '16px' 
            }}>
              ⭐ FOR PROPERTY OWNERS & DEVELOPERS
            </span>
            <h2>Sell or Liquidate Your Land 3x Faster</h2>
            <p>
              Connect directly with verified buyers, institutional land investors, and NRIs. We provide free title diligence, professional video walk-throughs, and zero listing fees.
            </p>

            <div className="dual-banner-actions">
              <button 
                onClick={() => onOpenLeadModal({ title: "List Your Property - Owner Consultation" })}
                className="btn btn-primary"
                style={{ 
                  background: '#0A8DDD', 
                  color: 'white', 
                  padding: '14px 28px', 
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(10, 141, 221, 0.25)'
                }}
              >
                <span>Post Your Property (Free)</span>
                <ArrowRight size={18} />
              </button>

              <button 
                onClick={() => onOpenLeadModal({ title: "Institutional Land Sale / JV Partnership" })}
                className="btn btn-outline"
                style={{ 
                  background: 'white', 
                  color: '#475569', 
                  border: '1.5px solid #cbd5e1', 
                  padding: '14px 24px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <PhoneCall size={18} color="#0A8DDD" />
                <span>Request JV / Bulk Land Sale</span>
              </button>
            </div>
          </div>

          <div style={{ 
            background: '#ffffff', 
            borderRadius: '16px', 
            padding: '32px', 
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
          }}>
            <h4 style={{ color: '#0f172a', fontSize: '1.15rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
              <TrendingUp size={22} color="#1CD359" /> Why List on Land Lots?
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.95rem', color: '#475569' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#eafaf0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={16} color="#1CD359" />
                </div>
                <span>Average sale closure time of <strong>28 days</strong></span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#eafaf0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={16} color="#1CD359" />
                </div>
                <span>Direct verified buyer inquiries without middleman spam</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#eafaf0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={16} color="#1CD359" />
                </div>
                <span>Free APCRDA, DTCP &amp; revenue record verification</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#eafaf0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={16} color="#1CD359" />
                </div>
                <span>High visibility across targeted Google &amp; Meta ad campaigns</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
