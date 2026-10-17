import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, Clock, CheckCircle2, ArrowLeft, QrCode, 
  CreditCard, Building2, Smartphone, FileText, Download, Share2, 
  AlertCircle, Sparkles, Printer, ExternalLink, HelpCircle
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function BookingPaymentPage({ property, onBack, onBookingSuccess }) {
  const { t, language } = useTranslation();

  // 15-Minute Countdown Timer for Real Estate Inventory Lock
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60);
  const [step, setStep] = useState(1); // 1: Form & Payment, 2: Success Receipt

  // Form State with user-friendly defaults for immediate testing
  const [buyerName, setBuyerName] = useState('Ramesh Chandra Varma');
  const [buyerPhone, setBuyerPhone] = useState('98480 12345');
  const [buyerEmail, setBuyerEmail] = useState('ramesh.varma@gmail.com');
  const [buyerPan, setBuyerPan] = useState('APCRD9981F');
  const [tokenAmount, setTokenAmount] = useState(25000); // Default ₹25,000 token
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'netbanking' | 'cards' | 'escrow'
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [selectedBank, setSelectedBank] = useState('hdfc');
  const [upiIdInput, setUpiIdInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Countdown effect
  useEffect(() => {
    if (step === 2) return; // Stop countdown on success
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const nameToUse = buyerName.trim() || 'Verified Buyer';
    const cleanPhone = buyerPhone.replace(/\D/g, '').slice(-10) || '9848012345';
    const panToUse = (buyerPan.trim() || 'APCRD9981F').toUpperCase();

    setIsProcessing(true);

    // Simulate Payment Gateway Handshake (Razorpay / Cashfree / PayU order verification)
    setTimeout(async () => {
      const txId = `TX-AP-${Date.now().toString().slice(-6)}`;
      const receipt = {
        txId,
        date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        plotId: property?.id || 'LL-PL-101',
        plotTitle: property?.title || 'Amaravati Capital Green Plot',
        plotLocation: property?.location || 'Mangalagiri, Vijayawada',
        buyerName: nameToUse,
        buyerPhone: `+91 ${cleanPhone}`,
        buyerEmail: buyerEmail || 'customer@gmail.com',
        buyerPan: panToUse,
        totalDealValue: property?.price || '₹36.0 Lakhs',
        tokenAmount: `₹${tokenAmount.toLocaleString('en-IN')}`,
        paymentMode: paymentMethod.toUpperCase(),
        escrowAccount: 'YESB-000491-RERA-ESCROW',
        referenceHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`.toUpperCase(),
        status: 'CONFIRMED'
      };

      try {
        // Record into backend ledger if available
        await fetch('http://localhost:5001/api/ledger', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(receipt)
        }).catch(() => {
          // If server is in offline/mock mode, proceed cleanly
        });
      } catch (err) {
        console.warn('Backend sync skipped:', err);
      }

      setIsProcessing(false);
      setReceiptData(receipt);
      setStep(2);
      if (onBookingSuccess) {
        onBookingSuccess(receipt);
      }
    }, 1800);
  };

  return (
    <div className="payment-page-container" style={{ minHeight: '100vh', background: '#F9F8F5', color: '#141E1A', padding: '32px 16px 80px' }}>
      <div className="container" style={{ maxWidth: '1020px', margin: '0 auto' }}>
        
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <button 
            onClick={onBack}
            className="btn btn-outline"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '8px 16px',
              fontSize: '0.88rem',
              borderColor: '#e2dec9',
              background: '#FFFFFF',
              borderRadius: '9999px'
            }}
          >
            <ArrowLeft size={16} />
            <span>{t('receipt_done') || 'Back'}</span>
          </button>

          {/* RERA Guarantee Pill */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: '#eefbf4', 
            color: '#0e7041', 
            padding: '6px 14px', 
            borderRadius: '9999px',
            fontSize: '0.82rem',
            fontWeight: 600,
            border: '1px solid #b6edd1'
          }}>
            <ShieldCheck size={16} color="#00b074" />
            <span>RERA Protected Escrow Deposit</span>
          </div>
        </div>

        {/* STEP 1: Interactive Booking & Payment Form */}
        {step === 1 && (
          <div>
            {/* Header Titles */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ 
                display: 'inline-block', 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                letterSpacing: '1.2px', 
                textTransform: 'uppercase', 
                color: '#0A8DDD',
                background: '#e0f2fe',
                padding: '4px 10px',
                borderRadius: '6px',
                marginBottom: '8px'
              }}>
                STEP 1 OF 2 : ADVANCE SLOT RESERVATION
              </div>
              <h1 style={{ 
                fontFamily: '"Playfair Display", Georgia, serif', 
                fontSize: 'clamp(1.75rem, 3vw, 2.35rem)', 
                fontWeight: 700, 
                letterSpacing: '-0.02em', 
                marginBottom: '8px',
                color: '#141E1A'
              }}>
                {t('pay_title')}
              </h1>
              <p style={{ color: '#556960', fontSize: '1rem', maxWidth: '720px', lineHeight: 1.5 }}>
                {t('pay_subtitle')}
              </p>
            </div>

            {/* Dynamic Inventory Hold Alert Banner */}
            <div style={{ 
              background: '#fff8ea', 
              border: '1px solid #fed7aa', 
              borderRadius: '16px', 
              padding: '16px 20px', 
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ 
                  background: '#ea580c', 
                  color: 'white', 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '10px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Lock size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#9a3412' }}>
                    {t('pay_inventory_lock')}: {property?.title || 'Selected Plot'}
                  </h4>
                  <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#c2410c' }}>
                    {t('pay_lock_desc')}
                  </p>
                </div>
              </div>

              {/* Countdown Pill */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: '#ffedd5', 
                border: '1px solid #f97316', 
                color: '#c2410c', 
                padding: '8px 16px', 
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '1rem',
                fontVariantNumeric: 'tabular-nums'
              }}>
                <Clock size={18} className="animate-pulse" />
                <span>{t('pay_expires_in')}: {formatTimer(secondsRemaining)}</span>
              </div>
            </div>

            {/* Grid Layout: 2 Columns on Desktop */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '28px' }}>
              
              {/* Left Column: Buyer KYC & Payment Channels */}
              <div>
                <form onSubmit={handleProcessPayment} style={{ background: '#FFFFFF', border: '1px solid #e7e5dc', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                  
                  {errorMessage && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle size={18} />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Section 1: Buyer KYC */}
                  <div style={{ marginBottom: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <div style={{ background: '#0A8DDD', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 800 }}>1</div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{t('pay_buyer_details')}</h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                          {t('pay_name')} *
                        </label>
                        <input 
                          type="text" 
                          required
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          placeholder="e.g. Ramesh Chandra Varma"
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                          {t('pay_phone')} *
                        </label>
                        <input 
                          type="tel" 
                          required
                          value={buyerPhone}
                          onChange={(e) => setBuyerPhone(e.target.value)}
                          placeholder="98490 12345"
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                          {t('pay_pan')} *
                        </label>
                        <input 
                          type="text" 
                          required
                          maxLength={10}
                          value={buyerPan}
                          onChange={(e) => setBuyerPan(e.target.value.toUpperCase())}
                          placeholder="ABCDE1234F"
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', textTransform: 'uppercase' }}
                        />
                      </div>

                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                          {t('pay_email')}
                        </label>
                        <input 
                          type="email" 
                          value={buyerEmail}
                          onChange={(e) => setBuyerEmail(e.target.value)}
                          placeholder="ramesh.varma@gmail.com"
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Payment Method Channels */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <div style={{ background: '#0A8DDD', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 800 }}>2</div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{t('pay_method_title')}</h3>
                    </div>

                    {/* Method Selector Tabs */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px' }}>
                      {[
                        { id: 'upi', label: '⚡ UPI / QR', icon: Smartphone },
                        { id: 'netbanking', label: '🏦 NetBanking', icon: Building2 },
                        { id: 'cards', label: '💳 Cards', icon: CreditCard },
                        { id: 'escrow', label: '🏛️ Escrow NEFT', icon: FileText }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setPaymentMethod(item.id)}
                          style={{
                            padding: '10px 8px',
                            borderRadius: '10px',
                            border: paymentMethod === item.id ? '2px solid #0A8DDD' : '1px solid #e2e8f0',
                            background: paymentMethod === item.id ? '#f0f9ff' : '#f8fafc',
                            color: paymentMethod === item.id ? '#0A8DDD' : '#475569',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {/* Method Panel 1: UPI */}
                    {paymentMethod === 'upi' && (
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.88rem', color: '#475569', margin: '0 0 16px' }}>
                          {t('pay_upi_instruction')}
                        </p>

                        <div style={{ display: 'inline-block', background: 'white', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '16px' }}>
                          <img 
                            src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi%3A%2F%2Fpay%3Fpa%3Dlandlots%40yesbank%26pn%3DLandLots%2BEscrow%26am%3D25000%26cu%3DINR%26tn%3DPlot%2BHold%2BAdvance"
                            alt="Scan UPI QR" 
                            style={{ width: '150px', height: '150px', display: 'block' }}
                          />
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px', fontWeight: 600 }}>
                            UPI ID: landlots.escrow@yesbank
                          </div>
                        </div>

                        {/* Fast App Launchers */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'].map((app) => (
                            <button
                              key={app}
                              type="button"
                              onClick={() => setSelectedUpiApp(app.toLowerCase())}
                              style={{
                                padding: '6px 14px',
                                borderRadius: '9999px',
                                border: '1px solid #cbd5e1',
                                background: 'white',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: '#1e293b',
                                cursor: 'pointer'
                              }}
                            >
                              ⚡ {app}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Method Panel 2: NetBanking */}
                    {paymentMethod === 'netbanking' && (
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '10px' }}>
                          Select Preferred Bank:
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
                          {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Canara Bank'].map((bank) => (
                            <button
                              key={bank}
                              type="button"
                              onClick={() => setSelectedBank(bank)}
                              style={{
                                padding: '10px',
                                borderRadius: '8px',
                                border: selectedBank === bank ? '2px solid #0A8DDD' : '1px solid #cbd5e1',
                                background: selectedBank === bank ? '#e0f2fe' : 'white',
                                color: selectedBank === bank ? '#0369a1' : '#334155',
                                fontWeight: 600,
                                fontSize: '0.82rem',
                                cursor: 'pointer'
                              }}
                            >
                              {bank}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Method Panel 3: Cards */}
                    {paymentMethod === 'cards' && (
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Card Number</label>
                          <input type="text" placeholder="4532 •••• •••• 9821" defaultValue="4532 8921 7712 9011" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Expiry</label>
                            <input type="text" placeholder="MM/YY" defaultValue="11/28" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>CVV</label>
                            <input type="password" maxLength={3} placeholder="•••" defaultValue="871" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} />
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '12px', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Accepted:</span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>RuPay • VISA • MasterCard</span>
                        </div>
                      </div>
                    )}

                    {/* Method Panel 4: Escrow NEFT */}
                    {paymentMethod === 'escrow' && (
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
                        <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>
                          <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Virtual Escrow Account for NEFT/RTGS:</div>
                          <div><strong>Beneficiary:</strong> LandLots Projects Escrow Pvt Ltd</div>
                          <div><strong>Virtual A/c:</strong> <code>LLREAL99{property?.id?.replace(/\D/g, '') || '8841'}</code></div>
                          <div><strong>IFSC Code:</strong> <code>YESB0000001</code> (Yes Bank CMS)</div>
                          <div><strong>Account Type:</strong> RERA Project Designated Escrow</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submission CTA Button */}
                  <div style={{ marginTop: '28px' }}>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      style={{
                        width: '100%',
                        padding: '16px 24px',
                        background: '#0A8DDD',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        cursor: isProcessing ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        boxShadow: '0 4px 14px rgba(10, 141, 221, 0.35)',
                        transition: 'background 0.2s ease'
                      }}
                    >
                      {isProcessing ? (
                        <>
                          <div className="spinner" style={{ width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                          <span>Processing RERA Escrow Gateway...</span>
                        </>
                      ) : (
                        <>
                          <Lock size={18} />
                          <span>{t('pay_btn_confirm')} (₹{tokenAmount.toLocaleString('en-IN')})</span>
                        </>
                      )}
                    </button>
                    
                    <p style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center', margin: '14px 0 0', lineHeight: 1.5 }}>
                      {t('pay_security_notice')}
                    </p>
                  </div>
                </form>
              </div>

              {/* Right Column: Order Summary & Legal Deed Guarantees */}
              <div>
                <div style={{ background: '#FFFFFF', border: '1px solid #e7e5dc', borderRadius: '20px', padding: '24px', position: 'sticky', top: '100px' }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem', fontWeight: 700, borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                    {t('pay_summary')}
                  </h3>

                  {/* Property Card Thumbnail */}
                  <div style={{ display: 'flex', gap: '14px', marginBottom: '20px' }}>
                    <img 
                      src={property?.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80'} 
                      alt={property?.title || 'Selected Plot'} 
                      style={{ width: '84px', height: '84px', borderRadius: '12px', objectFit: 'cover' }}
                    />
                    <div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#00b074', background: '#eefbf4', padding: '2px 8px', borderRadius: '4px' }}>
                        {property?.category?.toUpperCase() || 'RESIDENTIAL PLOT'}
                      </span>
                      <h4 style={{ margin: '4px 0 2px', fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                        {property?.title || 'Amaravati Prime Capital Plot'}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                        📍 {property?.location || 'Mangalagiri, Amaravati'}
                      </p>
                      <div style={{ fontSize: '0.75rem', color: '#0A8DDD', fontWeight: 600, marginTop: '2px' }}>
                        ID: {property?.id || 'LL-PL-101'} • {property?.area || '200 Sq.Yds'}
                      </div>
                    </div>
                  </div>

                  {/* Price Calculation Table */}
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem', color: '#475569' }}>
                      <span>{t('pay_total_price')}</span>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{property?.price || '₹36.0 Lakhs'}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem', color: '#475569' }}>
                      <span>Rate / Sq.Yd</span>
                      <span>{property?.rate || '₹18,000 / Sq.Yd'}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem', color: '#059669' }}>
                      <span>Legal Documentation & Verification</span>
                      <span style={{ fontWeight: 700 }}>FREE (₹0)</span>
                    </div>

                    <div style={{ borderTop: '2px dashed #e2e8f0', margin: '14px 0', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{t('pay_token_amount')}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{t('pay_token_sub')}</div>
                      </div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0A8DDD' }}>
                        ₹{tokenAmount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Trust Bulletpoints */}
                  <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', fontSize: '0.78rem', color: '#334155', lineHeight: 1.5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontWeight: 600, color: '#0e7041' }}>
                      <CheckCircle2 size={14} color="#00b074" />
                      <span>100% Refund Guarantee within 48 Hours</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontWeight: 600, color: '#0e7041' }}>
                      <CheckCircle2 size={14} color="#00b074" />
                      <span>DTCP / APCRDA Verified Title Search</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#0e7041' }}>
                      <CheckCircle2 size={14} color="#00b074" />
                      <span>Instant Digital Ledger Certificate Issued</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Official Digital Receipt & Ledger Confirmation */}
        {step === 2 && receiptData && (
          <div style={{ maxWidth: '720px', margin: '0 auto', background: '#FFFFFF', border: '1px solid #dcd7c7', borderRadius: '24px', padding: '40px 32px', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
            
            {/* Top Success Icon */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                background: '#dcfce7', 
                color: '#15803d', 
                borderRadius: '50%', 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '16px' 
              }}>
                <CheckCircle2 size={36} />
              </div>
              <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.85rem', fontWeight: 700, margin: '0 0 6px', color: '#141E1A' }}>
                {t('receipt_title')}
              </h2>
              <p style={{ color: '#556960', fontSize: '0.95rem', margin: 0 }}>
                {t('receipt_subtitle')}
              </p>
            </div>

            {/* Official Certificate Card */}
            <div style={{ border: '2px solid #0A8DDD', borderRadius: '16px', padding: '24px', background: '#f8fafc', marginBottom: '28px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-12px', right: '20px', background: '#0A8DDD', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '2px 10px', borderRadius: '4px', letterSpacing: '1px' }}>
                DIGITAL TITLE HOLD CERTIFICATE
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.88rem' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>{t('receipt_tx_id')}</div>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontFamily: 'monospace', fontSize: '0.95rem' }}>{receiptData.txId}</div>
                </div>

                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>{t('receipt_date')}</div>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{receiptData.date}</div>
                </div>

                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>{t('receipt_plot')}</div>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{receiptData.plotTitle}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Plot Ref: {receiptData.plotId} ({receiptData.plotLocation})</div>
                </div>

                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Buyer Name & PAN</div>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{receiptData.buyerName}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>PAN: {receiptData.buyerPan} • {receiptData.buyerPhone}</div>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>{t('receipt_amount_paid')}</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#00b074' }}>{receiptData.tokenAmount}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Payment Channel</div>
                    <div style={{ fontWeight: 700, color: '#0A8DDD' }}>{receiptData.paymentMode} / ESCROW VERIFIED</div>
                  </div>
                </div>
              </div>

              {/* Security Hash footer */}
              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px dashed #cbd5e1', fontSize: '0.72rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                <span>Ledger Hash: <code>{receiptData.referenceHash}</code></span>
                <span>RERA Escrow: {receiptData.escrowAccount}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => window.print()} 
                className="btn btn-outline"
                style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600 }}
              >
                <Printer size={16} />
                <span>{t('receipt_print')}</span>
              </button>

              <button 
                onClick={onBack}
                className="btn btn-primary"
                style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600, background: '#0A8DDD' }}
              >
                <span>{t('receipt_done')}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
