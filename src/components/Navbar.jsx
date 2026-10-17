import React, { useState } from 'react';
import { 
  Building, MapPin, PlusCircle, Search, PhoneCall, ChevronDown, 
  ShieldCheck, UserCheck, LogOut, KeyRound, Menu, X, Globe, CreditCard
} from 'lucide-react';
import { CITIES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';

export default function Navbar({ 
  selectedCity, 
  onSelectCity, 
  onOpenLeadModal, 
  onOpenAdminLogin, 
  onOpenAdminDashboard,
  onOpenBuyerPortal,
  onOpenPaymentPage
}) {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { language, changeLanguage, t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const languageLabels = {
    en: 'English',
    te: 'తెలుగు (Telugu)',
    hi: 'हिन्दी (Hindi)'
  };

  const isBuyer = currentUser?.role === 'buyer';

  return (
    <header className="site-header">
      <div className="container">
        <div className="navbar-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            {/* Brand Logo with Official SVG */}
            <a href="#" className="brand-logo" onClick={handleNavClick}>
              <img 
                src="/logo.svg" 
                alt="Land Lots Official Logo" 
                className="brand-logo-img"
                style={{ height: '42px', width: 'auto', display: 'block' }}
              />
            </a>

            {/* Desktop Navigation Links (Fully Translated) */}
            <ul className="nav-links desktop-only">
              <li><a href="#" className="nav-link active">{t('nav_home')}</a></li>
              <li><a href="#properties" className="nav-link">{t('nav_plots')}</a></li>
              <li><a href="#properties" className="nav-link">{t('nav_agro')}</a></li>
              <li><a href="#calculators" className="nav-link">{t('nav_tools')}</a></li>
              <li><a href="#agents" className="nav-link">{t('nav_agents')}</a></li>
            </ul>
          </div>

          {/* Right Header Actions */}
          <div className="header-actions">
            
            {/* Multi-Language Selector (Desktop & Tablet) */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="btn btn-outline"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: '9999px',
                  borderColor: '#cbd5e1',
                  background: '#FFFFFF',
                  color: '#141E1A',
                  cursor: 'pointer'
                }}
                title="Change Platform Language"
              >
                <Globe size={14} color="#0A8DDD" />
                <span style={{ fontWeight: 600 }}>
                  {language === 'te' ? 'తెలుగు' : language === 'hi' ? 'हिन्दी' : 'English'}
                </span>
                <ChevronDown size={12} color="#64748b" />
              </button>

              {langDropdownOpen && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '6px',
                    background: '#FFFFFF',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    zIndex: 100,
                    minWidth: '160px',
                    overflow: 'hidden'
                  }}
                >
                  {[
                    { code: 'en', label: 'English (EN)' },
                    { code: 'te', label: 'తెలుగు (Telugu)' },
                    { code: 'hi', label: 'हिन्दी (Hindi)' }
                  ].map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        changeLanguage(item.code);
                        setLangDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 14px',
                        fontSize: '0.85rem',
                        background: language === item.code ? '#e0f2fe' : 'transparent',
                        color: language === item.code ? '#0369a1' : '#334155',
                        fontWeight: language === item.code ? 700 : 500,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{item.label}</span>
                      {language === item.code && <span style={{ color: '#0A8DDD', fontWeight: 800 }}>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* City Selector (Desktop) */}
            <div className="desktop-only" style={{ position: 'relative' }}>
              <select 
                value={selectedCity} 
                onChange={(e) => onSelectCity(e.target.value)}
                className="city-select-btn"
                style={{ appearance: 'none', paddingRight: '28px', cursor: 'pointer' }}
              >
                {CITIES.map(c => (
                  <option key={c.name} value={c.name}>
                    📍 {c.name} {c.state !== "All" ? `(${c.state})` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '10px', pointerEvents: 'none', color: '#64748b' }} />
            </div>

            {/* Book Token Quick Trigger */}
            <button
              onClick={() => onOpenPaymentPage()}
              className="btn btn-outline desktop-only"
              style={{
                fontSize: '0.82rem',
                padding: '7px 12px',
                borderColor: '#b6edd1',
                background: '#eefbf4',
                color: '#0e7041',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600
              }}
              title="Reserve & Pay Plot Token"
            >
              <CreditCard size={14} color="#00b074" />
              <span>{t('nav_book_token')}</span>
            </button>

            {/* If Authenticated: Separate Public Buyer from Internal Staff */}
            {isAuthenticated ? (
              <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isBuyer ? (
                  /* PUBLIC BUYER PORTAL TRIGGER */
                  <button
                    onClick={onOpenBuyerPortal}
                    className="btn btn-secondary"
                    style={{
                      padding: '8px 14px',
                      fontSize: '0.85rem',
                      background: 'linear-gradient(135deg, #0e243d 0%, #081626 100%)',
                      border: '1px solid rgba(0, 214, 143, 0.4)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer'
                    }}
                    title="Open Investor & Buyer Portal"
                  >
                    <ShieldCheck size={16} color="#00d68f" />
                    <span style={{ fontWeight: 700 }}>{currentUser.name.split(' ')[0]}</span>
                    <span style={{
                      background: '#00b074',
                      color: 'white',
                      fontSize: '0.65rem',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontWeight: 800,
                      letterSpacing: '0.5px'
                    }}>
                      INVESTOR
                    </span>
                  </button>
                ) : (
                  /* INTERNAL STAFF / ADMIN CONSOLE TRIGGER */
                  <button
                    onClick={onOpenAdminDashboard}
                    className="btn btn-secondary"
                    style={{
                      padding: '8px 14px',
                      fontSize: '0.85rem',
                      background: '#0f2942',
                      border: '1px solid #1e4976',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    title="Open Office Staff Console"
                  >
                    <ShieldCheck size={16} color="#0A8DDD" />
                    <span>{currentUser.name.split(' ')[0]}</span>
                    <span style={{
                      background: '#0284c7',
                      color: 'white',
                      fontSize: '0.65rem',
                      padding: '1px 6px',
                      borderRadius: '9999px',
                      textTransform: 'uppercase',
                      fontWeight: 800
                    }}>
                      {currentUser.role?.replace('_', ' ')}
                    </span>
                  </button>
                )}

                <button
                  onClick={logout}
                  className="btn btn-outline"
                  style={{ padding: '8px 10px', color: '#ef4444' }}
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              /* Public: Admin & Office Portal Login Trigger (Desktop) */
              <button
                onClick={onOpenAdminLogin}
                className="btn btn-outline desktop-only"
                style={{
                  fontSize: '0.85rem',
                  padding: '8px 14px',
                  borderColor: '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <KeyRound size={15} color="#0A8DDD" />
                <span>{t('nav_office_login')}</span>
              </button>
            )}

            {/* Post Property High Conversion Button */}
            <button 
              onClick={() => onOpenLeadModal({ title: "List Your Property (Free Seller Consultation)" })}
              className="btn btn-primary nav-post-btn"
            >
              <PlusCircle size={16} />
              <span className="post-btn-text">{t('nav_post_free')}</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button 
              className="mobile-menu-toggle mobile-only"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} color="#0f172a" /> : <Menu size={22} color="#0f172a" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer mobile-only animate-fade-in">
            {/* Mobile Language Switcher */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                🌐 Select Language / భాష / भाषा:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {[
                  { code: 'en', label: 'English' },
                  { code: 'te', label: 'తెలుగు' },
                  { code: 'hi', label: 'हिन्दी' }
                ].map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      changeLanguage(item.code);
                    }}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: language === item.code ? '2px solid #0A8DDD' : '1px solid #cbd5e1',
                      background: language === item.code ? '#e0f2fe' : 'white',
                      color: language === item.code ? '#0369a1' : '#334155',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile City Selector */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                Select Active Market:
              </label>
              <div style={{ position: 'relative' }}>
                <select 
                  value={selectedCity} 
                  onChange={(e) => {
                    onSelectCity(e.target.value);
                    setMobileMenuOpen(false);
                  }}
                  className="city-select-btn"
                  style={{ width: '100%', appearance: 'none', padding: '10px 14px', cursor: 'pointer', background: '#f8fafc' }}
                >
                  {CITIES.map(c => (
                    <option key={c.name} value={c.name}>
                      📍 {c.name} {c.state !== "All" ? `(${c.state})` : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '14px', top: '14px', pointerEvents: 'none', color: '#64748b' }} />
              </div>
            </div>

            {/* Mobile Quick Book Token */}
            <button
              onClick={() => {
                onOpenPaymentPage();
                setMobileMenuOpen(false);
              }}
              className="btn btn-outline"
              style={{
                width: '100%',
                marginBottom: '14px',
                justifyContent: 'center',
                borderColor: '#b6edd1',
                background: '#eefbf4',
                color: '#0e7041',
                fontWeight: 700
              }}
            >
              <CreditCard size={16} color="#00b074" />
              <span>{t('nav_book_token')} (Advance Hold)</span>
            </button>

            {/* Mobile Links */}
            <ul className="mobile-nav-links">
              <li><a href="#" onClick={handleNavClick}>🏠 {t('nav_home')}</a></li>
              <li><a href="#properties" onClick={handleNavClick}>📐 {t('nav_plots')}</a></li>
              <li><a href="#properties" onClick={handleNavClick}>🌾 {t('nav_agro')}</a></li>
              <li><a href="#calculators" onClick={handleNavClick}>🧮 {t('nav_tools')}</a></li>
              <li><a href="#agents" onClick={handleNavClick}>🤝 {t('nav_agents')}</a></li>
            </ul>

            {/* Mobile Office Login / Console */}
            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
              {isAuthenticated ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {isBuyer ? (
                    <button
                      onClick={() => {
                        onOpenBuyerPortal();
                        setMobileMenuOpen(false);
                      }}
                      className="btn btn-secondary"
                      style={{ width: '100%', justifyContent: 'center', background: '#0e243d', borderColor: 'rgba(0, 214, 143, 0.4)' }}
                    >
                      <ShieldCheck size={16} color="#00d68f" /> Open Investor &amp; Buyer Portal
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onOpenAdminDashboard();
                        setMobileMenuOpen(false);
                      }}
                      className="btn btn-secondary"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <ShieldCheck size={16} /> Open {currentUser.role?.replace('_', ' ')} Console
                    </button>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="btn btn-outline"
                    style={{ width: '100%', justifyContent: 'center', color: '#ef4444' }}
                  >
                    <LogOut size={16} /> Sign Out ({currentUser.name})
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onOpenAdminLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="btn btn-outline"
                  style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
                >
                  <KeyRound size={16} color="#0A8DDD" /> {t('nav_office_login')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
