import React, { useState, useEffect } from 'react';
import { LogisticsLayout } from '../templates/LogisticsLayout';
import { logisticaApi }    from '../../services/api';
import { useToast }         from '../../hooks/useToast';
import type { Envio, EnvioFallback, NuevoEnvio, ApiError } from '../../types';

export const EnviosPage: React.FC = () => {
  const [envios, setEnvios]   = useState<Envio[] | EnvioFallback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving]   = useState<boolean>(false);
  const { showError, showSuccess } = useToast();

  // ── Carga inicial ─────────────────────────────────────────────────────────
  useEffect(() => {
    logisticaApi.getEnvios()
      .then(setEnvios)
      .catch((err: ApiError) => showError(err))
      .finally(() => setLoading(false));
  }, []);

  // ── Crear envío ───────────────────────────────────────────────────────────
  async function crearEnvio(data: NuevoEnvio): Promise<void> {
    setSaving(true);
    try {
      const nuevo = await logisticaApi.crearEnvio(data);
      setEnvios((prev) => [...(prev as Envio[]), nuevo]);
      showSuccess('Envío registrado correctamente.');
    } catch (err) {
      showError(err as ApiError);
    } finally {
      setSaving(false);
    }
  }

  return (
    <LogisticsLayout
      envios={envios}
      loading={loading}
      saving={saving}
      onCreateEnvio={crearEnvio}
    />
  );
};

export default EnviosPage;