import React from 'react';
import { StatValue } from '../atoms/StatValue';

export type DeltaType = 'up' | 'warn' | 'neutral';

export interface StatCardProps {
  label: string;
  value: number | string;
  delta?: string;
  deltaType?: DeltaType;
  accentColor?: string;
  className?: string;
}

const deltaColors: Record<DeltaType, string> = {
  up:      '#1D9E75',
  warn:    '#BA7517',
  neutral: '#888780',
};

/**
 * MOLÉCULA — StatCard
 * Combina un label, StatValue y delta opcional para dashboards.
 *
 * @example
 * <StatCard label="En Ruta" value={3} delta="↑ en movimiento" deltaType="up" />
 */
export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  delta,
  deltaType = 'neutral',
  accentColor = '#D85A30',
  className = '',
}) => (
  <div
    className={`don-stat-card ${className}`}
    style={{
      background:   'var(--don-surface, #F5F4F0)',
      borderRadius: '8px',
      padding:      '1rem',
      position:     'relative',
      overflow:     'hidden',
    }}
  >
    <p style={{ fontSize: '12px', color: '#888780', marginBottom: '6px' }}>{label}</p>
    <StatValue value={value} />
    {delta && (
      <p style={{ fontSize: '11px', marginTop: '4px', color: deltaColors[deltaType] }}>
        {delta}
      </p>
    )}
    {/* Decorative dot */}
    <div
      aria-hidden="true"
      style={{
        position: 'absolute', right: '-12px', bottom: '-12px',
        width: '56px', height: '56px', borderRadius: '50%',
        background: accentColor, opacity: 0.12,
      }}
    />
  </div>
);