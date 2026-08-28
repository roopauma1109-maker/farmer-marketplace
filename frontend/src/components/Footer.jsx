import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container">

        <div className="footer-grid">

          {/* Brand Info */}
          <div className="footer-brand">

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginBottom: '0.75rem'
              }}
            >
              <Sprout
                size={28}
                color="#4ade80"
              />

              <h3 style={{ margin: 0 }}>
                {t('brandName')}
              </h3>
            </div>

            <p style={{ lineHeight: 1.6 }}>
              {t('footerAbout')}
            </p>

          </div>


          {/* Quick Links */}
          <div className="footer-col">

            <h4>
              {t('footerQuickLinks')}
            </h4>

            <ul className="footer-links">

              <li>
                <Link to="/">
                  {t('navHome')}
                </Link>
              </li>

              <li>
                <Link to="/marketplace">
                  {t('navMarketplace')}
                </Link>
              </li>

              <li>
                <Link to="/market-prices">
                  {t('navMarketPrices')}
                </Link>
              </li>

              <li>
                <Link to="/assisted-access">
                  {t('navAssistedAccess')}
                </Link>
              </li>

              <li>
                <Link to="/login">
                  {t('navLogin')}
                </Link>
              </li>

            </ul>

          </div>


          {/* Government Data Sources */}
          <div className="footer-col">

            <h4>
              {t('footerGovSources')}
            </h4>

            <ul className="footer-links">

              <li>
                <a
                  href="https://agmarknet.gov.in/"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span>
                    AGMARKNET Mandi Portal
                  </span>

                  <ExternalLink size={13} />
                </a>
              </li>


              <li>
                <a
                  href="https://www.enam.gov.in/"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span>
                    National Agriculture Market (e-NAM)
                  </span>

                  <ExternalLink size={13} />
                </a>
              </li>


              <li>
                <a
                  href="https://data.gov.in/"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span>
                    Open Government Data (data.gov.in)
                  </span>

                  <ExternalLink size={13} />
                </a>
              </li>


              <li>
                <span
                  style={{
                    fontSize: '0.82rem',
                    color: '#64748b',
                    display: 'block',
                    marginTop: '0.5rem'
                  }}
                >
                  {t('footerGovNote')}
                </span>
              </li>

            </ul>

          </div>

        </div>


        {/* Footer Bottom */}
        <div className="footer-bottom">

          <p>
            {t('footerRights')}
          </p>

        </div>

      </div>
    </footer>
  );
};
