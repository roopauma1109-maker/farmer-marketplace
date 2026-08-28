import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle,
  Eye,
  AlertTriangle,
  MapPin,
  Calendar
} from 'lucide-react';
import { cropsAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Sidebar } from '../components/Sidebar';
import { Modal } from '../components/Modal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { getCropKey, getCropImage, getCropDisplayName } from '../utils/cropRegistry';

export const FarmerMyCropsPage = () => {
  const { t, language } = useLanguage();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit modal state
  const [editTarget, setEditTarget] = useState(null);
  const [editFormData, setEditFormData] = useState({
    crop_name: '',
    quantity: '',
    unit: 'kg',
    price: '',
    location: '',
    availability: 'Available',
    description: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchMyCrops = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await cropsAPI.getMy();
      setCrops(data);
    } catch (err) {
      setError(err.message || 'Failed to load your crops.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCrops();
  }, []);

  const handleMarkSold = async (id) => {
    try {
      await cropsAPI.markSold(id);
      setSuccessMsg(t('cropSoldSuccess'));
      fetchMyCrops();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Could not update status.');
    }
  };

  const openDeleteModal = (crop) => {
    setDeleteTarget(crop);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await cropsAPI.delete(deleteTarget.id);
      setDeleteTarget(null);
      setSuccessMsg(t('cropDeletedSuccess'));
      fetchMyCrops();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete crop listing.');
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = (crop) => {
    setEditTarget(crop);
    setEditFormData({
      crop_name: crop.crop_name,
      quantity: crop.quantity,
      unit: crop.unit,
      price: crop.price,
      location: crop.location,
      availability: crop.availability,
      description: crop.description || ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editTarget) return;
    setIsUpdating(true);
    try {
      await cropsAPI.update(editTarget.id, {
        crop_name: editFormData.crop_name,
        quantity: Number(editFormData.quantity),
        unit: editFormData.unit,
        price: Number(editFormData.price),
        location: editFormData.location,
        availability: editFormData.availability,
        description: editFormData.description
      });
      setEditTarget(null);
      setSuccessMsg(t('cropUpdatedSuccess'));
      fetchMyCrops();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update crop.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container main-content">
      <div className="dashboard-layout">
        <Sidebar />

        <div className="dashboard-main">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
                {t('myCropsTitle')}
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                {t('myCropsSubtitle')}
              </p>
            </div>
            <Link to="/farmer/add-crop" className="btn btn-primary">
              <PlusCircle size={18} />
              <span>{t('navAddCrop')}</span>
            </Link>
          </div>

          {/* Feedback messages */}
          {error && <ErrorMessage message={error} onRetry={fetchMyCrops} />}
          {successMsg && (
            <div style={{
              backgroundColor: '#dcfce7',
              border: '1px solid #bbf7d0',
              color: '#15803d',
              padding: '0.85rem 1.25rem',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          {loading ? (
            <LoadingSpinner message={t('loading')} />
          ) : crops.length === 0 ? (
            <EmptyState
              icon={Package}
              title={t('noCropsDashboard')}
              message={t('noCropsDashboardDesc')}
              actionText={t('navAddCrop')}
              onAction={() => window.location.href = '/farmer/add-crop'}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {crops.map((crop) => {
                const cropKey = getCropKey(crop.crop_name);
                const imageSrc = getCropImage(cropKey, crop.image_url);
                const displayName = getCropDisplayName(cropKey, language) || crop.crop_name;

                return (
                  <div
                    key={crop.id}
                    className="card"
                    style={{
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1.25rem'
                    }}
                  >
                    {/* Left: Image & Details */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: '1 1 320px' }}>
                      <img
                        src={imageSrc}
                        alt={displayName}
                        style={{ width: '72px', height: '72px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }}
                        onError={(e) => { e.target.src = getCropImage(cropKey); }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                            {displayName}
                          </h3>
                          <span className={`badge ${crop.availability === 'Available' ? 'badge-available' : crop.availability === 'Sold' ? 'badge-sold' : 'badge-negotiation'}`}>
                            {crop.availability === 'Available' ? t('available') : crop.availability === 'Sold' ? t('sold') : t('underNegotiation')}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem', color: '#64748b', flexWrap: 'wrap' }}>
                          <span>{t('quantity')}: <strong style={{ color: '#0f172a' }}>{crop.quantity} {crop.unit}</strong></span>
                          <span>{t('colPrice')}: <strong style={{ color: '#15803d' }}>₹{crop.price}/{crop.unit}</strong></span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <MapPin size={13} color="#16a34a" />
                            {crop.location}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Calendar size={13} />
                            {new Date(crop.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <Link to={`/crop/${crop.id}`} className="btn btn-sm btn-secondary" title={t('view')}>
                        <Eye size={15} />
                        <span>{t('view')}</span>
                      </Link>

                      <button
                        onClick={() => openEditModal(crop)}
                        className="btn btn-sm btn-outline"
                        title={t('edit')}
                      >
                        <Edit size={15} />
                        <span>{t('edit')}</span>
                      </button>

                      {crop.availability !== 'Sold' && (
                        <button
                          onClick={() => handleMarkSold(crop.id)}
                          className="btn btn-sm btn-secondary"
                          title={t('markAsSold')}
                        >
                          <CheckCircle size={15} color="#16a34a" />
                          <span>{t('markAsSold')}</span>
                        </button>
                      )}

                      <button
                        onClick={() => openDeleteModal(crop)}
                        className="btn btn-sm btn-danger"
                        title={t('delete')}
                      >
                        <Trash2 size={15} />
                        <span>{t('delete')}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title={t('confirmDeleteTitle')}>
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            <AlertTriangle size={28} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            {t('deleteCropPrompt')}
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {t('deleteCropDesc')}
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              className="btn btn-secondary"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              {t('cancel')}
            </button>
            <button
              className="btn btn-danger"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? t('deleting') : t('confirmDeleteBtn')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Crop Modal */}
      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title={t('editCrop')}>
        <form onSubmit={handleEditSubmit}>
          <div className="form-group">
            <label className="form-label">{t('cropName')} *</label>
            <input
              type="text"
              className="form-input"
              value={editFormData.crop_name}
              onChange={(e) => setEditFormData({ ...editFormData, crop_name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">{t('quantity')} *</label>
              <input
                type="number"
                step="any"
                className="form-input"
                value={editFormData.quantity}
                onChange={(e) => setEditFormData({ ...editFormData, quantity: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t('unit')}</label>
              <select
                className="form-select"
                value={editFormData.unit}
                onChange={(e) => setEditFormData({ ...editFormData, unit: e.target.value })}
              >
                <option value="kg">kg ({t('unitKg')})</option>
                <option value="quintal">quintal ({t('unitQuintal')})</option>
                <option value="ton">ton ({t('unitTon')})</option>
                <option value="bag">bag ({t('unitBag')})</option>
                <option value="box">box ({t('unitBox')})</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">{t('expectedPrice')} *</label>
              <input
                type="number"
                step="any"
                className="form-input"
                value={editFormData.price}
                onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t('availability')}</label>
              <select
                className="form-select"
                value={editFormData.availability}
                onChange={(e) => setEditFormData({ ...editFormData, availability: e.target.value })}
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
              className="form-input"
              value={editFormData.location}
              onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('description')}</label>
            <textarea
              className="form-textarea"
              rows="3"
              value={editFormData.description}
              onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditTarget(null)}
              disabled={isUpdating}
              style={{ flex: 1 }}
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isUpdating}
              style={{ flex: 2 }}
            >
              {isUpdating ? t('saving') : t('saveChanges')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
