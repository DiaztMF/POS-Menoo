# syntax=docker/dockerfile:1.7

# ==========================================
# Stage 1: Build Frontend Assets (Vite)
# ==========================================
FROM node:22-alpine AS frontend-builder

WORKDIR /app

# Enable pnpm via npm to ensure reliable installation in Alpine
RUN npm install -g pnpm@10.5.2

# Copy dependency manifests first for layer caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source needed for Vite build
COPY vite.config.ts tsconfig.json components.json ./
COPY routes/ ./routes/
COPY resources/ ./resources/
COPY public/ ./public/

# Build production assets
RUN pnpm run build

# ==========================================
# Stage 2: Install Composer Dependencies
# ==========================================
FROM composer:2.8.3 AS composer-builder

WORKDIR /app

COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts \
    --no-progress

# ==========================================
# Stage 3: Production Runtime (FrankenPHP)
# ==========================================
FROM dunglas/frankenphp:1.4.4-php8.4-alpine AS runner

# Install essential production extensions for Laravel + PostgreSQL
RUN install-php-extensions \
    pdo_pgsql \
    pgsql \
    intl \
    bcmath \
    pcntl \
    opcache \
    zip

# Recommended PHP & Opcache production configuration
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" && \
    sed -i 's/memory_limit = .*/memory_limit = 256M/' "$PHP_INI_DIR/php.ini" && \
    sed -i 's/upload_max_filesize = .*/upload_max_filesize = 20M/' "$PHP_INI_DIR/php.ini" && \
    sed -i 's/post_max_size = .*/post_max_size = 25M/' "$PHP_INI_DIR/php.ini"

WORKDIR /app

# Set default environment variables
ENV APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr \
    FRANKENPHP_CONFIG="worker ./public/index.php"

# Copy base Laravel source
COPY . /app

# Copy production PHP dependencies from composer-builder
COPY --from=composer-builder /app/vendor /app/vendor

# Copy compiled frontend assets from frontend-builder
COPY --from=frontend-builder /app/public/build /app/public/build

# Copy custom Caddyfile and startup script
COPY docker/Caddyfile /etc/caddy/Caddyfile
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh

# Ensure storage & cache directories exist with correct permissions
RUN mkdir -p /app/storage/framework/cache/data \
             /app/storage/framework/sessions \
             /app/storage/framework/views \
             /app/storage/logs \
             /app/bootstrap/cache && \
    chmod +x /usr/local/bin/entrypoint.sh && \
    chown -R www-data:www-data /app/storage /app/bootstrap/cache && \
    chmod -R 775 /app/storage /app/bootstrap/cache

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
