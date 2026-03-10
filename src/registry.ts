import type { RegisterServiceOptions, RegisteredService } from './types';

export class RegistryClient {
  constructor(
    private baseUrl: string,
    private apiKey?: string,
  ) {}

  async register(options: RegisterServiceOptions): Promise<RegisteredService> {
    if (!this.apiKey) throw new Error('API key required for registry operations');

    const res = await fetch(`${this.baseUrl}/api/registry/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
      body: JSON.stringify(options),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as Record<string, string>;
      throw new Error(`Registry register failed: ${err.error || res.statusText}`);
    }

    const data = (await res.json()) as { service: RegisteredService };
    return data.service;
  }

  async list(): Promise<RegisteredService[]> {
    const res = await fetch(`${this.baseUrl}/api/registry`);

    if (!res.ok) {
      throw new Error(`Registry list failed: ${res.statusText}`);
    }

    const data = (await res.json()) as { services: RegisteredService[] };
    return data.services;
  }

  async get(serviceId: string): Promise<RegisteredService> {
    const res = await fetch(`${this.baseUrl}/api/registry/${serviceId}`);

    if (!res.ok) {
      throw new Error(`Registry get failed: ${res.statusText}`);
    }

    const data = (await res.json()) as { service: RegisteredService };
    return data.service;
  }
}
