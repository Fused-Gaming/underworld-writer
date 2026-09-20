#!/usr/bin/env bash
# Build and test Docker images for underworld-writer

set -euo pipefail

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

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

# Check Docker is installed
if ! command -v docker &> /dev/null; then
    log_error "Docker is not installed. Please install Docker Desktop or Docker Engine."
    exit 1
fi

# Check Docker daemon is running
if ! docker ps &> /dev/null; then
    log_error "Docker daemon is not running. Please start Docker."
    exit 1
fi

log_success "Docker is available: $(docker --version)"

cd "$PROJECT_ROOT"

# Build stages
log_info "Building Docker image stages..."

# Builder stage
log_info "Building builder stage..."
if docker build -t underworld-writer:builder-${TIMESTAMP} \
    --target builder \
    --progress=plain \
    . > build-output-builder-${TIMESTAMP}.log 2>&1; then
    log_success "Builder stage built successfully"
else
    log_error "Builder stage failed. Check build-output-builder-${TIMESTAMP}.log"
    tail -50 build-output-builder-${TIMESTAMP}.log
    exit 1
fi

# Validator stage
log_info "Building validator stage..."
if docker build -t underworld-writer:validator-${TIMESTAMP} \
    --target validator \
    --progress=plain \
    . > build-output-validator-${TIMESTAMP}.log 2>&1; then
    log_success "Validator stage built successfully"
else
    log_error "Validator stage failed. Check build-output-validator-${TIMESTAMP}.log"
    tail -50 build-output-validator-${TIMESTAMP}.log
    exit 1
fi

# Runtime stage
log_info "Building runtime stage..."
if docker build -t underworld-writer:runtime-${TIMESTAMP} \
    --target runtime \
    --progress=plain \
    . > build-output-runtime-${TIMESTAMP}.log 2>&1; then
    log_success "Runtime stage built successfully"
else
    log_error "Runtime stage failed. Check build-output-runtime-${TIMESTAMP}.log"
    tail -50 build-output-runtime-${TIMESTAMP}.log
    exit 1
fi

# Tag latest
log_info "Tagging images as latest..."
docker tag underworld-writer:builder-${TIMESTAMP} underworld-writer:builder-latest
docker tag underworld-writer:validator-${TIMESTAMP} underworld-writer:validator-latest
docker tag underworld-writer:runtime-${TIMESTAMP} underworld-writer:runtime-latest

log_success "All images tagged as latest"

# Test the runtime image
log_info "Testing runtime image..."
if docker run --rm underworld-writer:runtime-${TIMESTAMP} 2>&1 | head -5; then
    log_success "Runtime image is functional"
else
    log_error "Runtime image test failed"
    exit 1
fi

# Show image sizes
log_info "Image sizes:"
docker images --filter "reference=underworld-writer:*-${TIMESTAMP}" --format "table {{.Repository}}:{{.Tag}}\t{{.Size}}"

log_success "Docker build complete!"
log_info "Built images:"
log_info "  - underworld-writer:builder-${TIMESTAMP} (latest: builder-latest)"
log_info "  - underworld-writer:validator-${TIMESTAMP} (latest: validator-latest)"
log_info "  - underworld-writer:runtime-${TIMESTAMP} (latest: runtime-latest)"

echo ""
log_info "To run the runtime image:"
echo "    docker run --rm underworld-writer:runtime-${TIMESTAMP} node dist/cli.js --help"

log_info "To run with docker-compose:"
echo "    docker-compose build"
echo "    docker-compose up validator"
echo "    docker-compose run runtime"
