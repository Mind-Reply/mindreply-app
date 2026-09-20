export interface FleetHealth {
  status: 'healthy' | 'degraded' | 'critical';
  timestamp: number;
}

export function checkFleetHealth(): FleetHealth {
  return {
    status: 'healthy',
    timestamp: Date.now(),
  };
}
