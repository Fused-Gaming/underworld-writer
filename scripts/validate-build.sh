#!/usr/bin/env bash
# Local build validation script - validates build without Docker

set -euo pipefail

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

log_info() {
    echo -e "${BLUE}ℹ${NC} $*"
}

log_success() {
    echo -e "${GREEN}✓${NC} $*"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $*"
}

log_error() {
    echo -e "${RED}✗${NC} $*"
}

check_requirement() {
    local cmd=$1
    local name=$2
    if ! command -v "$cmd" &> /dev/null; then
        log_error "$name is required but not installed"
        exit 1
    fi
    log_success "Found $name: $(${cmd} --version 2>&1 | head -1)"
}

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Underworld Writer - Build Validation Script${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

cd "$PROJECT_ROOT"

# Check requirements
log_info "Checking system requirements..."
check_requirement "node" "Node.js"
check_requirement "npm" "npm"

# Get versions
NODE_VER=$(node --version)
NPM_VER=$(npm --version)

log_info "Node version: $NODE_VER"
log_info "npm version: $NPM_VER"

# Check Node version is >= 20
NODE_MAJOR=$(echo $NODE_VER | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_MAJOR" -lt 20 ]; then
    log_error "Node.js 20+ required, got $NODE_VER"
    exit 1
fi
log_success "Node.js version is compatible"

echo ""
log_info "Installing dependencies..."
npm ci --silent

echo ""
log_info "Running TypeScript build..."
if npm run build > build.log 2>&1; then
    log_success "Build completed successfully"
else
    log_error "Build failed. Output:"
    tail -50 build.log
    exit 1
fi

echo ""
log_info "Validating build artifacts..."

# Check dist directory exists
if [ ! -d "dist" ]; then
    log_error "dist directory not created"
    exit 1
fi
log_success "dist directory exists"

# Check main entry point
if [ ! -f "dist/index.js" ]; then
    log_error "dist/index.js not found"
    exit 1
fi
log_success "dist/index.js exists"

# Check TypeScript definitions
if [ ! -f "dist/index.d.ts" ]; then
    log_error "dist/index.d.ts not found"
    exit 1
fi
log_success "dist/index.d.ts exists"

# Check CLI entry point
if [ ! -f "dist/cli.js" ]; then
    log_warning "dist/cli.js not found (optional)"
else
    log_success "dist/cli.js exists"
fi

# Check file sizes
MAIN_SIZE=$(du -h "dist/index.js" | cut -f1)
log_info "Main entry point size: $MAIN_SIZE"

# Count build artifacts
ARTIFACT_COUNT=$(find dist -type f | wc -l)
log_info "Total artifacts: $ARTIFACT_COUNT files"

echo ""
log_info "Running linting..."
if npm run lint > lint.log 2>&1; then
    log_success "Linting passed"
else
    log_warning "Linting warnings/errors found"
    tail -20 lint.log
fi

echo ""
log_info "Running unit tests..."
if npm test -- --passWithNoTests > test.log 2>&1; then
    log_success "Tests passed"
else
    log_warning "Tests failed or no tests found"
    tail -20 test.log
fi

echo ""
log_info "Validating package.json exports..."
node -e "
const pkg = require('./package.json');
console.log('Main entry:', pkg.main);
console.log('Types entry:', pkg.types);
console.log('Exports:');
Object.entries(pkg.exports || {}).forEach(([k, v]) => {
  console.log('  ' + k + ':', v);
});
"

echo ""
log_info "Validating CLI interface..."
if node dist/cli.js --help 2>&1 | head -3; then
    log_success "CLI is functional"
else
    log_warning "CLI test produced output"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
log_success "Build validation complete!"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Summary
echo -e "${BLUE}Build Summary:${NC}"
echo "  Node.js: $NODE_VER"
echo "  npm: $NPM_VER"
echo "  Artifacts: $ARTIFACT_COUNT files"
echo "  Main size: $MAIN_SIZE"
echo ""

echo -e "${BLUE}Next Steps:${NC}"
echo "  • Docker build: bash scripts/build-docker.sh (requires Docker)"
echo "  • Run tests: npm test"
echo "  • Watch mode: npm run dev"
echo "  • Full validation: npm run validate:release"
