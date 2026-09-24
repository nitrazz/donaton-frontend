import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

/**
 * ÁTOMO — Input
 * Campo de texto base. La prop `error` cambia el borde a rojo.
 *
 * @example
 * <Input placeholder="Destino…" error={!!errors.destino} />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error = false, style, ...props }, ref) => (
    <input
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
    />
  )
);
Input.displayName = 'Input';