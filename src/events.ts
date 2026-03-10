import { createHmac } from 'crypto';
import type { SubscribeOptions, WebhookSubscription } from './types';

export class EventsClient {
  constructor(
    private baseUrl: string,
    private sessionToken?: string,
  ) {}

  async subscribe(options: SubscribeOptions): Promise<WebhookSubscription> {
    if (!this.sessionToken) throw new Error('Session token required for subscription');

    const res = await fetch(`${this.baseUrl}/api/webhooks/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `next-auth.session-token=${this.sessionToken}`,
      },
      body: JSON.stringify(options),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as Record<string, string>;
      throw new Error(`Subscribe failed: ${err.error || res.statusText}`);
    }

    const data = (await res.json()) as { subscription: WebhookSubscription };
    return data.subscription;
  }

  async list(): Promise<WebhookSubscription[]> {
    if (!this.sessionToken) throw new Error('Session token required');

    const res = await fetch(`${this.baseUrl}/api/webhooks`, {
      headers: {
        Cookie: `next-auth.session-token=${this.sessionToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`List subscriptions failed: ${res.statusText}`);
    }

    const data = (await res.json()) as { subscriptions: WebhookSubscription[] };
    return data.subscriptions;
  }

  /**
   * Verify an HMAC-SHA256 webhook signature.
   */
  static verifySignature(body: string, secret: string, signature: string): boolean {
    const expected = createHmac('sha256', secret).update(body).digest('hex');
    return expected === signature;
  }
}
