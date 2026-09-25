import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';
import { msalConfig, tokenRequest } from '../authConfig';
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
const API_BASE = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080';

// Instancia interna de MSAL para obtener el token en peticiones de API
const msalInstance = new PublicClientApplication(msalConfig);

/**
 * Obtiene el Token JWT de Entra ID silenciosamente o abre Popup si vence la sesión.
 */
async function getAccessToken(): Promise<string | null> {
  await msalInstance.initialize();
  const accounts = msalInstance.getAllAccounts();
  
  if (accounts.length === 0) {
    return null; // Si es una ruta pública o no hay usuario autenticado
  }

  try {
    const response = await msalInstance.acquireTokenSilent({
      ...tokenRequest,
      account: accounts[0],
    });
    return response.accessToken;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      const response = await msalInstance.acquireTokenPopup(tokenRequest);
      return response.accessToken;
    }
    console.error('Error al adquirir token:', error);
    return null;
  }
}

// ─── Cliente base ─────────────────────────────────────────────────────────────
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const token = await getAccessToken();

  // Encabezados dinámicos inyectando Authorization Bearer si existe token
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers as Record<string, string>),
  };

  const res = await fetch(url, {
    ...options,
    headers,
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