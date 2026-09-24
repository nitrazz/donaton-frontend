// ─── @donaton/ui v2 — Atomic Design + TypeScript ─────────────────────────────

// ── Átomos ────────────────────────────────────────────────────────────────────
export { Badge, Button, Input, Select, Label, TransportChip, Spinner, Textarea, StatValue }
  from './components/atoms';
export type { BadgeProps, ButtonProps, ButtonVariant, ButtonSize, InputProps,
  SelectProps, SelectOption, LabelProps, TransportChipProps, SpinnerProps,
  TextareaProps, StatValueProps }
  from './components/atoms';

// ── Moléculas ─────────────────────────────────────────────────────────────────
export { FormField, StatCard, TableRow, NeedCard, FallbackBanner, TabBar, ModalHeader }
  from './components/molecules';
export type { FormFieldProps, StatCardProps, DeltaType, TableRowProps, NeedCardProps,
  FallbackBannerProps, TabBarProps, TabItem, ModalHeaderProps }
  from './components/molecules';

// ── Organismos ────────────────────────────────────────────────────────────────
export { StatsRow, ShipmentTable, NeedCardGrid, PlanForm, NeedReportForm, Sidebar, Topbar }
  from './components/organisms';
export type { StatsRowProps, ShipmentTableProps, NeedCardGridProps, PlanFormProps,
  NeedReportFormProps, SidebarProps, NavItem, TopbarProps, TopbarAction }
  from './components/organisms';

// ── Templates ─────────────────────────────────────────────────────────────────
export { LogisticsLayout, NeedsAdminLayout, PublicFormLayout, DashboardLayout }
  from './components/templates';
export type { LogisticsLayoutProps, NeedsAdminLayoutProps, PublicFormLayoutProps,
  DashboardLayoutProps }
  from './components/templates';

// ── Páginas ───────────────────────────────────────────────────────────────────
export { DashboardPage, EnviosPage, NecesidadesPage, ReportarPage }
  from './components/pages';

// ── App shell ─────────────────────────────────────────────────────────────────
export { App } from './App';

// ── Tipos del BFF ─────────────────────────────────────────────────────────────
export type { Envio, EnvioFallback, Necesidad, NuevaNecesidad, NuevoEnvio,
  ApiError, EstadoEnvio, EstadoNecesidad, EstadoBadge, TipoTransporte,
  isEnvioFallback }
  from './types';

// ── Design tokens ─────────────────────────────────────────────────────────────
export { colors, estadoColorMap, cssVariables } from './tokens';
export type { EstadoColorConfig } from './tokens';