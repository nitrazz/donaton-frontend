import React, { useState } from 'react';
import { Topbar }        from '../organisms/Topbar';
import { StatsRow }      from '../organisms/StatsRow';
import { ShipmentTable } from '../organisms/ShipmentTable';
import { PlanForm }      from '../organisms/PlanForm';
import type { Envio, EnvioFallback, NuevoEnvio } from '../../types';

export interface LogisticsLayoutProps {
  envios: Envio[] | EnvioFallback[];
  loading?: boolean;
  onCreateEnvio: (data: NuevoEnvio) => Promise<void>;
  onRowClick?: (envio: Envio) => void;
  saving?: boolean;
}

export const LogisticsLayout: React.FC<LogisticsLayoutProps> = ({
  envios,
  loading = false,
  onCreateEnvio,
  onRowClick,
  saving = false,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const isNormal = !loading && Array.isArray(envios) && envios.length > 0 && !('error' in envios[0]);
  const normal   = isNormal ? (envios as Envio[]) : [];

  const stats = [
    { label: 'Total Envíos',   value: normal.length },
    { label: 'En Preparación', value: normal.filter(e => e.estado === 'EN_PREPARACION').length, deltaType: 'warn' as const },
    { label: 'En Ruta',        value: normal.filter(e => e.estado === 'EN_RUTA').length,        deltaType: 'up'   as const },
    { label: 'Entregados',     value: normal.filter(e => e.estado === 'ENTREGADO').length,      deltaType: 'up'   as const },
  ];

  async function handleSubmit(data: NuevoEnvio) {
    await onCreateEnvio(data);
    setModalOpen(false);
  }

  return (
    <div className="don-logistics-layout">
      <Topbar
        title="Gestión de Envíos"
        subtitle="Logística y distribución de ayuda humanitaria"
        actions={[{
          label: 'Nuevo Envío',
          icon: '＋',
          variant: 'primary',
          onClick: () => setModalOpen(true),
        }]}
      />

      <StatsRow stats={stats} />

      <div style={{
        background: '#fff',
        borderRadius: '12px',
        border: '0.5px solid rgba(0,0,0,0.08)',
      }}>
        <ShipmentTable
          data={envios}
          loading={loading}
          onRowClick={onRowClick}
        />
      </div>

      <PlanForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </div>
  );
};