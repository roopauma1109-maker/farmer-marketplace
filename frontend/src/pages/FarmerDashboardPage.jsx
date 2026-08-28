import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  PlusCircle,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Eye,
  Edit
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { cropsAPI, enquiriesAPI, marketPricesAPI } from '../services/api';
import { Sidebar } from '../components/Sidebar';
import { DashboardCard } from '../components/DashboardCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { getCropKey, getCropImage, getCropDisplayName } from '../utils/cropRegistry';

export const FarmerDashboardPage = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const [myCrops, setMyCrops] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [latestPrice, setLatestPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        const [cropsData, enquiriesData, pricesData] = await Promise.all([
          cropsAPI.getMy(),
          enquiriesAPI.getFarmerEnquiries(),
          marketPricesAPI.getAll({})
        ]);

        setMyCrops(cropsData);
        setEnquiries(enquiriesData);
        if (pricesData && pricesData.length > 0) {
          setLatestPrice(pricesData[0]);
        }
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const activeCropsCount = myCrops.filter(c => c.availability === 'Available').length;
  const pendingEnquiriesCount = enquiries.filter(e => e.status === 'Pending').length;

  return (
    <div className="container main-content">
      <div className="dashboard-layout">
        {/* Sidebar */}
        <Sidebar />

        {/* Dashboard Main Content */}
        <div className="dashboard-main">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
                {t('dashboardTitle')}
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                {t('welcomeFarmer')}, <strong>{user?.name}</strong>. {t('dashboardSubtitle')}
              </p>
            </div>
            <Link to="/farmer/add-crop" className="btn btn-primary">
              <PlusCircle size={18} />
              <span>{t('navAddCrop')}</span>
            </Link>
          </div>

          {error && <ErrorMessage message={error} />}

          {loading ? (
            <LoadingSpinner message={t('loading')} />
          ) : (
            <>
              {/* 4 Metric Cards */}
              <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
                <DashboardCard
                  title={t('statTotalCrops')}
                  value={myCrops.length}
                  icon={Package}
                  color="#16a34a"
                  bg="#f0fdf4"
                  subtitle={t('statTotalSubtitle')}
                />
                <DashboardCard
                  title={t('statActiveListings')}
                  value={activeCropsCount}
                  icon={CheckCircle}
                  color="#0284c7"
                  bg="#f0f9ff"
                  subtitle={t('statActiveSubtitle')}
                />
                <DashboardCard
                  title={t('statBuyerEnquiries')}
                  value={enquiries.length}
                  icon={MessageSquare}
                  color="#d97706"
                  bg="#fffbeb"
                  subtitle={`${pendingEnquiriesCount} ${t('statEnquiriesSubtitle')}`}
                />
                <DashboardCard
                  title={t('statLatestMandi')}
                  value={latestPrice ? `₹${latestPrice.modal_price}/kg` : '₹22/kg'}
                  icon={TrendingUp}
                  color="#7c3aed"
                  bg="#f5f3ff"
                  subtitle={latestPrice ? `${getCropDisplayName(latestPrice.crop_name, language)} (${latestPrice.district})` : 'Mandi Rate'}
                />
              </div>

              {/* My Recent Crop Listings Section */}
              <div className="card" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                      {t('recentListingsTitle')}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      {t('recentListingsSubtitle')}
                    </p>
                  </div>
                  <Link to="/farmer/crops" className="btn btn-secondary btn-sm">
                    <span>{t('viewAll')}</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>

                {myCrops.length === 0 ? (
                  <EmptyState
                    icon={Package}
                    title={t('noCropsDashboard')}
                    message={t('noCropsDashboardDesc')}
                    actionText={t('navAddCrop')}
                    onAction={() => window.location.href = '/farmer/add-crop'}
                  />
                ) : (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>{t('colCrop')}</th>
                          <th>{t('colQuantity')}</th>
                          <th>{t('colPrice')}</th>
                          <th>{t('colLocation')}</th>
                          <th>{t('colStatus')}</th>
                          <th>{t('colActions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myCrops.slice(0, 5).map((crop) => {
                          const cropKey = getCropKey(crop.crop_name);
                          const imageSrc = getCropImage(cropKey, crop.image_url);
                          const displayName = getCropDisplayName(cropKey, language) || crop.crop_name;
                          return (
                            <tr key={crop.id}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  <img
                                    src={imageSrc}
                                    alt={displayName}
                                    style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                                    onError={(e) => { e.target.src = getCropImage(cropKey); }}
                                  />
                                  <div>
                                    <strong style={{ color: '#0f172a', display: 'block' }}>{displayName}</strong>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                      {t('listedOn')} {new Date(crop.created_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td>{crop.quantity} {crop.unit}</td>
                              <td>
                                <strong style={{ color: '#15803d' }}>₹{crop.price}</strong>/{crop.unit}
                              </td>
                              <td style={{ color: '#475569' }}>{crop.location}</td>
                              <td>
                                <span className={`badge ${crop.availability === 'Available' ? 'badge-available' : 'badge-sold'}`}>
                                  {crop.availability === 'Available' ? t('available') : crop.availability === 'Sold' ? t('sold') : t('underNegotiation')}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                  <Link to={`/crop/${crop.id}`} className="btn btn-sm btn-secondary" title={t('view')}>
                                    <Eye size={14} />
                                  </Link>
                                  <Link to={`/farmer/crops`} className="btn btn-sm btn-outline" title={t('edit')}>
                                    <Edit size={14} />
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Pending Buyer Enquiries Quick Widget */}
              {enquiries.length > 0 && (
                <div className="card" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                        {t('recentEnquiriesTitle')}
                      </h3>
                      <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                        {t('recentEnquiriesSubtitle')}
                      </p>
                    </div>
                    <Link to="/farmer/enquiries" className="btn btn-secondary btn-sm">
                      <span>{t('viewAllEnquiries')}</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {enquiries.slice(0, 3).map((enq) => {
                      const cropKey = getCropKey(enq.crop?.crop_name);
                      const cropName = getCropDisplayName(cropKey, language) || enq.crop?.crop_name || 'Crop';
                      return (
                        <div
                          key={enq.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem',
                            backgroundColor: '#f8fafc',
                            borderRadius: '10px',
                            border: '1px solid #e2e8f0'
                          }}
                        >
                          <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                              {enq.buyer?.name || 'Wholesale Buyer'} — {t('enquiryFor')} <strong>{cropName}</strong>
                            </h4>
                            <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '0.2rem' }}>
                              {t('requestedQtyLabel')} <strong>{enq.required_quantity} kg</strong> | "{enq.message.slice(0, 60)}..."
                            </p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span className={`badge ${enq.status === 'Accepted' ? 'badge-available' : enq.status === 'Rejected' ? 'badge-sold' : 'badge-negotiation'}`}>
                              {enq.status === 'Accepted' ? t('enquiryStatusAccepted') : enq.status === 'Rejected' ? t('enquiryStatusRejected') : t('enquiryStatusPending')}
                            </span>
                            <Link to="/farmer/enquiries" className="btn btn-sm btn-primary">
                              {t('reviewEnquiry')}
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
