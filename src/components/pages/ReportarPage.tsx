import React from 'react';
import { PublicFormLayout } from '../templates/PublicFormLayout';
import { necesidadesApi }   from '../../services/api';
import { useToast }          from '../../hooks/useToast';
import type { NuevaNecesidad, ApiError } from '../../types';

export const ReportarPage: React.FC = () => {
  const { showError } = useToast();

  async function reportarNecesidad(data: NuevaNecesidad): Promise<void> {
    try {
      await necesidadesApi.crearNecesidad(data);
      // El éxito lo maneja internamente PublicFormLayout mostrando la pantalla de confirmación
    } catch (err) {
      showError(err as ApiError);
      throw err; // Re-lanzar para que PublicFormLayout no muestre el éxito
    }
  }

  return (
    <PublicFormLayout
      onSubmit={reportarNecesidad}
      successMessage="¡Tu solicitud fue enviada! El equipo de Donaton te contactará a la brevedad."
    />
  );
};

export default ReportarPage;