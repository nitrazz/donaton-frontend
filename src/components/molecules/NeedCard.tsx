import React from 'react';
import { Badge }  from '../atoms/Badge';
import { Button } from '../atoms/Button';
import type { Necesidad } from '../../types';

export interface NeedCardProps {
  necesidad: Necesidad;
  onAtender?: (id: number) => void;
  className?: string;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CL', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

/**
 * MOLÉCULA — NeedCard
 * Tarjeta de necesidad reportada para el panel administrativo.
 * Combina Badge + Button.
 *
 * @example
 * <NeedCard necesidad={n} onAtender={(id) => marcarAtendida(id)} />
 */
export const NeedCard: React.FC<NeedCardProps> = ({ necesidad, onAtender, className = '' }) => {
  const { id, recursoNecesitado, cantidad, ubicacionGeografica, estado, fechaReporte } = necesidad;

  return (
    <article
      className={`don-need-card ${className}`}
      aria-label={`Necesidad: ${recursoNecesitado}`}
      style={{
        background:    '#F5F4F0',
        borderRadius:  '8px',
        border:        '0.5px solid rgba(0,0,0,0.1)',
        padding:       '1rem',
        display:       'flex',
        flexDirection: 'column',
        gap:           '6px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontWeight: 500, fontSize: '14px' }}>{recursoNecesitado}</span>
        <Badge estado={estado} size="sm" />
      </div>

      <div>
        <span style={{ fontSize: '22px', fontWeight: 700, color: '#D85A30' }}>
          {cantidad.toLocaleString('es-CL')}
        </span>
        <span style={{ fontSize: '12px', color: '#888780', marginLeft: '4px' }}>unidades</span>
      </div>

      <p style={{ fontSize: '12px', color: '#5F5E5A', display: 'flex', gap: '4px' }}>
        <span aria-hidden="true">📍</span>{ubicacionGeografica}
      </p>

      <p style={{ fontSize: '11px', color: '#B4B2A9' }}>
        🕐 {fmtDate(fechaReporte)} · ID #{id}
      </p>

      {estado === 'PENDIENTE' && onAtender && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onAtender(id)}
          aria-label={`Marcar ${recursoNecesitado} como atendida`}
          style={{ alignSelf: 'flex-start', marginTop: '4px' }}
        >
          ✓ Marcar como atendida
        </Button>
      )}
    </article>
  );
};