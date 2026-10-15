import React, { useState } from 'react';
import { 
  Building, Users, FileSpreadsheet, ArrowLeft, LogOut, PlusCircle, CheckCircle, 
  DollarSign, TrendingUp, ShieldCheck, PhoneCall, Download, Filter, Search, 
  Layers, MapPin, Calendar, Clock, BarChart3, AlertCircle, X, Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { exportToCSV } from '../../utils/excelUtils';

// Mock Office Financial Transactions Ledger
const INITIAL_TRANSACTIONS = [
  {
    txId: "TX-9901",
    date: "2026-10-15",
    plotId: "LL-PL-101",
    plotTitle: "Green Valley Eco Plots (Plot #42)",
    buyerName: "Vikramaditya Raju",
    buyerPhone: "+91 98480 22334",
    totalDealValue: "₹34.50 Lakhs",
    tokenAmount: "₹2,00,000",
    tokenNum: 200000,
    paymentMode: "RTGS (HDFC Bank)",
    commissionRate: "2.5%",
    commissionEarned: "₹86,250",
    agentName: "Suresh Varma",
    agentCommissionShare: "₹43,125",
    officeNetMargin: "₹43,125",
    status: "Token Received"
  },
  {
    txId: "TX-9902",
    date: "2026-10-14",
    plotId: "LL-VL-202",
    plotTitle: "The Royal Crest Villa (#B-12)",
    buyerName: "Sneha Deshmukh",
    buyerPhone: "+91 98230 45671",
    totalDealValue: "₹1.95 Crores",
    tokenAmount: "₹10,00,000",
    tokenNum: 1000000,
    paymentMode: "Cheque (#409122 - ICICI)",
    commissionRate: "2.0%",
    commissionEarned: "₹3,90,000",
    agentName: "Pooja Reddy",
    agentCommissionShare: "₹1,95,000",
    officeNetMargin: "₹1,95,000",
    status: "Sale Agreement Executed"
  },
  {
    txId: "TX-9903",
    date: "2026-10-12",
    plotId: "LL-PL-105",
    plotTitle: "Sunrise Smart City Layout (#88)",
    buyerName: "K. Murali Mohan",
    buyerPhone: "+91 94401 55667",
    totalDealValue: "₹26.00 Lakhs",
    tokenAmount: "₹1,50,000",
    tokenNum: 150000,
    paymentMode: "UPI / Net Banking",
    commissionRate: "3.0%",
    commissionEarned: "₹78,000",
    agentName: "Suresh Varma",
    agentCommissionShare: "₹39,000",
    officeNetMargin: "₹39,000",
    status: "Registration Completed"
  }
];

export default function AdminDashboard({ onBackToWebsite, properties, onAddProperty, leads, onUpdateLeadStatus }) {
  const { currentUser, officeAccounts, createOfficeAccount, logout } = useAuth();
  
  // Active Tab: 'accounts' | 'staff' | 'leads' | 'inventory' | 'marketing'
  const [activeTab, setActiveTab] = useState(
    currentUser?.role === 'sales' ? 'leads' : 
    currentUser?.role === 'marketing' ? 'marketing' : 'accounts'
  );

  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showAddPlotModal, setShowAddPlotModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form State for Adding Office Staff
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('sales');
  const [newStaffBranch, setNewStaffBranch] = useState('Vijayawada HQ');
  const [newStaffPhone, setNewStaffPhone] = useState('');

  // Form State for Adding New Plot Layout
  const [newPlotTitle, setNewPlotTitle] = useState('');
  const [newPlotCity, setNewPlotCity] = useState('Vijayawada');
  const [newPlotLocation, setNewPlotLocation] = useState('');
  const [newPlotPrice, setNewPlotPrice] = useState('₹30.0 Lakhs');
  const [newPlotArea, setNewPlotArea] = useState('200 Sq.Yds');
  const [newPlotApprovals, setNewPlotApprovals] = useState('DTCP Approved, 100% Clear Title');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Add Staff Account Submit
  const handleAddStaffSubmit = (e) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) return;

    createOfficeAccount({
      name: newStaffName,
      email: newStaffEmail,
      role: newStaffRole,
      branch: newStaffBranch,
      phone: newStaffPhone
    });

    showToast(`Provisioned new ${newStaffRole.toUpperCase()} account for ${newStaffName}`);
    setShowAddStaffModal(false);
    setNewStaffName('');
    setNewStaffEmail('');
    setNewStaffPhone('');
  };

  // Add Plot Layout Submit
  const handleAddPlotSubmit = (e) => {
    e.preventDefault();
    if (!newPlotTitle || !newPlotLocation) return;

    const newProp = {
      id: `LL-PL-${Math.floor(500 + Math.random() * 500)}`,
      title: newPlotTitle,
      category: 'plots',
      typeTag: 'RESIDENTIAL PLOT',
      listingType: 'sale',
      location: newPlotLocation,
      city: newPlotCity,
      price: newPlotPrice,
      priceNum: parseInt(newPlotPrice.replace(/\D/g, '')) * 100000 || 3000000,
      rate: '₹15,000 / Sq.Yd',
      area: newPlotArea,
      facing: 'East Facing',
      roadWidth: '40 Ft Road',
      approvals: newPlotApprovals.split(',').map(s => s.trim()),
      featured: true,
      trending: true,
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80",
      agent: {
        name: currentUser?.name || "Suresh Varma",
        phone: "+91 98490 12345",
        whatsapp: "919849012345",
        verified: true,
        rating: 4.9
      }
    };

    onAddProperty([newProp]);
    showToast(`Created & approved new plot layout: ${newPlotTitle}`);
    setShowAddPlotModal(false);
    setNewPlotTitle('');
    setNewPlotLocation('');
  };

  // Export Financial Ledger to CSV
  const handleExportLedger = () => {
    exportToCSV(transactions, `LandLots_Office_Financial_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    showToast('Financial ledger exported to Excel/CSV successfully!');
  };

  // Export Leads to CSV
  const handleExportLeads = () => {
    exportToCSV(leads, `LandLots_Master_Leads_CRM_${new Date().toISOString().slice(0, 10)}.csv`);
    showToast('Leads CRM pipeline exported to Excel/CSV successfully!');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0b1523', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#059669',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '10px',
          fontWeight: 700,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          <Check size={18} /> {toastMessage}
        </div>
      )}

      {/* TOP NAVIGATION BAR FOR ADMIN */}
      <header style={{
        background: '#091322',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button 
            onClick={onBackToWebsite}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'white',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} /> Back to Website
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#00b074', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building size={20} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', margin: 0 }}>Land Lots Central Office</h2>
              <span style={{ fontSize: '0.7rem', color: '#00d68f', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}>
                Vijayawada Corporate Hub
              </span>
            </div>
          </div>
        </div>

        {/* User Info & Role Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>{currentUser?.name || "Srikanth Varma"}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
              <span style={{
                background: currentUser?.role === 'super_admin' ? '#f59e0b' : currentUser?.role === 'sales' ? '#0d6efd' : '#8b5cf6',
                color: '#000',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '9999px',
                textTransform: 'uppercase'
              }}>
                {currentUser?.role?.replace('_', ' ') || 'SUPER ADMIN'}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>• {currentUser?.branch || 'Vijayawada HQ'}</span>
            </div>
          </div>

          <button 
            onClick={() => {
              logout();
              onBackToWebsite();
            }}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
            title="Sign Out"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </header>

      {/* DASHBOARD BODY WITH SIDEBAR TABS */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', flex: 1 }}>
        {/* SIDEBAR */}
        <aside style={{ background: '#08111e', borderRight: '1px solid rgba(255,255,255,0.08)', padding: '24px 16px' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px', paddingLeft: '12px' }}>
            Administrative Modules
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* Tab: Office Accounts */}
            <button
              onClick={() => setActiveTab('accounts')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '10px',
                background: activeTab === 'accounts' ? '#00b074' : 'transparent',
                color: activeTab === 'accounts' ? 'white' : '#94a3b8',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <DollarSign size={18} />
              <span>Office Accounts &amp; Ledger</span>
            </button>

            {/* Tab: Staff Provisioning */}
            <button
              onClick={() => setActiveTab('staff')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '10px',
                background: activeTab === 'staff' ? '#00b074' : 'transparent',
                color: activeTab === 'staff' ? 'white' : '#94a3b8',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Users size={18} />
              <span>Team &amp; Staff Logins</span>
              <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '9999px' }}>
                {officeAccounts.length}
              </span>
            </button>

            {/* Tab: Master Leads CRM */}
            <button
              onClick={() => setActiveTab('leads')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '10px',
                background: activeTab === 'leads' ? '#00b074' : 'transparent',
                color: activeTab === 'leads' ? 'white' : '#94a3b8',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <FileSpreadsheet size={18} />
              <span>Sales Leads Pipeline</span>
              <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '9999px' }}>
                {leads.length}
              </span>
            </button>

            {/* Tab: Inventory Master */}
            <button
              onClick={() => setActiveTab('inventory')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '10px',
                background: activeTab === 'inventory' ? '#00b074' : 'transparent',
                color: activeTab === 'inventory' ? 'white' : '#94a3b8',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Layers size={18} />
              <span>Plot Inventory Master</span>
              <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '9999px' }}>
                {properties.length}
              </span>
            </button>

            {/* Tab: Marketing Campaigns */}
            <button
              onClick={() => setActiveTab('marketing')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '10px',
                background: activeTab === 'marketing' ? '#00b074' : 'transparent',
                color: activeTab === 'marketing' ? 'white' : '#94a3b8',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <BarChart3 size={18} />
              <span>Marketing Campaigns &amp; UTM</span>
            </button>
          </nav>

          <div style={{ marginTop: 'auto', paddingTop: '30px', paddingLeft: '8px', fontSize: '0.75rem', color: '#64748b' }}>
            <div>🔒 <strong>Access Level:</strong> {currentUser?.roleLabel || "Administrator"}</div>
            <div style={{ marginTop: '4px' }}>🏢 Office: Vijayawada HQ, Benz Circle</div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main style={{ padding: '36px', overflowY: 'auto' }}>
          {/* TAB 1: OFFICE ACCOUNTS & FINANCIAL LEDGER */}
          {activeTab === 'accounts' && (
            <div>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>Office Accounts &amp; Financial Ledger</h1>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                    Track plot token advances, brokerage commissions earned, and office revenue across active deals.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleExportLedger} className="btn btn-primary" style={{ fontSize: '0.88rem' }}>
                    <Download size={16} /> Export Ledger to Excel (.csv)
                  </button>
                </div>
              </div>

              {/* KPI Metrics Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                <div style={{ background: '#102238', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Token Advances Collected</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#00d68f', margin: '8px 0' }}>₹13,50,000</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>3 active token receipts this month</div>
                </div>

                <div style={{ background: '#102238', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Gross Transacted Value</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', margin: '8px 0' }}>₹2.55 Crores</div>
                  <div style={{ fontSize: '0.75rem', color: '#00d68f' }}>+18% from last quarter</div>
                </div>

                <div style={{ background: '#102238', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Office Brokerage Commission</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', margin: '8px 0' }}>₹5,54,250</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Average 2.2% commission rate</div>
                </div>

                <div style={{ background: '#102238', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Net Office Retained Margin</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', margin: '8px 0' }}>₹2,77,125</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>After 50% agent payout split</div>
                </div>
              </div>

              {/* Transactions Table */}
              <div style={{ background: '#102238', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Recent Real Estate Transaction Receipts</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Showing {transactions.length} verified transactions</span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: '#091626', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <th style={{ padding: '14px 20px' }}>Receipt / Date</th>
                      <th style={{ padding: '14px 20px' }}>Property Layout</th>
                      <th style={{ padding: '14px 20px' }}>Buyer Name &amp; Phone</th>
                      <th style={{ padding: '14px 20px' }}>Token Advance</th>
                      <th style={{ padding: '14px 20px' }}>Payment Mode</th>
                      <th style={{ padding: '14px 20px' }}>Commission</th>
                      <th style={{ padding: '14px 20px' }}>Assigned Agent</th>
                      <th style={{ padding: '14px 20px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.txId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ fontWeight: 700, color: 'white' }}>{tx.txId}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{tx.date}</div>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ fontWeight: 600, color: '#f8fafc' }}>{tx.plotTitle}</div>
                          <div style={{ fontSize: '0.75rem', color: '#00d68f' }}>Deal: {tx.totalDealValue}</div>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ fontWeight: 600, color: 'white' }}>{tx.buyerName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{tx.buyerPhone}</div>
                        </td>
                        <td style={{ padding: '14px 20px', fontWeight: 800, color: '#00d68f' }}>
                          {tx.tokenAmount}
                        </td>
                        <td style={{ padding: '14px 20px', color: '#cbd5e1' }}>
                          {tx.paymentMode}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ fontWeight: 700, color: '#f59e0b' }}>{tx.commissionEarned}</div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Office: {tx.officeNetMargin}</div>
                        </td>
                        <td style={{ padding: '14px 20px', color: '#93c5fd' }}>
                          {tx.agentName}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            background: tx.status === 'Registration Completed' ? '#065f46' : '#1e3a8a',
                            color: 'white',
                            fontSize: '0.72rem',
                            padding: '4px 8px',
                            borderRadius: '9999px',
                            fontWeight: 700
                          }}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: STAFF & TEAM PROVISIONING */}
          {activeTab === 'staff' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>Office Staff &amp; Team Logins</h1>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                    Provision dedicated login credentials for Sales executives, Marketing campaign managers, and Office Accounts staff.
                  </p>
                </div>

                <button 
                  onClick={() => setShowAddStaffModal(true)} 
                  className="btn btn-primary"
                >
                  <PlusCircle size={18} /> Provision New Staff Login
                </button>
              </div>

              {/* Staff Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {officeAccounts.map((account) => (
                  <div key={account.id} style={{
                    background: '#102238',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{
                        background: account.role === 'super_admin' ? '#f59e0b' : account.role === 'sales' ? '#0d6efd' : '#8b5cf6',
                        color: '#000',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        textTransform: 'uppercase'
                      }}>
                        {account.role.replace('_', ' ')}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{account.id}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '4px' }}>
                      <img 
                        src={account.avatar} 
                        alt={account.name} 
                        style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00b074' }} 
                      />
                      <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>{account.name}</h4>
                        <div style={{ fontSize: '0.78rem', color: '#00d68f', fontWeight: 600 }}>{account.roleLabel}</div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', fontSize: '0.82rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div>✉️ <strong>Email:</strong> {account.email}</div>
                      <div>📞 <strong>Phone:</strong> {account.phone}</div>
                      <div>🏢 <strong>Branch:</strong> {account.branch}</div>
                      <div>📑 <strong>Department:</strong> {account.department}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MASTER LEADS CRM */}
          {activeTab === 'leads' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>Sales Leads Pipeline &amp; Site Inspections</h1>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                    Live customer inquiries captured through website CTAs, phone calls, and marketing campaigns.
                  </p>
                </div>

                <button onClick={handleExportLeads} className="btn btn-primary">
                  <Download size={16} /> Export All Leads to Excel (.csv)
                </button>
              </div>

              {/* Leads Table */}
              <div style={{ background: '#102238', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: '#091626', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '14px 20px' }}>Lead ID &amp; Time</th>
                      <th style={{ padding: '14px 20px' }}>Buyer Name &amp; Phone</th>
                      <th style={{ padding: '14px 20px' }}>Interested Property</th>
                      <th style={{ padding: '14px 20px' }}>Budget</th>
                      <th style={{ padding: '14px 20px' }}>Assigned Sales Rep</th>
                      <th style={{ padding: '14px 20px' }}>Status Pipeline</th>
                      <th style={{ padding: '14px 20px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ fontWeight: 700, color: 'white' }}>{lead.id}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{lead.timestamp}</div>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ fontWeight: 700, color: 'white' }}>{lead.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#00d68f' }}>{lead.phone}</div>
                        </td>
                        <td style={{ padding: '14px 20px', color: '#f8fafc' }}>
                          {lead.interest}
                        </td>
                        <td style={{ padding: '14px 20px', color: '#f59e0b', fontWeight: 700 }}>
                          {lead.budget}
                        </td>
                        <td style={{ padding: '14px 20px', color: '#93c5fd' }}>
                          {lead.assignedAgent || 'Suresh Varma'}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <select
                            value={lead.status}
                            onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value)}
                            style={{
                              background: '#132842',
                              color: 'white',
                              border: '1px solid rgba(255,255,255,0.2)',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 600
                            }}
                          >
                            <option value="New Inquiry">New Inquiry</option>
                            <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                            <option value="Site Visit Confirmed">Site Visit Confirmed</option>
                            <option value="Callback Requested">Callback Requested</option>
                            <option value="Negotiation / Token Stage">Negotiation / Token</option>
                            <option value="Deal Closed (Token Paid)">Deal Closed (Token Paid)</option>
                          </select>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <a 
                            href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${lead.name}, thank you for reaching out to LandLots. I am following up on your inquiry for ${lead.interest}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-whatsapp"
                            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                          >
                            WhatsApp
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PLOT INVENTORY MASTER */}
          {activeTab === 'inventory' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>Plot &amp; Real Estate Inventory Master</h1>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                    Manage approved layouts, update RERA/DTCP certificates, and toggle listing visibility.
                  </p>
                </div>

                <button onClick={() => setShowAddPlotModal(true)} className="btn btn-primary">
                  <PlusCircle size={18} /> Add New Plot Layout
                </button>
              </div>

              {/* Inventory Table */}
              <div style={{ background: '#102238', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: '#091626', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '14px 20px' }}>ID &amp; Title</th>
                      <th style={{ padding: '14px 20px' }}>Location</th>
                      <th style={{ padding: '14px 20px' }}>Price &amp; Rate</th>
                      <th style={{ padding: '14px 20px' }}>Plot Area</th>
                      <th style={{ padding: '14px 20px' }}>Approvals Verified</th>
                      <th style={{ padding: '14px 20px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ fontWeight: 700, color: 'white' }}>{p.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.id} • {p.typeTag}</div>
                        </td>
                        <td style={{ padding: '14px 20px', color: '#cbd5e1' }}>
                          {p.location}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ fontWeight: 800, color: '#00d68f' }}>{p.price}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{p.rate}</div>
                        </td>
                        <td style={{ padding: '14px 20px', color: '#f8fafc' }}>
                          {p.area}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {p.approvals.slice(0, 2).map((a, i) => (
                              <span key={i} style={{ background: '#064e3b', color: '#6ee7b7', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px' }}>
                                ✓ {a}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{ background: '#047857', color: 'white', padding: '4px 8px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700 }}>
                            LIVE ON PORTAL
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: MARKETING CAMPAIGNS & UTM */}
          {activeTab === 'marketing' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>Marketing Campaigns &amp; UTM Attribution</h1>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                    Track ad spend ROI across Google Search Ads, Meta campaigns, and organic SEO traffic.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
                <div style={{ background: '#102238', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>
                    <span>CAMPAIGN: DIWALI PLOTS VJA</span>
                    <span style={{ color: '#00d68f' }}>Google Ads</span>
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', margin: '10px 0' }}>84 Qualified Leads</div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Cost Per Lead (CPL): <strong>₹420</strong></div>
                  <div style={{ fontSize: '0.8rem', color: '#00d68f', marginTop: '4px' }}>Site Visit Conversion: <strong>32.4%</strong></div>
                </div>

                <div style={{ background: '#102238', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>
                    <span>CAMPAIGN: HYDERABAD VILLAS</span>
                    <span style={{ color: '#38bdf8' }}>Meta (FB/IG)</span>
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', margin: '10px 0' }}>46 Qualified Leads</div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Cost Per Lead (CPL): <strong>₹680</strong></div>
                  <div style={{ fontSize: '0.8rem', color: '#00d68f', marginTop: '4px' }}>Site Visit Conversion: <strong>26.1%</strong></div>
                </div>

                <div style={{ background: '#102238', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>
                    <span>ORGANIC REAL ESTATE SEO</span>
                    <span style={{ color: '#f59e0b' }}>Organic</span>
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', margin: '10px 0' }}>112 Inquiries</div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Cost Per Lead: <strong>₹0.00</strong></div>
                  <div style={{ fontSize: '0.8rem', color: '#00d68f', marginTop: '4px' }}>Site Visit Conversion: <strong>41.8%</strong></div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: PROVISION NEW OFFICE STAFF LOGIN */}
      {showAddStaffModal && (
        <div className="modal-overlay" onClick={() => setShowAddStaffModal(false)}>
          <div className="modal-dialog" style={{ background: '#0e1e33', color: 'white' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ background: '#091626', borderColor: 'rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Provision New Office Account</h3>
              <button onClick={() => setShowAddStaffModal(false)} className="modal-close-btn" style={{ color: 'white' }}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleAddStaffSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="input-group">
                  <label style={{ color: '#cbd5e1' }}>Staff Full Name *</label>
                  <div className="input-field-wrap" style={{ background: '#132842' }}>
                    <input 
                      type="text" 
                      placeholder="e.g. Ramesh Naidu" 
                      value={newStaffName} 
                      onChange={(e) => setNewStaffName(e.target.value)}
                      required 
                      style={{ color: 'white' }}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label style={{ color: '#cbd5e1' }}>Corporate Email *</label>
                  <div className="input-field-wrap" style={{ background: '#132842' }}>
                    <input 
                      type="email" 
                      placeholder="ramesh@landlots.co" 
                      value={newStaffEmail} 
                      onChange={(e) => setNewStaffEmail(e.target.value)}
                      required 
                      style={{ color: 'white' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="input-group">
                    <label style={{ color: '#cbd5e1' }}>Assigned Role</label>
                    <div className="input-field-wrap" style={{ background: '#132842' }}>
                      <select 
                        value={newStaffRole} 
                        onChange={(e) => setNewStaffRole(e.target.value)}
                        style={{ color: 'white' }}
                      >
                        <option value="sales">Sales &amp; Client Advisory</option>
                        <option value="marketing">Marketing &amp; Campaigns</option>
                        <option value="finance_accounts">Office Accounts &amp; Finance</option>
                        <option value="super_admin">Master Admin</option>
                      </select>
                    </div>
                  </div>

                  <div className="input-group">
                    <label style={{ color: '#cbd5e1' }}>Office Branch</label>
                    <div className="input-field-wrap" style={{ background: '#132842' }}>
                      <select 
                        value={newStaffBranch} 
                        onChange={(e) => setNewStaffBranch(e.target.value)}
                        style={{ color: 'white' }}
                      >
                        <option value="Vijayawada HQ">Vijayawada HQ</option>
                        <option value="Hyderabad Corporate">Hyderabad Corporate</option>
                        <option value="Amaravati Branch">Amaravati Capital</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="input-group">
                  <label style={{ color: '#cbd5e1' }}>Mobile Number</label>
                  <div className="input-field-wrap" style={{ background: '#132842' }}>
                    <input 
                      type="tel" 
                      placeholder="+91 98490 55667" 
                      value={newStaffPhone} 
                      onChange={(e) => setNewStaffPhone(e.target.value)}
                      style={{ color: 'white' }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '14px', marginTop: '8px' }}>
                  Confirm &amp; Provision Office Account
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW PLOT LAYOUT */}
      {showAddPlotModal && (
        <div className="modal-overlay" onClick={() => setShowAddPlotModal(false)}>
          <div className="modal-dialog" style={{ background: '#0e1e33', color: 'white' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ background: '#091626', borderColor: 'rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Add &amp; Approve Plot Layout</h3>
              <button onClick={() => setShowAddPlotModal(false)} className="modal-close-btn" style={{ color: 'white' }}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleAddPlotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="input-group">
                  <label style={{ color: '#cbd5e1' }}>Project / Layout Title *</label>
                  <div className="input-field-wrap" style={{ background: '#132842' }}>
                    <input 
                      type="text" 
                      placeholder="e.g. Royal Palms Gated Layout" 
                      value={newPlotTitle} 
                      onChange={(e) => setNewPlotTitle(e.target.value)}
                      required 
                      style={{ color: 'white' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="input-group">
                    <label style={{ color: '#cbd5e1' }}>City</label>
                    <div className="input-field-wrap" style={{ background: '#132842' }}>
                      <select value={newPlotCity} onChange={(e) => setNewPlotCity(e.target.value)} style={{ color: 'white' }}>
                        <option value="Vijayawada">Vijayawada</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Amaravati">Amaravati</option>
                        <option value="Bengaluru">Bengaluru</option>
                      </select>
                    </div>
                  </div>

                  <div className="input-group">
                    <label style={{ color: '#cbd5e1' }}>Starting Price</label>
                    <div className="input-field-wrap" style={{ background: '#132842' }}>
                      <input 
                        type="text" 
                        value={newPlotPrice} 
                        onChange={(e) => setNewPlotPrice(e.target.value)}
                        style={{ color: 'white' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="input-group">
                  <label style={{ color: '#cbd5e1' }}>Exact Location / Highway Frontage</label>
                  <div className="input-field-wrap" style={{ background: '#132842' }}>
                    <input 
                      type="text" 
                      placeholder="e.g. Mangalagiri AIIMS Highway Road" 
                      value={newPlotLocation} 
                      onChange={(e) => setNewPlotLocation(e.target.value)}
                      required
                      style={{ color: 'white' }}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label style={{ color: '#cbd5e1' }}>Legal Approvals (Comma separated)</label>
                  <div className="input-field-wrap" style={{ background: '#132842' }}>
                    <input 
                      type="text" 
                      value={newPlotApprovals} 
                      onChange={(e) => setNewPlotApprovals(e.target.value)}
                      style={{ color: 'white' }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '14px', marginTop: '8px' }}>
                  Approve &amp; Publish Plot to Portal
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
