import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

/**
 * ÁTOMO — Textarea
 * Área de texto base con soporte de estado error.
 *
 * @example
 * <Textarea placeholder="Descripción adicional…" rows={3} />
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error = false, style, ...props }, ref) => (
    <textarea
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
        resize:       'vertical',
        minHeight:    '80px',
        ...style,
      }}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';