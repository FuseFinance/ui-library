import { Step } from './types/sharedTypes';

export const checkShowIsTraceMode = (traceSteps: Step[], id: string, isTraceMode: boolean) => {
  const isInTraceList = traceSteps.some((step: Step) => step.id === id);
  return isTraceMode && isInTraceList;
};
