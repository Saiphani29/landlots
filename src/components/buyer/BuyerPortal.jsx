import React, { useState } from 'react';
import { 
  Building, ShieldCheck, MapPin, Calendar, Clock, Car, PhoneCall, 
  Download, FileText, CheckCircle2, Heart, ArrowLeft, ExternalLink, 
  Sparkles, Award, CreditCard, ChevronRight, AlertCircle, LogOut, Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';

export default function BuyerPortal({ 
  onBackToHome, 
  onOpenBooking,
  savedProperties = [], 
  onRemoveSavedProperty 
}) {
  const { currentUser, logout } = useAuth();
  const { t } = useTranslation();

  // Active Tab: 'saved' | 'visits' | 'receipts' | 'documents'
  const [activeTab, setActiveTab] = useState('saved');

  // Mock investor site visits
  const [visits] = useState([
    {
      id: "SV-8041",
      plotTitle: "Green Valley Eco Plots (Plot #42)",
      location: "Kankipadu - Bandar Highway, Vijayawada",
      date: "Sunday, Oct 26, 2026",
      timeSlot: "10:00 AM - 12:00 PM",
      status: "Cab Confirmed",
      pickupAddress: "Benz Circle, Vijayawada (Near Trendset Mall)",
      driverName: "Ramesh Babu (AP 16 TX 4920 - White Innova Crysta)",
      driverPhone: "+91 98492 88122",
      advisorName: "Suresh Varma (Senior Land Specialist)",
      advisorPhone: "+91 98490 12345"
    }
  ]);

  // Mock investor token advance receipts
  const [receipts] = useState([
    {
      bookingId: "LL-BK-9921",
      date: "15 Oct 2026",
      plotTitle: "Green Valley Eco Plots",
      plotNumber: "Plot #42 (East Facing, 200 Sq.Yds)",
      location: "Kankipadu - Bandar Highway, Vijayawada",
      tokenPaid: "₹50,000",
      totalDealValue: "₹34.50 Lakhs",
      paymentMode: "UPI / Net Banking (HDFC Bank)",
      utrNumber: "HDFC984201948210",
      status: "Token Hold Confirmed",
      refundGuarantee: "100% RERA Statutory Refundable within 7 Days if Title Encumbered"
    }
  ]);

  // Mock verified legal documents
  const documents = [
    {
      id: "DOC-01",
      title: "30-Year Encumbrance Certificate (MeeSeva EC)",
      property: "Green Valley Eco Plots",
      category: "Encumbrance Search",
      status: "100% Nil Encumbrance Verified",
      date: "Certified 12 Oct 2026"
    },
    {
      id: "DOC-02",
      title: "Statutory DTCP & APCRDA Layout Approval Order",
      property: "Green Valley Eco Plots",
      category: "Town Planning Approval",
      status: "Approved Layout LP No. 42/2024",
      date: "Certified 05 Jun 2024"
    },
    {
      id: "DOC-03",
      title: "AP RERA Project Certificate",
      property: "Green Valley Eco Plots",
      category: "RERA Registration",
      status: "RERA Reg: P03290120932",
      date: "Valid till 2028"
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#040b14', color: '#f8fafc', fontFamily: 'var(--font-body)' }}>
      {/* Top Investor Header */}
      <header style={{
        background: '#091524',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '16px 32px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={onBackToHome}
              className="btn btn-outline"
              style={{
                padding: '8px 14px',
                fontSize: '0.82rem',
                borderColor: 'rgba(255,255,255,0.15)',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ArrowLeft size={16} /> Back to Commercial Listings
            </button>
            <div style={{ height: '24px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#00d68f' }}>Land Lots</span>
              <span style={{ fontSize: '0.75rem', background: 'rgba(0,176,116,0.15)', color: '#00d68f', padding: '2px 8px', borderRadius: '9999px', fontWeight: 800 }}>
                INVESTOR PORTAL
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'white' }}>{currentUser?.name || 'Verified Investor'}</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{currentUser?.email}</div>
            </div>
            <button 
              onClick={logout}
              className="btn btn-outline"
              style={{ padding: '8px 12px', borderColor: 'rgba(239,68,68,0.3)', color: '#f87171', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Sign Out"
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Investor Workspace */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '36px 24px' }}>
        
        {/* Investor Profile Hero Card */}
        <div style={{
          background: 'linear-gradient(135deg, #0e2238 0%, #081626 100%)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          marginBottom: '32px',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          gap: '28px',
          alignItems: 'center'
        }}>
          {/* Avatar / Monogram */}
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00b074 0%, #0A8DDD 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 800,
            color: 'white',
            boxShadow: '0 8px 24px rgba(0,176,116,0.35)',
            border: '3px solid rgba(255,255,255,0.2)'
          }}>
            {(currentUser?.name || 'U')[0].toUpperCase()}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', margin: 0 }}>
                {currentUser?.name || 'Verified Buyer'}
              </h1>
              <span style={{
                background: 'rgba(0,214,143,0.15)',
                color: '#00d68f',
                border: '1px solid rgba(0,214,143,0.3)',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <ShieldCheck size={14} /> RERA VERIFIED INVESTOR
              </span>
              <span style={{
                background: 'rgba(56,189,248,0.15)',
                color: '#38bdf8',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                Priority Concierge Tier
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', margin: 0, maxWidth: '640px' }}>
              Manage your saved certified land layouts, track complimentary chauffeur site visits, review token reservation receipts, and access legal clearance documents.
            </p>
          </div>

          {/* Quick Contact Advisor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a 
              href="https://wa.me/919849012345?text=Hello%20LandLots%20Advisory,%20I%20am%20a%20verified%20investor%20requesting%20assistance."
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
              style={{ padding: '10px 18px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}
            >
              <PhoneCall size={16} /> Contact Priority Advisor
            </a>
          </div>
        </div>

        {/* Investor Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '12px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          marginBottom: '28px',
          overflowX: 'auto',
          paddingBottom: '2px'
        }}>
          {[
            { id: 'saved', label: 'Saved Plots & Shortlist', count: savedProperties.length, icon: <Heart size={16} /> },
            { id: 'visits', label: 'Site Visits & AC Cab Status', count: visits.length, icon: <Car size={16} /> },
            { id: 'receipts', label: 'Token Advance Receipts', count: receipts.length, icon: <CreditCard size={16} /> },
            { id: 'documents', label: 'Legal Deeds & EC Vault', count: documents.length, icon: <FileText size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '12px 12px 0 0',
                background: activeTab === tab.id ? '#0e2238' : 'transparent',
                color: activeTab === tab.id ? '#00d68f' : '#94a3b8',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #00d68f' : '2px solid transparent',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span style={{
                background: activeTab === tab.id ? 'rgba(0,214,143,0.2)' : 'rgba(255,255,255,0.06)',
                color: activeTab === tab.id ? '#00d68f' : '#64748b',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: 800
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* TAB 1: SAVED PLOTS & SHORTLIST */}
        {activeTab === 'saved' && (
          <div>
            {savedProperties.length === 0 ? (
              <div style={{
                background: '#091524',
                border: '1px dashed rgba(255,255,255,0.15)',
                borderRadius: '16px',
                padding: '56px 24px',
                textAlign: 'center'
              }}>
                <Heart size={44} color="#64748b" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '8px' }}>Your Saved Plots List is Empty</h3>
                <p style={{ color: '#94a3b8', maxWidth: '480px', margin: '0 auto 20px', fontSize: '0.9rem' }}>
                  Explore verified DTCP, HMDA, and CRDA approved layouts on our commercial portal and tap the heart icon to shortlist plots for comparison.
                </p>
                <button onClick={onBackToHome} className="btn btn-primary">
                  Explore Certified Plots
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {savedProperties.map(prop => (
                  <div key={prop.id} style={{
                    background: '#0b192c',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <div style={{ position: 'relative', height: '180px' }}>
                      <img src={prop.image} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#00b074', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '4px 8px', borderRadius: '6px' }}>
                        {prop.typeTag || 'VERIFIED PLOT'}
                      </div>
                      <button 
                        onClick={() => onRemoveSavedProperty && onRemoveSavedProperty(prop.id)}
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: 'rgba(0,0,0,0.6)',
                          color: '#f87171',
                          border: 'none',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        title="Remove from Saved"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>{prop.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.82rem', marginBottom: '14px' }}>
                        <MapPin size={14} color="#0A8DDD" /> {prop.location}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                        <div>
                          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#00d68f' }}>{prop.price}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{prop.rate} • {prop.area}</div>
                        </div>
                      </div>

                      <button 
                        onClick={() => onOpenBooking && onOpenBooking(prop)}
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center', gap: '8px', fontSize: '0.88rem' }}
                      >
                        <CreditCard size={16} /> Reserve Token Advance (Hold Plot)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SCHEDULED SITE VISITS & AC CAB TRACKER */}
        {activeTab === 'visits' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {visits.map(v => (
              <div key={v.id} style={{
                background: '#0a1a2e',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '28px',
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '24px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ background: '#065f46', color: '#34d399', fontSize: '0.75rem', fontWeight: 800, padding: '3px 8px', borderRadius: '9999px' }}>
                      COMPLIMENTARY AC CAB CONFIRMED
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Ref: {v.id}</span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
                    {v.plotTitle}
                  </h3>
                  <div style={{ color: '#94a3b8', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                    <MapPin size={15} color="#0A8DDD" /> {v.location}
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Inspection Date</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={14} color="#00d68f" /> {v.date}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Time Slot</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={14} color="#00d68f" /> {v.timeSlot}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chauffeur & Advisor Details */}
                <div style={{ background: '#0e243d', borderRadius: '14px', padding: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Car size={16} /> Chauffeur &amp; Advisory Assignment
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Pickup Location:</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>{v.pickupAddress}</div>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Assigned Vehicle &amp; Driver:</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#00d68f' }}>{v.driverName}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Driver Phone: {v.driverPhone}</div>
                  </div>

                  <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>On-Site Legal &amp; Plot Advisor:</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>{v.advisorName}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: TOKEN ADVANCE RECEIPTS */}
        {activeTab === 'receipts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {receipts.map(r => (
              <div key={r.bookingId} style={{
                background: '#091829',
                borderRadius: '16px',
                border: '1px solid rgba(0,214,143,0.3)',
                padding: '28px',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ background: '#065f46', color: '#34d399', fontSize: '0.75rem', fontWeight: 800, padding: '3px 8px', borderRadius: '9999px' }}>
                        OFFICIAL TOKEN ADVANCE RECEIPT
                      </span>
                      <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Receipt No: {r.bookingId}</span>
                    </div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'white', margin: 0 }}>
                      {r.plotTitle}
                    </h3>
                    <div style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '4px' }}>
                      {r.plotNumber} • {r.location}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Token Advance Paid</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#00d68f' }}>{r.tokenPaid}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Deal: {r.totalDealValue}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Payment Method</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>{r.paymentMode}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Bank Reference (UTR)</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>{r.utrNumber}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Payment Date</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>{r.date}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontSize: '0.82rem', fontWeight: 600 }}>
                    <CheckCircle2 size={16} /> {r.refundGuarantee}
                  </div>
                  <button 
                    onClick={() => window.print()}
                    className="btn btn-outline"
                    style={{ fontSize: '0.82rem', padding: '6px 14px', borderColor: 'rgba(255,255,255,0.2)', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Download size={14} /> Download PDF Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: LEGAL & DOCUMENT VAULT */}
        {activeTab === 'documents' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(10,141,221,0.1)', border: '1px solid rgba(10,141,221,0.25)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <ShieldCheck size={24} color="#0A8DDD" />
              <div style={{ fontSize: '0.88rem', color: '#bae6fd' }}>
                All title records are certified by our senior legal conveyancing team following statutory AP Registration Department &amp; MeeSeva Encumbrance protocols.
              </div>
            </div>

            {documents.map(doc => (
              <div key={doc.id} style={{
                background: '#0a1a2e',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(0,176,116,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={22} color="#00d68f" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', margin: 0 }}>{doc.title}</h4>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                      {doc.property} • <span style={{ color: '#38bdf8' }}>{doc.status}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{doc.date}</span>
                  <button 
                    onClick={() => alert(`Opening secure certified copy of ${doc.title}`)}
                    className="btn btn-outline"
                    style={{ fontSize: '0.82rem', padding: '6px 12px', borderColor: 'rgba(255,255,255,0.15)', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Download size={14} /> View Certificate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
