import React, { useState, useEffect } from 'react';
import { TrendingUp, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { marketPricesAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const FarmerPriceComparison = ({ cropName, expectedPrice, district = '' }) => {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cropName || !expectedPrice || expectedPrice <= 0) {
      setData(null);
      return;
    }

    const fetchComparison = async () => {
      setLoading(true);
      try {
        const result = await marketPricesAPI.compare(cropName, expectedPrice, district);
        setData(result);
      } catch (err) {
        console.warn('Could not fetch market comparison:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchComparison();
    }, 400);

    return () => clearTimeout(timer);
  }, [cropName, expectedPrice, district]);

  if (!cropName || !expectedPrice || expectedPrice <= 0) {
    return (
      <div style={{
        padding: '1.25rem',
        borderRadius: '12px',
        backgroundColor: '#f8fafc',
        border: '1.5px dashed #cbd5e1',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        color: '#64748b',
        fontSize: '0.88rem'
      }}>
        <Info size={20} color="#16a34a" />
        <span>{t('priceWidgetPlaceholder')}</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
        {t('comparingPrices')}
      </div>
    );
  }

  if (!data) return null;

  const isWithin = data.market_found && expectedPrice >= data.min_price && expectedPrice <= data.max_price;
  const isBelow = data.market_found && expectedPrice < data.min_price;
  const isAbove = data.market_found && expectedPrice > data.max_price;

  return (
    <div style={{
      backgroundColor: '#f0fdf4',
      border: '1.5px solid #bbf7d0',
      borderRadius: '14px',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.85rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={18} color="#16a34a" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#166534' }}>
            {t('priceComparisonTitle')}
          </h4>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600 }}>
          {t('mandiSource')}
        </span>
      </div>

      {/* Comparison Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #dcfce7', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{t('yourExpectedPrice')}</span>
          <p style={{ fontSize: '1.15rem', fontWeight: 800, color: '#15803d', marginTop: '0.1rem' }}>
            ₹{expectedPrice}/{data.unit}
          </p>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #dcfce7', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{t('currentMarketRange')}</span>
          <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#334155', marginTop: '0.1rem' }}>
            {data.market_found ? `₹${data.min_price} – ₹${data.max_price}` : 'N/A'}
          </p>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #dcfce7', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{t('avgMarketPrice')}</span>
          <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#334155', marginTop: '0.1rem' }}>
            {data.market_found ? `₹${data.modal_price}/${data.unit}` : 'N/A'}
          </p>
        </div>
      </div>

      {/* Guidance Message Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.65rem 0.95rem',
        borderRadius: '8px',
        backgroundColor: isWithin ? '#dcfce7' : isBelow ? '#fef3c7' : '#eff6ff',
        color: isWithin ? '#14532d' : isBelow ? '#78350f' : '#1e3a8a',
        fontSize: '0.85rem',
        fontWeight: 600
      }}>
        {isWithin && <CheckCircle size={16} color="#15803d" />}
        {isBelow && <AlertCircle size={16} color="#b45309" />}
        {isAbove && <Info size={16} color="#2563eb" />}
        <span>{data.status_message}</span>
      </div>

      <p style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic', margin: 0 }}>
        {t('priceWidgetDisclaimer')}
      </p>
    </div>
  );
};
