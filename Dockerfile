    FROM node:20-alpine AS build
    WORKDIR /app
    COPY package.json package-lock.json* ./
    RUN npm ci
    COPY tsconfig.json ./
    COPY src ./src
    RUN npm run build && ls -l dist
    
    FROM grafana/k6:latest AS k6src
    
    FROM node:20-alpine
    WORKDIR /app
    
    ENV HOST=0.0.0.0
    ENV PORT=8080
    ENV OUT_DIR=/out
    ENV LOG_DIR=/logs
        
    COPY --from=k6src /usr/bin/k6 /usr/bin/k6
        
    COPY --from=build /app/dist ./dist
    COPY package.json package-lock.json* ./
    RUN npm ci --omit=dev
    
    RUN mkdir -p /out /logs
    VOLUME ["/out", "/logs"]
    
    EXPOSE 8080
    CMD ["node", "dist/server.cjs"]
    