import React from 'react';
import { NeedReportForm } from '../organisms/NeedReportForm';
import type { NuevaNecesidad } from '../../types';

export interface PublicFormLayoutProps {
  onSubmit: (data: NuevaNecesidad) => Promise<void>;
  loading?: boolean;
  successMessage?: string;
}

/**
 * TEMPLATE — PublicFormLayout
 * Vista pública para ciudadanos: hero ilustrativo + NeedReportForm.
 * Diseñado para ser embebido en un portal ciudadano externo.
 *
 * @example
 * <PublicFormLayout onSubmit={reportarNecesidad} />
 */
export const PublicFormLayout: React.FC<PublicFormLayoutProps> = ({
  onSubmit,
  loading = false,
  successMessage,
}) => (
  <div
    className="don-public-form-layout"
    style={{ maxWidth: '540px', margin: '0 auto', padding: '1.5rem' }}
  >
    {/* Hero */}
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <div style={{
        width: '56px', height: '56px', background: '#D85A30',
        borderRadius: '12px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', margin: '0 auto 1rem', fontSize: '28px',
      }}>
        🩹
      </div>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>
        Solicitar Ayuda
      </h1>
      <p style={{ fontSize: '13.5px', color: '#5F5E5A', lineHeight: 1.6, maxWidth: '380px', margin: '0 auto' }}>
        Completa el formulario para reportar una necesidad.
        Nuestro equipo la atenderá a la brevedad posible.
      </p>
    </div>

    {/* Form card */}
    <div style={{
      background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)',
      borderRadius: '12px', padding: '1.5rem',
    }}>
      <NeedReportForm
        onSubmit={onSubmit}
        loading={loading}
        successMessage={successMessage}
      />
    </div>

    <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '12px', color: '#B4B2A9' }}>
      Tu reporte es anónimo y será revisado por el equipo de Donaton.
    </p>
  </div>
);