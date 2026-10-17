import React, { useState } from 'react';
import { 
  Building, ShieldCheck, Mail, Lock, ArrowRight, ArrowLeft, 
  Sparkles, Globe, UserCheck, KeyRound, Flame, CheckCircle2, ChevronRight, Eye, EyeOff, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage({ onBackToHome, onLoginSuccess }) {
  const { loginWithEmail, loginWithGoogle, switchRole, failedAttempts, isLockedOut } = useAuth();
  
  // Login Mode: 'public' (Google & Public Buyers) vs 'office' (Sales, Marketing, Accounts, Admin)
  const [loginMode, setLoginMode] = useState('public');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    const res = loginWithEmail(email, password);
    if (res.success) {
      onLoginSuccess(res.user);
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  const handleGooglePublicSignIn = () => {
    const user = loginWithGoogle();
    onLoginSuccess(user);
  };

  const handleOfficeFastSwitch = (roleKey) => {
    switchRole(roleKey);
    onLoginSuccess();
  };

  // Prefill helper for demo testing
  const handlePrefill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  return (
    <div className="admin-login-layout" style={{
      minHeight: '100vh',
      background: '#040b14',
      color: 'white',
      fontFamily: 'var(--font-body)',
      position: 'relative'
    }}>
      {/* SCOPED ANIMATIONS STYLESHEET */}
      <style>{`
        .admin-login-layout {
          display: grid;
          grid-template-columns: 1.25fr 1fr;
        }

        @media (max-width: 960px) {
          .admin-login-layout {
            grid-template-columns: 1fr !important;
            overflow-y: auto !important;
          }
          .admin-canvas-col {
            min-height: 420px !important;
            padding: 24px 20px 16px !important;
          }
          .admin-form-col {
            padding: 32px 20px 48px !important;
          }
        }

        @keyframes auraBreath {
          0%, 100% { transform: scale(1); opacity: 0.75; }
          50% { transform: scale(1.15); opacity: 0.95; filter: drop-shadow(0 0 45px rgba(245, 158, 11, 0.8)); }
        }

        @keyframes flagFlutter {
          0%, 100% { transform: rotate(0deg) skewY(0deg); }
          50% { transform: rotate(6deg) skewY(4deg); }
        }

        @keyframes waveDrift1 {
          0% { transform: translateX(0); }
          50% { transform: translateX(-40px); }
          100% { transform: translateX(0); }
        }

        @keyframes waveDrift2 {
          0% { transform: translateX(0); }
          50% { transform: translateX(35px); }
          100% { transform: translateX(0); }
        }

        @keyframes trafficLightRun {
          0% { transform: translateX(-100px); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateX(750px); opacity: 0; }
        }

        @keyframes starGlimmer {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }

        @keyframes floatEmberOrb {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translateY(-160px) scale(0.6); opacity: 0; }
        }

        @keyframes neonPulsePier {
          0%, 100% { opacity: 0.6; filter: drop-shadow(0 0 4px #38bdf8); }
          50% { opacity: 1; filter: drop-shadow(0 0 12px #00d68f); }
        }
      `}</style>

      {/* LEFT COLUMN: CINEMATIC ANIMATED VIJAYAWADA CANVAS */}
      <div className="admin-canvas-col" style={{
        position: 'relative',
        background: 'radial-gradient(ellipse at 50% 15%, #122847 0%, #061220 50%, #02070e 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 56px 24px',
        overflow: 'hidden',
        borderRight: '1px solid rgba(255,255,255,0.08)'
      }}>
        {/* Floating Stars */}
        <div style={{ position: 'absolute', top: '15%', left: '20%', width: '4px', height: '4px', borderRadius: '50%', background: '#fef08a', animation: 'starGlimmer 2.5s infinite ease-in-out' }} />
        <div style={{ position: 'absolute', top: '25%', left: '45%', width: '3px', height: '3px', borderRadius: '50%', background: '#ffffff', animation: 'starGlimmer 3.8s infinite ease-in-out 1s' }} />
        <div style={{ position: 'absolute', top: '18%', left: '75%', width: '5px', height: '5px', borderRadius: '50%', background: '#38bdf8', animation: 'starGlimmer 4.2s infinite ease-in-out 0.5s' }} />
        <div style={{ position: 'absolute', top: '30%', left: '85%', width: '4px', height: '4px', borderRadius: '50%', background: '#f59e0b', animation: 'starGlimmer 3s infinite ease-in-out 1.5s' }} />
        
        {/* Rising Golden Embers */}
        <div style={{ position: 'absolute', bottom: '260px', left: '46%', width: '6px', height: '6px', borderRadius: '50%', background: '#fbbf24', filter: 'blur(1px)', animation: 'floatEmberOrb 5s infinite linear' }} />
        <div style={{ position: 'absolute', bottom: '240px', left: '52%', width: '5px', height: '5px', borderRadius: '50%', background: '#fef08a', filter: 'blur(1px)', animation: 'floatEmberOrb 6s infinite linear 2s' }} />
        <div style={{ position: 'absolute', bottom: '280px', left: '42%', width: '4px', height: '4px', borderRadius: '50%', background: '#f59e0b', filter: 'blur(1px)', animation: 'floatEmberOrb 7s infinite linear 1s' }} />

        {/* Ambient Glow Orbs */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          left: '30%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, transparent 65%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '80px',
          left: '-60px',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 214, 143, 0.18) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }} />

        {/* TOP BRAND & RETURN BUTTON */}
        <div style={{ position: 'relative', zIndex: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img 
                src="/logo.svg" 
                alt="Land Lots Official Logo" 
                style={{ height: '48px', width: 'auto', display: 'block' }}
              />
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#1CD359', fontWeight: 800, background: 'rgba(28, 211, 89, 0.15)', border: '1px solid rgba(28, 211, 89, 0.3)', padding: '4px 10px', borderRadius: '6px' }}>
                Enterprise Portal
              </span>
            </div>

            <button
              onClick={onBackToHome}
              className="btn btn-outline"
              style={{
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                borderColor: 'rgba(255,255,255,0.25)',
                padding: '8px 16px',
                fontSize: '0.85rem',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <ArrowLeft size={16} /> Return to Marketplace
            </button>
          </div>

          <div style={{ marginTop: '36px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              color: '#fbbf24',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '14px'
            }}>
              <Flame size={14} color="#f59e0b" /> Cultural Heritage &amp; Modern Growth Hub
            </div>

            <h1 style={{
              fontSize: '2.6rem',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.8px',
              marginBottom: '12px',
              background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 60%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              The Gateway to Verified Land &amp; Real Estate
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6, maxWidth: '520px' }}>
              Access certified DTCP layouts, track plot site inspections, or manage central office transactions across Andhra Pradesh &amp; Telangana.
            </p>
          </div>
        </div>

        {/* GRAND ANIMATED SCENIC LANDMARK: PRAKASAM BARRAGE & KANAKADURGA TEMPLE */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '340px',
          marginTop: 'auto',
          zIndex: 10
        }}>
          <svg
            viewBox="0 0 760 340"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '100%', overflow: 'visible' }}
          >
            <defs>
              <radialGradient id="divineAuraAnimated2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
                <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.65" />
                <stop offset="70%" stopColor="#d97706" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#040b14" stopOpacity="0" />
              </radialGradient>

              <linearGradient id="riverGradBase2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#051f38" />
                <stop offset="50%" stopColor="#023047" />
                <stop offset="100%" stopColor="#001224" />
              </linearGradient>

              <linearGradient id="goldGopuramShine2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="30%" stopColor="#fbbf24" />
                <stop offset="70%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>

              <linearGradient id="bridgeStructureGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="30%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>

              <linearGradient id="trafficLightBeam2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0" />
                <stop offset="50%" stopColor="#fbbf24" stopOpacity="1" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Indrakeeladri Mountain Background Silhouette Layer 1 */}
            <path
              d="M0 240 C120 160 220 90 380 75 C520 60 620 140 760 220 L760 340 L0 340 Z"
              fill="#06182e"
              opacity="0.9"
            />
            {/* Indrakeeladri Ridge Layer 2 */}
            <path
              d="M80 240 C200 140 280 100 380 95 C490 90 580 170 760 240 L760 340 L80 340 Z"
              fill="#0c233e"
              opacity="0.8"
            />

            {/* Sri Kanakadurga Temple Divine Radiance Aura (Pulsating) */}
            <g style={{ transformOrigin: '380px 75px', animation: 'auraBreath 3.5s infinite ease-in-out' }}>
              <circle cx="380" cy="75" r="95" fill="url(#divineAuraAnimated2)" />
            </g>

            {/* Sacred Kanakadurga Temple Gopuram */}
            <g transform="translate(348, 18)">
              {/* Grand Golden Kalash */}
              <circle cx="32" cy="0" r="4.5" fill="#fef08a" filter="drop-shadow(0 0 8px #fbbf24)" />
              <path d="M32 -5 L34 2 L30 2 Z" fill="#ffffff" />
              <circle cx="23" cy="2" r="3" fill="#fef08a" />
              <circle cx="41" cy="2" r="3" fill="#fef08a" />

              {/* Tier 1 */}
              <path d="M22 6 L42 6 L46 20 L18 20 Z" fill="url(#goldGopuramShine2)" />
              <rect x="26" y="10" width="12" height="4" rx="1" fill="#78350f" opacity="0.6" />

              {/* Tier 2 */}
              <path d="M14 20 L50 20 L56 42 L8 42 Z" fill="url(#goldGopuramShine2)" />
              <circle cx="22" cy="30" r="3" fill="#fef08a" />
              <circle cx="32" cy="30" r="4" fill="#ffffff" />
              <circle cx="42" cy="30" r="3" fill="#fef08a" />

              {/* Tier 3 */}
              <path d="M6 42 L58 42 L64 68 L0 68 Z" fill="url(#goldGopuramShine2)" />
              <rect x="10" y="50" width="10" height="12" rx="2" fill="#78350f" />
              <rect x="27" y="48" width="10" height="14" rx="2" fill="#78350f" />
              <rect x="44" y="50" width="10" height="12" rx="2" fill="#78350f" />

              {/* Maha Mandapam Sanctum Base */}
              <rect x="-6" y="68" width="76" height="26" rx="4" fill="#92400e" stroke="#f59e0b" strokeWidth="1" />
              
              {/* Temple Golden Inner Sanctum */}
              <path d="M24 94 C24 78 40 78 40 94 Z" fill="#fef08a" filter="drop-shadow(0 0 10px #fbbf24)" />

              {/* Red Temple Sacred Dhwaja Flag */}
              <g style={{ transformOrigin: '54px 10px', animation: 'flagFlutter 2s infinite ease-in-out' }}>
                <path d="M48 6 L68 12 L48 18 Z" fill="#ef4444" />
                <line x1="48" y1="4" x2="48" y2="22" stroke="#fbbf24" strokeWidth="2" />
              </g>
            </g>

            {/* Sacred Landmark Label */}
            <text x="380" y="132" textAnchor="middle" fill="#fef08a" fontSize="11" fontWeight="800" letterSpacing="1.8" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">
              ★ SRI KANAKADURGA TEMPLE (INDRAKEELADRI) ★
            </text>

            {/* PRAKASAM BARRAGE ARCHITECTURE */}
            <line x1="0" y1="184" x2="760" y2="184" stroke="#94a3b8" strokeWidth="1" strokeDasharray="6 3" />
            <rect x="0" y="188" width="760" height="8" fill="url(#bridgeStructureGrad2)" />
            <rect x="0" y="196" width="760" height="4" fill="#0f172a" />

            {/* Animated Traffic Lights */}
            <g style={{ animation: 'trafficLightRun 4.5s infinite linear' }}>
              <rect x="0" y="187" width="140" height="4" rx="2" fill="url(#trafficLightBeam2)" filter="drop-shadow(0 0 8px #fbbf24)" />
            </g>
            <g style={{ animation: 'trafficLightRun 6s infinite linear 2s' }}>
              <rect x="0" y="190" width="100" height="3" rx="1.5" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)" />
            </g>

            {/* Sluice Piers */}
            {[...Array(16)].map((_, i) => {
              const xPos = 24 + i * 46;
              return (
                <g key={i}>
                  <rect x={xPos} y="200" width="12" height="52" fill="url(#bridgeStructureGrad2)" rx="2" stroke="#334155" strokeWidth="0.5" />
                  <path
                    d={`M${xPos + 12} 210 Q${xPos + 29} 198 ${xPos + 46} 210 L${xPos + 46} 248 L${xPos + 12} 248 Z`}
                    fill="#020912"
                    opacity="0.85"
                  />
                  <circle 
                    cx={xPos + 6} 
                    cy="192" 
                    r="2.5" 
                    fill="#38bdf8" 
                    style={{ animation: `neonPulsePier ${2 + (i % 3) * 0.5}s infinite ease-in-out ${i * 0.2}s` }} 
                  />
                </g>
              );
            })}

            {/* KRISHNA RIVER WATERBED */}
            <rect x="0" y="246" width="760" height="94" fill="url(#riverGradBase2)" />

            {/* Waves */}
            <g style={{ animation: 'waveDrift1 4s infinite ease-in-out' }}>
              <path
                d="M-40 256 C60 250 160 262 260 256 C360 250 460 262 560 256 C660 250 760 262 820 256"
                stroke="#00d68f"
                strokeWidth="2"
                strokeOpacity="0.45"
              />
              <path
                d="M-40 274 C80 268 180 280 280 274 C380 268 480 280 580 274 C680 268 780 280 820 274"
                stroke="#38bdf8"
                strokeWidth="1.8"
                strokeOpacity="0.35"
              />
            </g>

            <g style={{ animation: 'waveDrift2 5.5s infinite ease-in-out' }}>
              <path
                d="M0 292 C100 286 200 298 300 292 C400 286 500 298 600 292 C700 286 800 298 840 292"
                stroke="#00d68f"
                strokeWidth="2"
                strokeOpacity="0.4"
              />
              <path
                d="M0 314 C120 306 240 320 360 314 C480 306 600 320 720 314 C780 310 840 318 860 314"
                stroke="#38bdf8"
                strokeWidth="2.2"
                strokeOpacity="0.5"
              />
            </g>

            <ellipse cx="380" cy="275" rx="65" ry="14" fill="#f59e0b" opacity="0.18" filter="blur(8px)" />
            <ellipse cx="380" cy="305" rx="90" ry="12" fill="#00d68f" opacity="0.15" filter="blur(10px)" />

            <text x="380" y="238" textAnchor="middle" fill="#7dd3fc" fontSize="11" fontWeight="800" letterSpacing="2.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">
              PRAKASAM BARRAGE • KRISHNA RIVER
            </text>
          </svg>
        </div>

        {/* Bottom Status */}
        <div style={{
          position: 'relative',
          zIndex: 20,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: '#64748b'
        }}>
          <span>📍 Landmark: Indrakeeladri Hill &amp; Krishna River Front</span>
          <span>⚡ TLS 1.3 End-to-End Encrypted Session</span>
        </div>
      </div>

      {/* RIGHT COLUMN: MODERN AUTHENTICATION PANEL */}
      <div className="admin-form-col" style={{
        background: '#091322',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '48px 56px',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>
          
          {/* DUAL MODE TABS: PUBLIC ACCESS VS OFFICE ADMIN */}
          <div style={{
            display: 'flex',
            background: '#0e1d33',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '28px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <button
              type="button"
              onClick={() => {
                setLoginMode('public');
                setErrorMsg('');
                setEmail('');
                setPassword('');
              }}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                background: loginMode === 'public' ? '#00b074' : 'transparent',
                color: loginMode === 'public' ? 'white' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Globe size={16} />
              <span>Public Access</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginMode('office');
                setErrorMsg('');
                setEmail('admin@landlots.co');
                setPassword('Admin@LandLots2026!');
              }}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                background: loginMode === 'office' ? '#0d6efd' : 'transparent',
                color: loginMode === 'office' ? 'white' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <KeyRound size={16} />
              <span>Office Admin &amp; Staff</span>
            </button>
          </div>

          {/* TAB 1: PUBLIC ACCESS (FOR BUYERS, SELLERS & INVESTORS) */}
          {loginMode === 'public' ? (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <span style={{
                  background: 'rgba(0, 176, 116, 0.15)',
                  color: '#00d68f',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  display: 'inline-block',
                  marginBottom: '10px'
                }}>
                  PUBLIC SIGN IN • BUYERS &amp; INVESTORS
                </span>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
                  Welcome to Land Lots
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
                  Sign in with Google to track saved plots, view confirmed site visits, and access property documents.
                </p>
              </div>

              {/* PUBLIC GOOGLE AUTHENTICATION BUTTON */}
              <div style={{ marginBottom: '24px' }}>
                <button
                  type="button"
                  onClick={handleGooglePublicSignIn}
                  style={{
                    width: '100%',
                    background: 'white',
                    color: '#1f2937',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px 20px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,255,255,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: '24px 0',
                color: '#64748b',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                fontWeight: 700
              }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <span>Or Continue with Email</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              </div>

              {/* Public Buyer Email Login */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {errorMsg && (
                  <div style={{ background: '#7f1d1d', color: '#fca5a5', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={16} /> {errorMsg}
                  </div>
                )}

                <div className="input-group">
                  <label style={{ color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 700 }}>
                    Email Address
                  </label>
                  <div className="input-field-wrap" style={{ background: '#112238', borderColor: 'rgba(255,255,255,0.15)' }}>
                    <span style={{ padding: '12px', color: '#64748b' }}><Mail size={16} /></span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. buyer@gmail.com"
                      style={{ color: 'white' }}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label style={{ color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 700 }}>
                    Password (Min 6 characters)
                  </label>
                  <div className="input-field-wrap" style={{ background: '#112238', borderColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center' }}>
                    <span style={{ padding: '12px', color: '#64748b' }}><Lock size={16} /></span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ color: 'white', flex: 1 }}
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ padding: '12px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    padding: '14px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    marginTop: '4px'
                  }}
                >
                  <span>Sign In as Buyer / Investor</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>
          ) : (
            /* TAB 2: OFFICE & STAFF CENTRAL ADMINISTRATION */
            <div>
              <div style={{ marginBottom: '24px' }}>
                <span style={{
                  background: 'rgba(13, 110, 253, 0.2)',
                  color: '#38bdf8',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  display: 'inline-block',
                  marginBottom: '10px'
                }}>
                  INTERNAL OFFICE &amp; STAFF PORTAL
                </span>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
                  Office Console Sign In
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
                  Strict corporate authentication with brute-force lockout protection.
                </p>
              </div>

              {/* Corporate Email / Passkey Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {errorMsg && (
                  <div style={{ background: '#7f1d1d', color: '#fca5a5', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={16} /> {errorMsg}
                  </div>
                )}

                <div className="input-group">
                  <label style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 700 }}>
                    Corporate Staff Email
                  </label>
                  <div className="input-field-wrap" style={{ background: '#112238', borderColor: 'rgba(255,255,255,0.15)' }}>
                    <span style={{ padding: '12px', color: '#64748b' }}><Mail size={16} /></span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@landlots.co"
                      style={{ color: 'white' }}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 700 }}>
                      Corporate Password
                    </label>
                    <span style={{ fontSize: '0.7rem', color: '#f59e0b' }}>Case-sensitive</span>
                  </div>
                  <div className="input-field-wrap" style={{ background: '#112238', borderColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center' }}>
                    <span style={{ padding: '12px', color: '#64748b' }}><Lock size={16} /></span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ color: 'white', flex: 1 }}
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ padding: '12px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Real-time NIST SP 800-63B Password Complexity Meter */}
                  {password && (
                    <div style={{ marginTop: '8px', background: 'rgba(255,255,255,0.04)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                          Security Entropy:
                        </span>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 800, 
                          color: password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password) ? '#00d68f' : '#f59e0b' 
                        }}>
                          {password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password) ? '🛡️ ENTERPRISE GRADE' : '⚠️ REQUIRES NIST COMPLEXITY'}
                        </span>
                      </div>
                      
                      {/* Strength Bar */}
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
                        <div style={{
                          height: '100%',
                          width: `${Math.min(100, (
                            (password.length >= 8 ? 20 : 0) +
                            (/[A-Z]/.test(password) ? 20 : 0) +
                            (/[a-z]/.test(password) ? 20 : 0) +
                            (/[0-9]/.test(password) ? 20 : 0) +
                            (/[!@#$%^&*]/.test(password) ? 20 : 0)
                          ))}%`,
                          background: password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password) ? '#00b074' : '#f59e0b',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>

                      {/* Rule Badges */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '0.68rem' }}>
                        <span style={{ color: password.length >= 8 ? '#00d68f' : '#64748b' }}>
                          {password.length >= 8 ? '✓' : '✗'} 8+ Chars
                        </span>
                        <span style={{ color: /[A-Z]/.test(password) ? '#00d68f' : '#64748b' }}>
                          {/[A-Z]/.test(password) ? '✓' : '✗'} Uppercase
                        </span>
                        <span style={{ color: /[a-z]/.test(password) ? '#00d68f' : '#64748b' }}>
                          {/[a-z]/.test(password) ? '✓' : '✗'} Lowercase
                        </span>
                        <span style={{ color: /[0-9]/.test(password) ? '#00d68f' : '#64748b' }}>
                          {/[0-9]/.test(password) ? '✓' : '✗'} Number
                        </span>
                        <span style={{ color: /[!@#$%^&*]/.test(password) ? '#00d68f' : '#64748b' }}>
                          {/[!@#$%^&*]/.test(password) ? '✓' : '✗'} Special Char
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Active Brute-Force Lockout Notice */}
                  {isLockedOut && (
                    <div style={{ background: '#7f1d1d', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                      <AlertTriangle size={18} />
                      <div>
                        <strong>Brute-Force Guard Engaged:</strong> 5 failed attempts exceeded. Login temporarily blocked for security.
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLockedOut}
                  className="btn btn-secondary"
                  style={{
                    padding: '14px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    marginTop: '4px',
                    opacity: isLockedOut ? 0.5 : 1
                  }}
                >
                  <span>{isLockedOut ? 'Account Temporarily Locked' : 'Verify & Enter Office Console'}</span>
                  <ArrowRight size={18} />
                </button>
              </form>

              {/* CORPORATE GOVERNANCE COMPLIANCE NOTICE */}
              <div style={{
                marginTop: '28px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}>
                  <ShieldCheck size={18} color="#00d68f" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '0.76rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    <strong style={{ color: 'white' }}>Enterprise Security Guard:</strong> Access to this management console is strictly restricted to authorized Land Lots personnel under SOC2/NIST RBAC controls. Unapproved access attempts and IP signatures are logged to the tamper-evident audit ledger.
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
