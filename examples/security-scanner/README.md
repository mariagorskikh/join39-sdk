# Security Scanner

Monitors agent tool calls and flags suspicious patterns (HTTP requests, code execution, shell access).

## Run

```bash
npm install
WEBHOOK_SECRET=your_secret npm start
```

## Endpoints

- `GET /health` — Health check + alert count
- `GET /alerts` — Recent alerts (last 50)
- `POST /webhook` — Webhook receiver
