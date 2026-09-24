import { useState, useEffect, useCallback } from 'react';
import { logisticaApi, necesidadesApi } from '../services/api';
import { Envio, Necesidad, isEnvioFallback, ApiError } from '../types';
import { useToast } from './useToast'; // <-- Importamos tu hook de notificaciones

export const useDashboard = () => {
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [necesidades, setNecesidades] = useState<Necesidad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toasts, showError, showSuccess } = useToast();

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const [resEnvios, resNecesidades] = await Promise.all([
        logisticaApi.getEnvios().catch((err) => {
          showError(err as ApiError);
          return [] as Envio[];
        }),
        necesidadesApi.getNecesidades().catch((err) => {
          showError(err as ApiError);
          return [] as Necesidad[];
        })
      ]);

      if (isEnvioFallback(resEnvios)) {
        setEnvios([]); 
      } else {
        setEnvios(resEnvios);
      }

      setNecesidades(resNecesidades);
    } catch (err) {
      showError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Métricas para las tarjetas de tu pantalla
  const metrics = {
    enPreparacion: envios.filter(e => e.estado === 'EN_PREPARACION').length,
    enRuta: envios.filter(e => e.estado === 'EN_RUTA').length,
    entregados: envios.filter(e => e.estado === 'ENTREGADO').length,
    necesidadesPendientes: necesidades.filter(n => n.estado === 'PENDIENTE').length
  };

  return { 
    envios, 
    necesidades, 
    metrics, 
    loading, 
    toasts, // Los exponemos para pintarlos en la UI si es necesario
    refresh: fetchDashboardData 
  };
};