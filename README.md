# @donaton/ui — v2

Biblioteca de componentes **React + TypeScript** para la plataforma Donaton.
Arquitectura **Atomic Design**: átomos → moléculas → organismos → templates → páginas.

## Instalación

```bash
npm install @donaton/ui
```

Requiere `react >= 18` como peer dependency.

---

## Arquitectura

```
src/
├── atoms/          # Unidades mínimas: Badge, Button, Input, Select…
├── molecules/      # Combinaciones: FormField, StatCard, NeedCard…
├── organisms/      # Secciones completas: ShipmentTable, PlanForm…
├── templates/      # Layouts por módulo: LogisticsLayout, PublicFormLayout…
├── pages/          # Páginas conectadas al BFF: EnviosPage, ReportarPage…
├── types/          # Contratos de datos del BFF
└── tokens/         # Colores, CSS variables, estadoColorMap
```

**Regla de dependencia:** cada nivel importa solo del nivel inmediatamente inferior.
Las páginas no importan átomos directamente.

---

## Uso rápido

### Shell completo (App)

```tsx
import { App } from '@donaton/ui';

// main.tsx
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

### Solo el módulo de logística

```tsx
import { LogisticsLayout } from '@donaton/ui';

<LogisticsLayout
  envios={envios}          // Envio[] | EnvioFallback[]
  loading={isLoading}
  onCreateEnvio={crearEnvio}
  saving={isSaving}
/>
```

### Solo el formulario público

```tsx
import { PublicFormLayout } from '@donaton/ui';

<PublicFormLayout
  onSubmit={async (data) => {
    await fetch('/api/bff/necesidades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }}
/>
```

---

## Átomos disponibles

| Componente      | Props clave                              | Uso                          |
|-----------------|------------------------------------------|------------------------------|
| `Badge`         | `estado`, `size`                         | Estado envío / necesidad     |
| `Button`        | `variant`, `size`, `loading`             | Acciones                     |
| `Input`         | `error` (boolean)                        | Campos de texto              |
| `Select`        | `options`, `placeholder`, `error`        | Dropdowns tipados            |
| `Label`         | `required`                               | Etiquetas de formulario      |
| `TransportChip` | `tipo`, `showLabel`                      | Tipo de transporte           |
| `Spinner`       | `size`, `color`, `label`                 | Indicador de carga           |
| `Textarea`      | `error`                                  | Áreas de texto               |
| `StatValue`     | `value`, `color`, `size`                 | Número grande en dashboard   |

---

## Manejo de errores del BFF

### Circuit Breaker (fallback de logística)

`ShipmentTable` detecta automáticamente la respuesta de fallback y muestra `FallbackBanner`:

```tsx
// Respuesta normal
<ShipmentTable data={envios} />

// ShipmentTable detecta esto y muestra el banner rojo:
// [{ "error": "Servicio logístico temporalmente no disponible", "estado": "FALLBACK" }]
<ShipmentTable data={fallbackData} />
```

### GlobalExceptionHandler (errores de formulario)

```tsx
import type { ApiError } from '@donaton/ui';

async function crearEnvio(data: NuevoEnvio) {
  const res = await fetch('/api/bff/logistica/envios', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err: ApiError = await res.json();
    // err.status  → 404
    // err.message → "No se encontró la necesidad solicitada."
    mostrarToast(err.message, 'error');
    return;
  }
}
```

---

## Design Tokens

```tsx
import { colors, estadoColorMap, cssVariables } from '@donaton/ui';

// Inyectar CSS variables globales
const style = document.createElement('style');
style.textContent = cssVariables;
document.head.appendChild(style);

// Acceso directo
colors.accent           // '#D85A30'
estadoColorMap.EN_RUTA  // { bg: '#E6F1FB', text: '#378ADD', label: 'En Ruta' }
```

---

## Build

```bash
npm run build      # CJS + ESM en dist/
npm run typecheck  # Solo verificación de tipos
npm run test       # Vitest
```
dependencias azure: npm install @azure/msal-browser @azure/msal-react
---

## Licencia

MIT © Donaton Team