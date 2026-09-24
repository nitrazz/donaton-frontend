import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
  error?: boolean;
}

/**
 * ÁTOMO — Select
 * Dropdown tipado con opciones + placeholder opcional.
 *
 * @example
 * <Select
 *   options={[{ value: 'AEREO', label: '✈️ Aéreo' }]}
 *   placeholder="Seleccionar…"
 * />
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, placeholder, error = false, style, ...props }, ref) => (
    <select
      ref={ref}
      style={{
        width:        '100%',
        padding:      '8px 10px',
        borderRadius: '8px',
        border:       `0.5px solid ${error ? '#A32D2D' : 'rgba(0,0,0,0.2)'}`,
        fontSize:     '13.5px',
        fontFamily:   'inherit',
        outline:      'none',
        background:   '#fff',
        color:        'inherit',
        ...style,
      }}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
);
Select.displayName = 'Select';