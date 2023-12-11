import { Execution } from '@/src/types/services/executions';
import { FILTERS_TYPE } from '@/src/utils/constants';
import { uniqBy } from 'lodash';

export const filterExecutionsByStatusUtil = (
  filters: string[],
  testExecutions: Execution[],
  setFilteredExecutions: (_value) => void,
) => {
  if (!filters || filters.length === 0) {
    setFilteredExecutions(null);
    return;
  }

  let alertExecutions = [];
  let successExecutions = [];
  let erroExecutions = [];

  if (filters.includes(FILTERS_TYPE.ALERT)) {
    alertExecutions = testExecutions.filter((execution) => execution.alertBlockExecuted);
  }

  if (filters.includes(FILTERS_TYPE.SUCCESS)) {
    successExecutions = testExecutions.filter(
      (execution) => execution.success && !execution.alertBlockExecuted,
    );
  }

  if (filters.includes(FILTERS_TYPE.ERROR)) {
    erroExecutions = testExecutions.filter(
      (execution) => !execution.success && !execution.alertBlockExecuted,
    );
  }

  const mergeFilteredResult = [...alertExecutions, ...successExecutions, ...erroExecutions];

  setFilteredExecutions(uniqBy(mergeFilteredResult, 'id'));
};
