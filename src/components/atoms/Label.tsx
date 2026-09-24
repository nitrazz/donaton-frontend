import React from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

/**
 * ÁTOMO — Label
 * Etiqueta para campos de formulario. Agrega * si required.
 *
 * @example
 * <Label htmlFor="destino" required>Destino</Label>
 */
export const Label: React.FC<LabelProps> = ({ required, children, style, ...props }) => (
  <label
    style={{
      display:    'block',
      fontSize:   '12px',
      fontWeight: 500,
      color:      '#5F5E5A',
      marginBottom: '5px',
      ...style,
    }}
    {...props}
  >
    {children}
    {required && (
      <span aria-hidden="true" style={{ color: '#D85A30', marginLeft: '2px' }}>*</span>
    )}
  </label>
);