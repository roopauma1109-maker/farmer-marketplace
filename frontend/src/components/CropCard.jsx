import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, User, ArrowRight, Package } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getCropKey, getCropImage, getCropDisplayName } from '../utils/cropRegistry';

export const CropCard = ({ crop }) => {
  const { t, language } = useLanguage();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return <span className="badge badge-available">{t('available')}</span>;
      case 'Sold':
        return <span className="badge badge-sold">{t('sold')}</span>;
      case 'Under Negotiation':
        return <span className="badge badge-negotiation">{t('underNegotiation')}</span>;
      default:
        return <span className="badge badge-available">{status}</span>;
    }
  };

  const cropKey = getCropKey(crop.crop_name);
  const imageSrc = getCropImage(cropKey, crop.image_url);
  const displayName = getCropDisplayName(cropKey, language) || crop.crop_name;

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Crop Image & Availability Badge */}
      <div style={{ position: 'relative', height: '190px', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
        <img
          src={imageSrc}
          alt={displayName}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
          onError={(e) => { e.target.src = getCropImage(cropKey); }}
        />
        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
          {getStatusBadge(crop.availability)}
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', lineHeight: 1.3 }}>
          {displayName}
        </h3>

        {/* Price & Quantity highlights */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.75rem', padding: '0.5rem 0.75rem', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #dcfce7' }}>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#15803d' }}>
              ₹{crop.price}
            </span>
            <span style={{ fontSize: '0.82rem', color: '#166534', fontWeight: 600 }}>
              /{crop.unit}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>
            <Package size={15} />
            <span>{crop.quantity} {crop.unit}</span>
          </div>
        </div>

        {/* Location & Farmer info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={15} color="#16a34a" />
            <span style={{ fontWeight: 500, color: '#334155' }}>{crop.location}</span>
          </div>
          {crop.farmer && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={15} color="#64748b" />
              <span>{t('farmerLabel')}: <strong style={{ color: '#0f172a' }}>{crop.farmer.name}</strong></span>
            </div>
          )}
        </div>

        {/* Card Action */}
        <div style={{ marginTop: 'auto' }}>
          <Link to={`/crop/${crop.id}`} className="btn btn-primary btn-block" style={{ fontSize: '0.9rem' }}>
            <span>{t('viewDetails')}</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
