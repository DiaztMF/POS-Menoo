#!/bin/sh
set -e

# Link public storage if not present
if [ ! -L /app/public/storage ]; then
    php artisan storage:link --force 2>/dev/null || true
fi

# In production, cache config, routes, and views if APP_KEY is provided
if [ -n "$APP_KEY" ]; then
    php artisan config:cache || true
    php artisan route:cache || true
    php artisan view:cache || true
fi

# Automatically run database migrations if enabled
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Running database migrations..."
    php artisan migrate --force || true
fi

# Start FrankenPHP with Caddy
exec frankenphp run --config /etc/caddy/Caddyfile "$@"
