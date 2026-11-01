# Stage 1: Build
FROM --platform=$BUILDPLATFORM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Vite inlines these at build time
ARG VITE_FARO_ENABLED=false
ARG VITE_FARO_URL
ARG FARO_UPLOAD_ENDPOINT
ARG FARO_APP_ID
ARG FARO_STACK_ID
RUN --mount=type=secret,id=faro_api_key FARO_API_KEY="$(cat /run/secrets/faro_api_key 2>/dev/null)" npm run build \
    && find dist -name "*.map" -delete

# Stage 2: Production Runtime
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
