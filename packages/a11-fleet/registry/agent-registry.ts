export type AgentStatus = 'healthy' | 'degraded' | 'offline';

export interface FleetAgent {
  id: string;
  role: string;
  status: AgentStatus;
  lastHeartbeat: number;
}

export class AgentRegistry {
  private agents = new Map<string, FleetAgent>();

  register(agent: FleetAgent) {
    this.agents.set(agent.id, agent);
  }

  heartbeat(id: string) {
    const agent = this.agents.get(id);
    if (agent) agent.lastHeartbeat = Date.now();
  }

  list() {
    return [...this.agents.values()];
  }
}
