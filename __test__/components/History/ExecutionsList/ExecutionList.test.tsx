import { fireEvent, render } from '@utils/test/testUtils';
import { ExecutionsList } from '@/src/components/Executions';
import { HistoryIds } from '@/src/constants/appIDS';
import { mockExecutions } from '@/__mocks__/executionMocks';
import { Execution } from '@/src/types/services/executions';

let mockOnSelectExecution = jest.fn();

const setUp = () => {
  return render(
    <ExecutionsList
      executions={mockExecutions as Execution[]}
      selectedExecutionId={'2'}
      isLoadingExecutions={false}
      onSelectExecution={mockOnSelectExecution}
      showWorkflowName={false}
      showPagination={false}
    />,
    {},
  );
};

describe('EditableText Component', () => {
  it('Should render', () => {
    const { getByDataCy } = setUp();
    const executionsList = getByDataCy(HistoryIds.executionsList);
    expect(executionsList).toBeInTheDocument();
  });

  it('Should call mockOnSelectExecution when execution item clcked', () => {
    const { getAllByDataCy } = setUp();
    const executionItems = getAllByDataCy(HistoryIds.executionItem);
    fireEvent.click(executionItems[1]);
    expect(mockOnSelectExecution).toHaveBeenCalledTimes(1);
  });
});
