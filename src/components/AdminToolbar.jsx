import React, { useState, useRef } from 'react';
import { Download, Upload, FileSpreadsheet, ShieldAlert, ChevronUp, ChevronDown, Check, X } from 'lucide-react';
import { exportToCSV, parseCSV } from '../utils/excelUtils';

export default function AdminToolbar({ leads, properties, onBulkAddProperties }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const fileInputRef = useRef(null);

  const handleExportLeads = () => {
    const filename = `LandLots_Sales_Leads_${new Date().toISOString().slice(0, 10)}.csv`;
    exportToCSV(leads, filename);
    showNotice(`Downloaded ${leads.length} leads to ${filename}`);
  };

  const handleExportCatalog = () => {
    const simplifiedCatalog = properties.map(p => ({
      ID: p.id,
      Title: p.title,
      Category: p.category,
      City: p.city,
      Location: p.location,
      Price: p.price,
      Rate: p.rate,
      Area: p.area,
      Approvals: p.approvals.join('; '),
      AgentName: p.agent.name,
      AgentPhone: p.agent.phone
    }));
    const filename = `LandLots_Property_Inventory_${new Date().toISOString().slice(0, 10)}.csv`;
    exportToCSV(simplifiedCatalog, filename);
    showNotice(`Exported ${properties.length} properties to ${filename}`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = parseCSV(event.target.result);
        if (parsed.length > 0) {
          // Format into property objects
          const newProperties = parsed.map((item, idx) => ({
            id: item.ID || `LL-CSV-${Date.now()}-${idx}`,
            title: item.Title || "Imported Plot Listing",
            category: item.Category || "plots",
            typeTag: "VERIFIED PLOT",
            listingType: "sale",
            location: item.Location || "Vijayawada Outer Ring Road",
            city: item.City || "Vijayawada",
            price: item.Price || "₹25.0 Lakhs",
            priceNum: 2500000,
            rate: item.Rate || "₹12,500 / Sq.Yd",
            area: item.Area || "200 Sq.Yds",
            facing: "East Facing",
            approvals: ["DTCP Approved", "Clear Title"],
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80",
            agent: {
              name: item.AgentName || "Suresh Varma",
              phone: item.AgentPhone || "+91 98490 12345",
              whatsapp: "919849012345",
              verified: true,
              rating: 4.9
            }
          }));

          onBulkAddProperties(newProperties);
          showNotice(`Successfully imported ${newProperties.length} properties from Excel!`);
        } else {
          showNotice('Could not parse valid property rows from file.');
        }
      } catch (err) {
        showNotice('Error reading file. Ensure it is a valid CSV.');
      }
    };
    reader.readAsText(file);
    e.target.value = null; // Reset input
  };

  const showNotice = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  return (
    <div className="admin-toolbar-dock">
      {/* Toast Notification */}
      {notification && (
        <div style={{ 
          position: 'absolute', 
          bottom: '60px', 
          right: '0', 
          background: '#065f46', 
          color: 'white', 
          padding: '10px 16px', 
          borderRadius: '10px', 
          fontSize: '0.85rem', 
          fontWeight: 600, 
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          whiteSpace: 'nowrap'
        }}>
          <Check size={16} /> {notification}
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="admin-menu-dropdown">
          <div className="admin-menu-header">
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0b1523', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileSpreadsheet size={16} color="#00b074" /> Marketing & Sales Hub
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Excel / CRM Ingestion & Export Engine
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ color: '#94a3b8' }}>
              <X size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button onClick={handleExportLeads} className="admin-menu-item">
              <Download size={16} color="#00b074" />
              <div>
                <div>Export Buyer Leads (.csv)</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{leads.length} active leads ready for CRM</div>
              </div>
            </button>

            <button onClick={handleExportCatalog} className="admin-menu-item">
              <FileSpreadsheet size={16} color="#0d6efd" />
              <div>
                <div>Export Property Catalog (.csv)</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{properties.length} listings in inventory</div>
              </div>
            </button>

            <button onClick={() => fileInputRef.current.click()} className="admin-menu-item">
              <Upload size={16} color="#f59e0b" />
              <div>
                <div>Bulk Import from Excel (.csv)</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Upload spreadsheet to add listings</div>
              </div>
            </button>

            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept=".csv"
              onChange={handleFileUpload}
            />
          </div>

          <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', fontSize: '0.72rem', color: '#64748b' }}>
            💡 <strong>Pro-Tip for Sales:</strong> Downloaded CSV files can be dragged directly into Zoho CRM, LeadSquared, or Google Sheets without manual data entry.
          </div>
        </div>
      )}

      {/* Floating Pill Trigger */}
      <button 
        className="admin-toolbar-pill"
        onClick={() => setIsOpen(!isOpen)}
        title="Marketing & Sales Operations"
      >
        <FileSpreadsheet size={18} color="#00d68f" />
        <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>Marketing & Sales Hub</span>
        <span style={{ 
          background: '#00b074', 
          color: 'white', 
          fontSize: '0.72rem', 
          fontWeight: 800, 
          padding: '2px 8px', 
          borderRadius: '9999px' 
        }}>
          {leads.length} Leads
        </span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>
    </div>
  );
}
