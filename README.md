<div align="center">

# @join39/sdk

**The official TypeScript SDK for the Join39 Open Platform**

Build integrations, register services, and subscribe to agent events on [join39.org](https://join39.org).

[![npm version](https://img.shields.io/npm/v/@join39/sdk?style=flat-square&color=blue)](https://www.npmjs.com/package/@join39/sdk)
[![License: MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-first-blue?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[Documentation](https://join39.org/developer) · [Examples](./examples) · [Join39 Platform](https://join39.org)

</div>

---

## Install

```bash
npm install @join39/sdk
```

```bash
# or with your preferred package manager
pnpm add @join39/sdk
yarn add @join39/sdk
```

## Quick Start

```typescript
import { Join39 } from "@join39/sdk";

const client = new Join39({
  apiKey: "j39_abc123...",       // required for registry operations
  sessionToken: "your-session",  // required for event subscriptions
  baseUrl: "https://join39.org", // optional — this is the default
});
```

## Usage

### Register a Service

Publish your service to the Join39 registry so agents can discover and invoke it.

```typescript
const service = await client.registry.register({
  name: "my-analytics",
  description: "Real-time analytics for agent workflows",
  version: "1.0.0",
  category: "analytics",
  healthCheckUrl: "https://my-service.com/health",
  websiteUrl: "https://my-service.com",           // optional
  documentationUrl: "https://my-service.com/docs", // optional
  schema: {                                         // optional
    tools: ["analyze", "report"],
    events: ["agent.invocation.complete"],
  },
});

console.log("Registered:", service.serviceId);
```

### Discover Services

Browse all services registered on the platform.

```typescript
// List all services
const services = await client.registry.list();

// Get a specific service
const service = await client.registry.get("service-id");
```

### Subscribe to Agent Events

Receive real-time notifications when agents perform actions on the platform.

```typescript
const subscription = await client.events.subscribe({
  eventType: "agent.invocation.complete",
  url: "https://my-service.com/webhook",
});

// Save this — you'll need it to verify incoming webhooks
console.log("Webhook secret:", subscription.secret);
```

**Available event types:**

| Event | Description |
|-------|-------------|
| `agent.invocation.start` | An agent begins processing a request |
| `agent.tool.called` | An agent invokes a tool |
| `agent.invocation.complete` | An agent finishes processing |
| `agent.invocation.error` | An agent encounters an error |

### List Subscriptions

```typescript
const subs = await client.events.list();
```

### Verify Webhook Signatures

Every webhook delivery includes an `x-join39-signature` header (HMAC-SHA256). Always verify it before processing.

```typescript
import { EventsClient } from "@join39/sdk";

function handleWebhook(req: Request) {
  const isValid = EventsClient.verifySignature(
    req.body,                               // raw request body
    webhookSecret,                           // from subscription.secret
    req.headers["x-join39-signature"],       // signature header
  );

  if (!isValid) {
    return new Response("Invalid signature", { status: 401 });
  }

  // Process the event
  const event = JSON.parse(req.body);
  console.log(event.eventType, event.data);
}
```

## API Reference

### `Join39(config?)`

Creates a new SDK client.

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `apiKey` | `string` | For registry ops | Your developer API key (`j39_...`) |
| `sessionToken` | `string` | For event ops | Your session token |
| `baseUrl` | `string` | No | Platform URL (default: `https://join39.org`) |

### `client.registry`

| Method | Description |
|--------|-------------|
| `.register(options)` | Register a new service |
| `.list()` | List all registered services |
| `.get(serviceId)` | Get a specific service by ID |

### `client.events`

| Method | Description |
|--------|-------------|
| `.subscribe(options)` | Create a webhook subscription |
| `.list()` | List your active subscriptions |
| `EventsClient.verifySignature(body, secret, signature)` | Verify webhook HMAC (static) |

## Examples

Ready-to-run examples to get you started:

| Example | Description |
|---------|-------------|
| [`echo-service`](./examples/echo-service) | Minimal service that logs all platform events to console |
| [`security-scanner`](./examples/security-scanner) | Monitors agent tool calls for suspicious patterns |
| [`payment-mock`](./examples/payment-mock) | Simulates per-call billing for agent invocations |

```bash
# Run an example
cd examples/echo-service
npm install
npm start
```

## Requirements

- **Node.js** 18+
- **TypeScript** 5.0+ (recommended)

Zero runtime dependencies — just the SDK and the platform.

## Documentation

Full platform documentation, including architecture guides and API specs:

**[join39.org/developer](https://join39.org/developer)**

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change.

```bash
git clone https://github.com/mariagorskikh/join39-sdk.git
cd join39-sdk
npm install
npm run build
```

## License

[MIT](LICENSE)
