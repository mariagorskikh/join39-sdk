# Payment Mock

Tracks agent invocations and simulates per-call billing.

## Run

```bash
npm install
WEBHOOK_SECRET=your_secret npm start
```

## Endpoints

- `GET /health` — Health check
- `GET /billing` — Full billing ledger
- `GET /billing/:username` — Billing for a specific user
- `POST /webhook` — Webhook receiver
