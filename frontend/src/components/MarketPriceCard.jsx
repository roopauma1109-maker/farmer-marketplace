import React from 'react';
import { Building2, MapPin, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getCropDisplayName } from '../utils/cropRegistry';

export const MarketPriceCard = ({ priceRecord }) => {
  const { t, language } = useLanguage();
  const displayName = getCropDisplayName(priceRecord.crop_name, language) || priceRecord.crop_name;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {/* Header with Crop name and Source tag */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.6rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
          {displayName}
        </h3>
        <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
          {priceRecord.source}
        </span>
      </div>

      {/* Main Modal Price */}
      <div style={{ backgroundColor: '#f0fdf4', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
        <span style={{ fontSize: '0.82rem', color: '#166534', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {t('modalPrice')}
        </span>
        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#15803d', marginTop: '0.1rem' }}>
          ₹{priceRecord.modal_price}
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#166534' }}> /{priceRecord.unit}</span>
        </div>
      </div>

      {/* Min & Max Price Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
        <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{t('minPrice')}</span>
          <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#334155', marginTop: '0.1rem' }}>
            ₹{priceRecord.min_price}/{priceRecord.unit}
          </p>
        </div>
        <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{t('maxPrice')}</span>
          <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#334155', marginTop: '0.1rem' }}>
            ₹{priceRecord.max_price}/{priceRecord.unit}
          </p>
        </div>
      </div>

      {/* Mandi Market & District Details */}
      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem', color: '#64748b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Building2 size={14} color="#16a34a" />
          <span style={{ fontWeight: 600, color: '#1e293b' }}>{priceRecord.market}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={14} color="#64748b" />
            <span>{priceRecord.district}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem' }}>
            <Calendar size={13} color="#94a3b8" />
            <span>{priceRecord.price_date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
