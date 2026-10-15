import React from 'react';
import { Search, MapPin, IndianRupee, ShieldCheck, Compass, ArrowRight, Layers, PhoneCall } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function HeroSearch({ 
  searchTab, 
  setSearchTab, 
  searchQuery, 
  setSearchQuery, 
  selectedBudget, 
  setSelectedBudget, 
  selectedFacing, 
  setSelectedFacing, 
  onPerformSearch, 
  onOpenLeadModal 
}) {
  const { t } = useTranslation();

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-grid">
          {/* Left Column: Clean Editorial Headline & Simplified Search Bar */}
          <div>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: '#F0EDE6', 
              border: '1px solid #E8E5DF', 
              padding: '6px 14px', 
              borderRadius: '9999px', 
              marginBottom: '20px' 
            }}>
              <ShieldCheck size={15} color="#15803d" />
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#3A4843', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
                {t('hero_badge')}
              </span>
            </div>

            <h1 className="hero-title" style={{ fontFamily: "var(--font-serif)", fontSize: '3.3rem', letterSpacing: '-0.5px', lineHeight: 1.15 }}>
              {t('hero_title_prefix')} <span className="highlight" style={{ fontStyle: 'italic' }}>{t('hero_title_highlight')}</span>
            </h1>
            <p className="hero-subtext" style={{ fontSize: '1.05rem', color: '#52605B', lineHeight: 1.65, maxWidth: '520px', marginBottom: '28px' }}>
              {t('hero_subtitle')}
            </p>

            {/* Simplified, Clean Light Search Bar */}
            <div className="search-card-wrapper">
              <div className="search-filters-grid">
                {/* 1. Location / Locality Search */}
                <div className="filter-field">
                  <label><MapPin size={12} color="#0A8DDD" /> Location / City</label>
                  <input 
                    type="text" 
                    placeholder={t('search_placeholder')} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* 2. Simplified Property Type Dropdown */}
                <div className="filter-field">
                  <label><Layers size={12} color="#1CD359" /> Property Type</label>
                  <select 
                    value={searchTab}
                    onChange={(e) => setSearchTab(e.target.value)}
                  >
                    <option value="all">{t('cat_all')}</option>
                    <option value="plots">{t('search_tab_plots')}</option>
                    <option value="agricultural">{t('search_tab_agro')}</option>
                    <option value="commercial">{t('search_tab_commercial')}</option>
                  </select>
                </div>

                {/* 3. Budget Range */}
                <div className="filter-field">
                  <label><IndianRupee size={12} color="#0A8DDD" /> Budget Range</label>
                  <select 
                    value={selectedBudget}
                    onChange={(e) => setSelectedBudget(e.target.value)}
                  >
                    <option value="all">{t('budget_all')}</option>
                    <option value="under30L">{t('budget_under30')}</option>
                    <option value="30L-50L">{t('budget_30_50')}</option>
                    <option value="50L-1Cr">{t('budget_50_1cr')}</option>
                    <option value="above1Cr">{t('budget_above1cr')}</option>
                  </select>
                </div>

                {/* 4. Search Submit CTA */}
                <button 
                  onClick={onPerformSearch}
                  className="btn btn-primary"
                  style={{ 
                    height: '52px', 
                    padding: '0 24px', 
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    borderRadius: '12px'
                  }}
                >
                  <Search size={18} />
                  <span>{t('btn_search')}</span>
                </button>
              </div>

              {/* Minimal Clean Tag Hints */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', fontSize: '0.8rem', color: '#64748b', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 600 }}>Quick:</span>
                <button 
                  onClick={() => setSearchQuery('Vijayawada')} 
                  style={{ background: '#f1f5f9', color: '#0A8DDD', padding: '3px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}
                >
                  Vijayawada Plots
                </button>
                <button 
                  onClick={() => setSearchQuery('DTCP')} 
                  style={{ background: '#eafaf0', color: '#15ab47', padding: '3px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}
                >
                  DTCP Approved
                </button>
                <button 
                  onClick={() => setSearchQuery('Amaravati')} 
                  style={{ background: '#f1f5f9', color: '#0A8DDD', padding: '3px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}
                >
                  Amaravati Agro
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Spotlight Card (Light Aesthetics) */}
          <div>
            <div style={{ 
              background: 'white', 
              borderRadius: '24px', 
              padding: '28px', 
              border: '1px solid rgba(0, 0, 0, 0.06)', 
              boxShadow: '0 8px 30px rgba(20, 30, 26, 0.04)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ 
                  background: '#F0EDE6', 
                  color: '#15803d', 
                  fontSize: '0.72rem', 
                  fontWeight: 800, 
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  padding: '4px 10px', 
                  borderRadius: '6px' 
                }}>
                  ★ SPOTLIGHT LAYOUT
                </span>
                <span style={{ fontSize: '0.78rem', color: '#7A8983', fontWeight: 700, letterSpacing: '0.5px' }}>
                  RERA: P03290120932
                </span>
              </div>

              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: '#141E1A', marginBottom: '8px' }}>
                Krishna Valley Eco Layout
              </h3>
              <p style={{ color: '#52605B', fontSize: '0.9rem', marginBottom: '18px', lineHeight: 1.6 }}>
                Premium DTCP layout on Bandar Highway, Vijayawada with 40ft CC roads, avenue plantation &amp; immediate spot registration.
              </p>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <span style={{ background: '#F9F8F5', border: '1px solid #E8E5DF', padding: '5px 12px', borderRadius: '8px', fontSize: '0.78rem', color: '#141E1A', fontWeight: 600 }}>
                  📍 Kankipadu, Vijayawada
                </span>
                <span style={{ background: '#F9F8F5', border: '1px solid #E8E5DF', padding: '5px 12px', borderRadius: '8px', fontSize: '0.78rem', color: '#141E1A', fontWeight: 600 }}>
                  📏 180 - 450 Sq.Yds
                </span>
                <span style={{ background: '#eef7fd', border: '1px solid #bae2fa', padding: '5px 12px', borderRadius: '8px', fontSize: '0.78rem', color: '#0A8DDD', fontWeight: 700 }}>
                  🏷️ ₹17,250 / Sq.Yd
                </span>
              </div>

              <div style={{ borderTop: '1px solid #F0EDE6', paddingTop: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#7A8983', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Starting from</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0A8DDD', lineHeight: 1.1 }}>₹31.0 Lakhs</div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => onOpenLeadModal({ 
                      title: "Schedule Site Visit - Krishna Valley",
                      propertyName: "Krishna Valley Eco Layout (Vijayawada)" 
                    })}
                    className="btn btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                  >
                    {t('btn_site_visit')}
                  </button>
                  <a 
                    href="https://wa.me/919849012345?text=Hi%20LandLots%2C%20please%20share%20the%20brochure%20for%20Krishna%20Valley%20Eco%20Layout" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                    style={{ padding: '8px 12px' }}
                    title="WhatsApp Sales"
                  >
                    <PhoneCall size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
