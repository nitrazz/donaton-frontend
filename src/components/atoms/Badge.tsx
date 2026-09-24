import React from 'react';
import type { EstadoBadge } from '../../types';
import { estadoColorMap } from '../../tokens';

export interface BadgeProps {
  estado: EstadoBadge;
  size?: 'sm' | 'md';
  className?: string;
}

const iconMap: Record<EstadoBadge, string> = {
  EN_PREPARACION: '⏳',
  EN_RUTA:        '📍',
  ENTREGADO:      '✓',
  FALLBACK:       '⚠',
  PENDIENTE:      '⚠',
  ATENDIDA:       '✓',
};

/**
 * ÁTOMO — Badge
 * Etiqueta de color semántico para estados de envíos y necesidades.
 *
 * @example
 * <Badge estado="EN_RUTA" />
 * <Badge estado="PENDIENTE" size="sm" />
 */
export const Badge: React.FC<BadgeProps> = ({ estado, size = 'md', className = '' }) => {
  const config = estadoColorMap[estado];
  if (!config) return null;

  return (
    <span
      className={`don-badge don-badge--${estado.toLowerCase()} ${className}`}
      style={{
        display:         'inline-flex',
        alignItems:      'center',
        gap:             '4px',
        padding:         size === 'sm' ? '2px 7px' : '3px 10px',
        borderRadius:    '99px',
        fontSize:        size === 'sm' ? '11px' : '12px',
        fontWeight:      500,
        whiteSpace:      'nowrap',
        backgroundColor: config.bg,
        color:           config.text,
      }}
      aria-label={`Estado: ${config.label}`}
    >
      <span aria-hidden="true" style={{ fontSize: '10px' }}>{iconMap[estado]}</span>
      {config.label}
    </span>
  );
};