import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, RefreshCw } from 'lucide-react';
import { marketPricesAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { MarketPriceCard } from '../components/MarketPriceCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { getCropDisplayName } from '../utils/cropRegistry';

export const MarketPricesPage = () => {
  const { t, language } = useLanguage();
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState('');
  const [crop, setCrop] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

  const fetchPrices = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (district.trim()) params.district = district.trim();
      if (crop.trim()) params.crop = crop.trim();

      const data = await marketPricesAPI.getAll(params);
      setPrices(data);
    } catch (err) {
      setError(err.message || 'Failed to load government market prices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [district, crop]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPrices();
  };

  const handleClear = () => {
    setSearch('');
    setDistrict('');
    setCrop('');
    marketPricesAPI.getAll({}).then(setPrices).catch(console.error);
  };

  // Distinct districts from dataset
  const districts = ['Chennai', 'Madurai', 'Salem', 'Coimbatore', 'Tiruchirappalli', 'Erode', 'Thanjavur'];
  const commonCrops = ['Tomato', 'Onion', 'Potato', 'Brinjal', 'Banana', 'Carrot', 'Cabbage', 'Green Chilli', 'Turmeric', 'Paddy', 'Drumstick'];

  return (
    <div className="container main-content">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            <TrendingUp size={16} />
            <span>{t('agmarknetFeedBadge')}</span>
          </div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
            {t('marketPricesTitle')}
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            {t('marketPricesSubtitle')}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
            className="btn btn-secondary btn-sm"
          >
            {viewMode === 'cards' ? t('switchToTableView') : t('switchToCardsView')}
          </button>
          <button onClick={fetchPrices} className="btn btn-primary btn-sm" title={t('refreshBtn')}>
            <RefreshCw size={15} />
            <span>{t('refreshBtn')}</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSearchSubmit}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 250px' }}>
              <Search
                size={18}
                color="#94a3b8"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder={t('searchMandi')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Quick Crop Selector */}
            <div style={{ width: '170px' }}>
              <select
                className="form-select"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
              >
                <option value="">{t('allCropsOption')}</option>
                {commonCrops.map(c => (
                  <option key={c} value={c}>{getCropDisplayName(c, language)}</option>
                ))}
              </select>
            </div>

            {/* District Selector */}
            <div style={{ width: '180px' }}>
              <select
                className="form-select"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                <option value="">{t('allDistrictsOption')}</option>
                {districts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button type="submit" className="btn btn-primary">
              <Search size={18} />
              <span>{t('filterBtn')}</span>
            </button>

            {(search || district || crop) && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleClear}
              >
                {t('clearFilters')}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Content */}
      {error && <ErrorMessage message={error} onRetry={fetchPrices} />}

      {loading ? (
        <LoadingSpinner message={t('loading')} />
      ) : prices.length === 0 ? (
        <EmptyState
          title={t('noMarketPrices')}
          message={t('noMarketPricesDesc')}
          actionText={t('clearFilters')}
          onAction={handleClear}
        />
      ) : viewMode === 'cards' ? (
        <div className="grid-3">
          {prices.map((price) => (
            <MarketPriceCard key={price.id} priceRecord={price} />
          ))}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>{t('colCrop')}</th>
                <th>{t('marketName')}</th>
                <th>{t('districtName')}</th>
                <th>{t('minPrice')}</th>
                <th>{t('maxPrice')}</th>
                <th>{t('modalPrice')}</th>
                <th>Source</th>
                <th>{t('dateLabel')}</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((p) => {
                const cropDisplayName = getCropDisplayName(p.crop_name, language) || p.crop_name;
                return (
                  <tr key={p.id}>
                    <td><strong style={{ color: '#0f172a' }}>{cropDisplayName}</strong></td>
                    <td>{p.market}</td>
                    <td>{p.district}</td>
                    <td style={{ color: '#64748b' }}>₹{p.min_price}/{p.unit}</td>
                    <td style={{ color: '#64748b' }}>₹{p.max_price}/{p.unit}</td>
                    <td>
                      <span style={{ fontWeight: 800, color: '#15803d', backgroundColor: '#f0fdf4', padding: '0.25rem 0.5rem', borderRadius: '6px' }}>
                        ₹{p.modal_price}/{p.unit}
                      </span>
                    </td>
                    <td><span className="badge badge-info" style={{ fontSize: '0.72rem' }}>{p.source}</span></td>
                    <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{p.price_date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
