import { useState, useCallback } from 'react';
import type { ApiError } from '../types';

export interface Toast {
  id: number;
  message: string;
  type: 'error' | 'success' | 'info';
}

/**
 * Hook para mostrar notificaciones toast.
 * Úsalo para mostrar los errores del GlobalExceptionHandler del BFF.
 *
 * @example
 * const { toasts, showError, showSuccess } = useToast();
 * try { await logisticaApi.crearEnvio(data); showSuccess('Envío creado'); }
 * catch (err) { showError(err as ApiError); }
 */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast['type']) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const showError = useCallback(
    (err: ApiError | Error) => {
      const message = 'message' in err ? err.message : 'Error inesperado';
      addToast(message, 'error');
    },
    [addToast]
  );

  const showSuccess = useCallback(
    (message: string) => addToast(message, 'success'),
    [addToast]
  );

  const showInfo = useCallback(
    (message: string) => addToast(message, 'info'),
    [addToast]
  );

  return { toasts, showError, showSuccess, showInfo };
}