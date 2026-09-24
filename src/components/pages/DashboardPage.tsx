import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../templates/DashboardLayout';
import { logisticaApi, necesidadesApi } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { isEnvioFallback } from '../../types'; // <-- Importamos tu validador de fallback
import type { Envio, Necesidad, ApiError } from '../../types';

export interface DashboardPageProps {
  onNavigate: (key: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [envios, setEnvios]           = useState<Envio[]>([]);
  const [necesidades, setNecesidades] = useState<Necesidad[]>([]);
  const [loading, setLoading]         = useState<boolean>(true);
  
  const { showError } = useToast();

  // ── Carga inicial de datos ────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    
    Promise.all([
      logisticaApi.getEnvios().catch((err) => {
        console.error("Error capturado en Logística (Circuit Breaker activo):", err);
        return []; // Retornamos arreglo vacío para que no rompa el Promise.all completo
      }),
      necesidadesApi.getNecesidades().catch((err) => {
        console.error("Error capturado en Necesidades:", err);
        return [];
      })
    ])
      .then(([enviosData, necesidadesData]) => {
        // Usamos tu helper para comprobar si el BFF nos mandó un objeto de contingencia/fallback
        if (isEnvioFallback(enviosData)) {
          console.warn("Logística devolvió contingencia controlada.");
          setEnvios([]); // Ponemos la lista vacía para que la interfaz diga de forma limpia "No hay envíos"
        } else {
          setEnvios(enviosData as Envio[]);
        }
        
        setNecesidades(necesidadesData as Necesidad[]);
      })
      .catch((err: ApiError) => {
        showError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showError]);

  // ── Renderizado condicional de carga ──────────────────────────────────────
  if (loading) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        fontFamily: 'sans-serif', 
        color: '#666' 
      }}>
        Sincronizando con la red operacional Donatón...
      </div>
    );
  }

  return (
    <DashboardLayout
      envios={envios}
      necesidades={necesidades}
      onGoToLogistica={() => onNavigate('envios')}
      onGoToNecesidades={() => onNavigate('necesidades')}
    />
  );
};

export default DashboardPage;