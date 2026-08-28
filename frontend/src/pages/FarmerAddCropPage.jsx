import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { cropsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sidebar } from '../components/Sidebar';
import { FarmerPriceComparison } from '../components/FarmerPriceComparison';
import { ErrorMessage } from '../components/ErrorMessage';
import { CROP_IMAGE_MAP } from '../utils/cropRegistry';

export const FarmerAddCropPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    crop_name: '',
    quantity: '',
    unit: 'kg',
    price: '',
    location: user?.location || 'Tambaram, Tamil Nadu',
    availability: 'Available',
    description: '',
    image_url: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Suggested preset verified photos for farmers
  const sampleImages = [
    { label: 'Tomato', url: CROP_IMAGE_MAP.tomato },
    { label: 'Brinjal', url: CROP_IMAGE_MAP.brinjal },
    { label: 'Drumstick', url: CROP_IMAGE_MAP.drumstick },
    { label: 'Onion', url: CROP_IMAGE_MAP.onion },
    { label: 'Potato', url: CROP_IMAGE_MAP.potato },
    { label: 'Chilli', url: CROP_IMAGE_MAP.chilli },
    { label: 'Banana', url: CROP_IMAGE_MAP.banana },
    { label: 'Carrot', url: CROP_IMAGE_MAP.carrot },
    { label: 'Cabbage', url: CROP_IMAGE_MAP.cabbage },
    { label: 'Paddy', url: CROP_IMAGE_MAP.paddy }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.crop_name.trim() || !formData.quantity || !formData.price || !formData.location.trim()) {
      setError('Please fill in all required fields marked with *');
      return;
    }

    if (Number(formData.quantity) <= 0 || Number(formData.price) <= 0) {
      setError('Quantity and price must be positive numbers.');
      return;
    }

    try {
      setSubmitting(true);
      await cropsAPI.create({
        crop_name: formData.crop_name.trim(),
        quantity: Number(formData.quantity),
        unit: formData.unit,
        price: Number(formData.price),
        location: formData.location.trim(),
        availability: formData.availability,
        description: formData.description.trim() || null,
        image_url: formData.image_url.trim() || null
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/farmer/crops');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to list crop. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container main-content">
      <div className="dashboard-layout">
        <Sidebar />

        <div className="dashboard-main">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
                {t('addCropTitle')}
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                {t('addCropSubtitle')}
              </p>
            </div>
            <Link to="/farmer/crops" className="btn btn-secondary btn-sm">
              <ArrowLeft size={16} />
              <span>{t('backToMyCrops')}</span>
            </Link>
          </div>

          {error && <ErrorMessage message={error} />}

          {success && (
            <div style={{
              backgroundColor: '#dcfce7',
              border: '1.5px solid #bbf7d0',
              color: '#15803d',
              padding: '1.25rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              textAlign: 'center',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem'
            }}>
              <CheckCircle size={22} />
              <span>{t('cropAddedSuccess')} {t('redirectingInventory')}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
            {/* Form */}
            <div className="card" style={{ padding: '2rem' }}>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">{t('cropName')} *</label>
                  <input
                    type="text"
                    name="crop_name"
                    className="form-input"
                    placeholder={t('cropNamePlaceholder')}
                    value={formData.crop_name}
                    onChange={handleChange}
                    disabled={submitting || success}
                    required
                  />
                  <span className="form-hint">{t('cropNameHint')}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">{t('quantity')} *</label>
                    <input
                      type="number"
                      step="any"
                      name="quantity"
                      className="form-input"
                      placeholder="e.g. 500"
                      value={formData.quantity}
                      onChange={handleChange}
                      disabled={submitting || success}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('unit')} *</label>
                    <select
                      name="unit"
                      className="form-select"
                      value={formData.unit}
                      onChange={handleChange}
                      disabled={submitting || success}
                    >
                      <option value="kg">kg ({t('unitKg')})</option>
                      <option value="quintal">quintal ({t('unitQuintal')})</option>
                      <option value="ton">ton ({t('unitTon')})</option>
                      <option value="bag">bag ({t('unitBag')})</option>
                      <option value="box">box ({t('unitBox')})</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">{t('expectedPrice')} *</label>
                    <input
                      type="number"
                      step="any"
                      name="price"
                      className="form-input"
                      placeholder="e.g. 24"
                      value={formData.price}
                      onChange={handleChange}
                      disabled={submitting || success}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('availability')}</label>
                    <select
                      name="availability"
                      className="form-select"
                      value={formData.availability}
                      onChange={handleChange}
                      disabled={submitting || success}
                    >
                      <option value="Available">{t('available')}</option>
                      <option value="Under Negotiation">{t('underNegotiation')}</option>
                      <option value="Sold">{t('sold')}</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('cropLocation')} *</label>
                  <input
                    type="text"
                    name="location"
                    className="form-input"
                    placeholder="e.g. Tambaram, Chengalpattu"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={submitting || success}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('description')}</label>
                  <textarea
                    name="description"
                    className="form-textarea"
                    rows="3"
                    placeholder={t('descriptionPlaceholder')}
                    value={formData.description}
                    onChange={handleChange}
                    disabled={submitting || success}
                  ></textarea>
                </div>

                {/* Crop Photo URL with Sample Presets */}
                <div className="form-group">
                  <label className="form-label">{t('imageUrl')}</label>
                  <input
                    type="url"
                    name="image_url"
                    className="form-input"
                    placeholder={t('imageUrlPlaceholder')}
                    value={formData.image_url}
                    onChange={handleChange}
                    disabled={submitting || success}
                  />
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', alignSelf: 'center' }}>{t('quickPhoto')}</span>
                    {sampleImages.map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        className="btn btn-sm btn-secondary"
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                        onClick={() => setFormData({ ...formData, image_url: s.url })}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-lg"
                  disabled={submitting || success}
                  style={{ marginTop: '1.25rem' }}
                >
                  <PlusCircle size={20} />
                  <span>{submitting ? t('listingCrop') : t('submitCrop')}</span>
                </button>
              </form>
            </div>

            {/* Real-time Mandi Market Price Guidance Panel */}
            <div>
              <FarmerPriceComparison
                cropName={formData.crop_name}
                expectedPrice={formData.price ? Number(formData.price) : 0}
                district={formData.location}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
