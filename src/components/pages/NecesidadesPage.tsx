import React, { useState, useEffect } from 'react';
import { NeedsAdminLayout } from '../templates/NeedsAdminLayout';
import { necesidadesApi }   from '../../services/api';
import { useToast }          from '../../hooks/useToast';
import type { Necesidad, ApiError } from '../../types';

export const NecesidadesPage: React.FC = () => {
  const [necesidades, setNecesidades] = useState<Necesidad[]>([]);
  const [loading, setLoading]         = useState<boolean>(true);
  const { showError, showSuccess }    = useToast();

  // ── Carga inicial ─────────────────────────────────────────────────────────
  useEffect(() => {
    necesidadesApi.getNecesidades()
      .then(setNecesidades)
      .catch((err: ApiError) => showError(err))
      .finally(() => setLoading(false));
  }, []);

  // ── Marcar como atendida ──────────────────────────────────────────────────
  async function marcarAtendida(id: number): Promise<void> {
    try {
      await necesidadesApi.atenderNecesidad(id);
      setNecesidades((prev: Necesidad[]) =>
        prev.map((n: Necesidad) =>
          n.id === id ? { ...n, estado: 'ATENDIDA' as const } : n
        )
      );
      showSuccess('Necesidad marcada como atendida.');
    } catch (err) {
      showError(err as ApiError);
    }
  }

  return (
    <NeedsAdminLayout
      necesidades={necesidades}
      loading={loading}
      onAtender={marcarAtendida}
    />
  );
};

export default NecesidadesPage;