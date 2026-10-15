import React, { useState } from 'react';
import { X, Calendar, Phone, User, MapPin, Clock, Car, CheckCircle2, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SiteVisitModal({ modalData, onClose, onSubmitLead }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [needCabPickup, setNeedCabPickup] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple Indian 10-digit mobile number validation
    const phoneClean = phone.replace(/\D/g, '');
    if (phoneClean.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const newLead = {
      id: `LD-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toLocaleString(),
      name: name.trim(),
      phone: `+91 ${phoneClean.slice(-10)}`,
      email: `${name.toLowerCase().replace(/\s+/g, '')}@lead.com`,
      interest: modalData.propertyName || modalData.title || "General Property Inquiry",
      budget: modalData.propertyPrice || "Flexible",
      status: "Site Visit Confirmed",
      date,
      timeSlot,
      cabPickup: needCabPickup ? "Yes (Requested)" : "No",
      source: "Website Direct / Site Visit Modal",
      utm_campaign: "organic_direct",
      assignedAgent: modalData.assignedAgent || "Suresh Varma"
    };

    onSubmitLead(newLead);
    setIsSuccess(true);
    setErrorMsg('');

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Confetti fallback
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              {isSuccess ? 'Site Visit Confirmed! 🎉' : modalData.title || 'Schedule Free Site Inspection'}
            </h3>
            {modalData.propertyName && (
              <p style={{ fontSize: '0.85rem', color: '#00b074', fontWeight: 700, marginTop: '2px' }}>
                📍 {modalData.propertyName}
              </p>
            )}
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '24px 12px' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                background: '#ecfdf5', 
                color: '#00b074', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 16px' 
              }}>
                <CheckCircle2 size={36} />
              </div>
              <h4 style={{ fontSize: '1.35rem', marginBottom: '8px' }}>Thank You, {name}!</h4>
              <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '20px' }}>
                Your inspection slot is booked for <strong>{date} ({timeSlot})</strong>. Our designated advisor (<strong>{modalData.assignedAgent || 'Suresh Varma'}</strong>) will contact you at <strong>+91 {phone.slice(-10)}</strong> with the layout directions.
              </p>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', color: '#334155', marginBottom: '24px' }}>
                🚗 <strong>Cab Pickup Status:</strong> {needCabPickup ? 'Free AC Pickup Driver Assigned' : 'Self-Drive'}
              </div>
              <button onClick={onClose} className="btn btn-primary" style={{ width: '100%' }}>
                Done / Back to Properties
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {errorMsg && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem' }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              <div className="input-group">
                <label><User size={12} /> Your Full Name *</label>
                <div className="input-field-wrap">
                  <input 
                    type="text" 
                    placeholder="e.g. Ramesh Kumar" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="input-group">
                <label><Phone size={12} /> WhatsApp / Mobile Number *</label>
                <div className="input-field-wrap">
                  <span style={{ padding: '12px 14px', background: '#e2e8f0', fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>
                    +91
                  </span>
                  <input 
                    type="tel" 
                    placeholder="98480 12345" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={10}
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                  <label><Calendar size={12} /> Preferred Date</label>
                  <div className="input-field-wrap">
                    <input 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label><Clock size={12} /> Time Slot</label>
                  <div className="input-field-wrap">
                    <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                      <option value="10:00 AM - 12:00 PM">Morning (10 AM)</option>
                      <option value="02:00 PM - 04:00 PM">Afternoon (2 PM)</option>
                      <option value="04:00 PM - 06:00 PM">Evening (4 PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <input 
                  type="checkbox" 
                  checked={needCabPickup} 
                  onChange={(e) => setNeedCabPickup(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#00b074' }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Car size={16} color="#00b074" /> Request Free AC Cab Pickup & Drop for Site Visit
                </span>
              </label>

              <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} color="#00b074" />
                100% Privacy Protected. No spam or aggressive broker calls.
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '14px', fontSize: '1rem', marginTop: '6px' }}>
                Confirm Free Site Visit Slot
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
