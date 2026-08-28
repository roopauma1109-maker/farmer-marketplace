import React from 'react';
import { HelpCircle, PhoneCall, Users, ShieldCheck, CheckCircle, ArrowRight, Sprout, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const AssistedAccessPage = () => {
  const { t } = useLanguage();

  return (
    <div className="container main-content">
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          backgroundColor: '#f0fdf4',
          color: '#15803d',
          padding: '0.35rem 0.95rem',
          borderRadius: '9999px',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '1rem',
          border: '1px solid #bbf7d0'
        }}>
          <HelpCircle size={16} />
          <span>{t('assistedProgramBadge')}</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
          {t('assistedTitle')}
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
          {t('assistedSubtitle')}
        </p>
      </div>

      {/* 4-Step Visual Flowchart */}
      <div className="card" style={{ padding: '2.5rem', marginBottom: '3rem', backgroundColor: '#ffffff' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: '2rem' }}>
          {t('assistedWorkflowHeading')}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', position: 'relative' }}>
          {[
            {
              step: 'Step 1',
              title: t('assistedStep1'),
              desc: t('assistedStep1Desc'),
              icon: Sprout
            },
            {
              step: 'Step 2',
              title: t('assistedStep2'),
              desc: t('assistedStep2Desc'),
              icon: Users
            },
            {
              step: 'Step 3',
              title: t('assistedStep3'),
              desc: t('assistedStep3Desc'),
              icon: Building
            },
            {
              step: 'Step 4',
              title: t('assistedStep4'),
              desc: t('assistedStep4Desc'),
              icon: PhoneCall
            }
          ].map((item, idx) => (
            <div key={idx} style={{
              backgroundColor: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.5rem 1.25rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                {item.step}
              </span>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <item.icon size={24} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.4, marginTop: '0.5rem' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Accessibility Features */}
      <div className="grid-2" style={{ marginBottom: '3rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={22} color="#16a34a" />
            <span>{t('inclusiveDesignHeading')}</span>
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.92rem', color: '#475569' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <CheckCircle size={18} color="#16a34a" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong>{t('inclusiveFeature1Title')}:</strong> {t('inclusiveFeature1Desc')}
              </div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <CheckCircle size={18} color="#16a34a" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong>{t('inclusiveFeature2Title')}:</strong> {t('inclusiveFeature2Desc')}
              </div>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <CheckCircle size={18} color="#16a34a" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong>{t('inclusiveFeature3Title')}:</strong> {t('inclusiveFeature3Desc')}
              </div>
            </li>
          </ul>
        </div>

        <div className="card" style={{ padding: '2rem', backgroundColor: '#f0fdf4', border: '1.5px solid #bbf7d0' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#166534', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PhoneCall size={22} color="#15803d" />
            <span>{t('kisanHotlineHeading')}</span>
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#15803d', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {t('kisanHotlineDesc')}
          </p>

          <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '10px', border: '1px solid #bbf7d0', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>{t('tollFreeLabel')}</span>
            <h4 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#15803d', marginTop: '0.2rem' }}>
              1800-180-1551
            </h4>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{t('helplineHours')}</span>
          </div>

          <Link to="/register" className="btn btn-primary btn-block">
            <span>{t('registerDirectlyNow')}</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
