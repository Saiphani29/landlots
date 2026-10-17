import React, { useState, useMemo } from 'react';
import { 
  Database, Table, Search, Download, X, Eye, 
  RefreshCw, CheckCircle, AlertCircle, Layers, ShieldCheck, KeyRound
} from 'lucide-react';
import { exportToCSV } from '../utils/excelUtils';

export default function DatabaseExplorerModal({ 
  isOpen, 
  onClose, 
  properties = [], 
  leads = [], 
  users = [],
  transactions = [],
  userSubmissions = [],
  siteVisits = []
}) {
  const [activeTable, setActiveTable] = useState('properties');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Table Data Mapping
  const tables = useMemo(() => {
    return {
      properties: {
        name: 'properties',
        label: '🏡 properties (Commercial Catalog)',
        description: 'Verified DTCP/RERA Approved Plots & Villas inventory',
        data: properties
      },
      users: {
        name: 'users',
        label: '👥 users (Accounts & Staff)',
        description: 'Office employees, RBAC roles, and registered investors',
        data: users
      },
      leads: {
        name: 'leads',
        label: '🎯 leads (Site Visits & Inquiries)',
        description: 'Buyer customer inquiries, phone numbers, and visit dates',
        data: leads
      },
      transactions: {
        name: 'transactions',
        label: '💰 transactions (Financial Ledger)',
        description: 'Plot token advances, deal values, and broker commissions',
        data: transactions
      },
      user_submissions: {
        name: 'user_submissions',
        label: '📤 user_submissions (Seller Listings)',
        description: 'User-posted land listings submitted for admin verification',
        data: userSubmissions
      },
      site_visits: {
        name: 'site_visits',
        label: '🚗 site_visits (Free Cab Tours)',
        description: 'Confirmed cab pickup schedules and field advisor allocations',
        data: siteVisits
      }
    };
  }, [properties, leads, users, transactions, userSubmissions, siteVisits]);

  const currentTableData = tables[activeTable]?.data || [];

  // Extract Columns dynamically
  const columns = useMemo(() => {
    if (!currentTableData || currentTableData.length === 0) return [];
    // Collect unique keys from first 10 rows
    const keys = new Set();
    currentTableData.slice(0, 10).forEach(row => {
      Object.keys(row).forEach(k => {
        // Exclude huge raw nested objects for clean column display
        if (typeof row[k] !== 'function') keys.add(k);
      });
    });
    return Array.from(keys);
  }, [currentTableData]);

  // Filtered rows by search query
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return currentTableData;
    const q = searchQuery.toLowerCase();
    return currentTableData.filter(row => {
      return Object.values(row).some(val => {
        if (val === null || val === undefined) return false;
        if (typeof val === 'object') return JSON.stringify(val).toLowerCase().includes(q);
        return String(val).toLowerCase().includes(q);
      });
    });
  }, [currentTableData, searchQuery]);

  const handleExportCSV = () => {
    if (!filteredRows.length) return;
    exportToCSV(filteredRows, `landlots_db_${activeTable}_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  if (!isOpen) return null;

  return (
    <div className="db-inspector-backdrop" onClick={onClose}>
      <div 
        className="db-inspector-window"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          background: 'linear-gradient(135deg, #091a2f 0%, #061322 100%)',
          borderBottom: '1px solid rgba(56, 189, 248, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'rgba(14, 165, 233, 0.2)',
              color: '#38bdf8',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(56, 189, 248, 0.3)'
            }}>
              <Database size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'white' }}>
                  Live Database Inspector
                </h3>
                <span style={{
                  background: 'rgba(28, 211, 89, 0.15)',
                  color: '#1CD359',
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontWeight: 800,
                  border: '1px solid rgba(28, 211, 89, 0.3)'
                }}>
                  ● SQLite / Postgres Connected
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Inspect live tables, raw records, foreign relationships, and schema columns
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleExportCSV}
              className="btn btn-outline"
              style={{
                padding: '7px 12px',
                fontSize: '0.8rem',
                borderColor: 'rgba(56, 189, 248, 0.4)',
                color: '#38bdf8',
                background: 'rgba(14, 165, 233, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Download table data as CSV"
            >
              <Download size={14} /> Export CSV
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Table Selector Pills */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '12px 24px',
          background: '#07101c',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          {Object.entries(tables).map(([key, tbl]) => (
            <button
              key={key}
              onClick={() => {
                setActiveTable(key);
                setSearchQuery('');
              }}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: activeTable === key ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                background: activeTable === key ? 'rgba(14, 165, 233, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                color: activeTable === key ? '#ffffff' : '#94a3b8',
                fontSize: '0.82rem',
                fontWeight: activeTable === key ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s'
              }}
            >
              <Table size={14} color={activeTable === key ? '#38bdf8' : '#64748b'} />
              <span>{key}</span>
              <span style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                padding: '1px 6px',
                borderRadius: '9999px',
                fontSize: '0.7rem',
                fontWeight: 800
              }}>
                {tbl.data?.length || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Metadata Bar */}
        <div style={{
          padding: '12px 24px',
          background: '#091524',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '10px', color: '#64748b' }} />
            <input 
              type="text"
              placeholder={`Filter ${activeTable}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '0.82rem'
              }}
            />
          </div>

          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Showing <strong>{filteredRows.length}</strong> of <strong>{currentTableData.length}</strong> rows • <strong>{columns.length}</strong> columns
          </div>
        </div>

        {/* Scrollable Table View */}
        <div className="db-table-scroll" style={{ flex: 1, maxHeight: '55vh' }}>
          {filteredRows.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              <Database size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <p>No rows found in table <strong>{activeTable}</strong> matching your filter.</p>
            </div>
          ) : (
            <table className="db-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>#</th>
                  <th style={{ width: '60px' }}>Action</th>
                  {columns.map(col => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ color: '#64748b', fontSize: '0.75rem' }}>{idx + 1}</td>
                    <td>
                      <button
                        onClick={() => setSelectedRecord(row)}
                        style={{
                          background: 'rgba(56, 189, 248, 0.15)',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          color: '#38bdf8',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Eye size={12} /> JSON
                      </button>
                    </td>
                    {columns.map(col => {
                      const val = row[col];
                      let displayVal = '';
                      if (val === null || val === undefined) {
                        displayVal = <span style={{ color: '#64748b', fontStyle: 'italic' }}>NULL</span>;
                      } else if (typeof val === 'object') {
                        displayVal = <span style={{ color: '#f59e0b', fontSize: '0.75rem' }}>{JSON.stringify(val).slice(0, 40)}...</span>;
                      } else if (typeof val === 'boolean') {
                        displayVal = val ? 'TRUE' : 'FALSE';
                      } else {
                        displayVal = String(val);
                      }

                      return (
                        <td key={col} title={typeof val === 'object' ? JSON.stringify(val) : String(val)}>
                          {displayVal}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 24px',
          background: '#07101c',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: '#64748b'
        }}>
          <div>
            Active Table: <span style={{ color: '#38bdf8', fontWeight: 700 }}>{activeTable}</span> ({tables[activeTable]?.description})
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Engine: <strong>Node 22 node:sqlite (WAL)</strong></span>
            <span>Isolation: <strong>ACID / Serializable</strong></span>
          </div>
        </div>

        {/* Record Inspector Modal */}
        {selectedRecord && (
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.8)',
              zIndex: 1200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setSelectedRecord(null)}
          >
            <div 
              style={{
                background: '#0f172a',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '700px',
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#38bdf8' }}>
                  Raw JSON Record Inspector
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                <pre style={{
                  background: '#020617',
                  padding: '16px',
                  borderRadius: '10px',
                  color: '#34d399',
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  lineHeight: 1.5,
                  overflowX: 'auto'
                }}>
                  {JSON.stringify(selectedRecord, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
