// ─── Design Tokens de Donaton ─────────────────────────────────────────────────
import type { EstadoBadge } from '../types';

export const colors = {
  accent:      '#D85A30',
  accentLight: '#FAECE7',
  accentDark:  '#993C1D',
  teal:        '#1D9E75',
  tealLight:   '#E1F5EE',
  blue:        '#378ADD',
  blueLight:   '#E6F1FB',
  amber:       '#BA7517',
  amberLight:  '#FAEEDA',
  green:       '#3B6D11',
  greenLight:  '#EAF3DE',
  red:         '#A32D2D',
  redLight:    '#FCEBEB',
  gray:        '#888780',
  grayLight:   '#F1EFE8',
} as const;

export interface EstadoColorConfig {
  bg: string;
  text: string;
  label: string;
}

export const estadoColorMap: Record<EstadoBadge, EstadoColorConfig> = {
  EN_PREPARACION: { bg: colors.amberLight, text: colors.amber,  label: 'En Preparación' },
  EN_RUTA:        { bg: colors.blueLight,  text: colors.blue,   label: 'En Ruta'        },
  ENTREGADO:      { bg: colors.greenLight, text: colors.green,  label: 'Entregado'      },
  FALLBACK:       { bg: colors.redLight,   text: colors.red,    label: 'No Disponible'  },
  PENDIENTE:      { bg: colors.amberLight, text: colors.amber,  label: 'Pendiente'      },
  ATENDIDA:       { bg: colors.tealLight,  text: colors.teal,   label: 'Atendida'       },
};

export const cssVariables = `
  :root {
    --don-accent:       ${colors.accent};
    --don-accent-light: ${colors.accentLight};
    --don-accent-dark:  ${colors.accentDark};
    --don-teal:         ${colors.teal};
    --don-blue:         ${colors.blue};
    --don-amber:        ${colors.amber};
    --don-green:        ${colors.green};
    --don-red:          ${colors.red};
    --don-radius-sm:    6px;
    --don-radius-md:    8px;
    --don-radius-lg:    12px;
  }
`;