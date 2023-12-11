import { useParams } from 'react-router';
import { useGetExecutionById } from '@/src/services/executions';
import { SingleExecutionView } from '@/src/components/Executions';

const IndividualExecution = () => {
  const { executionId } = useParams();

  const { execution, isLoading: isLoadingCurrentExecution } = useGetExecutionById({
    executionId: executionId,
    removeFields: 'steps.inputs,steps.outputs,steps.context',
  });

  return (
    <SingleExecutionView execution={execution} isLoadingExecution={isLoadingCurrentExecution} />
  );
};

export default IndividualExecution;
