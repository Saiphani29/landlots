import React from 'react';
import { Star, Quote, CheckCircle, ThumbsUp } from 'lucide-react';
import { TESTIMONIALS } from '../data/mockData';

export default function Testimonials() {
  return (
    <section className="section" style={{ background: '#f8fafc' }}>
      <div className="container">
        <div className="section-header">
          <div>
            <div className="section-tag">
              <ThumbsUp size={16} /> Buyer Trust & Proof
            </div>
            <h2 className="section-title">Trusted by 14,000+ Land & Home Buyers</h2>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '420px', textAlign: 'right' }}>
            Hear from genuine plot owners and NRI investors who completed spot registration with zero middleman friction.
          </p>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="testimonial-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <Quote size={24} color="#cbd5e1" />
              </div>

              <p className="testimonial-quote">"{t.quote}"</p>

              <div style={{ marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{t.name}</div>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{t.role} • {t.location}</div>
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '5px', 
                  fontSize: '0.74rem', 
                  color: '#15803d', 
                  fontWeight: 700, 
                  marginTop: '8px',
                  background: '#eafaf0',
                  border: '1px solid #b7f0cb',
                  padding: '3px 10px',
                  borderRadius: '9999px'
                }}>
                  <CheckCircle size={12} color="#16a34a" /> Verified Purchase: {t.verifiedPurchase}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
