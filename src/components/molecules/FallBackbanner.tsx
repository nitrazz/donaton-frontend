import React from 'react';

export interface FallbackBannerProps {
  message?: string;
  className?: string;
}

/**
 * MOLÉCULA — FallbackBanner
 * Banner de error para cuando el Circuit Breaker activa el fallback
 * del microservicio de logística.
 *
 * @example
 * <FallbackBanner message="Servicio logístico temporalmente no disponible" />
 */
export const FallbackBanner: React.FC<FallbackBannerProps> = ({
  message = 'Servicio logístico temporalmente no disponible',
  className = '',
}) => (
  <div
    role="alert"
    aria-live="assertive"
    className={`don-fallback-banner ${className}`}
    style={{
      display:      'flex',
      alignItems:   'center',
      gap:          '10px',
      padding:      '10px 1.25rem',
      background:   '#FCEBEB',
      borderRadius: '8px',
      border:       '0.5px solid rgba(163,45,45,0.2)',
    }}
  >
    <span aria-hidden="true" style={{ fontSize: '18px' }}>⚠️</span>
    <div>
      <p style={{ fontSize: '13px', fontWeight: 500, color: '#A32D2D' }}>
        Servicio no disponible
      </p>
      <p style={{ fontSize: '12px', color: '#A32D2D', opacity: 0.8, marginTop: '2px' }}>
        {message}
      </p>
    </div>
  </div>
);