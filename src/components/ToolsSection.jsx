import React, { useState } from 'react';
import { Ruler, Calculator, ArrowRightLeft, Percent, IndianRupee } from 'lucide-react';
import { convertLandArea, calculateEMI } from '../utils/excelUtils';

export default function ToolsSection() {
  // Land Converter State
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

  return (
    <section id="calculators" className="tools-section">
      <div className="container">
        <div className="section-header" style={{ marginBottom: '28px' }}>
          <div>
            <div className="section-tag">
              <Calculator size={16} /> Precision Decision Tools
            </div>
            <h2 className="section-title">Land Area Converter & Loan EMI Estimator</h2>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '420px', textAlign: 'right' }}>
            Used daily by our sales team and property investors to calculate exact land measurements and monthly repayment schedules.
          </p>
        </div>

        <div className="tools-grid">
          {/* Tool 1: Land Area Unit Converter */}
          <div className="tool-card">
            <div className="tool-header">
              <div className="tool-icon">
                <Ruler size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Land Area Unit Converter</h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Convert between Sq.Yards, Cents, Guntas, Acres & Sq.Feet</p>
              </div>
            </div>

            <div className="tool-body">
              <div className="input-group">
                <label>Enter Land Value</label>
                <div className="input-field-wrap">
                  <input 
                    type="number" 
                    value={areaVal} 
                    onChange={(e) => setAreaVal(e.target.value)}
                    min="1"
                    placeholder="e.g. 200"
                  />
                  <select 
                    value={fromUnit} 
                    onChange={(e) => setFromUnit(e.target.value)}
                    style={{ borderLeft: '1px solid #cbd5e1' }}
                  >
                    {Object.entries(unitLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
                <button 
                  onClick={() => {
                    const temp = fromUnit;
                    setFromUnit(toUnit);
                    setToUnit(temp);
                  }}
                  className="btn btn-outline"
                  style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '9999px' }}
                  title="Swap Units"
                >
                  <ArrowRightLeft size={14} /> Swap Conversion
                </button>
              </div>

              <div className="input-group">
                <label>Target Unit</label>
                <div className="input-field-wrap">
                  <select 
                    value={toUnit} 
                    onChange={(e) => setToUnit(e.target.value)}
                  >
                    {Object.entries(unitLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Converted Output Card */}
              <div className="tool-result-box">
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {areaVal || 0} {unitLabels[fromUnit]} equals
                  </div>
                  <div className="result-val">
                    {convertedResult.toLocaleString()} <span style={{ fontSize: '1rem', color: '#e2e8f0' }}>{unitLabels[toUnit]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tool 2: Plot & Home Loan EMI Calculator */}
          <div className="tool-card">
            <div className="tool-header">
              <div className="tool-icon" style={{ background: '#eff6ff', color: '#0d6efd' }}>
                <Percent size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Plot & Home Loan EMI Estimator</h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Calculate monthly installment for bank-approved layouts</p>
              </div>
            </div>

            <div className="tool-body">
              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label>Loan Amount (₹)</label>
                  <span style={{ fontWeight: 800, color: '#0b1523' }}>₹{(loanAmount / 100000).toFixed(2)} Lakhs</span>
                </div>
                <input 
                  type="range" 
                  min="500000" 
                  max="15000000" 
                  step="100000"
                  value={loanAmount} 
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#0A8DDD' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label>Interest Rate (% p.a.)</label>
                    <span style={{ fontWeight: 800 }}>{interestRate}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="7" 
                    max="14" 
                    step="0.1"
                    value={interestRate} 
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#0A8DDD' }}
                  />
                </div>

                <div className="input-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label>Tenure (Years)</label>
                    <span style={{ fontWeight: 800 }}>{tenureYears} Yrs</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="30" 
                    step="1"
                    value={tenureYears} 
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#0A8DDD' }}
                  />
                </div>
              </div>

              {/* EMI Output Card */}
              <div className="tool-result-box" style={{ background: 'linear-gradient(135deg, #eafaf0 0%, #ffffff 100%)', borderColor: '#b7f0cb' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 600 }}>Estimated Monthly EMI</div>
                  <div className="result-val" style={{ color: '#16a34a' }}>
                    ₹{emiResult.monthlyEMI.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#475569' }}>/ month</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.84rem', color: '#475569' }}>
                  <div>Total Interest: <strong style={{ color: '#0f172a' }}>₹{(emiResult.totalInterest / 100000).toFixed(2)}L</strong></div>
                  <div>Total Payment: <strong style={{ color: '#0f172a' }}>₹{(emiResult.totalPayment / 100000).toFixed(2)}L</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
