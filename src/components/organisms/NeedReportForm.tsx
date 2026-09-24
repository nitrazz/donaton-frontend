import React, { useState } from 'react';
import { FormField } from '../molecules/FormField';
import { Input }     from '../atoms/Input';
import { Select }    from '../atoms/Select';
import { Textarea }  from '../atoms/Textarea';
import { Button }    from '../atoms/Button';
import type { NuevaNecesidad } from '../../types';

export interface NeedReportFormProps {
  onSubmit: (data: NuevaNecesidad) => void | Promise<void>;
  loading?: boolean;
  successMessage?: string;
  className?: string;
}

type FormErrors = Partial<Record<keyof NuevaNecesidad, string>>;

const UNIDAD_OPTIONS = [
  { value: 'Unidades',  label: 'Unidades'  },
  { value: 'Litros',    label: 'Litros'    },
  { value: 'Cajas',     label: 'Cajas'     },
  { value: 'Kg',        label: 'Kg'        },
  { value: 'Porciones', label: 'Porciones' },
];

/**
 * ORGANISMO — NeedReportForm
 * Formulario público para que ciudadanos reporten necesidades.
 * Compuesto por FormField × 4 + Button.
 * Genera el payload para POST /api/bff/necesidades.
 *
 * @example
 * <NeedReportForm onSubmit={(data) => reportarNecesidad(data)} />
 */
export const NeedReportForm: React.FC<NeedReportFormProps> = ({
  onSubmit,
  loading = false,
  successMessage,
  className = '',
}) => {
  const [form, setForm]       = useState<Partial<NuevaNecesidad>>({ unidad: 'Unidades' });
  const [errors, setErrors]   = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.recursoNecesitado?.trim()) e.recursoNecesitado   = 'Indica qué recurso necesitas.';
    if (!form.cantidad || form.cantidad < 1) e.cantidad        = 'La cantidad debe ser mayor a 0.';
    if (!form.ubicacionGeografica?.trim()) e.ubicacionGeografica = 'La ubicación es requerida.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    await onSubmit(form as NuevaNecesidad);
    setSubmitted(true);
    setForm({ unidad: 'Unidades' });
    setErrors({});
  }

  if (submitted) {
    return (
      <div
        className={`don-need-report-form ${className}`}
        role="status"
        aria-live="polite"
        style={{ textAlign: 'center', padding: '3rem 1rem' }}
      >
        <div style={{ fontSize: '48px', marginBottom: '1rem' }}>✅</div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
          ¡Solicitud enviada!
        </h2>
        <p style={{ fontSize: '14px', color: '#5F5E5A' }}>
          {successMessage ?? 'Tu reporte fue recibido. El equipo de Donaton lo atenderá a la brevedad.'}
        </p>
        <Button
          variant="secondary"
          style={{ marginTop: '1.5rem' }}
          onClick={() => setSubmitted(false)}
        >
          Enviar otro reporte
        </Button>
      </div>
    );
  }

  return (
    <form
      className={`don-need-report-form ${className}`}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Formulario de solicitud de ayuda"
    >
      <FormField
        id="need-recurso"
        label="¿Qué recurso necesitas?"
        required
        error={errors.recursoNecesitado}
      >
        <Input
          id="need-recurso"
          placeholder="Ej: Agua Potable, Mantas, Medicamentos…"
          error={!!errors.recursoNecesitado}
          value={form.recursoNecesitado ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, recursoNecesitado: e.target.value }))}
        />
      </FormField>

      {/* Cantidad + Unidad en fila */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <FormField id="need-cantidad" label="Cantidad estimada" required error={errors.cantidad}>
          <Input
            id="need-cantidad"
            type="number"
            min={1}
            placeholder="Ej: 100"
            error={!!errors.cantidad}
            value={form.cantidad ?? ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, cantidad: parseInt(e.target.value, 10) || undefined }))
            }
          />
        </FormField>

        <FormField id="need-unidad" label="Unidad">
          <Select
            id="need-unidad"
            options={UNIDAD_OPTIONS}
            value={form.unidad ?? 'Unidades'}
            onChange={(e) => setForm((f) => ({ ...f, unidad: e.target.value }))}
          />
        </FormField>
      </div>

      <FormField
        id="need-ubicacion"
        label="Ubicación geográfica"
        required
        error={errors.ubicacionGeografica}
        hint="Incluye comuna y región para una respuesta más rápida."
      >
        <Input
          id="need-ubicacion"
          placeholder="Ej: Plaza de Armas, San Bernardo, RM"
          error={!!errors.ubicacionGeografica}
          value={form.ubicacionGeografica ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, ubicacionGeografica: e.target.value }))}
        />
      </FormField>

      <FormField id="need-desc" label="Descripción adicional" hint="Opcional — contexto sobre urgencia o condiciones.">
        <Textarea
          id="need-desc"
          placeholder="Ej: Se requiere con urgencia, hay 50 personas sin agua desde ayer…"
          rows={3}
          value={form.descripcionAdicional ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, descripcionAdicional: e.target.value }))}
        />
      </FormField>

      <Button
        variant="primary"
        type="submit"
        loading={loading}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        📤 Enviar Solicitud de Ayuda
      </Button>
    </form>
  );
};