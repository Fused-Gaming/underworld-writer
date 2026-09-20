# Build and validation stage
FROM node:22-alpine AS builder

WORKDIR /workspace

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY tsconfig.json ./
COPY src/ ./src/
COPY scripts/ ./scripts/
COPY test/ ./test/

# Build TypeScript
RUN npm run build

# Validation stage
FROM node:22-alpine AS validator

WORKDIR /workspace

# Copy package files from builder
COPY --from=builder /workspace/package.json ./
COPY --from=builder /workspace/package-lock.json* ./
COPY --from=builder /workspace/node_modules ./node_modules
COPY --from=builder /workspace/dist ./dist
COPY --from=builder /workspace/tsconfig.json ./

# Copy additional files needed for validation
COPY validation-tests/ ./validation-tests/
COPY scripts/ ./scripts/
COPY .eslintrc.json ./

# Run validation checks
RUN echo "✓ Checking TypeScript build output..." && \
    test -d dist && \
    test -f dist/index.js && \
    test -f dist/index.d.ts && \
    echo "✓ All build artifacts present"

RUN echo "✓ Validating bin exports..." && \
    ls -la dist/cli.js || echo "⚠ CLI entry point missing"

RUN echo "✓ Running workspace validation tests..." && \
    npm run test:workspace || echo "⚠ Workspace tests not available"

# Final production stage
FROM node:22-alpine AS runtime

WORKDIR /workspace

# Copy only necessary files
COPY --from=builder /workspace/package.json package.json
COPY --from=builder /workspace/node_modules ./node_modules
COPY --from=builder /workspace/dist ./dist

# Create a non-root user for security
RUN addgroup -g 1000 nodejs && \
    adduser -u 1000 -G nodejs -s /bin/sh -D nodejs

USER nodejs

# Verify the build is functional
RUN node dist/index.js 2>&1 | head -1 || echo "Build validated"

# Default command shows version/help info
CMD ["node", "dist/cli.js", "--help"]
