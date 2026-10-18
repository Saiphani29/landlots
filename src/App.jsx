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
import { apiClient } from './utils/apiClient';
import BuyerPortal from './components/buyer/BuyerPortal';
import EstimatorSidebar from './components/EstimatorSidebar';
import DatabaseExplorerModal from './components/DatabaseExplorerModal';

import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useTranslation } from './context/LanguageContext';
import { INITIAL_PROPERTIES, INITIAL_LEADS } from './data/mockData';

// Initial User Submissions (User Space Seller Verification Lifecycle)
const INITIAL_USER_SUBMISSIONS = [
  {
    id: "USR-PROP-101",
    title: "Sunrise Golden Palms East Facing Plot #28",
    category: "plots",
    typeTag: "RESIDENTIAL PLOT",
    listingType: "sale",
    city: "Vijayawada",
    location: "Kankipadu - Bandar Highway",
    price: "₹34.5 Lakhs",
    priceNum: 3450000,
    area: "200 Sq.Yds",
    facing: "East Facing",
    roadWidth: "40 Ft CC Road",
    approvals: ["DTCP Approved", "100% Clear Title", "Bank Loan Ready"],
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop",
    description: "Direct owner plot with registered revenue survey, LP No. 42/2024, immediate registration.",
    sellerName: "B. Venkateswara Rao",
    sellerPhone: "+91 98480 99881",
    sellerEmail: "venkat.rao@gmail.com",
    status: "pending_verification",
    submittedAt: "17 Oct 2026"
  },
  {
    id: "USR-PROP-102",
    title: "Greenwood Organic Farm Land (1.5 Acres)",
    category: "farms",
    typeTag: "AGRICULTURAL FARM",
    listingType: "sale",
    city: "Guntur",
    location: "Perecherla Highway",
    price: "₹72.0 Lakhs",
    priceNum: 7200000,
    area: "1.5 Acres",
    facing: "North-East Facing",
    roadWidth: "33 Ft BT Road",
    approvals: ["Revenue Passbook (1-B)", "Pattadar Title Deed"],
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop",
    description: "Borewell with high sweet water yield, perimeter fencing installed, solar pump connected.",
    sellerName: "K. Murali Mohan",
    sellerPhone: "+91 94401 55667",
    sellerEmail: "murali.k@yahoo.com",
    status: "approved",
    submittedAt: "14 Oct 2026"
  }
];

