import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  User,
  Calendar,
  Package,
  Phone,
  MessageSquare,
  CheckCircle,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { cropsAPI, enquiriesAPI, marketPricesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Modal } from '../components/Modal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { getCropKey, getCropImage, getCropDisplayName } from '../utils/cropRegistry';

export const CropDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const { t, language } = useLanguage();

  const [crop, setCrop] = useState(null);
  const [mandiComparison, setMandiComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Contact farmer reveal
  const [showContact, setShowContact] = useState(false);

  // Enquiry modal state
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [requiredQty, setRequiredQty] = useState('');
  const [enquiryMsg, setEnquiryMsg] = useState('');
  const [enquirySending, setEnquirySending] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryError, setEnquiryError] = useState('');

  useEffect(() => {
    const fetchCropDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await cropsAPI.getById(id);
        setCrop(data);

        // Fetch Mandi benchmark for this crop
        try {
          const comp = await marketPricesAPI.compare(data.crop_name, data.price, data.location);
          setMandiComparison(comp);
        } catch (e) {
          console.warn('Mandi comparison failed:', e);
        }
      } catch (err) {
        setError(err.message || 'Crop not found or could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    fetchCropDetails();
  }, [id]);

  const cropKey = crop ? getCropKey(crop.crop_name) : 'default';
  const imageSrc = crop ? getCropImage(cropKey, crop.image_url) : '';
  const displayName = crop ? (getCropDisplayName(cropKey, language) || crop.crop_name) : '';

  const handleOpenEnquiry = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/crop/${id}` } } });
      return;
    }
    if (role !== 'buyer') {
      alert('Only registered buyers can send purchase enquiries. Please switch to or register a buyer account.');
      return;
    }
    setRequiredQty(crop.quantity ? String(Math.min(crop.quantity, 100)) : '50');
    setEnquiryMsg(`Vanakkam, I am interested in purchasing ${displayName}. Please let me know pickup/delivery terms.`);
    setEnquirySuccess(false);
    setEnquiryError('');
    setIsEnquiryOpen(true);
  };

  const handleSendEnquiry = async (e) => {
    e.preventDefault();
    setEnquiryError('');

    if (!requiredQty || Number(requiredQty) <= 0) {
      setEnquiryError('Please enter a valid required quantity.');
      return;
    }
    if (!enquiryMsg.trim()) {
      setEnquiryError('Please provide a message for the farmer.');
      return;
    }

    try {
      setEnquirySending(true);
      await enquiriesAPI.create({
        crop_id: crop.id,
        required_quantity: Number(requiredQty),
        message: enquiryMsg.trim(),
      });
      setEnquirySuccess(true);
      setTimeout(() => {
        setIsEnquiryOpen(false);
        setEnquirySuccess(false);
      }, 2500);
    } catch (err) {
      setEnquiryError(err.message || 'Failed to send enquiry.');
    } finally {
      setEnquirySending(false);
    }
  };

  if (loading) return <div className="container main-content"><LoadingSpinner message={t('loading')} /></div>;
  if (error || !crop) return <div className="container main-content"><ErrorMessage message={error || 'Crop details unavailable.'} /></div>;

  return (
    <div className="container main-content">
      {/* Back Button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/marketplace" className="btn btn-sm btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowLeft size={16} />
          <span>{t('backToMarketplace')}</span>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '2.5rem' }}>
        {/* Left Column: Image and Description */}
        <div>
          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '1.5rem'
          }}>
            <img
              src={imageSrc}
              alt={displayName}
              style={{ width: '100%', height: '360px', objectFit: 'cover' }}
              onError={(e) => { e.target.src = getCropImage(cropKey); }}
            />
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
              {t('cropDescQuality')}
            </h3>
            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {crop.description || t('defaultCropDesc')}
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#64748b' }}>
                <Calendar size={16} color="#16a34a" />
                <span>{t('listedOn')}: <strong>{new Date(crop.created_at).toLocaleDateString()}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#64748b' }}>
                <CheckCircle size={16} color="#16a34a" />
                <span>{t('colStatus')}: <strong>{crop.availability}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Key Details, Price Comparison, Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Main Price & Title Box */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className={`badge ${crop.availability === 'Available' ? 'badge-available' : 'badge-sold'}`}>
                {crop.availability}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#64748b' }}>
                <MapPin size={15} color="#16a34a" />
                <span>{crop.location}</span>
              </div>
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', lineHeight: 1.2 }}>
              {displayName}
            </h1>

            {/* Price Box */}
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1.5px solid #bbf7d0',
              padding: '1.25rem 1.5rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                  {t('farmerDirectPrice')}
                </span>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#15803d', lineHeight: 1 }}>
                  ₹{crop.price}
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: '#166534' }}> /{crop.unit}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>{t('totalQuantity')}</span>
                <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {crop.quantity} {crop.unit}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <button
                onClick={handleOpenEnquiry}
                className="btn btn-primary btn-lg btn-block"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}
              >
                <MessageSquare size={20} />
                <span>{t('sendEnquiry')}</span>
              </button>

              <button
                onClick={() => setShowContact(!showContact)}
                className="btn btn-secondary btn-block"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}
              >
                <Phone size={18} color="#16a34a" />
                <span>{showContact ? t('hideContactInfo') : t('contactFarmer')}</span>
              </button>

              {/* Reveal Farmer Phone/Contact */}
              {showContact && (
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '1rem',
                  marginTop: '0.5rem',
                  fontSize: '0.9rem'
                }}>
                  <p style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                    {t('farmerContactLine')}
                  </p>
                  <p style={{ color: '#16a34a', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                    +91 98765 43210
                  </p>
                  <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {t('contactMentionNote')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Farmer Details Box */}
          {crop.farmer && (
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <ShieldCheck size={20} color="#16a34a" />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                  {t('aboutFarmer')}
                </h4>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#f0fdf4',
                  border: '1.5px solid #bbf7d0',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.2rem'
                }}>
                  {crop.farmer.name[0]}
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{crop.farmer.name}</h4>
                  <p style={{ fontSize: '0.82rem', color: '#64748b' }}>{crop.farmer.location || crop.location}</p>
                </div>
              </div>
            </div>
          )}

          {/* Mandi Benchmark Price Comparison Card */}
          {mandiComparison && mandiComparison.market_found && (
            <div className="card" style={{ backgroundColor: '#f0fdf4', border: '1.5px solid #bbf7d0', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <TrendingUp size={18} color="#16a34a" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#166534' }}>
                  {t('govMandiBenchmark')}
                </h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#14532d', marginBottom: '0.75rem', fontWeight: 500 }}>
                {mandiComparison.status_message}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#166534', borderTop: '1px solid #dcfce7', paddingTop: '0.5rem' }}>
                <span>{t('mandiRangeLabel')} <strong>₹{mandiComparison.min_price} – ₹{mandiComparison.max_price}/{mandiComparison.unit}</strong></span>
                <span>{t('marketLabel')} <strong>{mandiComparison.market}</strong></span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enquiry Modal */}
      <Modal isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} title={t('enquiryModalTitle')}>
        {enquirySuccess ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle size={48} color="#16a34a" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              {t('enquirySentSuccess')}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              {t('enquirySuccessDesc')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendEnquiry}>
            {enquiryError && <ErrorMessage message={enquiryError} />}

            <div className="form-group">
              <label className="form-label">{t('cropName')}</label>
              <input type="text" className="form-input" value={displayName} disabled style={{ backgroundColor: '#f8fafc' }} />
            </div>

            <div className="form-group">
              <label className="form-label">{t('requiredQuantity')} ({crop.unit}) *</label>
              <input
                type="number"
                step="any"
                className="form-input"
                placeholder="e.g. 100"
                value={requiredQty}
                onChange={(e) => setRequiredQty(e.target.value)}
                disabled={enquirySending}
                required
              />
              <span className="form-hint">{t('availableStockLabel')} {crop.quantity} {crop.unit}</span>
            </div>

            <div className="form-group">
              <label className="form-label">{t('enquiryMessage')} *</label>
              <textarea
                className="form-textarea"
                rows="4"
                placeholder={t('enquiryPlaceholder')}
                value={enquiryMsg}
                onChange={(e) => setEnquiryMsg(e.target.value)}
                disabled={enquirySending}
                required
              ></textarea>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsEnquiryOpen(false)}
                disabled={enquirySending}
                style={{ flex: 1 }}
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={enquirySending}
                style={{ flex: 2 }}
              >
                {enquirySending ? t('submittingEnquiry') : t('sendEnquiryBtn')}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
