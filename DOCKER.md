# Docker Build Guide

This guide explains how to build, test, and validate the Underworld Writer package using Docker.

## Prerequisites

- Docker Engine 20.10+ or Docker Desktop
- At least 2GB of available disk space
- ~5 minutes for a full build

## Quick Start

### Build the Docker image

```bash
# Basic build (all stages)
docker build -t underworld-writer:latest .

# Build specific stage
docker build --target builder -t underworld-writer:builder .
docker build --target validator -t underworld-writer:validator .
docker build --target runtime -t underworld-writer:runtime .
```

### Run the image

```bash
# Show CLI help
docker run --rm underworld-writer:latest node dist/cli.js --help

# Interactive shell in runtime
docker run --rm -it underworld-writer:latest /bin/sh
```

## Docker Architecture

The Dockerfile uses a **multi-stage build** for efficiency and security:

### 1. **Builder Stage** (`builder`)
- Installs Node.js dependencies
- Compiles TypeScript to JavaScript
- Produces optimized build artifacts
- **Does NOT include**: tests, dev dependencies, source files

**Image size**: ~300-400MB (with node_modules)

### 2. **Validator Stage** (`validator`)
- Inherits build artifacts from builder
- Runs validation checks
- Executes workspace tests
- Validates all exports and entry points
- **Does NOT include**: source files, dev dependencies

**Image size**: ~350-450MB (with node_modules)

### 3. **Runtime Stage** (`runtime`)
- Minimal production image
- Contains only dist/ and node_modules
- Runs as non-root user (nodejs:1000)
- Optimized for deployment
- **Does NOT include**: source, tests, or build tools

**Image size**: ~280-350MB

## Docker Compose Setup

Use docker-compose for orchestrated multi-stage testing:

```bash
# Build all services
docker-compose build

# Run validator (includes builder dependency)
docker-compose up validator

# Run runtime service
docker-compose run runtime

# Development mode with live reload
docker-compose run dev

# Cleanup
docker-compose down
docker-compose down -v  # with volumes
```

### Services

- **builder**: Compiles TypeScript, tagged as `underworld-writer:builder-latest`
- **validator**: Validates build output, depends on builder
- **runtime**: Production-ready image, tagged as `underworld-writer:latest`
- **dev**: Development image with npm watch mode

## Build Scripts

### Automated Docker Build (`scripts/build-docker.sh`)

Builds all stages with timestamps and validation:

```bash
bash scripts/build-docker.sh
```

**Output**:
- Three timestamped images (builder, validator, runtime)
- Automatic `latest` tags
- Build logs for each stage
- Image size report
- Success/failure summary

**Example output**:
```
✓ Builder stage built successfully
✓ Validator stage built successfully
✓ Runtime stage built successfully
✓ All images tagged as latest

Built images:
  - underworld-writer:builder-20260920_150000
  - underworld-writer:validator-20260920_150000
  - underworld-writer:runtime-20260920_150000
```

### Local Build Validation (`scripts/validate-build.sh`)

Validates build without Docker:

```bash
bash scripts/validate-build.sh
```

**Checks**:
- System requirements (Node.js >= 20)
- Dependencies installation
- TypeScript compilation
- Build artifact presence
- Linting
- Unit tests
- CLI functionality

## Build Configuration Files

### `.dockerignore`
Optimizes build context by excluding:
- Node modules (rebuilt in image)
- Generated files
- Git metadata
- Development configs
- Large output directories

### `docker-compose.yml`
Defines multi-stage services with:
- Dependency ordering
- Volume mounts
- Environment variables
- Build targets

## Validation Checks

The Dockerfile includes built-in validation:

```dockerfile
# Builder stage
✓ npm ci                    # Install exact dependencies
✓ npm run build            # Compile TypeScript

# Validator stage
✓ Artifact verification    # Check all files exist
✓ Export validation        # Verify entry points
✓ Test execution           # Run workspace tests
✓ CLI functionality        # Test CLI interface
```

