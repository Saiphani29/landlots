import React, { useState } from 'react';
import { 
  Ruler, Calculator, ArrowRightLeft, Percent, IndianRupee, 
  X, CheckCircle, ArrowRight, ShieldCheck, HelpCircle
} from 'lucide-react';
import { convertLandArea, calculateEMI } from '../utils/excelUtils';

export default function EstimatorSidebar({ isOpen, onClose, onOpenLeadModal }) {
  // Tab State: 'converter' | 'emi'
  const [activeTab, setActiveTab] = useState('converter');

  // Land Area Unit Converter State
  const [areaVal, setAreaVal] = useState("200");
  const [fromUnit, setFromUnit] = useState("sqyds");
  const [toUnit, setToUnit] = useState("cents");

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(3500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  const convertedResult = convertLandArea(areaVal, fromUnit, toUnit);
  const emiResult = calculateEMI(loanAmount, interestRate, tenureYears);

  const unitLabels = {
    sqyds: "Square Yards (Gaj)",
    sqft: "Square Feet (Sq.Ft)",
    cents: "Cents (Andhra/TN)",
    guntas: "Guntas (Telangana/KA)",
    acres: "Acres",
    sqmtrs: "Square Meters"
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-backdrop" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="estimator-drawer" role="dialog" aria-modal="true">
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'rgba(28, 211, 89, 0.2)',
              color: '#1CD359',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Calculator size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'white' }}>
                Land &amp; Loan Estimator
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                Instant unit conversions &amp; bank EMI estimates
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="drawer-close-btn"
            aria-label="Close Estimator Drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          padding: '12px 24px',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          gap: '8px'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('converter')}
            style={{
              padding: '10px',
              borderRadius: '10px',
              border: activeTab === 'converter' ? '2px solid #0A8DDD' : '1px solid #cbd5e1',
              background: activeTab === 'converter' ? '#e0f2fe' : '#ffffff',
              color: activeTab === 'converter' ? '#0369a1' : '#475569',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Ruler size={16} /> Area Converter
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('emi')}
            style={{
              padding: '10px',
              borderRadius: '10px',
              border: activeTab === 'emi' ? '2px solid #1CD359' : '1px solid #cbd5e1',
              background: activeTab === 'emi' ? '#eafaf0' : '#ffffff',
              color: activeTab === 'emi' ? '#15ab47' : '#475569',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <IndianRupee size={16} /> Loan EMI Estimator
          </button>
        </div>

        {/* Drawer Content */}
        <div className="drawer-body">
          {activeTab === 'converter' ? (
            /* TAB 1: AREA UNIT CONVERTER */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '0.82rem',
                color: '#0369a1'
              }}>
                📐 <strong>Official Land Measurement Ratios:</strong> Standardized conversions for Andhra Pradesh, Telangana, Karnataka, and Tamil Nadu.
              </div>

              {/* Input Value & Source Unit */}
              <div className="input-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px', display: 'block' }}>
                  Enter Land Measurement:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '8px' }}>
                  <input 
                    type="number" 
                    value={areaVal} 
                    onChange={(e) => setAreaVal(e.target.value)}
                    min="1"
                    placeholder="e.g. 200"
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#0f172a'
                    }}
                  />
                  <select 
                    value={fromUnit} 
                    onChange={(e) => setFromUnit(e.target.value)}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      background: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    {Object.entries(unitLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button 
                  type="button"
                  onClick={() => {
                    const temp = fromUnit;
                    setFromUnit(toUnit);
                    setToUnit(temp);
                  }}
                  className="btn btn-outline"
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.82rem',
                    borderRadius: '9999px',
                    borderColor: '#cbd5e1',
                    background: '#f8fafc',
                    color: '#0A8DDD',
                    fontWeight: 700
                  }}
                >
                  <ArrowRightLeft size={14} /> Swap Units
                </button>
              </div>

              {/* Target Unit */}
              <div className="input-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px', display: 'block' }}>
                  Target Conversion Unit:
                </label>
                <select 
                  value={toUnit} 
                  onChange={(e) => setToUnit(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  {Object.entries(unitLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Converted Output Card */}
              <div style={{
                background: 'linear-gradient(135deg, #071527 0%, #0d2847 100%)',
                color: 'white',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 8px 24px rgba(10, 141, 221, 0.2)',
                border: '1px solid rgba(14, 165, 233, 0.3)'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Converted Measurement
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
                  {convertedResult.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.92rem', color: '#e2e8f0', fontWeight: 600, marginTop: '2px' }}>
                  {unitLabels[toUnit]}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
                  Equates exactly to: <strong>{areaVal || 0} {unitLabels[fromUnit]}</strong>
                </div>
              </div>

              {/* Quick Equivalents Table */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '14px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                  ⚡ Quick Regional Land Multipliers:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.76rem', color: '#64748b' }}>
                  <div>• 1 Gunta = 121 Sq.Yds</div>
                  <div>• 1 Acre = 40 Guntas</div>
                  <div>• 1 Cent = 48.4 Sq.Yds</div>
                  <div>• 1 Acre = 100 Cents</div>
                  <div>• 1 Sq.Yd = 9 Sq.Ft</div>
                  <div>• 1 Cent = 435.6 Sq.Ft</div>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: LOAN EMI ESTIMATOR */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                background: '#eafaf0',
                border: '1px solid #bbf7d0',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '0.82rem',
                color: '#166534'
              }}>
                🏦 <strong>Bank Loan Approvals:</strong> Tie-ups with SBI, HDFC, ICICI, and LIC Housing Finance for up to 80% plot &amp; construction funding.
              </div>

              {/* Loan Amount Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                    Desired Loan Amount:
                  </label>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0A8DDD' }}>
                    ₹{(loanAmount / 100000).toFixed(1)} Lakhs
                  </span>
                </div>
                <input 
                  type="range"
                  min="500000"
                  max="20000000"
                  step="100000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#0A8DDD', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8' }}>
                  <span>₹5 Lakhs</span>
                  <span>₹1 Crore</span>
                  <span>₹2 Crores</span>
                </div>
              </div>

              {/* Interest Rate Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                    Annual Interest Rate:
                  </label>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1CD359' }}>
                    {interestRate}% p.a.
                  </span>
                </div>
                <input 
                  type="range"
                  min="6.5"
                  max="14.0"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#1CD359', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8' }}>
                  <span>6.5%</span>
                  <span>8.5% (Prime)</span>
                  <span>14.0%</span>
                </div>
              </div>

              {/* Tenure Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                    Loan Tenure (Years):
                  </label>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f59e0b' }}>
                    {tenureYears} Years ({tenureYears * 12} Months)
                  </span>
                </div>
                <input 
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8' }}>
                  <span>5 Yrs</span>
                  <span>15 Yrs</span>
                  <span>30 Yrs</span>
                </div>
              </div>

              {/* EMI Calculation Output Card */}
              <div style={{
                background: 'linear-gradient(135deg, #071527 0%, #06261d 100%)',
                color: 'white',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 8px 24px rgba(28, 211, 89, 0.2)',
                border: '1px solid rgba(28, 211, 89, 0.3)'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Estimated Monthly EMI
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1CD359', marginTop: '4px' }}>
                  ₹{emiResult.monthlyEMI.toLocaleString()}
                  <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}> / month</span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginTop: '16px',
                  paddingTop: '14px',
                  borderTop: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total Interest Payable</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f59e0b' }}>
                      ₹{emiResult.totalInterest.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total Principal + Interest</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                      ₹{emiResult.totalPayment.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenLeadModal) {
                    onOpenLeadModal({
                      title: "Apply for Pre-Approved Land & Home Loan",
                      loanRequired: `₹${(loanAmount / 100000).toFixed(1)} Lakhs`
                    });
                  }
                }}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  justifyContent: 'center',
                  fontSize: '0.92rem',
                  gap: '8px'
                }}
              >
                <span>Get Bank Pre-Approval Assistance</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
