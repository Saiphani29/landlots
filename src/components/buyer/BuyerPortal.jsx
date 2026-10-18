import React, { useState } from 'react';
import { 
  Building, ShieldCheck, MapPin, Calendar, Clock, Car, PhoneCall, 
  Download, FileText, CheckCircle2, Heart, ArrowLeft, ExternalLink, 
  Sparkles, Award, CreditCard, ChevronRight, AlertCircle, LogOut, Trash2,
  PlusCircle, Image, Upload, Check, Compass, Ruler
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';

export default function BuyerPortal({ 
  onBackToHome, 
  onOpenBooking,
  savedProperties = [], 
  onRemoveSavedProperty,
  userSubmissions = [],
  onSubmitProperty
}) {
  const { currentUser, logout } = useAuth();
  const { t } = useTranslation();

  // Active Tab: 'saved' | 'post_property' | 'my_listings' | 'visits' | 'receipts' | 'documents'
  const [activeTab, setActiveTab] = useState(userSubmissions.length > 0 ? 'my_listings' : 'saved');

  // Property Post Form State
  const [propTitle, setPropTitle] = useState('');
  const [propCategory, setPropCategory] = useState('plots');
  const [propCity, setPropCity] = useState('Vijayawada');
  const [propLocation, setPropLocation] = useState('');
  const [propPrice, setPropPrice] = useState('');
  const [propArea, setPropArea] = useState('200 Sq.Yds');
  const [propFacing, setPropFacing] = useState('East Facing');
  const [propRoad, setPropRoad] = useState('40 Ft Road');
  const [propApprovals, setPropApprovals] = useState('DTCP Approved, 100% Clear Title');
  const [propImageUrl, setPropImageUrl] = useState('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop');
  const [propDescription, setPropDescription] = useState('');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '+91 98480 11223');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Sample photo presets for fast testing
  const PHOTO_PRESETS = [
    { label: '🌾 Green Agro Farmland', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop' },
    { label: '📐 Surveyed Gated Layout', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop' },
    { label: '🏡 Luxury Villa Plot', url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop' },
    { label: '🛣️ Highway Frontage Plot', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop' }
  ];

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!propTitle || !propLocation || !propPrice) return;

    const newSubmission = {
      id: `USR-PROP-${Math.floor(100 + Math.random() * 900)}`,
      title: propTitle,
      category: propCategory,
      typeTag: propCategory === 'plots' ? 'RESIDENTIAL PLOT' : propCategory.toUpperCase(),
      listingType: 'sale',
      city: propCity,
      location: propLocation,
      price: propPrice.startsWith('₹') ? propPrice : `₹${propPrice}`,
      priceNum: parseInt(propPrice.replace(/\D/g, '')) * 100000 || 3000000,
      area: propArea,
      facing: propFacing,
      roadWidth: propRoad,
      approvals: propApprovals.split(',').map(s => s.trim()),
      image: propImageUrl,
      description: propDescription || 'Prime verified plot with clear legal title, immediate registration, and complete municipal clearances.',
      sellerName: currentUser?.name || 'Verified Land Owner',
      sellerPhone: contactPhone,
      sellerEmail: currentUser?.email || 'owner@landlots.co',
      status: 'pending_verification',
      submittedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    if (onSubmitProperty) {
      onSubmitProperty(newSubmission);
    }

    setFormSubmitted(true);
    setActiveTab('my_listings');

    // Reset fields
    setPropTitle('');
    setPropLocation('');
    setPropPrice('');
    setPropDescription('');
  };

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
      {/* Top Header */}
      <header style={{
        background: '#091524',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '14px 20px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button 
              onClick={onBackToHome}
              className="btn btn-outline"
              style={{
                padding: '7px 12px',
                fontSize: '0.82rem',
                borderColor: 'rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.08)',
                color: '#cbd5e1',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ArrowLeft size={16} /> Commercial Listings
            </button>
            <div style={{ height: '22px', width: '1px', background: 'rgba(255,255,255,0.12)' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#00d68f' }}>Land Lots</span>
              <span style={{ fontSize: '0.72rem', background: 'rgba(0,176,116,0.18)', color: '#00d68f', padding: '2px 8px', borderRadius: '9999px', fontWeight: 800 }}>
                USER SPACE
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'white' }}>{currentUser?.name || 'Verified User'}</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{currentUser?.email}</div>
            </div>
            <button 
              onClick={logout}
              className="btn btn-outline"
              style={{ padding: '7px 10px', borderColor: 'rgba(239,68,68,0.3)', color: '#f87171', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Sign Out"
            >
              <LogOut size={14} /> Exit
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px' }}>
        
        {/* User Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0e2238 0%, #081626 100%)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 16px 36px rgba(0,0,0,0.35)',
          marginBottom: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00b074 0%, #0A8DDD 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              fontWeight: 800,
              color: 'white',
              boxShadow: '0 8px 20px rgba(0,176,116,0.3)',
              flexShrink: 0
            }}>
              {(currentUser?.name || 'U')[0].toUpperCase()}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'white', margin: 0 }}>
                  {currentUser?.name || 'Verified Member'}
                </h1>
                <span style={{
                  background: 'rgba(0,214,143,0.15)',
                  color: '#00d68f',
                  border: '1px solid rgba(0,214,143,0.3)',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <ShieldCheck size={12} /> VERIFIED ACCOUNT
                </span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                Post your land/plots with photo attachments for legal admin clearance, track saved listings, and access your site visit schedule.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-start', md: 'flex-end' }}>
            <button
              onClick={() => setActiveTab('post_property')}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.85rem', background: '#00b074' }}
            >
              <PlusCircle size={15} /> Post Land for Sale
            </button>
            <a 
              href="https://wa.me/919849012345?text=Hello%20LandLots%20Legal%20Advisory,%20I%20am%20a%20registered%20user%20requesting%20assistance."
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
              style={{ padding: '8px 14px', fontSize: '0.85rem', borderColor: 'rgba(255,255,255,0.2)', color: '#38bdf8' }}
            >
              <PhoneCall size={14} /> Legal Support
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '2px',
          whiteSpace: 'nowrap'
        }}>
          {[
            { id: 'post_property', label: '📤 Post Land / Plot for Sale', icon: <PlusCircle size={15} /> },
            { id: 'my_listings', label: '📋 My Submitted Plots', count: userSubmissions.length, icon: <Building size={15} /> },
            { id: 'saved', label: '❤️ Saved Shortlist', count: savedProperties.length, icon: <Heart size={15} /> },
            { id: 'visits', label: '🚗 Site Visits & Cab', count: visits.length, icon: <Car size={15} /> },
            { id: 'receipts', label: '💳 Advance Token Receipts', count: receipts.length, icon: <CreditCard size={15} /> },
            { id: 'documents', label: '📜 Legal Vault', count: documents.length, icon: <FileText size={15} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '10px 10px 0 0',
                background: activeTab === tab.id ? '#0e2238' : 'transparent',
                color: activeTab === tab.id ? '#00d68f' : '#94a3b8',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #00d68f' : '2px solid transparent',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span style={{
                  background: activeTab === tab.id ? 'rgba(0,214,143,0.2)' : 'rgba(255,255,255,0.1)',
                  color: activeTab === tab.id ? '#00d68f' : '#94a3b8',
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  fontSize: '0.7rem',
                  fontWeight: 800
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: POST PROPERTY WITH PHOTO (User Space Seller Functionality) */}
        {activeTab === 'post_property' && (
          <div style={{
            background: '#091524',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '24px',
            maxWidth: '850px',
            margin: '0 auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{
                background: 'rgba(0,176,116,0.15)',
                color: '#00d68f',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <PlusCircle size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'white' }}>
                  List Your Land / Plot (Free Seller Submission)
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                  Upload land photos and specifications. Your submission goes to our Admin Legal Team for verification before going live.
                </p>
              </div>
            </div>

            <form onSubmit={handlePostSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Title */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  Property / Plot Title *
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Royal Meadows DTCP Approved East Facing Plot #14"
                  value={propTitle}
                  onChange={(e) => setPropTitle(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              {/* Category, City, Location */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={propCategory}
                    onChange={(e) => setPropCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      background: '#0e2238',
                      color: 'white',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="plots">Residential Plot (DTCP/CRDA)</option>
                    <option value="villas">Independent Villa / House</option>
                    <option value="commercial">Commercial Land / Highway</option>
                    <option value="farms">Agricultural Farm Land (Guntas/Acres)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    City / District
                  </label>
                  <select
                    value={propCity}
                    onChange={(e) => setPropCity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      background: '#0e2238',
                      color: 'white',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="Vijayawada">Vijayawada</option>
                    <option value="Guntur">Guntur</option>
                    <option value="Amaravati">Amaravati Capital</option>
                    <option value="Visakhapatnam">Visakhapatnam</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Rajahmundry">Rajahmundry</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Specific Location / Highway *
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Kankipadu Highway, Near NH-16"
                    value={propLocation}
                    onChange={(e) => setPropLocation(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'white',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              {/* Price, Area, Facing */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Expected Asking Price *
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. ₹35.0 Lakhs or ₹18,000/Sq.Yd"
                    value={propPrice}
                    onChange={(e) => setPropPrice(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'white',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Plot Area / Measurement
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. 200 Sq.Yds or 1.5 Cents"
                    value={propArea}
                    onChange={(e) => setPropArea(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'white',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Facing Direction
                  </label>
                  <select
                    value={propFacing}
                    onChange={(e) => setPropFacing(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      background: '#0e2238',
                      color: 'white',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="East Facing">East Facing</option>
                    <option value="North Facing">North Facing</option>
                    <option value="West Facing">West Facing</option>
                    <option value="South Facing">South Facing</option>
                    <option value="North-East Corner">North-East Corner</option>
                  </select>
                </div>
              </div>

              {/* Photo Attachment & Real-time Preview */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px dashed rgba(255,255,255,0.2)',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Image size={16} /> Land Picture / Photo Attachment *
                </label>
                
                <input 
                  type="text"
                  placeholder="Paste direct Image URL or choose a preset below..."
                  value={propImageUrl}
                  onChange={(e) => setPropImageUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'rgba(0,0,0,0.3)',
                    color: 'white',
                    fontSize: '0.82rem',
                    marginBottom: '10px'
                  }}
                />

                {/* Instant Sample Presets */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', alignSelf: 'center' }}>Presets:</span>
                  {PHOTO_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPropImageUrl(p.url)}
                      style={{
                        padding: '4px 10px',
                        background: propImageUrl === p.url ? 'rgba(0,214,143,0.2)' : 'rgba(255,255,255,0.05)',
                        border: propImageUrl === p.url ? '1px solid #00d68f' : '1px solid rgba(255,255,255,0.1)',
                        color: propImageUrl === p.url ? '#00d68f' : '#cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Live Photo Preview */}
                {propImageUrl && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '130px',
                      height: '80px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '2px solid #00d68f',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      flexShrink: 0
                    }}>
                      <img 
                        src={propImageUrl} 
                        alt="Property Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop';
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      <span style={{ color: '#00d68f', fontWeight: 700 }}>✓ Photo Preview Active:</span> This picture will be verified by the admin legal team and displayed on the public catalog upon approval.
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  Property Highlights &amp; Legal Approval Claims
                </label>
                <textarea 
                  rows="3"
                  placeholder="e.g. DTCP LP No. 42/2024, 100% Clear Title, 40 Ft CC Roads, Electricity &amp; Water Lines Ready. Contact for immediate sale."
                  value={propDescription}
                  onChange={(e) => setPropDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    fontSize: '0.85rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  padding: '12px 24px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #0A8DDD 0%, #00b074 100%)',
                  gap: '8px',
                  marginTop: '6px'
                }}
              >
                <Upload size={16} /> Submit Property for Admin Legal Verification
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: MY SUBMITTED LISTINGS (User Property Status) */}
        {activeTab === 'my_listings' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'white' }}>
                  My Submitted Land Listings ({userSubmissions.length})
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
                  Live tracking of user submissions and Admin Legal approvals.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('post_property')}
                className="btn btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.82rem', background: '#00b074' }}
              >
                <PlusCircle size={15} /> Add Another Plot
              </button>
            </div>

            {userSubmissions.length === 0 ? (
              <div style={{
                background: '#091524',
                borderRadius: '16px',
                border: '1px dashed rgba(255,255,255,0.15)',
                padding: '48px 24px',
                textAlign: 'center'
              }}>
                <Building size={40} color="#64748b" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '6px' }}>
                  No Land Listings Submitted Yet
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', maxWidth: '420px', margin: '0 auto 20px' }}>
                  Have land, a residential plot, or farmland to sell? Post it with photos for free legal title verification and access thousands of qualified buyers.
                </p>
                <button
                  onClick={() => setActiveTab('post_property')}
                  className="btn btn-primary"
                  style={{ padding: '10px 20px', fontSize: '0.88rem' }}
                >
                  <PlusCircle size={16} /> Post Your First Plot Now
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {userSubmissions.map((prop) => {
                  const isPending = prop.status === 'pending_verification';
                  return (
                    <div 
                      key={prop.id}
                      style={{
                        background: '#091524',
                        border: isPending ? '1.5px solid rgba(245, 158, 11, 0.4)' : '1.5px solid rgba(0, 214, 143, 0.4)',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      {/* Photo Thumbnail */}
                      <div style={{ position: 'relative', height: '170px', background: '#040b14' }}>
                        <img 
                          src={prop.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop'} 
                          alt={prop.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          background: isPending ? 'rgba(245, 158, 11, 0.95)' : 'rgba(0, 176, 116, 0.95)',
                          color: '#ffffff',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                        }}>
                          {isPending ? '⏳ PENDING ADMIN VERIFICATION' : '✅ LIVE & APPROVED'}
                        </div>

                        <div style={{
                          position: 'absolute',
                          bottom: '10px',
                          right: '10px',
                          background: 'rgba(0,0,0,0.75)',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem'
                        }}>
                          ID: {prop.id}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>
                          {prop.title}
                        </h3>

                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                          <MapPin size={13} color="#0A8DDD" />
                          <span>{prop.location}, {prop.city}</span>
                        </div>

                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '8px',
                          background: 'rgba(255,255,255,0.03)',
                          padding: '10px',
                          borderRadius: '8px',
                          marginBottom: '12px',
                          fontSize: '0.78rem'
                        }}>
                          <div>
                            <span style={{ color: '#64748b', display: 'block' }}>Asking Price:</span>
                            <strong style={{ color: '#00d68f', fontSize: '0.95rem' }}>{prop.price}</strong>
                          </div>
                          <div>
                            <span style={{ color: '#64748b', display: 'block' }}>Area / Facing:</span>
                            <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{prop.area} • {prop.facing}</span>
                          </div>
                        </div>

                        <div style={{
                          background: isPending ? 'rgba(245, 158, 11, 0.1)' : 'rgba(0, 214, 143, 0.1)',
                          border: isPending ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid rgba(0, 214, 143, 0.25)',
                          borderRadius: '8px',
                          padding: '10px',
                          fontSize: '0.76rem',
                          color: isPending ? '#fbbf24' : '#34d399',
                          marginTop: 'auto'
                        }}>
                          {isPending ? (
                            <div>
                              <strong>⏳ Under Title Survey:</strong> Our legal verification officer is checking the DTCP/LP records and local survey map. Expected approval: within 24 hours.
                            </div>
                          ) : (
                            <div>
                              <strong>✅ Published Live:</strong> Verified with DTCP and clear title. Active on public commercial catalogue!
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SAVED PROPERTIES SHORTLIST */}
        {activeTab === 'saved' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'white' }}>
                  Your Saved Properties ({savedProperties.length})
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
                  Curated certified plots ready for site visits or token reservation.
                </p>
              </div>
            </div>

            {savedProperties.length === 0 ? (
              <div style={{
                background: '#091524',
                borderRadius: '16px',
                border: '1px dashed rgba(255,255,255,0.15)',
                padding: '48px 24px',
                textAlign: 'center'
              }}>
                <Heart size={40} color="#64748b" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '6px' }}>
                  No Saved Properties Yet
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', maxWidth: '380px', margin: '0 auto 18px' }}>
                  Browse our certified commercial catalog and tap the heart icon on any plot to add it here.
                </p>
                <button onClick={onBackToHome} className="btn btn-primary" style={{ padding: '8px 18px' }}>
                  Browse Certified Catalog
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {savedProperties.map(prop => (
                  <div 
                    key={prop.id}
                    style={{
                      background: '#091524',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div style={{ position: 'relative', height: '170px' }}>
                      <img 
                        src={prop.image} 
                        alt={prop.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: '#00b074',
                        color: 'white',
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        fontSize: '0.7rem',
                        fontWeight: 800
                      }}>
                        {prop.typeTag}
                      </div>
                      <button
                        onClick={() => onRemoveSavedProperty(prop.id)}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: 'rgba(0,0,0,0.65)',
                          border: 'none',
                          color: '#f87171',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        title="Remove from Saved"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>
                        {prop.title}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
                        <MapPin size={13} color="#0A8DDD" />
                        <span>{prop.location}, {prop.city}</span>
                      </div>

                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#00d68f', marginBottom: '14px' }}>
                        {prop.price} <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>({prop.rate})</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: 'auto' }}>
                        <button
                          onClick={() => onOpenBooking(prop)}
                          className="btn btn-secondary"
                          style={{ padding: '8px', fontSize: '0.82rem', justifyContent: 'center' }}
                        >
                          <CreditCard size={14} /> Hold Token
                        </button>
                        <a
                          href={`https://wa.me/919849012345?text=Hello,%20I%20am%20interested%20in%20${encodeURIComponent(prop.title)}%20(${prop.id})`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline"
                          style={{ padding: '8px', fontSize: '0.82rem', justifyContent: 'center', color: '#38bdf8' }}
                        >
                          <PhoneCall size={14} /> Call Advisor
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SITE VISITS */}
        {activeTab === 'visits' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {visits.map(v => (
              <div 
                key={v.id}
                style={{
                  background: '#091524',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '24px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '20px',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ background: 'rgba(0,176,116,0.15)', color: '#00d68f', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '9999px', fontWeight: 800 }}>
                      ● {v.status}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {v.id}</span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', margin: '0 0 6px 0' }}>
                    {v.plotTitle}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} color="#0A8DDD" /> {v.location}
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', fontSize: '0.82rem' }}>
                  <div style={{ color: '#cbd5e1', marginBottom: '4px' }}>📅 <strong>{v.date}</strong></div>
                  <div style={{ color: '#cbd5e1', marginBottom: '4px' }}>⏰ <strong>{v.timeSlot}</strong></div>
                  <div style={{ color: '#38bdf8' }}>🚖 Driver: {v.driverName} ({v.driverPhone})</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a 
                    href={`tel:${v.advisorPhone}`}
                    className="btn btn-outline"
                    style={{ padding: '8px 12px', fontSize: '0.82rem', justifyContent: 'center', color: '#38bdf8' }}
                  >
                    <PhoneCall size={14} /> Call Specialist ({v.advisorName.split(' ')[0]})
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: TOKEN RECEIPTS */}
        {activeTab === 'receipts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {receipts.map(r => (
              <div 
                key={r.bookingId}
                style={{
                  background: '#091524',
                  borderRadius: '16px',
                  border: '1px solid rgba(0, 214, 143, 0.3)',
                  padding: '24px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '20px',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#00d68f', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                    ● {r.status}
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', margin: '0 0 4px 0' }}>
                    {r.plotTitle}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    {r.plotNumber} • {r.location}
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#94a3b8' }}>Token Advance:</span>
                    <strong style={{ color: '#00d68f', fontSize: '1rem' }}>{r.tokenPaid}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#94a3b8' }}>Total Value:</span>
                    <strong style={{ color: 'white' }}>{r.totalDealValue}</strong>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>UTR: {r.utrNumber}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '8px' }}>
                    🛡️ {r.refundGuarantee}
                  </div>
                  <button 
                    onClick={() => alert(`Downloading Certified GST Booking Receipt for Booking ID: ${r.bookingId}...`)}
                    className="btn btn-outline"
                    style={{ width: '100%', padding: '8px', fontSize: '0.82rem', justifyContent: 'center', color: '#00d68f' }}
                  >
                    <Download size={14} /> Download Stamp Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: LEGAL DOCUMENTS */}
        {activeTab === 'documents' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {documents.map(doc => (
              <div 
                key={doc.id}
                style={{
                  background: '#091524',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <FileText size={20} color="#00d68f" />
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>{doc.category}</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'white' }}>{doc.title}</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#00d68f', background: 'rgba(0,176,116,0.1)', padding: '6px 10px', borderRadius: '6px', marginBottom: '14px' }}>
                  ✓ {doc.status}
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{doc.date}</span>
                  <button 
                    onClick={() => alert(`Accessing certified digital deed for ${doc.title}...`)}
                    className="btn btn-outline"
                    style={{ padding: '6px 10px', fontSize: '0.75rem', color: '#38bdf8' }}
                  >
                    <Download size={12} /> View Deed
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
