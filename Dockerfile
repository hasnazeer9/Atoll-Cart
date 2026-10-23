# Atoll Cart: Next.js shop + admin. Needs Node 22.13+ (built-in SQLite).
FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
# Dev dependencies (Tailwind, TypeScript) are needed for the build step.
RUN npm ci --include=dev

COPY . .
RUN npm run build

# Mount a persistent disk here; the database and uploaded photos live in it.
ENV DATA_DIR=/data
VOLUME /data

EXPOSE 3000
CMD ["sh", "-c", "npm start -- -H 0.0.0.0 -p ${PORT:-3000}"]
