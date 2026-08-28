import React, { useState, useEffect } from 'react';
import { TrendingUp, Sparkles, AlertCircle, BarChart2 } from 'lucide-react';
import { aiAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { getCropDisplayName } from '../utils/cropRegistry';

export const AIPredictionPage = () => {
  const { t, language } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [location, setLocation] = useState('Tamil Nadu');
  const [priceData, setPriceData] = useState(null);
  const [demandData, setDemandData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const crops = ['Tomato', 'Onion', 'Potato', 'Brinjal', 'Banana', 'Carrot', 'Cabbage', 'Green Chilli', 'Turmeric', 'Paddy', 'Drumstick'];

  const fetchPredictions = async () => {
    setLoading(true);
    setError('');
    try {
      const [priceRes, demandRes] = await Promise.all([
        aiAPI.getPricePrediction(selectedCrop, location),
        aiAPI.getDemandPrediction(selectedCrop, location)
      ]);
      setPriceData(priceRes);
      setDemandData(demandRes);
    } catch (err) {
      setError(err.message || 'Could not fetch AI projection insights.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, [selectedCrop, location]);

  return (
    <div className="container main-content">
      {/* Header */}
      <div style={{ maxWidth: '800px', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          backgroundColor: '#eff6ff',
          color: '#2563eb',
          padding: '0.35rem 0.85rem',
          borderRadius: '9999px',
          fontSize: '0.82rem',
          fontWeight: 700,
          marginBottom: '0.75rem',
          border: '1px solid #bfdbfe'
        }}>
          <Sparkles size={16} />
          <span>{t('aiRoadmapBadge')}</span>
        </div>

        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
          {t('aiInsightsTitle')}
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
          {t('aiInsightsSubtitle')}
        </p>
      </div>

      {/* Advisory Banner */}
      <div style={{
        backgroundColor: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        color: '#92400e',
        fontSize: '0.88rem'
      }}>
        <AlertCircle size={20} color="#d97706" style={{ marginTop: '2px', flexShrink: 0 }} />
        <div>
          <strong>{t('aiNoticeHeading')}</strong> {t('aiNoticeDesc')}
        </div>
      </div>

      {/* Selector Toolbar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label className="form-label">{t('selectCropAnalyze')}</label>
            <select
              className="form-select"
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
            >
              {crops.map((c) => (
                <option key={c} value={c}>{getCropDisplayName(c, language)}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: '1 1 200px' }}>
            <label className="form-label">{t('regionMandiZone')}</label>
            <select
              className="form-select"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="Tamil Nadu (Chennai / Northern Mandis)">Chennai & Northern Mandis</option>
              <option value="Tamil Nadu (Madurai / Southern Mandis)">Madurai & Southern Mandis</option>
              <option value="Tamil Nadu (Salem & Western Agro-Climatic Zone)">Salem & Western Mandis</option>
            </select>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchPredictions} />}

      {loading ? (
        <LoadingSpinner message={t('loading')} />
      ) : (
        <div className="grid-2">
          {/* Price Prediction Box */}
          {priceData && (
            <div className="card" style={{ padding: '2rem', borderTop: '4px solid #16a34a' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={22} color="#16a34a" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                    {t('projectedPriceCorridor')}
                  </h3>
                </div>
                <span className="badge badge-success">{priceData.confidence_level}</span>
              </div>

              <div style={{ backgroundColor: '#f0fdf4', padding: '1.25rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #bbf7d0', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.82rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>
                  {t('expectedPriceRangeLabel')} ({getCropDisplayName(selectedCrop, language)})
                </span>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#15803d', marginTop: '0.2rem' }}>
                  {priceData.estimated_price_range}
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1rem' }}>
                {priceData.note}
              </p>
            </div>
          )}

          {/* Demand Prediction Box */}
          {demandData && (
            <div className="card" style={{ padding: '2rem', borderTop: '4px solid #2563eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BarChart2 size={22} color="#2563eb" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                    {t('marketDemandForecast')}
                  </h3>
                </div>
                <span className="badge badge-info">{demandData.demand_level}</span>
              </div>

              <div style={{ backgroundColor: '#eff6ff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #bfdbfe', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.82rem', color: '#1e40af', fontWeight: 700, textTransform: 'uppercase' }}>
                  {t('marketSentimentLabel')}
                </span>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e3a8a', marginTop: '0.2rem' }}>
                  {demandData.market_sentiment}
                </h4>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block', marginBottom: '0.25rem' }}>
                  {t('advisoryRecommendationLabel')}
                </strong>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                  {demandData.recommendation}
                </p>
              </div>

              <p style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>
                {demandData.note}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
