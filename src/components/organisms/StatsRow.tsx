import React from 'react';
import { StatCard } from '../molecules/StatCard';
import type { StatCardProps } from '../molecules/StatCard';

export interface StatsRowProps {
  stats: StatCardProps[];
  columns?: number;
  className?: string;
}

/**
 * ORGANISMO — StatsRow
 * Grilla horizontal de StatCards para encabezados de página.
 *
 * @example
 * <StatsRow stats={[
 *   { label: 'Total', value: 4 },
 *   { label: 'En Ruta', value: 2, delta: '↑', deltaType: 'up' },
 * ]} />
 */
export const StatsRow: React.FC<StatsRowProps> = ({ stats, columns, className = '' }) => (
  <div
    className={`don-stats-row ${className}`}
    style={{
      display:             'grid',
      gridTemplateColumns: `repeat(${columns ?? stats.length}, 1fr)`,
      gap:                 '12px',
      marginBottom:        '1.75rem',
    }}
  >
    {stats.map((s, i) => (
      <StatCard key={i} {...s} />
    ))}
  </div>
);