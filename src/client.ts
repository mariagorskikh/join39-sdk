import type { Join39Config } from './types';
import { RegistryClient } from './registry';
import { EventsClient } from './events';

const DEFAULT_BASE_URL = 'https://join39.org';

export class Join39 {
  public readonly registry: RegistryClient;
  public readonly events: EventsClient;

  constructor(config: Join39Config = {}) {
    const baseUrl = (config.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '');
    this.registry = new RegistryClient(baseUrl, config.apiKey);
    this.events = new EventsClient(baseUrl, config.sessionToken);
  }
}
