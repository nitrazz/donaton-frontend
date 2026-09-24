import React from 'react';

export interface TabItem {
  key: string;
  label: string;
  count?: number;
}

export interface TabBarProps {
  tabs: TabItem[];
  active: string;
  onChange: (key: string) => void;
  className?: string;
}

/**
 * MOLÉCULA — TabBar
 * Barra de pestañas reutilizable con contador opcional por tab.
 *
 * @example
 * <TabBar
 *   tabs={[
 *     { key: 'TODOS', label: 'Todos' },
 *     { key: 'EN_RUTA', label: 'En Ruta', count: 3 },
 *   ]}
 *   active="TODOS"
 *   onChange={(key) => setFilter(key)}
 * />
 */
export const TabBar: React.FC<TabBarProps> = ({ tabs, active, onChange, className = '' }) => (
  <div
    role="tablist"
    className={`don-tab-bar ${className}`}
    style={{ display: 'flex', borderBottom: '0.5px solid rgba(0,0,0,0.1)' }}
  >
    {tabs.map((tab) => {
      const isActive = tab.key === active;
      return (
        <button
          key={tab.key}
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(tab.key)}
          style={{
            padding:      '10px 1.25rem',
            fontSize:     '13px',
            fontWeight:   isActive ? 500 : 400,
            color:        isActive ? '#D85A30' : '#888780',
            background:   'none',
            border:       'none',
            borderBottom: isActive ? '2px solid #D85A30' : '2px solid transparent',
            cursor:       'pointer',
            marginBottom: '-1px',
            transition:   'all 0.15s',
            fontFamily:   'inherit',
            display:      'flex',
            alignItems:   'center',
            gap:          '6px',
          }}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              style={{
                fontSize:        '10px',
                background:      'rgba(0,0,0,0.07)',
                padding:         '1px 5px',
                borderRadius:    '99px',
                color:           isActive ? '#D85A30' : '#888780',
              }}
            >
              {tab.count}
            </span>
          )}
        </button>
      );
    })}
  </div>
);