import React, { useState, useRef } from 'react';
import PropertyCard from './PropertyCard';
import { 
  SlidersHorizontal, RefreshCw, AlertCircle, ChevronLeft, ChevronRight, 
  LayoutGrid, Rows3, Sparkles 
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function PropertyGrid({ 
  properties, 
  activeFilterCount, 
  onResetFilters, 
  onOpenLeadModal,
  onBookProperty,
  sortBy,
  setSortBy 
}) {
  const { t } = useTranslation();
  // View mode: 'scroll' (horizontal carousel rail) or 'grid' (classic grid)
  const [viewMode, setViewMode] = useState('scroll');
  const scrollContainerRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollOffset = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  return (
    <section id="properties" className="section" style={{ background: '#f8fafc', padding: '48px 0' }}>
      <div className="container">
        {/* Section Header with Controls */}
        <div className="section-header" style={{ marginBottom: '24px' }}>
          <div>
            <div className="section-tag" style={{ background: '#eef7fd', color: '#0A8DDD', border: '1px solid #ddecfa' }}>
              <SlidersHorizontal size={15} color="#0A8DDD" /> {t('badge_verified')}
            </div>
            <h2 className="section-title">{t('grid_title')}</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '4px' }}>
              {t('grid_subtitle')}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* View Mode Toggle: Scrollable Rail vs Grid */}
            <div className="view-mode-toggle">
              <button 
                type="button"
                className={`view-mode-btn ${viewMode === 'scroll' ? 'active' : ''}`}
                onClick={() => setViewMode('scroll')}
                title="Scrollable Carousel View"
              >
                <Rows3 size={15} /> <span>{t('view_scroll')}</span>
              </button>
              <button 
                type="button"
                className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <LayoutGrid size={15} /> <span>{t('view_grid')}</span>
              </button>
            </div>

            {/* Left / Right Carousel Arrow Buttons (Visible in scroll mode) */}
            {viewMode === 'scroll' && properties.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button 
                  type="button"
                  onClick={() => handleScroll('left')} 
                  className="rail-arrow-btn"
                  title="Scroll Left"
                  aria-label="Previous Properties"
                >
                  <ChevronLeft size={18} />
                </button>
                <button 
                  type="button"
                  onClick={() => handleScroll('right')} 
                  className="rail-arrow-btn"
                  title="Scroll Right"
                  aria-label="Next Properties"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* Reset Filters button */}
            {activeFilterCount > 0 && (
              <button 
                onClick={onResetFilters}
                className="btn btn-outline" 
                style={{ fontSize: '0.85rem', padding: '6px 14px' }}
              >
                <RefreshCw size={14} /> {t('btn_reset')} ({activeFilterCount})
              </button>
            )}

            {/* Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 600 }}>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ 
                  padding: '7px 12px', 
                  borderRadius: '8px', 
                  border: '1.5px solid #cbd5e1', 
                  background: 'white', 
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: '#0f172a'
                }}
              >
                <option value="featured">{t('sort_featured')}</option>
                <option value="priceLow">{t('sort_low_high')}</option>
                <option value="priceHigh">{t('sort_high_low')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Display: Scrollable Rail or Grid */}
        {properties.length > 0 ? (
          <div>
            {viewMode === 'scroll' ? (
              <div 
                ref={scrollContainerRef} 
                className="property-scroll-rail"
              >
                {properties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    onOpenLeadModal={onOpenLeadModal} 
                    onBookProperty={onBookProperty}
                  />
                ))}
              </div>
            ) : (
              <div className="property-grid">
                {properties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    onOpenLeadModal={onOpenLeadModal} 
                    onBookProperty={onBookProperty}
                  />
                ))}
              </div>
            )}

            {/* Subtle swipe hint for mobile users */}
            {viewMode === 'scroll' && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                fontSize: '0.78rem', 
                color: '#64748b', 
                marginTop: '10px',
                padding: '0 4px'
              }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  👆 <em>Swipe or use arrow keys to browse verified layouts</em>
                </span>
                <button 
                  onClick={() => setViewMode('grid')}
                  style={{ background: 'none', border: 'none', color: '#0A8DDD', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  View All as Grid ({properties.length}) →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '60px 24px', 
            textAlign: 'center', 
            border: '1.5px dashed #cbd5e1',
            margin: '20px 0' 
          }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              background: '#fef2f2', 
              color: '#ef4444', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 16px' 
            }}>
              <AlertCircle size={32} />
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>No exact listings found</h3>
            <p style={{ color: '#64748b', maxWidth: '420px', margin: '0 auto 20px', fontSize: '0.95rem' }}>
              We couldn't find properties matching your current filters. Try resetting filters or request our sales team to find custom off-market plots for you.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={onResetFilters} className="btn btn-outline">
                <RefreshCw size={16} /> {t('btn_reset')}
              </button>
              <button 
                onClick={() => onOpenLeadModal({ title: "Custom Land & Plot Request" })}
                className="btn btn-primary"
              >
                Request Custom Plots
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
