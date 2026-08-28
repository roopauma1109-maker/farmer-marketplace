import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  TrendingUp,
  Smartphone,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  ShoppingBag,
  ChevronRight
} from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { marketPricesAPI, cropsAPI } from '../services/api';
import { CropCard } from '../components/CropCard';
import { MarketPriceCard } from '../components/MarketPriceCard';

export const LandingPage = () => {
  const { t } = useLanguage();
  const { isAuthenticated, role } = useAuth();

  const [featuredCrops, setFeaturedCrops] = useState([]);
  const [mandiHighlights, setMandiHighlights] = useState([]);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const crops = await cropsAPI.getAll({
          availability: 'Available'
        });

        setFeaturedCrops(crops.slice(0, 3));

        const prices = await marketPricesAPI.getAll({});
        setMandiHighlights(prices.slice(0, 3));
      } catch (err) {
        console.warn(
          'Could not load landing page sample data:',
          err
        );
      }
    };

    loadHomeData();
  }, []);

  return (
    <div>

      {/* =========================
          HERO SECTION
      ========================= */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">

            <div>

              <h1 className="hero-title">
                {t('heroTitle')}
              </h1>

              <p className="hero-subtitle">
                {t('heroSubtitle')}
              </p>

              {/* HERO BUTTONS */}
              <div className="hero-buttons">

                <Link
                  to="/marketplace"
                  className="btn btn-lg btn-primary"
                >
                  <ShoppingBag size={20} />
                  <span>
                    {t('exploreMarketplace')}
                  </span>
                </Link>

                {isAuthenticated ? (
                  role === 'farmer' ? (
                    <Link
                      to="/farmer/dashboard"
                      className="btn btn-lg btn-secondary"
                    >
                      <span>
                        {t('navDashboard')}
                      </span>

                      <ArrowRight size={18} />
                    </Link>
                  ) : (
                    <Link
                      to="/buyer/profile"
                      className="btn btn-lg btn-secondary"
                    >
                      <span>
                        {t('navProfile')}
                      </span>

                      <ArrowRight size={18} />
                    </Link>
                  )
                ) : (
                  <Link
                    to="/register"
                    className="btn btn-lg btn-secondary"
                  >
                    <span>
                      {t('joinAsFarmer')}
                    </span>

                    <ArrowRight size={18} />
                  </Link>
                )}

              </div>

              {/* =========================
                  TRUST INDICATORS
              ========================= */}
              <div
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  marginTop: '2.5rem',
                  flexWrap: 'wrap'
                }}
              >

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#334155'
                  }}
                >
                  <CheckCircle
                    size={16}
                    color="#16a34a"
                  />

                  <span>
                    {t('trustNoMiddlemen')}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#334155'
                  }}
                >
                  <CheckCircle
                    size={16}
                    color="#16a34a"
                  />

                  <span>
                    {t('trustGovData')}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#334155'
                  }}
                >
                  <CheckCircle
                    size={16}
                    color="#16a34a"
                  />

                  <span>
                    {t('trustBilingual')}
                  </span>
                </div>

              </div>

            </div>

            {/* =========================
                HERO IMAGE
            ========================= */}
            <div className="hero-image-wrapper">

              <img
                src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800&auto=format&fit=crop&q=80"
                alt="Direct Farmer to Buyer Agriculture Marketplace"
              />

              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                  backgroundColor:
                    'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(4px)',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-md)'
                }}
              >

                <div>

                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#16a34a',
                      textTransform: 'uppercase'
                    }}
                  >
                    {t('heroBadgeTitle')}
                  </span>

                  <p
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      margin: 0
                    }}
                  >
                    {t('heroBadgeSubtitle')}
                  </p>

                </div>

                <Link
                  to="/marketplace"
                  style={{
                    color: '#16a34a',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <ChevronRight size={22} />
                </Link>

              </div>

            </div>

          </div>
        </div>
      </section>


      {/* =========================
          BENEFITS SECTION
      ========================= */}
      <section
        style={{
          padding: '4.5rem 0',
          backgroundColor: '#ffffff'
        }}
      >
        <div className="container">

          <div
            style={{
              textAlign: 'center',
              marginBottom: '3rem'
            }}
          >

            <h2
              style={{
                fontSize: '2.1rem',
                fontWeight: 800,
                color: '#0f172a',
                marginBottom: '0.5rem'
              }}
            >
              {t('benefitsTitle')}
            </h2>

            <p
              style={{
                color: '#64748b',
                fontSize: '1rem',
                maxWidth: '600px',
                margin: '0 auto'
              }}
            >
              {t('benefitsSubtitle')}
            </p>

          </div>


          <div className="grid-4">

            {/* BENEFIT 1 */}
            <div
              className="card"
              style={{
                borderTop: '4px solid #16a34a'
              }}
            >

              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '10px',
                  backgroundColor: '#f0fdf4',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <Users size={24} />
              </div>

              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  color: '#0f172a'
                }}
              >
                {t('benefit1Title')}
              </h3>

              <p
                style={{
                  fontSize: '0.88rem',
                  color: '#64748b',
                  lineHeight: 1.5
                }}
              >
                {t('benefit1Desc')}
              </p>

            </div>


            {/* BENEFIT 2 */}
            <div
              className="card"
              style={{
                borderTop: '4px solid #16a34a'
              }}
            >

              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '10px',
                  backgroundColor: '#f0fdf4',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <ShieldCheck size={24} />
              </div>

              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  color: '#0f172a'
                }}
              >
                {t('benefit2Title')}
              </h3>

              <p
                style={{
                  fontSize: '0.88rem',
                  color: '#64748b',
                  lineHeight: 1.5
                }}
              >
                {t('benefit2Desc')}
              </p>

            </div>


            {/* BENEFIT 3 */}
            <div
              className="card"
              style={{
                borderTop: '4px solid #16a34a'
              }}
            >

              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '10px',
                  backgroundColor: '#f0fdf4',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <TrendingUp size={24} />
              </div>

              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  color: '#0f172a'
                }}
              >
                {t('benefit3Title')}
              </h3>

              <p
                style={{
                  fontSize: '0.88rem',
                  color: '#64748b',
                  lineHeight: 1.5
                }}
              >
                {t('benefit3Desc')}
              </p>

            </div>


            {/* BENEFIT 4 */}
            <div
              className="card"
              style={{
                borderTop: '4px solid #16a34a'
              }}
            >

              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '10px',
                  backgroundColor: '#f0fdf4',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <Smartphone size={24} />
              </div>

              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  color: '#0f172a'
                }}
              >
                {t('benefit4Title')}
              </h3>

              <p
                style={{
                  fontSize: '0.88rem',
                  color: '#64748b',
                  lineHeight: 1.5
                }}
              >
                {t('benefit4Desc')}
              </p>

            </div>

          </div>
        </div>
      </section>


      {/* =========================
          HOW IT WORKS
      ========================= */}
      <section
        style={{
          padding: '4.5rem 0',
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2e8f0'
        }}
      >
        <div className="container">

          <div
            style={{
              textAlign: 'center',
              marginBottom: '3rem'
            }}
          >

            <h2
              style={{
                fontSize: '2.1rem',
                fontWeight: 800,
                color: '#0f172a',
                marginBottom: '0.5rem'
              }}
            >
              {t('howItWorksTitle')}
            </h2>

            <p
              style={{
                color: '#64748b',
                fontSize: '1rem'
              }}
            >
              {t('howItWorksSubtitle')}
            </p>

          </div>


          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap'
            }}
          >

            {[
              {
                num: '1',
                title: t('step1'),
                desc: t('step1Desc')
              },
              {
                num: '2',
                title: t('step2'),
                desc: t('step2Desc')
              },
              {
                num: '3',
                title: t('step3'),
                desc: t('step3Desc')
              },
              {
                num: '4',
                title: t('step4'),
                desc: t('step4Desc')
              },
              {
                num: '5',
                title: t('step5'),
                desc: t('step5Desc')
              }
            ].map((step, idx) => (

              <div
                key={idx}
                className="card"
                style={{
                  flex: '1 1 200px',
                  minWidth: '190px',
                  textAlign: 'center',
                  padding: '1.5rem 1rem'
                }}
              >

                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    margin: '0 auto 0.75rem auto'
                  }}
                >
                  {step.num}
                </div>

                <h4
                  style={{
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    marginBottom: '0.35rem'
                  }}
                >
                  {step.title}
                </h4>

                <p
                  style={{
                    fontSize: '0.8rem',
                    color: '#64748b',
                    lineHeight: 1.4
                  }}
                >
                  {step.desc}
                </p>

              </div>

            ))}

          </div>

        </div>
      </section>


      {/* =========================
          FEATURED CROPS
      ========================= */}
      {featuredCrops.length > 0 && (

        <section
          style={{
            padding: '4.5rem 0',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e2e8f0'
          }}
        >

          <div className="container">

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2rem'
              }}
            >

              <div>

                <h2
                  style={{
                    fontSize: '1.85rem',
                    fontWeight: 800,
                    color: '#0f172a'
                  }}
                >
                  {t('featuredCropsTitle')}
                </h2>

                <p
                  style={{
                    color: '#64748b',
                    fontSize: '0.95rem'
                  }}
                >
                  {t('featuredCropsSubtitle')}
                </p>

              </div>

              <Link
                to="/marketplace"
                className="btn btn-outline btn-sm"
              >
                <span>
                  {t('viewAll')}
                </span>

                <ArrowRight size={16} />
              </Link>

            </div>


            <div className="grid-3">

              {featuredCrops.map(crop => (
                <CropCard
                  key={crop.id}
                  crop={crop}
                />
              ))}

            </div>

          </div>

        </section>

      )}


      {/* =========================
          TODAY'S MANDI PRICES
      ========================= */}
      {mandiHighlights.length > 0 && (

        <section
          style={{
            padding: '4.5rem 0',
            backgroundColor: '#f0fdf4',
            borderTop: '1px solid #bbf7d0'
          }}
        >

          <div className="container">

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2rem'
              }}
            >

              <div>

                <h2
                  style={{
                    fontSize: '1.85rem',
                    fontWeight: 800,
                    color: '#166534'
                  }}
                >
                  {t('mandiHighlightsTitle')}
                </h2>

                <p
                  style={{
                    color: '#15803d',
                    fontSize: '0.95rem'
                  }}
                >
                  {t('mandiHighlightsSubtitle')}
                </p>

              </div>

              <Link
                to="/market-prices"
                className="btn btn-primary btn-sm"
              >
                <span>
                  {t('viewAllMandiRates')}
                </span>

                <ArrowRight size={16} />
              </Link>

            </div>


            <div className="grid-3">

              {mandiHighlights.map(price => (
                <MarketPriceCard
                  key={price.id}
                  priceRecord={price}
                />
              ))}

            </div>

          </div>

        </section>

      )}


      {/* =========================
          ASSISTED DIGITAL ACCESS
      ========================= */}
      <section
        style={{
          padding: '4rem 0',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0'
        }}
      >

        <div className="container">

          <div
            style={{
              backgroundColor: '#0f172a',
              color: '#ffffff',
              borderRadius: '20px',
              padding: '3rem 2.5rem',
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr',
              alignItems: 'center',
              gap: '2.5rem'
            }}
          >

            <div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: '#4ade80',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem'
                }}
              >

                <HelpCircle size={18} />

                <span>
                  {t('assistedProgramBadge')}
                </span>

              </div>

              <h2
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: '1rem'
                }}
              >
                {t('assistedTitle')}
              </h2>

              <p
                style={{
                  color: '#94a3b8',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  marginBottom: '1.5rem'
                }}
              >
                {t('assistedSubtitle')}{' '}
                {t('assistedSupportNote')}
              </p>

              <Link
                to="/assisted-access"
                className="btn btn-primary"
              >
                <span>
                  {t('learnAssistedAccess')}
                </span>

                <ArrowRight size={16} />
              </Link>

            </div>


            <div
              style={{
                backgroundColor: '#1e293b',
                padding: '1.75rem',
                borderRadius: '14px',
                border: '1px solid #334155'
              }}
            >

              <h4
                style={{
                  color: '#4ade80',
                  fontSize: '1rem',
                  fontWeight: 700,
                  marginBottom: '0.85rem'
                }}
              >
                {t('assistedWorkflowHeading')}
              </h4>

              <ul
                style={{
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  fontSize: '0.88rem',
                  color: '#cbd5e1'
                }}
              >

                <li
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                  }}
                >
                  <CheckCircle
                    size={16}
                    color="#4ade80"
                    style={{
                      marginTop: '3px',
                      flexShrink: 0
                    }}
                  />

                  <span>
                    {t('assistedStep1')}
                  </span>
                </li>


                <li
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                  }}
                >
                  <CheckCircle
                    size={16}
                    color="#4ade80"
                    style={{
                      marginTop: '3px',
                      flexShrink: 0
                    }}
                  />

                  <span>
                    {t('assistedStep2')}
                  </span>
                </li>


                <li
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                  }}
                >
                  <CheckCircle
                    size={16}
                    color="#4ade80"
                    style={{
                      marginTop: '3px',
                      flexShrink: 0
                    }}
                  />

                  <span>
                    {t('assistedStep3')}
                  </span>
                </li>

              </ul>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};