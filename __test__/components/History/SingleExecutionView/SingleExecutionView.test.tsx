import { v4 as uuidv4 } from 'uuid';
import { fireEvent, render, screen, waitFor } from '@utils/test/testUtils';
import { SingleExecutionView } from '@/src/components/Executions';
import { HistoryIds } from '@/src/constants/appIDS';
import { mockExecutions } from '@/__mocks__/executionMocks';
import { IconList } from '@/src/components/Icons/types';
import { Execution } from '@/src/types/services/executions';

let mockExecution = mockExecutions[0];
let mockSelectedStep = mockExecutions[0].steps[1];
const setUp = () => {
  return render(
    <SingleExecutionView execution={mockExecution as Execution} isLoadingExecution={false} />,
    {},
  );
};

jest.mock('@services/executions', () => ({
  useGetExecutionStep: () => ({
    step: mockExecutions[0].steps[1],
  }),
}));

describe('EditableText Component', () => {
  beforeAll(() => {
    // Next execution is needed to avoid CodeMirror error while testing
    document.createRange = () => {
      const range = new Range();

      range.getBoundingClientRect = jest.fn();

      range.getClientRects = () => {
        return {
          item: () => null,
          length: 0,
          [Symbol.iterator]: jest.fn(),
        };
      };

      return range;
    };
  });
  beforeEach(() => {
    mockExecution = mockExecutions[0];
    mockSelectedStep = mockExecutions[0].steps[1];
  });

  it('Should render', () => {
    const { getByDataCy } = setUp();
    const executionsList = getByDataCy(HistoryIds.singleExecution);
    expect(executionsList).toBeInTheDocument();
  });

  it('Should render BlockExecutionDetail modal on execution step click', async () => {
    const { getAllByDataCy, getByDataCy } = setUp();

    const executionStepsName = getAllByDataCy(HistoryIds.executionTableStepName);
    fireEvent.click(executionStepsName[0]);
    await waitFor(() => {
      const blockExecutionModal = getByDataCy(HistoryIds.blockExecutionModal);
      expect(blockExecutionModal).toBeInTheDocument();
    });
  });

  it('Should close BlockExecutionDetail modal on close button click', () => {
    const { getAllByDataCy, getByDataCy } = setUp();

    const executionStepsName = getAllByDataCy(HistoryIds.executionTableStepName);
    fireEvent.click(executionStepsName[0]);
    const blockExecutionModal = getByDataCy(HistoryIds.blockExecutionModal);
    const blockExecutionModalCloseButton = screen.getByDataCy(
      HistoryIds.blockExecutionModalCloseButton,
    );
    fireEvent.click(blockExecutionModalCloseButton);
    expect(blockExecutionModal).not.toBeInTheDocument();
  });

  it('Should render navigation icons on BlockExecutionDetail modal when more than 1 execution step', async () => {
    mockExecution.steps.push({
      id: uuidv4(),
      date: new Date(),
      name: 'If Condition',
      type: 'CONDITION',
      duration: 440.82175900042057,
      durationPortion: 86.45,
      inputs: [{ formula: 'test' }],
      output: [],
      context: {
        before: {},
        after: {},
      },
    });

    const { getAllByDataCy, getByDataCy } = setUp();

    const executionStepsName = getAllByDataCy(HistoryIds.executionTableStepName);
    fireEvent.click(executionStepsName[0]);
    const blockExecutionModal = getByDataCy(`Icon-${IconList.RightArrow}`);
    expect(blockExecutionModal).toBeInTheDocument();
  });
});