function MainApp() {
  const { isAuthenticated, currentUser } = useAuth();
  const { t } = useTranslation();

  // Navigation View: 'website' | 'admin_login' | 'admin_dashboard' | 'policy_page' | 'booking_payment' | 'buyer_portal'
  const [currentView, setCurrentView] = useState('website');
  const [policyPageKey, setPolicyPageKey] = useState('terms');
  const [selectedPropertyForBooking, setSelectedPropertyForBooking] = useState(null);

  // Estimator Sidebar & Database Modal State
  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false);

  // User Submissions State (User Space -> Admin Verification Pipeline)
  const [userSubmissions, setUserSubmissions] = useState(INITIAL_USER_SUBMISSIONS);

  // Inventory, Leads, and Buyer Saved Plots State
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [savedPropertyIds, setSavedPropertyIds] = useState(['LL-PL-101', 'LL-VL-202']);

  const savedProperties = useMemo(() => {
    return properties.filter(p => savedPropertyIds.includes(p.id));
  }, [properties, savedPropertyIds]);

  const handleToggleSaveProperty = (propId) => {
    setSavedPropertyIds(prev => 
      prev.includes(propId) ? prev.filter(id => id !== propId) : [...prev, propId]
    );
  };

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
    // Persist to the office CRM so the sales team actually receives the inquiry
    apiClient.submitLead({
      name: newLead.name,
      phone: newLead.phone,
      email: newLead.email,
      preferredDate: newLead.date,
      preferredTime: newLead.timeSlot,
      notes: `Cab pickup: ${newLead.cabPickup}`,
      propertyTitle: newLead.interest,
      utmSource: newLead.source,
      utmCampaign: newLead.utm_campaign
    });
  };

  // User Property Submissions Handlers (User Space -> Admin Verification Pipeline)
  const handleUserSubmitProperty = (newSubmission) => {
    setUserSubmissions(prev => [newSubmission, ...prev]);
  };

  const handleApproveProperty = (subId) => {
    setUserSubmissions(prev => prev.map(s => s.id === subId ? { ...s, status: 'approved' } : s));
    const target = userSubmissions.find(s => s.id === subId);
    if (target) {
      const approvedProperty = {
        id: `LL-${target.id}`,
        title: target.title,
        category: target.category,
        typeTag: target.typeTag || 'VERIFIED PLOT',
        listingType: target.listingType || 'sale',
        location: target.location,
        city: target.city,
        price: target.price,
        priceNum: target.priceNum || 3000000,
        rate: '₹16,500 / Sq.Yd',
        area: target.area,
        areaSub: 'Approved Plot Layout',
        facing: target.facing || 'East Facing',
        roadWidth: target.roadWidth || '40 Ft Road',
        approvals: target.approvals || ['DTCP Approved', '100% Clear Title'],
        featured: false,
        trending: true,
        image: target.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop',
        agent: {
          name: target.sellerName || 'Verified Advisor',
          phone: target.sellerPhone || '+91 98490 12345',
          rating: '4.9',
          deals: 'Verified Owner Listing'
        },
        highlights: ['Immediate Registration', 'Clear Title', 'DTCP Approved Layout']
      };
      setProperties(prev => [approvedProperty, ...prev]);
    }
  };

  const handleRejectProperty = (subId) => {
    setUserSubmissions(prev => prev.map(s => s.id === subId ? { ...s, status: 'rejected' } : s));
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
        onLoginSuccess={(user) => setCurrentView(user?.role === 'buyer' ? 'buyer_portal' : 'admin_dashboard')}
      />
    );
  }

  // VIEW 2: Master Admin & Office Accounts Dashboard (Protected Route Guard - STAFF ONLY)
  if (currentView === 'admin_dashboard') {
    if (!isAuthenticated) {
      return (
        <AdminLoginPage 
          onBackToHome={() => setCurrentView('website')}
          onLoginSuccess={(user) => setCurrentView(user?.role === 'buyer' ? 'buyer_portal' : 'admin_dashboard')}
        />
      );
    }

    // STRICT RBAC PRIVILEGE SEPARATION: Public buyers are never allowed into internal office console
    if (currentUser?.role === 'buyer') {
      return (
        <BuyerPortal 
          onBackToHome={() => setCurrentView('website')}
          onOpenBooking={handleOpenBooking}
          savedProperties={savedProperties}
          onRemoveSavedProperty={handleToggleSaveProperty}
          userSubmissions={userSubmissions}
          onSubmitProperty={handleUserSubmitProperty}
        />
      );
    }

    return (
      <>
        <AdminDashboard
          onBackToWebsite={() => setCurrentView('website')}
          properties={properties}
          onAddProperty={handleBulkAddProperties}
          leads={leads}
          onUpdateLeadStatus={handleUpdateLeadStatus}
          userSubmissions={userSubmissions}
          onApproveProperty={handleApproveProperty}
          onRejectProperty={handleRejectProperty}
          onOpenDatabaseModal={() => setIsDatabaseOpen(true)}
        />

        {/* Rendered here too: the dashboard's "Open DB Inspector" button would otherwise do nothing */}
        <DatabaseExplorerModal
          isOpen={isDatabaseOpen}
          onClose={() => setIsDatabaseOpen(false)}
          properties={properties}
          leads={leads}
          userSubmissions={userSubmissions}
        />
      </>
    );
  }

  // VIEW 3: Dedicated Institutional Buyer & User Space Portal
  if (currentView === 'buyer_portal') {
    return (
      <BuyerPortal 
        onBackToHome={() => setCurrentView('website')}
        onOpenBooking={handleOpenBooking}
        savedProperties={savedProperties}
        onRemoveSavedProperty={handleToggleSaveProperty}
        userSubmissions={userSubmissions}
        onSubmitProperty={handleUserSubmitProperty}
      />
    );
  }

  // VIEW 4: Designed Legal & Compliance Sub-Pages
  if (currentView === 'policy_page') {
    return (
      <PolicyPages 
        pageKey={policyPageKey}
        onBackToHome={() => setCurrentView('website')}
        onNavigateToPage={(key) => setPolicyPageKey(key)}
      />
    );
  }

  // VIEW 5: Dedicated Plot Token Advance & Payment Checkout Page
  if (currentView === 'booking_payment') {
    return (
      <BookingPaymentPage 
        property={selectedPropertyForBooking || properties[0]}
        onBack={() => setCurrentView('website')}
        onBookingSuccess={(receipt) => {
          console.log('Plot token reserved successfully:', receipt);
        }}
      />
    );
  }

  // VIEW 6: Public Commercial Portal
  return (
    <div className="app-container">
      {/* Top Marketing Campaign Bar */}
      <CampaignTopBar onOpenLeadModal={setModalData} />

      {/* Main Header / Navigation with Office Login, Buyer Portal, Language & Drawer Triggers */}
      <Navbar 
        selectedCity={selectedCity} 
        onSelectCity={setSelectedCity} 
        onOpenLeadModal={setModalData}
        onOpenAdminLogin={() => setCurrentView('admin_login')}
        onOpenAdminDashboard={() => setCurrentView('admin_dashboard')}
        onOpenBuyerPortal={() => setCurrentView('buyer_portal')}
        onOpenPaymentPage={handleOpenBooking}
        onOpenEstimator={() => setIsEstimatorOpen(true)}
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

      {/* Verified Real Estate Advisors */}
      <VerifiedAgents onOpenLeadModal={setModalData} />

      {/* Customer Reviews & Social Proof */}
      <Testimonials />

      {/* Enterprise Footer with Clickable Legal Policies & Newsletter */}
      <Footer onNavigateToPage={handleNavigateToPolicy} />

      {/* Floating Edge Trigger for Estimator & EMI */}
      <button 
        onClick={() => setIsEstimatorOpen(true)}
        className="floating-tools-btn"
        title="Open Land Area Converter & EMI Estimator"
        aria-label="Open Land Area Converter & EMI Estimator"
      >
        <span>📐 Tools &amp; EMI</span>
      </button>

      {/* Slide-Out Estimator & Area Converter Drawer */}
      <EstimatorSidebar 
        isOpen={isEstimatorOpen} 
        onClose={() => setIsEstimatorOpen(false)} 
        onOpenLeadModal={setModalData}
      />

      {/* Live Database Explorer Modal */}
      <DatabaseExplorerModal 
        isOpen={isDatabaseOpen}
        onClose={() => setIsDatabaseOpen(false)}
        properties={properties}
        leads={leads}
        userSubmissions={userSubmissions}
      />

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
