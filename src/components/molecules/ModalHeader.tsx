import React from 'react';
import { Button } from '../atoms/Button';

export interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

/**
 * MOLÉCULA — ModalHeader
 * Cabecera estándar de modal: título + botón cerrar.
 *
 * @example
 * <ModalHeader title="Planificar Nuevo Envío" onClose={() => setOpen(false)} />
 */
export const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => (
  <div
    style={{
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      marginBottom:   '1.25rem',
    }}
  >
    <h2 style={{ fontSize: '17px', fontWeight: 700, margin: 0 }}>{title}</h2>
    <Button
      variant="ghost"
      size="sm"
      onClick={onClose}
      aria-label="Cerrar modal"
      style={{ fontSize: '18px', padding: '4px' }}
    >
      ✕
    </Button>
  </div>
);