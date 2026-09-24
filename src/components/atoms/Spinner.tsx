import React from 'react';

export interface SpinnerProps {
  size?: number;
  color?: string;
  label?: string;
}

/**
 * ÁTOMO — Spinner
 * Indicador de carga animado accesible.
 *
 * @example
 * <Spinner />
 * <Spinner size={24} color="#D85A30" label="Cargando envíos…" />
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = 18,
  color = '#D85A30',
  label = 'Cargando…',
}) => (
  <span role="status" aria-label={label} style={{ display: 'inline-flex', alignItems: 'center' }}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ animation: 'don-spin 0.8s linear infinite' }}
    >
      <style>{`@keyframes don-spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2.5" strokeOpacity="0.2" />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  </span>
);