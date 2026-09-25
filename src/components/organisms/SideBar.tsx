import React from 'react';
import { useAdminAuth } from './../../hooks/useAdminAuth';

export interface NavItem {
  key: string;
  label: string;
  icon: string;
  section: string;
}

export interface SidebarProps {
  activeKey: string;
  onNavigate: (key: string) => void;
  className?: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard',   label: 'Dashboard',       icon: '⊞',  section: 'General'      },
  { key: 'envios',      label: 'Envíos',           icon: '🚛', section: 'Logística'    },
  { key: 'acopios',     label: 'Centros de Acopio',icon: '🏪', section: 'Logística'    },
  { key: 'necesidades', label: 'Reportes (Admin)', icon: '📋', section: 'Necesidades'  },
  { key: 'reportar',    label: 'Solicitar Ayuda',  icon: '➕', section: 'Necesidades'  },
  { key: 'donaciones',  label: 'Donación',         icon: '🤝', section: 'Donación'     }
];

// Agrupar por sección
function groupBySección(items: NavItem[]) {
  return items.reduce<Record<string, NavItem[]>>((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});
}

/**
 * ORGANISMO — Sidebar
 * Navegación lateral con agrupación por sección e ítem activo.
 *
 * @example
 * <Sidebar activeKey="envios" onNavigate={(key) => setView(key)} />
 */
export const Sidebar: React.FC<SidebarProps> = ({ activeKey, onNavigate, className = '' }) => {
  const grouped = groupBySección(NAV_ITEMS);
  const { authenticateAdmin, loading, error } = useAdminAuth();

  const handleNavigation = async (key: string) => {
    // Interceptar solo si se presiona la opción de Reportes (Admin)
    if (key === 'necesidades') {
      const isAdmin = await authenticateAdmin();
      if (isAdmin) {
        onNavigate(key);
      }
    } else {
      onNavigate(key);
    }
  };

  return (
    <nav
      className={`don-sidebar ${className}`}
      aria-label="Navegación principal"
      style={{
        width:          '220px',
        background:     '#fff',
        borderRight:    '0.5px solid rgba(0,0,0,0.08)',
        height:         '100vh',
        display:        'flex',
        flexDirection:  'column',
        position:       'fixed',
        top:            0,
        left:           0,
        zIndex:         10,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px', height: '32px', background: '#D85A30',
            borderRadius: '8px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '18px',
          }}>
            🤝
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.5px' }}>
            Dona<span style={{ color: '#D85A30' }}>ton</span>
          </span>
        </div>
      </div>

      {/* Nav sections */}
      <div style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
        {Object.entries(grouped).map(([section, items]) => (
          <div key={section} style={{ marginBottom: '1.5rem' }}>
            <p style={{
              fontSize: '10px', fontWeight: 500, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: '#B4B2A9',
              padding: '0 0.5rem', marginBottom: '0.5rem',
            }}>
              {section}
            </p>
            {items.map((item) => {
              const isActive = item.key === activeKey;
              const isAuthenticatingAdmin = loading && item.key === 'necesidades';

              return (
                <button
                  key={item.key}
                  onClick={() => handleNavigation(item.key)}
                  disabled={isAuthenticatingAdmin}
                  aria-current={isActive ? 'page' : undefined}
                  style={{
                    display:        'flex',
                    alignItems:     'center',
                    gap:            '10px',
                    width:          '100%',
                    padding:        '8px 10px',
                    borderRadius:   '8px',
                    border:         'none',
                    background:     isActive ? '#FAECE7' : 'transparent',
                    color:          isActive ? '#993C1D' : '#5F5E5A',
                    fontWeight:     isActive ? 500 : 400,
                    fontSize:       '13.5px',
                    cursor:         isAuthenticatingAdmin ? 'wait' : 'pointer',
                    fontFamily:     'inherit',
                    textAlign:      'left',
                    marginBottom:   '2px',
                    transition:     'all 0.15s',
                    opacity:        isAuthenticatingAdmin ? 0.6 : 1,
                  }}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {isAuthenticatingAdmin ? 'Autenticando...' : item.label}
                </button>
              );
            })}
          </div>
        ))}

        {/* Notificación de error en permisos */}
        {error && (
          <p style={{ padding: '0 0.5rem', color: '#D32F2F', fontSize: '11px', marginTop: '4px' }}>
            ⚠️ {error}
          </p>
        )}
      </div>
    </nav>
  );
};