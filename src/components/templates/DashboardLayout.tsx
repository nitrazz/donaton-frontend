import React from 'react';
import { Topbar }        from '../organisms/TopBar';
import { StatsRow }      from '../organisms/StatsRow';
import { ShipmentTable } from '../organisms/Shipmenttable';
import type { Envio, EnvioFallback, Necesidad } from '../../types';

export interface DashboardLayoutProps {
  envios: Envio[] | EnvioFallback[];
  necesidades: Necesidad[];
  loading?: boolean;
  onGoToLogistica: () => void;
  onGoToNecesidades: () => void;
}

/**
 * TEMPLATE — DashboardLayout
 * Vista resumen ejecutivo: combina métricas de ambos microservicios.
 *
 * @example
 * <DashboardLayout
 *   envios={envios}
 *   necesidades={necesidades}
 *   onGoToLogistica={() => navigate('envios')}
 *   onGoToNecesidades={() => navigate('necesidades')}
 * />
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  envios,
  necesidades,
  loading = false,
  onGoToLogistica,
  onGoToNecesidades,
}) => {
  const normalEnvios = (Array.isArray(envios) && !('error' in (envios[0] ?? {})))
    ? (envios as Envio[])
    : [];

  const stats = [
    {
      label: 'Envíos En Preparación',
      value: normalEnvios.filter(e => e.estado === 'EN_PREPARACION').length,
      deltaType: 'warn' as const,
    },
    {
      label: 'Envíos En Ruta',
      value: normalEnvios.filter(e => e.estado === 'EN_RUTA').length,
      deltaType: 'up' as const,
      delta: '↑ en movimiento',
    },
    {
      label: 'Entregados',
      value: normalEnvios.filter(e => e.estado === 'ENTREGADO').length,
      deltaType: 'up' as const,
    },
    {
      label: 'Necesidades Pendientes',
      value: necesidades.filter(n => n.estado === 'PENDIENTE').length,
      deltaType: 'warn' as const,
      delta: '⚠ requieren atención',
      accentColor: '#D85A30',
    },
  ];

  return (
    <div className="don-dashboard-layout">
      <Topbar title="Dashboard" subtitle="Resumen operacional en tiempo real" />

      <StatsRow stats={stats} />

      {/* Últimos envíos */}
      <div style={{
        background: '#fff', borderRadius: '12px',
        border: '0.5px solid rgba(0,0,0,0.08)', marginBottom: '1.5rem',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.25rem', borderBottom: '0.5px solid rgba(0,0,0,0.08)',
        }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>Últimos envíos</h2>
          <button
            onClick={onGoToLogistica}
            style={{
              fontSize: '12.5px', color: '#D85A30', background: 'none',
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Ver todos →
          </button>
        </div>
        <ShipmentTable
          data={Array.isArray(envios) ? envios.slice(0, 3) : envios}
          loading={loading}
        />
      </div>

      {/* Necesidades recientes */}
      <div style={{
        background: '#fff', borderRadius: '12px',
        border: '0.5px solid rgba(0,0,0,0.08)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.25rem', borderBottom: '0.5px solid rgba(0,0,0,0.08)',
        }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>Necesidades recientes</h2>
          <button
            onClick={onGoToNecesidades}
            style={{
              fontSize: '12.5px', color: '#D85A30', background: 'none',
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Ver todas →
          </button>
        </div>
        <div style={{ padding: '1rem 1.25rem' }}>
          {necesidades.slice(0, 2).map(n => (
            <div
              key={n.id}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)',
                fontSize: '13px',
              }}
            >
              <span style={{ fontWeight: 500 }}>{n.recursoNecesitado}</span>
              <span style={{ color: '#888780', fontSize: '12px' }}>{n.ubicacionGeografica}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};