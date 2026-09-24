// ─── Contratos de Datos — refleja exactamente lo que entrega el BFF ──────────

export type EstadoEnvio     = 'EN_PREPARACION' | 'EN_RUTA' | 'ENTREGADO' | 'FALLBACK';
export type EstadoNecesidad = 'PENDIENTE' | 'ATENDIDA';
export type EstadoBadge     = EstadoEnvio | EstadoNecesidad;
export type TipoTransporte  = 'TERRESTRE' | 'AEREO' | 'MARITIMO';
export type TipoDonacion   = 'INDIVIDUAL' | 'EMPRESARIAL';
export type EstadoDonacion = 'PENDIENTE' | 'COMPLETADA';

/** GET /api/bff/logistica/envios — ítem */
export interface Envio {
  id: number;
  centroAcopioOrigen: string;
  destino: string;
  tipoTransporte: TipoTransporte;
  estado: EstadoEnvio;
  fechaCreacion: string; // ISO 8601
}

/** Respuesta de contingencia — Circuit Breaker activo */
export interface EnvioFallback {
  error: string;
  estado: 'FALLBACK';
}

/** GET /api/bff/necesidades — ítem */
export interface Necesidad {
  id: number;
  recursoNecesitado: string;
  cantidad: number;
  ubicacionGeografica: string;
  estado: EstadoNecesidad;
  fechaReporte: string; // ISO 8601
}

/** POST /api/bff/necesidades — payload formulario público */
export interface NuevaNecesidad {
  recursoNecesitado: string;
  cantidad: number;
  unidad: string;
  ubicacionGeografica: string;
  descripcionAdicional?: string;
}

/** POST /api/bff/logistica/envios — payload formulario planificación */
export interface NuevoEnvio {
  centroAcopioOrigen: string;
  destino: string;
  tipoTransporte: TipoTransporte;
}

/** Error estandarizado — GlobalExceptionHandler */
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

/** GET /api/bff/donaciones — ítem */
export interface Donacion {
  id: number;
  tipo: TipoDonacion;
  monto: number;
  donanteNombre: string;
  nombreObjeto: string;
  estado: EstadoDonacion;
  rutEmpresa?: string;           // solo EMPRESARIAL
  certificadoImpuestos?: string; // solo EMPRESARIAL
}
 
/** POST /api/bff/donaciones — payload */
export interface NuevaDonacion {
  tipo: TipoDonacion;
  monto: number;
  nombre: string;
  objeto: string;
  rut?: string;
  certificado?: string;
}
 

/** Helpers de tipo */
export function isEnvioFallback(
  data: Envio[] | EnvioFallback[]
): data is EnvioFallback[] {
  return data.length > 0 && 'error' in data[0];
}