## Image Inspection

### List images
```bash
docker images | grep underworld-writer
```

### Inspect image layers
```bash
docker history underworld-writer:latest
```

### Check image contents
```bash
docker run --rm underworld-writer:latest ls -la /workspace/dist/
```

### View entry point
```bash
docker inspect underworld-writer:latest | grep -A5 Cmd
```

## Troubleshooting

### Build fails at "npm ci"
**Problem**: Network connectivity or corrupted cache
**Solution**:
```bash
docker builder prune  # Clear build cache
docker build --no-cache -t underworld-writer:latest .
```

### Image too large
**Problem**: Layers not optimized
**Solution**: Check `.dockerignore` includes all large directories

### Tests fail in validator stage
**Problem**: Missing fixtures or environment
**Solution**: Verify `validation-tests/` directory structure matches expected paths

### Permission denied errors
**Problem**: Volume mount permissions on Linux
**Solution**:
```bash
docker run -u 0:0 --rm underworld-writer:latest chmod -R 755 /workspace
```

## Performance Tips

### Cache optimization
```bash
# Use BuildKit for better layer caching
export DOCKER_BUILDKIT=1
docker build -t underworld-writer:latest .
```

### Parallel builds
```bash
# Build stages in parallel
docker build --target builder -t uw:builder . &
docker build --target validator -t uw:validator . &
wait
```

### Layer reuse
Structure Dockerfile to maximize cache hits:
1. Copy only package files first
2. Install dependencies
3. Copy source code last

## Production Deployment

### Tag for registry
```bash
docker tag underworld-writer:latest myregistry.com/uw:latest
docker push myregistry.com/uw:latest
```

### Run in production
```bash
docker run \
  --rm \
  --name underworld-writer \
  --user nodejs:nodejs \
  --read-only \
  --security-opt=no-new-privileges \
  myregistry.com/uw:latest
```

### Health check
```bash
docker run \
  --health-cmd='node dist/index.js --version || exit 1' \
  --health-interval=30s \
  -d myregistry.com/uw:latest
```

## Security Best Practices

✓ **Non-root user**: Runtime runs as nodejs:1000  
✓ **Read-only root**: Use `--read-only` in production  
✓ **Minimal base**: Alpine Linux reduces attack surface  
✓ **No secrets**: .dockerignore prevents env leaks  
✓ **Staged builds**: Production image excludes dev tools  

## CI/CD Integration

### GitHub Actions
```yaml
- name: Build Docker image
  run: |
    docker build -t uw:${{ github.sha }} .
    docker run --rm uw:${{ github.sha }} npm test

- name: Push to registry
  run: |
    docker tag uw:${{ github.sha }} registry.example.com/uw:latest
    docker push registry.example.com/uw:latest
```

### GitLab CI
```yaml
docker-build:
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
```

## Manual Build Steps (without Docker)

If Docker is unavailable, use the local validation script:

```bash
bash scripts/validate-build.sh
```

This performs equivalent checks:
- Dependency installation
- TypeScript compilation
- Artifact validation
- Linting and testing
- CLI functionality

## Maintenance

### Clean up images
```bash
# Remove dangling images
docker image prune

# Remove all underworld-writer images
docker images | grep underworld-writer | awk '{print $3}' | xargs docker rmi

# Keep only latest
docker images --filter "reference=underworld-writer:*" --format "{{.Repository}}:{{.Tag}}" | grep -v latest | xargs docker rmi
```

### Update base image
```bash
# Check for updates
docker pull node:22-alpine

# Rebuild with fresh base
docker build --no-cache -t underworld-writer:latest .
```

### Version pinning
For production, pin the base image:
```dockerfile
FROM node:22.22.2-alpine  # Instead of node:22-alpine
```

## References

- [Docker Documentation](https://docs.docker.com/)
- [Node.js Docker Image](https://hub.docker.com/_/node)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)
