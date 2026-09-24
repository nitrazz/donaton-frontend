import React, { useState } from 'react';
import { TabBar }         from '../molecules/TabBar';
import { TableRow }       from '../molecules/TableRow';
import { FallbackBanner } from '../molecules/FallbackBanner';
import { Spinner }        from '../atoms/Spinner';
import type { Envio, EstadoEnvio, EnvioFallback } from '../../types';
import { isEnvioFallback } from '../../types';

export interface ShipmentTableProps {
  data: Envio[] | EnvioFallback[];
  onRowClick?: (envio: Envio) => void;
  loading?: boolean;
  className?: string;
}

type FilterKey = 'TODOS' | EstadoEnvio;

const TABS: { key: FilterKey; label: string }[] = [
  { key: 'TODOS',          label: 'Todos'          },
  { key: 'EN_PREPARACION', label: 'En Preparación' },
  { key: 'EN_RUTA',        label: 'En Ruta'        },
  { key: 'ENTREGADO',      label: 'Entregados'     },
];

const th: React.CSSProperties = {
  padding:        '10px 1.25rem',
  textAlign:      'left',
  fontSize:       '11px',
  fontWeight:     500,
  letterSpacing:  '0.06em',
  textTransform:  'uppercase',
  color:          '#888780',
  borderBottom:   '0.5px solid rgba(0,0,0,0.1)',
  background:     '#F1EFE8',
};

/**
 * ORGANISMO — ShipmentTable
 * Tabla completa de envíos: TabBar + TableRow[] + manejo de fallback y loading.
 * Refleja el contrato GET /api/bff/logistica/envios.
 *
 * @example
 * <ShipmentTable data={envios} onRowClick={(e) => openDetail(e)} />
 */
export const ShipmentTable: React.FC<ShipmentTableProps> = ({
  data,
  onRowClick,
  loading = false,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<FilterKey>('TODOS');

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <Spinner label="Cargando envíos…" size={24} />
      </div>
    );
  }

  if (isEnvioFallback(data)) {
    return <FallbackBanner message={data[0].error} />;
  }

  const envios = data as Envio[];
  const tabs = TABS.map((t) => ({
    ...t,
    count: t.key === 'TODOS' ? undefined : envios.filter((e) => e.estado === t.key).length,
  }));
  const filtered = activeTab === 'TODOS' ? envios : envios.filter((e) => e.estado === activeTab);

  return (
    <div className={`don-shipment-table ${className}`}>
      <TabBar tabs={tabs} active={activeTab} onChange={(k) => setActiveTab(k as FilterKey)} />

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}
          role="grid"
          aria-label="Listado de envíos planificados"
        >
          <thead>
            <tr>
              <th style={th}>#</th>
              <th style={th}>Origen</th>
              <th style={th}>Destino</th>
              <th style={th}>Transporte</th>
              <th style={th}>Estado</th>
              <th style={th}>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{ padding: '2rem', textAlign: 'center', color: '#888780', fontSize: '13px' }}
                >
                  No hay envíos en este estado.
                </td>
              </tr>
            ) : (
              filtered.map((envio) => (
                <TableRow key={envio.id} envio={envio} onClick={onRowClick} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};