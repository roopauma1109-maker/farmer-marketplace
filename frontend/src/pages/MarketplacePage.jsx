import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, PackageOpen } from 'lucide-react';
import { cropsAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { CropCard } from '../components/CropCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';

export const MarketplacePage = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [availability, setAvailability] = useState(searchParams.get('availability') || 'Available');

  const fetchCrops = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (location.trim()) params.location = location.trim();
      if (minPrice) params.min_price = Number(minPrice);
      if (maxPrice) params.max_price = Number(maxPrice);
      if (availability) params.availability = availability;

      const data = await cropsAPI.getAll(params);
      setCrops(data);
    } catch (err) {
      setError(err.message || 'Failed to load crops from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, [availability]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCrops();
  };

  const handleClearFilters = () => {
    setSearch('');
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setAvailability('');
    setSearchParams({});
    cropsAPI.getAll({}).then(setCrops).catch(console.error);
  };

  return (
    <div className="container main-content">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
          {t('marketplaceTitle')}
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>
          {t('marketplaceSubtitle')}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSearchSubmit}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <Search
                size={18}
                color="#94a3b8"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder={t('searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Location filter */}
            <div style={{ flex: '1 1 180px' }}>
              <input
                type="text"
                className="form-input"
                placeholder={t('filterLocation')}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Availability filter */}
            <div style={{ width: '170px' }}>
              <select
                className="form-select"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              >
                <option value="">{t('filterAvailability')}: {t('filterAll')}</option>
                <option value="Available">{t('available')}</option>
                <option value="Under Negotiation">{t('underNegotiation')}</option>
                <option value="Sold">{t('sold')}</option>
              </select>
            </div>

            {/* Search Button */}
            <button type="submit" className="btn btn-primary">
              <Search size={18} />
              <span>{t('searchBtn')}</span>
            </button>

            {/* Reset */}
            {(search || location || minPrice || maxPrice || availability) && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleClearFilters}
                title={t('clearFilters')}
              >
                <X size={16} />
                <span>{t('clearFilters')}</span>
              </button>
            )}
          </div>

          {/* Price Range Filters */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.85rem', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.88rem' }}>
            <span style={{ fontWeight: 600, color: '#475569' }}>{t('colPrice')}:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <input
                type="number"
                className="form-input"
                style={{ width: '120px', padding: '0.45rem 0.6rem' }}
                placeholder={t('filterMinPrice')}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span style={{ color: '#94a3b8' }}>–</span>
              <input
                type="number"
                className="form-input"
                style={{ width: '120px', padding: '0.45rem 0.6rem' }}
                placeholder={t('filterMaxPrice')}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </form>
      </div>

      {/* Main Content Area */}
      {error && <ErrorMessage message={error} onRetry={fetchCrops} />}

      {loading ? (
        <LoadingSpinner message={t('loading')} />
      ) : crops.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title={t('noCropsFound')}
          message={t('noCropsFoundDesc')}
          actionText={t('clearFilters')}
          onAction={handleClearFilters}
        />
      ) : (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
              {t('showingCount')} <strong>{crops.length}</strong> {t('cropListingsText')}
            </span>
          </div>

          <div className="grid-3">
            {crops.map((crop) => (
              <CropCard key={crop.id} crop={crop} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
