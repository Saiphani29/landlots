import React, { useState } from 'react';
import { Heart, MapPin, CheckCircle, PhoneCall, Calendar, Compass, ShieldCheck, Ruler, CreditCard } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function PropertyCard({ property, onOpenLeadModal, onBookProperty }) {
  const [isSaved, setIsSaved] = useState(false);
  const { t } = useTranslation();

  const isPlot = property.category === 'plots' || property.category === 'agricultural';

  const generateWhatsAppLink = () => {
    const text = `Hi LandLots, I am interested in ${property.title} (${property.id}) priced at ${property.price} located in ${property.location}. Please share the approved layout brochure and site visit details.`;
    return `https://wa.me/${property.agent.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <article className="property-card">
      {/* Media Header */}
      <div className="card-media">
        <img 
          src={property.image} 
          alt={property.title} 
          className="card-img" 
          loading="lazy" 
        />
        
        {/* Top Badges */}
        <div className="card-top-badges">
          <span className={`badge ${property.listingType === 'sale' ? 'badge-sale' : 'badge-rent'}`}>
            {property.listingType === 'sale' ? t('badge_sale') : 'FOR RENT'}
          </span>
          <span className="badge badge-verified">
            <ShieldCheck size={12} /> {t('badge_verified')}
          </span>
        </div>

        {/* Favorite Bookmark */}
        <button 
          className={`card-save-btn ${isSaved ? 'saved' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsSaved(!isSaved);
          }}
          title={isSaved ? "Saved to Favorites" : "Save Property"}
          aria-label="Save Property"
        >
          <Heart size={18} fill={isSaved ? '#ef4444' : 'none'} color={isSaved ? '#ef4444' : 'currentColor'} />
        </button>

        {/* Floating Locality Bar */}
        <div className="card-location-tag">
          <MapPin size={14} color="#00d68f" />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {property.location}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body">
        {/* Price & Rate Row */}
        <div className="card-price-row">
          <div className="card-price">{property.price}</div>
          <span className="card-rate">{property.rate}</span>
        </div>

        {/* Property Title */}
        <h3 className="card-title">{property.title}</h3>

        {/* Context-Aware Specifications */}
        <div className="card-specs-strip">
          {isPlot ? (
            <>
              <div className="spec-cell">
                <div className="spec-cell-label">{t('spec_plot_area')}</div>
                <div className="spec-cell-val">{property.area}</div>
              </div>
              <div className="spec-cell">
                <div className="spec-cell-label">{t('spec_facing')}</div>
                <div className="spec-cell-val" style={{ fontSize: '0.8rem' }}>{property.facing?.split(' ')[0]}</div>
              </div>
              <div className="spec-cell">
                <div className="spec-cell-label">{t('spec_road')}</div>
                <div className="spec-cell-val">{property.roadWidth || '40 Ft Road'}</div>
              </div>
            </>
          ) : (
            <>
              <div className="spec-cell">
                <div className="spec-cell-label">Bedrooms</div>
                <div className="spec-cell-val">{property.bedrooms ? `${property.bedrooms} BHK` : 'Grade-A'}</div>
              </div>
              <div className="spec-cell">
                <div className="spec-cell-label">Bathrooms</div>
                <div className="spec-cell-val">{property.bathrooms ? `${property.bathrooms} Baths` : 'Equipped'}</div>
              </div>
              <div className="spec-cell">
                <div className="spec-cell-label">Built Area</div>
                <div className="spec-cell-val">{property.area}</div>
              </div>
            </>
          )}
        </div>

        {/* Approvals Badges */}
        <div className="card-approvals-row">
          {property.approvals.slice(0, 3).map((app, i) => (
            <span key={i} className="approval-chip">
              <CheckCircle size={10} color="#00b074" /> {app}
            </span>
          ))}
        </div>

        {/* Direct Sales Action Buttons with Booking Trigger */}
        <div className="card-sales-footer" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '6px' }}>
          <button 
            onClick={() => onOpenLeadModal({ 
              title: "Book Free Site Inspection",
              propertyName: `${property.title} (${property.id})`,
              propertyPrice: property.price,
              assignedAgent: property.agent.name
            })}
            className="btn btn-outline"
            style={{ fontSize: '0.78rem', padding: '8px 6px', justifyContent: 'center' }}
            title="Book Free Site Inspection"
          >
            <Calendar size={13} />
            <span>{t('btn_site_visit')}</span>
          </button>

          <button 
            onClick={() => onBookProperty(property)}
            className="btn btn-primary"
            style={{ 
              fontSize: '0.78rem', 
              padding: '8px 8px', 
              justifyContent: 'center',
              background: '#0A8DDD',
              borderColor: '#0A8DDD',
              color: 'white',
              fontWeight: 700
            }}
            title="Lock Plot with Token Advance"
          >
            <CreditCard size={13} />
            <span>{t('btn_book_token')}</span>
          </button>

          <a 
            href={generateWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
            style={{ fontSize: '0.78rem', padding: '8px 6px', justifyContent: 'center' }}
          >
            <PhoneCall size={13} />
            <span>{t('btn_whatsapp')}</span>
          </a>
        </div>
      </div>
    </article>
  );
}
