export type AgentEventType =
  | 'agent.invocation.start'
  | 'agent.tool.called'
  | 'agent.invocation.complete'
  | 'agent.invocation.error';

export interface AgentEvent {
  eventId: string;
  eventType: AgentEventType;
  timestamp: string;
  username: string;
  sessionId: string;
  data: Record<string, unknown>;
}

export interface Join39Config {
  apiKey?: string;
  sessionToken?: string;
  baseUrl?: string;
}

export interface RegisterServiceOptions {
  name: string;
  description: string;
  version: string;
  category: string;
  healthCheckUrl: string;
  websiteUrl?: string;
  documentationUrl?: string;
  schema?: {
    tools?: string[];
    events?: string[];
  };
}

export interface RegisteredService {
  serviceId: string;
  developerId: string;
  name: string;
  description: string;
  version: string;
  category: string;
  healthCheckUrl: string;
  websiteUrl?: string;
  documentationUrl?: string;
  schema: { tools?: string[]; events?: string[] };
  status: string;
  lastHealthCheck: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscribeOptions {
  eventType: AgentEventType;
  url: string;
}

export interface WebhookSubscription {
  subscriptionId: string;
  userId: string;
  username: string;
  eventType: string;
  url: string;
  secret: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DeveloperKey {
  keyId: string;
  userId: string;
  key: string;
  name: string;
  active: boolean;
  lastUsed: string | null;
  created_at: string;
}
