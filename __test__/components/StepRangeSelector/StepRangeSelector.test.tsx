import { render } from '@utils/test/testUtils';
import { DefaultComponentIds } from '@/src/constants/appIDS';
import { mockSimpleWorkFlow } from '@/__test__/utils/ReactFlow';
import StepRangeSelector from '@/src/components/StepRangeSelector';

let mockWorkFlow: any = {
  rfData: mockSimpleWorkFlow(),
  steps: [{id: 1, name: 'Mock 1'}, {id: 2, name: 'Mock 2'}]
}
let mockSetStepIds;
let mockStepIds;

const setUp = (mockSetStepIds: any, mockStepIds: any) => {
  return render(
    <StepRangeSelector
      selectedWorkflow={mockWorkFlow}
      setStepIds={mockSetStepIds}
      stepIds={mockStepIds}
    />,
  {},
  );
};

describe('StepRangeSelector component', () => {
  beforeEach(() => {
    mockSetStepIds = jest.fn();
    mockStepIds = [];
  });

  it('Should render 2 inputs', () => {
    const { queryAllByDataCy } = setUp(mockSetStepIds, mockStepIds);
    const stepSelectorInput = queryAllByDataCy(DefaultComponentIds.stepSelectorInput);
    expect(stepSelectorInput.length).toBe(2);
  });
})
