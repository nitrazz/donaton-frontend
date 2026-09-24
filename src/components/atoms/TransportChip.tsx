import React from 'react';
import type { TipoTransporte } from '../../types';

export interface TransportChipProps {
  tipo: TipoTransporte;
  showLabel?: boolean;
  className?: string;
}

const config: Record<TipoTransporte, { emoji: string; label: string; color: string }> = {
  TERRESTRE: { emoji: '🚛', label: 'Terrestre', color: '#5F5E5A' },
  AEREO:     { emoji: '✈️', label: 'Aéreo',     color: '#185FA5' },
  MARITIMO:  { emoji: '🚢', label: 'Marítimo',  color: '#0F6E56' },
};

/**
 * ÁTOMO — TransportChip
 * Pastilla visual para el tipo de transporte de un envío.
 *
 * @example
 * <TransportChip tipo="AEREO" />
 * <TransportChip tipo="TERRESTRE" showLabel={false} />
 */
export const TransportChip: React.FC<TransportChipProps> = ({
  tipo,
  showLabel = true,
  className = '',
}) => {
  const { emoji, label, color } = config[tipo];
  return (
    <span
      className={`don-transport-chip ${className}`}
      title={label}
      aria-label={`Transporte: ${label}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', color }}
    >
      <span aria-hidden="true">{emoji}</span>
      {showLabel && label}
    </span>
  );
};