import React from 'react';
import { NeedCard } from '../molecules/NeedCard';
import { Spinner }  from '../atoms/Spinner';
import type { Necesidad } from '../../types';

export interface NeedCardGridProps {
  data: Necesidad[];
  onAtender?: (id: number) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

/**
 * ORGANISMO — NeedCardGrid
 * Grilla responsive de tarjetas NeedCard para el panel administrativo.
 * Refleja el contrato GET /api/bff/necesidades.
 *
 * @example
 * <NeedCardGrid data={necesidades} onAtender={(id) => atender(id)} />
 */
export const NeedCardGrid: React.FC<NeedCardGridProps> = ({
  data,
  onAtender,
  loading = false,
  emptyMessage = 'No hay necesidades reportadas.',
  className = '',
}) => {
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <Spinner label="Cargando necesidades…" size={24} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: '#888780', padding: '2rem', fontSize: '13px' }}>
        {emptyMessage}
      </p>
    );
  }

  return (
    <div
      className={`don-need-card-grid ${className}`}
      style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap:                 '12px',
        padding:             '1.25rem',
      }}
    >
      {data.map((n) => (
        <NeedCard key={n.id} necesidad={n} onAtender={onAtender} />
      ))}
    </div>
  );
};