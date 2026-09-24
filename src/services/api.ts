import type {
  Envio,
  EnvioFallback,
  Necesidad,
  NuevoEnvio,
  NuevaNecesidad,
  ApiError,
  Donacion,
  NuevaDonacion
} from '../types';

// ─── URL BASE DEL BFF ─────────────────────────────────────────────────────────
const API_BASE = 'http://localhost:8080';

// ─── Cliente base ─────────────────────────────────────────────────────────────
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  // Concatenamos la URL base para que apunte al puerto 8080 de tu BFF
  const url = `${API_BASE}${path}`;
  
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const err: ApiError = await res.json().catch(() => ({
      timestamp: new Date().toISOString(),
      status: res.status,
      error: res.statusText,
      message: 'Error inesperado. Intenta nuevamente.',
      path: url,
    }));
    throw err;
  }

  return res.json();
}

// ─── Logística ────────────────────────────────────────────────────────────────
export const logisticaApi = {
  getEnvios: (): Promise<Envio[] | EnvioFallback[]> =>
    apiFetch('/api/bff/logistica/envios'),

  crearEnvio: (data: NuevoEnvio): Promise<Envio> =>
    apiFetch('/api/bff/logistica/envios', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  actualizarEstado: (id: number, estado: string): Promise<Envio> =>
    apiFetch(`/api/bff/logistica/envios/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado }),
    }),
};

// ─── Necesidades ──────────────────────────────────────────────────────────────
export const necesidadesApi = {
  getNecesidades: (): Promise<Necesidad[]> =>
    apiFetch('/api/bff/necesidades'),

  crearNecesidad: (data: NuevaNecesidad): Promise<Necesidad> =>
    apiFetch('/api/bff/necesidades', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  atenderNecesidad: (id: number): Promise<{ id: number; estado: string }> =>
    apiFetch(`/api/bff/necesidades/${id}/atender`, { method: 'PATCH' }),
};

// ─── Donaciones ───────────────────────────────────────────────────────────────
export const donacionesApi = {
  listarDonaciones: (): Promise<Donacion[]> =>
    apiFetch('/api/bff/donaciones'),

  crearDonacion: (data: NuevaDonacion): Promise<Donacion> =>
    apiFetch('/api/bff/donaciones', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  completarDonacion: (id: number): Promise<{ id: number; estado: string }> =>
    apiFetch(`/api/bff/donaciones/${id}/completar`, { method: 'PATCH' }),
};