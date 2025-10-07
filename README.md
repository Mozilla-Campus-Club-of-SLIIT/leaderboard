# Leaderboard

## Getting Started

Create `.env` file as setup the following variables

```bash
GITHUB_OWNER=Mozilla-Campus-Club-of-SLIIT
GITHUB_TOKEN=<github_token>
UPSTASH_REDIS_REST_URL=http://127.0.0.1:8080
UPSTASH_REDIS_REST_TOKEN=<redis_token>
```

This project uses upstash redis as a storage and caching mechanism. Please check their documentation on how to properly setup those environments.

#### If you are intending to run Upstash redis locally

Execute the following command to setup redis and upstash. This setup uses docker (recommended)
```bash
docker network create redis-net

# Run Redis in Docker
docker run -d --name redis --network redis-net redis:latest

# Run SRH container
docker run -d \
  --name srh \
  --network redis-net \
  -p 8080:80 \
  -e SRH_MODE=env \
  -e SRH_TOKEN=redis \
  -e SRH_CONNECTION_STRING=redis://redis:6379 \
  hiett/serverless-redis-http:latest
```

- Make sure you have Docker installed

Then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

