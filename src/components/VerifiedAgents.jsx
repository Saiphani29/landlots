import React from 'react';
import { ShieldCheck, Star, PhoneCall, CheckCircle2, UserCheck } from 'lucide-react';
import { VERIFIED_AGENTS } from '../data/mockData';

export default function VerifiedAgents({ onOpenLeadModal }) {
  return (
    <section id="agents" className="section">
      <div className="container">
        <div className="section-header">
          <div>
            <div className="section-tag">
              <UserCheck size={16} /> Certified Real Estate Advisors
            </div>
            <h2 className="section-title">Consult with Local Land & Property Experts</h2>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '420px', textAlign: 'right' }}>
            All LandLots advisors are RERA registered, revenue-law verified, and have closed 25+ certified land deals.
          </p>
        </div>

        <div className="agents-grid">
          {VERIFIED_AGENTS.map((agent) => (
            <div key={agent.id} className="agent-card">
              <div className="agent-avatar-wrap">
                <img 
                  src={agent.avatar} 
                  alt={agent.name} 
                  className="agent-avatar" 
                  loading="lazy" 
                />
                <div className="agent-verify-badge" title="RERA Certified Advisor">
                  <ShieldCheck size={14} />
                </div>
              </div>

              <h3 className="agent-name">{agent.name}</h3>
              <p className="agent-title">{agent.title}</p>
              
              <div className="agent-rating-row">
                <Star size={14} fill="#d97706" color="#d97706" />
                <span>{agent.rating}</span>
                <span style={{ color: '#94a3b8', fontWeight: 500 }}>({agent.reviewsCount} reviews)</span>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '14px', background: '#f8fafc', padding: '6px 10px', borderRadius: '8px', width: '100%' }}>
                <div>📍 <strong>{agent.coverage}</strong></div>
                <div style={{ color: '#00b074', fontWeight: 700, marginTop: '2px' }}>{agent.activeListings} Active Verified Plots</div>
              </div>

              <div className="agent-actions">
                <button 
                  onClick={() => onOpenLeadModal({ 
                    title: `Schedule Call with ${agent.name}`,
                    assignedAgent: agent.name 
                  })}
                  className="btn btn-outline"
                  style={{ fontSize: '0.8rem', padding: '8px' }}
                >
                  <PhoneCall size={14} /> Call
                </button>
                <a 
                  href={`https://wa.me/${agent.whatsapp}?text=${encodeURIComponent(`Hi ${agent.name}, I found your profile on LandLots. I'm looking for verified plots in ${agent.coverage}. Please assist me.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{ fontSize: '0.8rem', padding: '8px' }}
                >
                  WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
