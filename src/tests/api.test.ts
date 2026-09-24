import { describe, test, expect, beforeEach, afterEach, vi, type Mock } from 'vitest';
import { logisticaApi, necesidadesApi, donacionesApi } from '../services/api';

describe('Pruebas en src/services/api.ts (Vitest con globalThis)', () => {
  beforeEach(() => {
    // Usamos globalThis en lugar de global para entornos de navegador con Vite
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // ─── GRUPO 1: LOGÍSTICA ─────────────────────────────────────────────────────
  describe('logisticaApi', () => {
    test('getEnvios devuelve datos correctamente (200 OK)', async () => {
      const mockResponse = [{ id: 1, trackingNumber: 'TRK-123', estado: 'EN_RUTA' }];
      (globalThis.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const data = await logisticaApi.getEnvios();
      expect(data).toEqual(mockResponse);
      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/bff/logistica/envios', expect.any(Object));
    });

    test('crearEnvio envía un POST con el body correcto', async () => {
      const nuevoEnvio = {
        centroAcopioOrigen: 'Centro A',
        destino: 'Comunidad B',
        tipoTransporte: 'TERRESTRE', 
        descripcionCarga: 'Víveres'
      } as any;
      
      (globalThis.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 99, ...nuevoEnvio }),
      });

      const res = await logisticaApi.crearEnvio(nuevoEnvio);
      expect(res.id).toBe(99);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/bff/logistica/envios',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(nuevoEnvio)
        })
      );
    });
  });

  // ─── GRUPO 2: NECESIDADES ───────────────────────────────────────────────────
  describe('necesidadesApi', () => {
    test('crearNecesidad envía los datos correctamente al BFF', async () => {
      const nuevaNecesidad = {
        recursoNecesitado: 'Medicamentos',
        cantidad: 50,
        unidad: 'unidades',
        ubicacionGeografica: 'Sector Central'
      } as any;

      (globalThis.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 5, ...nuevaNecesidad, estado: 'PENDIENTE' }),
      });

      const res = await necesidadesApi.crearNecesidad(nuevaNecesidad);
      expect(res.estado).toBe('PENDIENTE');
    });
  });

  // ─── GRUPO 3: MANEJO EXCEPCIONAL DE ERRORES (ApiError) ──────────────────────
  describe('Manejo de Errores e Intercepción de res.ok = false', () => {
    test('apiFetch debe parsear y arrojar el ApiError formateado por el backend', async () => {
      const backendError = {
        timestamp: '2026-06-21T12:00:00Z',
        status: 400,
        error: 'Bad Request',
        message: 'La cantidad solicitada no puede ser negativa.',
        path: '/api/bff/necesidades'
      };

      (globalThis.fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => backendError,
      });

      await expect(necesidadesApi.getNecesidades()).rejects.toEqual(backendError);
    });

    test('apiFetch debe construir un fallback genérico si el JSON del error falla', async () => {
      (globalThis.fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 504,
        statusText: 'Gateway Timeout',
        json: async () => { throw new Error('No JSON here'); },
      });

      await expect(donacionesApi.listarDonaciones()).rejects.toMatchObject({
        status: 504,
        error: 'Gateway Timeout',
        message: 'Error inesperado. Intenta nuevamente.'
      });
    });
  });
});