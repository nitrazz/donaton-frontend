import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from '../hooks/useToast';

describe('Pruebas en el Hook useToast', () => {
  beforeEach(() => {
    // Activamos temporizadores virtuales para controlar el setTimeout de 4000ms
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('debería inicializarse con un arreglo de toasts vacío', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toEqual([]);
  });

  test('debería agregar un toast de éxito (success) y borrarlo tras 4 segundos', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showSuccess('¡Guardado!');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('¡Guardado!');
    expect(result.current.toasts[0].type).toBe('success');

    // Adelantamos el tiempo 4 segundos en el entorno virtual
    act(() => {
      vi.advanceTimersByTime(4000);
    });

    // El toast debió ser eliminado automáticamente por el setTimeout
    expect(result.current.toasts).toEqual([]);
  });

  test('debería agregar un toast informativo (info)', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showInfo('Sincronizando datos...');
    });

    expect(result.current.toasts[0].type).toBe('info');
    expect(result.current.toasts[0].message).toBe('Sincronizando datos...');
  });

  test('debería extraer el mensaje de un objeto ApiError', () => {
    const { result } = renderHook(() => useToast());
    const mockApiError = {
      timestamp: '2026-06-21',
      status: 400,
      error: 'Bad Request',
      message: 'Error de validación en el BFF',
      path: '/api'
    };

    act(() => {
      result.current.showError(mockApiError);
    });

    expect(result.current.toasts[0].type).toBe('error');
    expect(result.current.toasts[0].message).toBe('Error de validación en el BFF');
  });

  test('debería usar un mensaje por defecto si se pasa un Error genérico de JS', () => {
    const { result } = renderHook(() => useToast());
    // Creamos un objeto que no tiene la propiedad 'message' para forzar la rama alternativa
    const errorGenerico = {} as any;

    act(() => {
      result.current.showError(errorGenerico);
    });

    expect(result.current.toasts[0].type).toBe('error');
    expect(result.current.toasts[0].message).toBe('Error inesperado');
  });
});