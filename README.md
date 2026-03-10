# @join39/sdk

Official TypeScript SDK for the Join39 Open Platform.

## Install

```bash
npm install @join39/sdk
```

## Quick Start

```typescript
import { Join39 } from '@join39/sdk';

const client = new Join39({
  apiKey: 'j39_abc123...',       // For registry operations
  sessionToken: 'your-session',  // For event subscriptions
  baseUrl: 'https://join39.org', // Optional, this is the default
});

// Register a service
await client.registry.register({
  name: 'my-service',
  description: 'Does cool things',
  version: '1.0.0',
  category: 'analytics',
  healthCheckUrl: 'https://my-service.com/health',
});

// List all registered services
const services = await client.registry.list();

// Subscribe to agent events
const sub = await client.events.subscribe({
  eventType: 'agent.invocation.complete',
  url: 'https://my-service.com/webhook',
});
console.log('Webhook secret:', sub.secret);
```

## Verify Webhook Signatures

```typescript
import { EventsClient } from '@join39/sdk';

const isValid = EventsClient.verifySignature(
  rawBody,
  webhookSecret,
  request.headers['x-join39-signature']
);
```

## Examples

- [`examples/echo-service`](./examples/echo-service) — Logs every event to console
- [`examples/security-scanner`](./examples/security-scanner) — Monitors tool calls for suspicious patterns
- [`examples/payment-mock`](./examples/payment-mock) — Simulates per-call billing

## Docs

Full documentation at [join39.org/developer](https://join39.org/developer#platform-architecture)

## License

MIT
