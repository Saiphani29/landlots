import React from 'react';
import { Sparkles, PhoneCall, ArrowRight } from 'lucide-react';

export default function CampaignTopBar({ onOpenLeadModal }) {
  return (
    <div className="top-campaign-bar">
      <div className="container">
        <div className="campaign-content">
          <span className="campaign-pill">🔥 Festive Launch</span>
          <span>
            <strong>0% Brokerage & Free DTCP Legal Clearance</strong> on all new residential plot bookings in Vijayawada & Hyderabad!
          </span>
          <button 
            onClick={() => onOpenLeadModal({ title: "Festive Offer Registration" })}
            className="btn btn-outline"
            style={{ padding: '4px 10px', fontSize: '0.75rem', background: '#ffffff', color: '#0A8DDD', border: '1px solid #b9dcf5', whiteSpace: 'nowrap' }}
          >
            Claim Offer <ArrowRight size={12} />
          </button>
        </div>
      </div>
      <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '16px', whiteSpace: 'nowrap' }}>
        <PhoneCall size={14} color="#0A8DDD" />
        <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Sales Hotline: 1800-200-9999</span>
      </div>
    </div>
  );
}
