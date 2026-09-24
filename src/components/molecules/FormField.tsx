import React from 'react';
import { Label } from '../atoms/Label';

export interface FormFieldProps {
  /** id que conecta Label con el input via htmlFor */
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * MOLÉCULA — FormField
 * Combina Label + input/select/textarea + mensaje de error.
 * El `children` es el átomo Input, Select o Textarea correspondiente.
 *
 * @example
 * <FormField id="destino" label="Destino" required error={errors.destino}>
 *   <Input id="destino" placeholder="Ej: Hospital Regional" error={!!errors.destino} />
 * </FormField>
 */
export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  required,
  error,
  hint,
  children,
  className = '',
}) => (
  <div className={`don-form-field ${className}`} style={{ marginBottom: '1rem' }}>
    <Label htmlFor={id} required={required}>
      {label}
    </Label>

    {children}

    {hint && !error && (
      <p style={{ fontSize: '11px', color: '#888780', marginTop: '3px' }}>
        {hint}
      </p>
    )}

    {error && (
      <p
        id={`${id}-error`}
        role="alert"
        style={{ fontSize: '11px', color: '#A32D2D', marginTop: '3px' }}
      >
        {error}
      </p>
    )}
  </div>
);