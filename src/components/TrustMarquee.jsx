import React from 'react';
import { ShieldCheck, Award, Landmark, CheckCircle, Banknote, Sparkles } from 'lucide-react';

export default function TrustMarquee() {
  const marqueeItems = [
    { icon: <ShieldCheck size={16} color="#0A8DDD" />, text: "APCRDA & CRDA Approved Layouts" },
    { icon: <CheckCircle size={16} color="#15ab47" />, text: "100% DTCP Clear Title Plots" },
    { icon: <Award size={16} color="#f59e0b" />, text: "RERA Certified: AP/RERA/2024/098" },
    { icon: <Landmark size={16} color="#0A8DDD" />, text: "SBI, HDFC & ICICI Loan Approved" },
    { icon: <Banknote size={16} color="#15ab47" />, text: "0% Brokerage Direct Developer Pricing" },
    { icon: <Sparkles size={16} color="#0A8DDD" />, text: "Free 30-Year Encumbrance Search" },
    { icon: <CheckCircle size={16} color="#15ab47" />, text: "Hassle-Free Spot Registration" },
  ];

  return (
    <div className="trust-marquee-wrapper" aria-label="Approved Authorities and Certifications">
      <div className="trust-marquee-track">
        {/* Render twice for continuous infinite scroll loop */}
        {[...marqueeItems, ...marqueeItems].map((item, idx) => (
          <div key={idx} className="trust-marquee-item">
            {item.icon}
            <span>{item.text}</span>
            <span style={{ color: '#cbd5e1', margin: '0 8px' }}>•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
