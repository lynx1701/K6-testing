# ----- Build stage: transpile TypeScript to JS -----
    FROM node:20-alpine AS builder
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci
    COPY tsconfig.json ./
    COPY src ./src
    RUN npm run build
    
    # ----- Runtime stage: run tests with k6 -----
    FROM grafana/k6:latest
    # Copy compiled scripts into /scripts
    COPY --from=builder /app/dist /scripts
    
    # Defaults (can be overridden by env / compose)
    ENV TARGET_URL="https://test.k6.io" \
        TEST_TYPE="load" \
        LOAD_VUS="30" \
        SPIKE_PRE_VUS="100" \
        SPIKE_MAX_VUS="1000" \
        SOAK_RATE="10" \
        SOAK_DURATION="2h" \
        SOAK_PRE_VUS="50" \
        SOAK_MAX_VUS="200" \
        SLEEP="1"
    
    # Default command: run the scenario selector file
    # (You can override this in docker-compose or CLI)
    CMD ["run", "--summary-export=/results/summary.json", "/scripts/tests/streams/loadTest.js"]
    