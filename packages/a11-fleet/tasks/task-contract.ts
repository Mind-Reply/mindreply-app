export interface FleetTask {
  id: string;
  name: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  execute(): Promise<void>;
}

export interface TaskResult {
  taskId: string;
  success: boolean;
  timestamp: string;
}
