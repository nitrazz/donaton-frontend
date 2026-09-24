import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useDashboard } from '../hooks/useDashboard';
import { logisticaApi, necesidadesApi } from '../services/api';
import * as typesModule from '../types'; // Importamos todo el módulo de tipos

// Mock básico para las llamadas de la API
vi.mock('../services/api', () => ({
  logisticaApi: { getEnvios: vi.fn() },
  necesidadesApi: { getNecesidades: vi.fn() }
}));

describe('Pruebas en el Hook useDashboard', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('debería cargar datos, validar que no sea fallback y calcular las métricas correctamente', async () => {
    const mockEnvios = [
      { id: 1, estado: 'EN_PREPARACION' },
      { id: 2, estado: 'EN_RUTA' },
      { id: 3, estado: 'ENTREGADO' }
    ];
    const mockNecesidades = [
      { id: 10, estado: 'PENDIENTE' },
      { id: 11, estado: 'ATENDIDA' }
    ];

    (logisticaApi.getEnvios as any).mockResolvedValue(mockEnvios);
    (necesidadesApi.getNecesidades as any).mockResolvedValue(mockNecesidades);
    
    // Usamos vi.spyOn sobre el módulo importado para controlar la función de fallback
    const fallbackSpy = vi.spyOn(typesModule, 'isEnvioFallback').mockReturnValue(false);

    const { result } = renderHook(() => useDashboard());

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.envios).toEqual(mockEnvios);
    expect(result.current.necesidades).toEqual(mockNecesidades);

    // Validamos el cálculo exacto de tus métricas
    expect(result.current.metrics.enPreparacion).toBe(1);
    expect(result.current.metrics.enRuta).toBe(1);
    expect(result.current.metrics.entregados).toBe(1);
    expect(result.current.metrics.necesidadesPendientes).toBe(1);

    fallbackSpy.mockRestore();
  });

  test('debería setear envíos vacíos si isEnvioFallback es verdadero (true)', async () => {
    (logisticaApi.getEnvios as any).mockResolvedValue([{ mensajeFallback: 'Servicio offline' }]);
    (necesidadesApi.getNecesidades as any).mockResolvedValue([]);
    const fallbackSpy = vi.spyOn(typesModule, 'isEnvioFallback').mockReturnValue(true);

    const { result } = renderHook(() => useDashboard());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.envios).toEqual([]);
    
    fallbackSpy.mockRestore();
  });

  test('debería tolerar errores individuales en las APIs mediante sus .catch() internos', async () => {
    (logisticaApi.getEnvios as any).mockRejectedValue(new Error('Error de red Logística'));
    (necesidadesApi.getNecesidades as any).mockResolvedValue([{ id: 1, estado: 'PENDIENTE' }]);
    const fallbackSpy = vi.spyOn(typesModule, 'isEnvioFallback').mockReturnValue(false);

    const { result } = renderHook(() => useDashboard());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.envios).toEqual([]);
    expect(result.current.necesidades).toHaveLength(1);
    
    fallbackSpy.mockRestore();
  });

  test('debería permitir volver a pedir los datos manualmente al ejecutar refresh()', async () => {
    (logisticaApi.getEnvios as any).mockResolvedValue([]);
    (necesidadesApi.getNecesidades as any).mockResolvedValue([]);
    const fallbackSpy = vi.spyOn(typesModule, 'isEnvioFallback').mockReturnValue(false);

    const { result } = renderHook(() => useDashboard());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.refresh();
    });

    expect(logisticaApi.getEnvios).toHaveBeenCalledTimes(2);
    expect(necesidadesApi.getNecesidades).toHaveBeenCalledTimes(2);

    fallbackSpy.mockRestore();
  });
});