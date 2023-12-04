import { fireEvent, waitFor, screen } from '@testing-library/react';
import { render } from '@utils/test/testUtils';
import ExecutionSearch from '@components/ExecutionSearch';
import { TestPageIds } from '@/src/constants/appIDS';
const setUp = (props) => {
  return render(<ExecutionSearch {...props} />, {});
};
describe('ExecutionSearch Component', () => {
  const inputValue = '$.test == 1; $.test == 2';
  it('Should search on blur', async () => {
    const triggerSearch = jest.fn();
    const { getByDataCy } = setUp({ searchExecution: triggerSearch });
    const searchExecutionInput = getByDataCy(TestPageIds.searchExecutionInput).firstElementChild;

    fireEvent.mouseDown(searchExecutionInput);
    await waitFor(() =>
      fireEvent.change(screen.getByRole('combobox'), { target: { value: inputValue } }),
    );
    await waitFor(() =>
      fireEvent.click(document.querySelectorAll('.ant-select-item-option-content')[0]),
    );

    expect(triggerSearch).toBeCalled();
  });
});
