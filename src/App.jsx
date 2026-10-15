import React, { useState, useMemo } from 'react';
import CampaignTopBar from './components/CampaignTopBar';
import Navbar from './components/Navbar';
import HeroSearch from './components/HeroSearch';
import StatsStrip from './components/StatsStrip';
import CategoryExplorer from './components/CategoryExplorer';
import PropertyGrid from './components/PropertyGrid';
import TrustMarquee from './components/TrustMarquee';
import ToolsSection from './components/ToolsSection';
import VerifiedAgents from './components/VerifiedAgents';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import SiteVisitModal from './components/SiteVisitModal';
import AdminToolbar from './components/AdminToolbar';
import AdminLoginPage from './components/admin/AdminLoginPage';
import AdminDashboard from './components/admin/AdminDashboard';
import PolicyPages from './components/pages/PolicyPages';
import BookingPaymentPage from './components/BookingPaymentPage';

import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useTranslation } from './context/LanguageContext';
import { INITIAL_PROPERTIES, INITIAL_LEADS } from './data/mockData';

function MainApp() {
  const { isAuthenticated, currentUser } = useAuth();
  const { t } = useTranslation();

  // Navigation View: 'website' | 'admin_login' | 'admin_dashboard' | 'policy_page' | 'booking_payment'
  const [currentView, setCurrentView] = useState('website');
  const [policyPageKey, setPolicyPageKey] = useState('terms');
  const [selectedPropertyForBooking, setSelectedPropertyForBooking] = useState(null);

  // Inventory and Leads State (ready for Excel/DB sync)
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [leads, setLeads] = useState(INITIAL_LEADS);

  // Search & Filter State
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTab, setSearchTab] = useState('plots');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('all');
  const [selectedFacing, setSelectedFacing] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Modal State
  const [modalData, setModalData] = useState(null);

  // Calculate filtered and sorted properties
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // City filter
      if (selectedCity !== 'All Cities' && p.city !== selectedCity) {
        return false;
      }

      // Category filter (CategoryExplorer or SearchTab)
      if (activeCategory !== 'all' && p.category !== activeCategory) {
        return false;
      }

      // Search query (matches title, location, city, approvals)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesLoc = p.location.toLowerCase().includes(q);
        const matchesCity = p.city.toLowerCase().includes(q);
        const matchesApproval = p.approvals.some(a => a.toLowerCase().includes(q));
        if (!matchesTitle && !matchesLoc && !matchesCity && !matchesApproval) {
          return false;
        }
      }

      // Budget filter
      if (selectedBudget === 'under30L' && p.priceNum > 3000000) return false;
      if (selectedBudget === '30L-50L' && (p.priceNum < 3000000 || p.priceNum > 5000000)) return false;
      if (selectedBudget === '50L-1Cr' && (p.priceNum < 5000000 || p.priceNum > 10000000)) return false;
      if (selectedBudget === 'above1Cr' && p.priceNum < 10000000) return false;

      // Facing filter
      if (selectedFacing !== 'all') {
        if (!p.facing || !p.facing.toLowerCase().includes(selectedFacing.toLowerCase())) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'priceLow') return a.priceNum - b.priceNum;
      if (sortBy === 'priceHigh') return b.priceNum - a.priceNum;
      // Default: featured first
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [properties, selectedCity, activeCategory, searchQuery, selectedBudget, selectedFacing, sortBy]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCity !== 'All Cities') count++;
    if (activeCategory !== 'all') count++;
    if (searchQuery.trim()) count++;
    if (selectedBudget !== 'all') count++;
    if (selectedFacing !== 'all') count++;
    return count;
  }, [selectedCity, activeCategory, searchQuery, selectedBudget, selectedFacing]);

  // Reset filters
  const handleResetFilters = () => {
    setSelectedCity('All Cities');
    setActiveCategory('all');
    setSearchQuery('');
    setSelectedBudget('all');
    setSelectedFacing('all');
    setSortBy('featured');
  };

  // Perform search from Hero Search button
  const handlePerformSearch = () => {
    if (searchTab !== 'all') {
      setActiveCategory(searchTab);
    }
    const propSection = document.getElementById('properties');
    if (propSection) {
      propSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Lead handling
  const handleLeadSubmit = (newLead) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  // Lead status update by Sales / Admin
  const handleUpdateLeadStatus = (leadId, newStatus) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
  };

  // Bulk add properties from Excel/CSV upload or Admin
  const handleBulkAddProperties = (newProps) => {
    setProperties((prev) => [...newProps, ...prev]);
  };

  // Navigate to designed policy / legal page
  const handleNavigateToPolicy = (pageKey) => {
    setPolicyPageKey(pageKey);
    setCurrentView('policy_page');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Trigger Booking / Payment Page
  const handleOpenBooking = (propertyToBook) => {
    const targetProp = propertyToBook || properties[0];
    setSelectedPropertyForBooking(targetProp);
    setCurrentView('booking_payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // VIEW 1: Dedicated Admin & Staff Login Page
  if (currentView === 'admin_login') {
    return (
      <AdminLoginPage 
        onBackToHome={() => setCurrentView('website')}
        onLoginSuccess={() => setCurrentView('admin_dashboard')}
      />
    );
  }

  // VIEW 2: Master Admin & Office Accounts Dashboard (Protected Route Guard)
  if (currentView === 'admin_dashboard') {
    if (!isAuthenticated) {
      return (
        <AdminLoginPage 
          onBackToHome={() => setCurrentView('website')}
          onLoginSuccess={() => setCurrentView('admin_dashboard')}
        />
      );
    }

    return (
      <AdminDashboard 
        onBackToWebsite={() => setCurrentView('website')}
        properties={properties}
        onAddProperty={handleBulkAddProperties}
        leads={leads}
        onUpdateLeadStatus={handleUpdateLeadStatus}
      />
    );
  }

  // VIEW 3: Designed Legal & Compliance Sub-Pages
  if (currentView === 'policy_page') {
    return (
      <PolicyPages 
        pageKey={policyPageKey}
        onBackToHome={() => setCurrentView('website')}
        onNavigateToPage={(key) => setPolicyPageKey(key)}
      />
    );
  }

  // VIEW 4: Dedicated Plot Token Advance & Payment Checkout Page
  if (currentView === 'booking_payment') {
    return (
      <BookingPaymentPage 
        property={selectedPropertyForBooking || properties[0]}
        onBack={() => setCurrentView('website')}
        onBookingSuccess={(receipt) => {
          // Log in local leads/transactions
          console.log('Plot token reserved successfully:', receipt);
        }}
      />
    );
  }

  // VIEW 5: Public Commercial Portal
  return (
    <div className="app-container">
      {/* Top Marketing Campaign Bar */}
      <CampaignTopBar onOpenLeadModal={setModalData} />

      {/* Main Header / Navigation with Office Login & Language Trigger */}
      <Navbar 
        selectedCity={selectedCity} 
        onSelectCity={setSelectedCity} 
        onOpenLeadModal={setModalData}
        onOpenAdminLogin={() => setCurrentView('admin_login')}
        onOpenAdminDashboard={() => setCurrentView('admin_dashboard')}
        onOpenPaymentPage={handleOpenBooking}
      />

      {/* Hero Section with Search Engine & Spotlight Banner */}
      <HeroSearch 
        searchTab={searchTab}
        setSearchTab={setSearchTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedBudget={selectedBudget}
        setSelectedBudget={setSelectedBudget}
        selectedFacing={selectedFacing}
        setSelectedFacing={setSelectedFacing}
        onPerformSearch={handlePerformSearch}
        onOpenLeadModal={setModalData}
      />

      {/* Trust & Stats Counter */}
      <StatsStrip />

      {/* Continuous Horizontal Trust & Approvals Marquee */}
      <TrustMarquee />

      {/* Category Explorer */}
      <CategoryExplorer 
        activeCategory={activeCategory} 
        onSelectCategory={setActiveCategory} 
      />

      {/* Certified Properties Catalog with Scrollable Rail / Grid & Direct Hold */}
      <PropertyGrid 
        properties={filteredProperties}
        activeFilterCount={activeFilterCount}
        onResetFilters={handleResetFilters}
        onOpenLeadModal={setModalData}
        onBookProperty={handleOpenBooking}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Interactive Land Area Converter & EMI Tool */}
      <ToolsSection />

      {/* Verified Real Estate Advisors */}
      <VerifiedAgents onOpenLeadModal={setModalData} />

      {/* Customer Reviews & Social Proof */}
      <Testimonials />

      {/* Enterprise Footer with Clickable Legal Policies & Newsletter */}
      <Footer onNavigateToPage={handleNavigateToPolicy} />

      {/* High-Velocity Lead Capture Modal */}
      {modalData && (
        <SiteVisitModal 
          modalData={modalData} 
          onClose={() => setModalData(null)}
          onSubmitLead={handleLeadSubmit}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <MainApp />
      </LanguageProvider>
    </AuthProvider>
  );
}
