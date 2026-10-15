import React from 'react';
import { ShieldCheck, Award, Users, Landmark } from 'lucide-react';

export default function StatsStrip() {
  const stats = [
    {
      icon: <ShieldCheck size={28} />,
      number: "1,200+",
      label: "Verified DTCP & RERA Plots"
    },
    {
      icon: <Award size={28} />,
      number: "100%",
      label: "Legal Title Clearance"
    },
    {
      icon: <Landmark size={28} />,
      number: "₹450 Cr+",
      label: "Real Estate Value Transacted"
    },
    {
      icon: <Users size={28} />,
      number: "14,500+",
      label: "Satisfied Land & Home Buyers"
    }
  ];

  return (
    <div className="container">
      <div className="stats-strip">
        {stats.map((s, idx) => (
          <div key={idx} className="stat-item">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-info">
              <h3>{s.number}</h3>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
