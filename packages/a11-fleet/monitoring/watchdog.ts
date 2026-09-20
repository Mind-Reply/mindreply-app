export interface FleetHealth {
  agents: number;
  healthy: boolean;
  timestamp: string;
}

export async function runWatchdog(): Promise<FleetHealth> {
  return {
    agents: 0,
    healthy: true,
    timestamp: new Date().toISOString(),
  };
}

setInterval(async () => {
  await runWatchdog();
}, 60000);
