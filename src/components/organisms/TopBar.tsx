import React from 'react';
import { Button } from '../atoms/Button';

export interface TopbarAction {
  label: string;
  icon?: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export interface TopbarProps {
  title: string;
  subtitle?: string;
  actions?: TopbarAction[];
  className?: string;
}

/**
 * ORGANISMO — Topbar
 * Encabezado de página con título, subtítulo y acciones opcionales.
 *
 * @example
 * <Topbar
 *   title="Gestión de Envíos"
 *   subtitle="Logística y distribución"
 *   actions={[{ label: 'Nuevo Envío', icon: '＋', onClick: openModal, variant: 'primary' }]}
 * />
 */
export const Topbar: React.FC<TopbarProps> = ({ title, subtitle, actions = [], className = '' }) => (
  <header
    className={`don-topbar ${className}`}
    style={{
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      marginBottom:   '2rem',
    }}
  >
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>{title}</h1>
      {subtitle && (
        <p style={{ fontSize: '13px', color: '#888780', marginTop: '2px' }}>{subtitle}</p>
      )}
    </div>

    {actions.length > 0 && (
      <div style={{ display: 'flex', gap: '8px' }}>
        {actions.map((action, i) => (
          <Button
            key={i}
            variant={action.variant ?? 'secondary'}
            onClick={action.onClick}
          >
            {action.icon && <span aria-hidden="true">{action.icon}</span>}
            {action.label}
          </Button>
        ))}
      </div>
    )}
  </header>
);