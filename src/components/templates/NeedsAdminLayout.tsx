import React from 'react';
import { Topbar }       from '../organisms/TopBar';
import { StatsRow }     from '../organisms/StatsRow';
import { NeedCardGrid } from '../organisms/NeedCardGrid';
import type { Necesidad } from '../../types';

export interface NeedsAdminLayoutProps {
  /** Datos del BFF — GET /api/bff/necesidades */
  necesidades: Necesidad[];
  loading?: boolean;
  onAtender: (id: number) => Promise<void>;
}

/**
 * TEMPLATE — NeedsAdminLayout
 * Panel administrativo de necesidades reportadas:
 * Topbar + StatsRow + NeedCardGrid.
 *
 * @example
 * <NeedsAdminLayout
 *   necesidades={necesidades}
 *   loading={isLoading}
 *   onAtender={marcarAtendida}
 * />
 */
export const NeedsAdminLayout: React.FC<NeedsAdminLayoutProps> = ({
  necesidades,
  loading = false,
  onAtender,
}) => {
  const pendientes = necesidades.filter(n => n.estado === 'PENDIENTE').length;
  const atendidas  = necesidades.filter(n => n.estado === 'ATENDIDA').length;
  const totalUnidades = necesidades.reduce((acc, n) => acc + n.cantidad, 0);

  const stats = [
    { label: 'Total Reportes',            value: necesidades.length },
    { label: 'Pendientes',                value: pendientes,    deltaType: 'warn' as const, delta: pendientes > 0 ? '⚠ requieren atención' : undefined },
    { label: 'Atendidas',                 value: atendidas,     deltaType: 'up'   as const },
    { label: 'Unidades Totales Solicitadas', value: totalUnidades },
  ];

  return (
    <div className="don-needs-admin-layout">
      <Topbar
        title="Necesidades Reportadas"
        subtitle="Panel administrativo de solicitudes ciudadanas"
        actions={[
          { label: 'Filtrar',            icon: '▼', onClick: () => {} },
          { label: 'Ordenar por fecha',  icon: '↕', onClick: () => {} },
        ]}
      />

      <StatsRow stats={stats} />

      <div style={{
        background: '#fff', borderRadius: '12px',
        border: '0.5px solid rgba(0,0,0,0.08)',
      }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>Todos los reportes</h2>
        </div>
        <NeedCardGrid
          data={necesidades}
          loading={loading}
          onAtender={onAtender}
        />
      </div>
    </div>
  );
};