import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize    = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background:  '#D85A30',
    color:       '#fff',
    borderColor: '#993C1D',
  },
  secondary: {
    background:  'transparent',
    color:       'inherit',
    borderColor: 'rgba(0,0,0,0.2)',
  },
  ghost: {
    background:  'transparent',
    color:       'inherit',
    border:      'none',
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '5px 10px', fontSize: '12px' },
  md: { padding: '8px 14px', fontSize: '13.5px' },
  lg: { padding: '10px 18px', fontSize: '14px' },
};

/**
 * ÁTOMO — Button
 * Botón base con variantes primary / secondary / ghost.
 *
 * @example
 * <Button variant="primary" onClick={…}>Nuevo Envío</Button>
 * <Button variant="secondary" loading>Guardando…</Button>
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  style,
  ...props
}) => (
  <button
    disabled={disabled || loading}
    style={{
      display:       'inline-flex',
      alignItems:    'center',
      gap:           '6px',
      borderRadius:  '8px',
      border:        '0.5px solid',
      fontFamily:    'inherit',
      fontWeight:    500,
      cursor:        disabled || loading ? 'not-allowed' : 'pointer',
      opacity:       disabled || loading ? 0.6 : 1,
      transition:    'all 0.15s',
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...style,
    }}
    {...props}
  >
    {loading ? '⏳' : icon}
    {loading ? 'Cargando…' : children}
  </button>
);