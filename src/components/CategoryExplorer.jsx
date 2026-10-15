import React from 'react';
import { LayoutGrid, MapPin, Tractor, Home, Building2, Flame } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

export default function CategoryExplorer({ activeCategory, onSelectCategory }) {
  const getIcon = (id) => {
    switch (id) {
      case 'plots': return <MapPin size={24} />;
      case 'agricultural': return <Tractor size={24} />;
      case 'residential': return <Home size={24} />;
      case 'commercial': return <Building2 size={24} />;
      default: return <LayoutGrid size={24} />;
    }
  };

  return (
    <section className="section" style={{ paddingBottom: '20px' }}>
      <div className="container">
        <div className="section-header">
          <div>
            <div className="section-tag">
              <Flame size={16} /> Curated Categories
            </div>
            <h2 className="section-title">Explore by Property Segment</h2>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '420px', textAlign: 'right' }}>
            From high-growth DTCP residential layouts to highway-facing agricultural farms and luxury villas.
          </p>
        </div>

        <div className="categories-grid">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <div 
                key={cat.id} 
                className={`category-card ${isActive ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat.id)}
              >
                {cat.popular && (
                  <span style={{ 
                    position: 'absolute', 
                    top: '8px', 
                    right: '8px', 
                    background: '#fef3c7', 
                    color: '#b45309', 
                    fontSize: '0.65rem', 
                    fontWeight: 800, 
                    padding: '2px 6px', 
                    borderRadius: '9999px' 
                  }}>
                    HIGH DEMAND
                  </span>
                )}
                <div className="category-icon-box">
                  {getIcon(cat.id)}
                </div>
                <div className="category-name">{cat.label}</div>
                <div className="category-count">{cat.count}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
