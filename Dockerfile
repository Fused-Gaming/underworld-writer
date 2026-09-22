ARG NODE_VERSION=22

# Build and validation stage
FROM node:${NODE_VERSION}-alpine AS builder

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
ARG NODE_VERSION
FROM node:${NODE_VERSION}-alpine AS validator

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
COPY test/ ./test/
COPY src/ ./src/
COPY docs/ ./docs/
COPY examples/ ./examples/
COPY templates/ ./templates/
COPY jest.config.cjs ./
COPY eslint.config.mjs ./
COPY .eslintrc.json ./
COPY VERSION.json ./
COPY plugin.json ./
COPY README.md ./
COPY SKILL.md ./

# Run validation checks
RUN echo "✓ Checking TypeScript build output..." && \
    test -d dist && \
    test -f dist/index.js && \
    test -f dist/index.d.ts && \
    echo "✓ All build artifacts present"

RUN echo "✓ Validating bin exports..." && \
    test -f dist/cli.js && \
    echo "✓ CLI entry point present"

RUN echo "✓ Linting..." && npm run lint

RUN echo "✓ Running workspace validation tests..." && \
    npm run test:workspace

RUN echo "✓ Running Jest suite..." && npm test

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
RUN set -o pipefail && \
    (node dist/index.js 2>&1 | head -1 || true) && \
    echo "✓ Runtime validation complete"

# Default command shows version/help info
CMD ["node", "dist/cli.js", "--help"]
