#!/bin/bash
# ═════════════════════════════════════════════════════════════════════════════════
# Environment Variables Validation Script
# Validates that .env.local and eas.json have correct database/API configuration
# Usage: bash scripts/setup-database-config.sh
# ═════════════════════════════════════════════════════════════════════════════════

set -e

echo "🔧 Gaia Pacha Configuration Validation"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check .env.local exists
if [ ! -f ".env.local" ]; then
  echo -e "${YELLOW}⚠️  .env.local not found${NC}"
  echo "Copy from .env.example and add your database credentials"
  exit 1
fi
echo -e "${GREEN}✅ .env.local exists${NC}"

# Validate required database variables
echo ""
echo "🔍 Checking database configuration in .env.local..."

REQUIRED=(
  "DATABASE_HOST"
  "DATABASE_PORT"
  "DATABASE_NAME"
  "DATABASE_USER"
  "DATABASE_PASSWORD"
  "EXPO_PUBLIC_API_URL"
)

MISSING=()
for var in "${REQUIRED[@]}"; do
  if grep -q "^${var}=" .env.local 2>/dev/null; then
    echo -e "${GREEN}✅ ${var}${NC}"
  else
    echo -e "${RED}❌ ${var} missing${NC}"
    MISSING+=("$var")
  fi
done

if [ ${#MISSING[@]} -gt 0 ]; then
  echo ""
  echo -e "${RED}Missing variables:${NC}"
  printf ' - %s\n' "${MISSING[@]}"
  exit 1
fi

# Check eas.json references correct variable
echo ""
echo "🔍 Checking eas.json references EXPO_PUBLIC_API_URL..."

if grep -q '"EXPO_PUBLIC_API_URL"' eas.json; then
  echo -e "${GREEN}✅ eas.json uses EXPO_PUBLIC_API_URL${NC}"
else
  echo -e "${YELLOW}⚠️  eas.json may not reference EXPO_PUBLIC_API_URL${NC}"
fi

# Check Node.js version
if command -v node &> /dev/null; then
  NODE_VERSION=$(node --version)
  echo -e "${GREEN}✅ Node.js ${NODE_VERSION}${NC}"
else
  echo -e "${YELLOW}⚠️  Node.js not found${NC}"
fi

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Configuration validation complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo ""
echo "📚 Next steps:"
echo "   1. Create backend API (see backend-template/README.md)"
echo "   2. Start mobile app: npm start"
echo "   3. Review: SETUP_GUIA_RAPIDA.md"
echo ""
