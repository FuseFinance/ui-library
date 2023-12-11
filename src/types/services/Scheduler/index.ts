export interface Scheduler {
  workflowName: string;
  schedulerId: string;
  schedulerName: string;
  workflowId: string;
  env: string;
  schedule: string;
  timeZone: string;
  rawScheduler: any;
}
