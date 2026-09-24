import React from 'react';

export interface StatValueProps {
  value: number | string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = { sm: '18px', md: '24px', lg: '32px' };

/**
 * ÁTOMO — StatValue
 * Número grande destacado para dashboards. Usado dentro de StatCard.
 *
 * @example
 * <StatValue value={42} />
 * <StatValue value={1500} color="#D85A30" size="lg" />
 */
export const StatValue: React.FC<StatValueProps> = ({
  value,
  color = 'inherit',
  size = 'md',
}) => (
  <span
    style={{
      fontSize:   sizeMap[size],
      fontWeight: 700,
      color,
      lineHeight: 1,
      display:    'block',
    }}
  >
    {typeof value === 'number' ? value.toLocaleString('es-CL') : value}
  </span>
);