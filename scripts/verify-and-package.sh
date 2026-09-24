#!/usr/bin/env bash
# =============================================================================
# verify-and-package.sh
# Verifica la estructura completa de @donaton/ui y empaqueta los outputs.
# Uso: bash scripts/verify-and-package.sh
# =============================================================================

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT_DIR/src"
OUTPUT_DIR="$ROOT_DIR/dist"
PACKAGE_NAME="donaton-ui-atomic"

# Colores
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[1;33m"
CYAN="\033[0;36m"
RESET="\033[0m"

ERRORS=0

# -----------------------------------------------------------------------------
# Helpers
# -----------------------------------------------------------------------------
ok()   { echo -e "  ${GREEN}✓${RESET}  $1"; }
fail() { echo -e "  ${RED}✗${RESET}  $1"; ERRORS=$((ERRORS + 1)); }
info() { echo -e "\n${CYAN}▶ $1${RESET}"; }
warn() { echo -e "  ${YELLOW}⚠${RESET}  $1"; }

check_file() {
  local path="$1"
  if [ -f "$path" ]; then
    ok "$path"
  else
    fail "FALTA: $path"
  fi
}

# -----------------------------------------------------------------------------
# 1. Verificar archivos de configuración raíz
# -----------------------------------------------------------------------------
info "Archivos de configuración raíz"
check_file "$ROOT_DIR/package.json"
check_file "$ROOT_DIR/tsconfig.json"
check_file "$ROOT_DIR/rollup.config.js"
check_file "$ROOT_DIR/README.md"

# -----------------------------------------------------------------------------
# 2. Verificar tokens y tipos
# -----------------------------------------------------------------------------
info "Tokens y tipos"
check_file "$SRC/types/index.ts"
check_file "$SRC/tokens/index.ts"

# -----------------------------------------------------------------------------
# 3. Verificar átomos
# -----------------------------------------------------------------------------
info "Átomos (9 esperados)"
ATOMS=("Badge" "Button" "Input" "Select" "Label" "TransportChip" "Spinner" "Textarea" "StatValue")
for atom in "${ATOMS[@]}"; do
  check_file "$SRC/atoms/${atom}.tsx"
done
check_file "$SRC/atoms/index.ts"

# -----------------------------------------------------------------------------
# 4. Verificar moléculas
# -----------------------------------------------------------------------------
info "Moléculas (7 esperadas)"
MOLECULES=("FormField" "StatCard" "TableRow" "NeedCard" "FallbackBanner" "TabBar" "ModalHeader")
for mol in "${MOLECULES[@]}"; do
  check_file "$SRC/molecules/${mol}.tsx"
done
check_file "$SRC/molecules/index.ts"

# -----------------------------------------------------------------------------
# 5. Verificar organismos
# -----------------------------------------------------------------------------
info "Organismos (7 esperados)"
ORGANISMS=("StatsRow" "ShipmentTable" "NeedCardGrid" "PlanForm" "NeedReportForm" "Sidebar" "Topbar")
for org in "${ORGANISMS[@]}"; do
  check_file "$SRC/organisms/${org}.tsx"
done
check_file "$SRC/organisms/index.ts"

# -----------------------------------------------------------------------------
# 6. Verificar templates
# -----------------------------------------------------------------------------
info "Templates (4 esperados)"
TEMPLATES=("LogisticsLayout" "NeedsAdminLayout" "PublicFormLayout" "DashboardLayout")
for tmpl in "${TEMPLATES[@]}"; do
  check_file "$SRC/templates/${tmpl}.tsx"
done
check_file "$SRC/templates/index.ts"

# -----------------------------------------------------------------------------
# 7. Verificar páginas y App
# -----------------------------------------------------------------------------
info "Páginas y App shell"
check_file "$SRC/pages/index.tsx"
check_file "$SRC/App.tsx"
check_file "$SRC/index.ts"

# -----------------------------------------------------------------------------
# 8. Resumen de estructura
# -----------------------------------------------------------------------------
info "Conteo total de archivos"
TOTAL=$(find "$SRC" -type f | wc -l | tr -d ' ')
echo -e "  Archivos en src/: ${CYAN}${TOTAL}${RESET} (esperados: 36)"
if [ "$TOTAL" -eq 36 ]; then
  ok "Conteo correcto"
else
  warn "El conteo difiere del esperado (36). Revisa si agregaste o eliminaste archivos."
fi

# -----------------------------------------------------------------------------
# 9. Resultado de verificación
# -----------------------------------------------------------------------------
echo ""
if [ "$ERRORS" -eq 0 ]; then
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo -e "${GREEN}  ✓ Estructura verificada sin errores.${RESET}"
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
else
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo -e "${RED}  ✗ Se encontraron ${ERRORS} archivo(s) faltante(s).${RESET}"
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  exit 1
fi

# -----------------------------------------------------------------------------
# 10. Empaquetar output
# -----------------------------------------------------------------------------
info "Empaquetando output"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ZIP_NAME="${PACKAGE_NAME}_${TIMESTAMP}.zip"
ZIP_PATH="$ROOT_DIR/$ZIP_NAME"

cd "$ROOT_DIR/.."
zip -r "$ZIP_PATH" "$(basename "$ROOT_DIR")/" \
  --exclude "*/node_modules/*" \
  --exclude "*/.git/*" \
  --exclude "*/dist/*" \
  --exclude "*/*.zip"

ok "Paquete creado: $ZIP_PATH"

# Copiar a outputs si existe la carpeta (entorno de desarrollo)
if [ -d "/mnt/user-data/outputs" ]; then
  cp "$ZIP_PATH" "/mnt/user-data/outputs/${ZIP_NAME}"
  ok "Copiado a /mnt/user-data/outputs/${ZIP_NAME}"
fi

echo ""
echo -e "${GREEN}  ✓ Todo listo. Paquete: ${ZIP_NAME}${RESET}"
echo ""