import React from 'react';
import { Badge }         from '../atoms/Badge';
import { TransportChip } from '../atoms/TransportChip';
import type { Envio }    from '../../types';

export interface TableRowProps {
  envio: Envio;
  onClick?: (envio: Envio) => void;
}

const td: React.CSSProperties = {
  padding:      '12px 1.25rem',
  borderBottom: '0.5px solid rgba(0,0,0,0.07)',
  verticalAlign:'middle',
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CL', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

/**
 * MOLÉCULA — TableRow
 * Fila de la tabla de envíos. Combina Badge + TransportChip.
 *
 * @example
 * <TableRow envio={envio} onClick={(e) => openDetail(e)} />
 */
export const TableRow: React.FC<TableRowProps> = ({ envio, onClick }) => (
  <tr
    onClick={() => onClick?.(envio)}
    onKeyDown={(e) => e.key === 'Enter' && onClick?.(envio)}
    tabIndex={onClick ? 0 : undefined}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    <td style={{ ...td, fontFamily: 'monospace', fontSize: '11px', color: '#B4B2A9' }}>
      #{envio.id}
    </td>
    <td style={{ ...td, fontWeight: 500 }}>
      {envio.centroAcopioOrigen}
    </td>
    <td style={{ ...td, fontSize: '13px', color: '#5F5E5A' }}>
      {envio.destino}
    </td>
    <td style={td}>
      <TransportChip tipo={envio.tipoTransporte} />
    </td>
    <td style={td}>
      <Badge estado={envio.estado} />
    </td>
    <td style={{ ...td, fontSize: '12px', color: '#888780' }}>
      {fmtDate(envio.fechaCreacion)}
    </td>
  </tr>
);