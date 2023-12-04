import { fireEvent, render, screen, waitFor } from '@utils/test/testUtils';
import { HistoryHeader } from '@/src/components/History';
import { HistoryIds } from '@/src/constants/appIDS';
import dayjs from 'dayjs';
import { mockEnvironments } from '@/__mocks__/environmentMocks';
import { workflowMocks } from '@/__mocks__/workflowMocks';
import { Workflow } from '@/src/types/services/workflows';

let mockHandleEnvSelect = jest.fn();
let mockHandleWorkflowSelect = jest.fn();
let mockSetDateRange = jest.fn();
let mockDateRange = [];

const setUp = () => {
  return render(
    <HistoryHeader
      environments={mockEnvironments}
      selectedEnvironmentName={'test'}
      handleEnvSelect={mockHandleEnvSelect}
      workflows={workflowMocks as Workflow[]}
      selectedWorkflowId={'id'}
      handleWorkflowSelect={mockHandleWorkflowSelect}
      startDate={mockDateRange[0]}
      endDate={mockDateRange[1]}
      setDateRange={mockSetDateRange}
    />,
    {},
  );
};

describe('EditableText Component', () => {
  beforeEach(() => {
    mockDateRange = [dayjs('Tue Aug 29 2023'), dayjs('Fri Sep 01 2023')];
  });

  it('Should render', () => {
    const { getByDataCy } = setUp();
    const historyHeader = getByDataCy(HistoryIds.historyHeader);
    expect(historyHeader).toBeInTheDocument();
  });

  it('Should render menu on environment dropdown trigger hover', async () => {
    const { getByDataCy } = setUp();
    const environmentDropdownButton = getByDataCy(HistoryIds.environmentDropdownButton);

    fireEvent.mouseOver(environmentDropdownButton);
    await waitFor(() => {
      const dropdown = screen.getByRole('menu');
      expect(dropdown).toBeInTheDocument();
    });
  });

  it('Should call mockHandleEnvSelect on menu item click', async () => {
    const { getByDataCy } = setUp();
    const environmentDropdownButton = getByDataCy(HistoryIds.environmentDropdownButton);

    fireEvent.mouseOver(environmentDropdownButton);
    await waitFor(() => {
      const dropdownOptions = document.getElementsByClassName('ant-dropdown-menu-item');
      fireEvent.click(dropdownOptions[0]);
      expect(mockHandleEnvSelect).toHaveBeenCalledTimes(1);
    });
  });

  it('Should render menu on environment dropdown trigger hover', async () => {
    const { getByDataCy } = setUp();
    const workflowDropdownButton = getByDataCy(HistoryIds.workflowDropdownButton);

    fireEvent.mouseOver(workflowDropdownButton);
    await waitFor(() => {
      const dropdown = screen.getByRole('menu');
      expect(dropdown).toBeInTheDocument();
    });
  });

  it('Should call mockHandleWorkflowSelect on menu item click', async () => {
    const { getByDataCy } = setUp();
    const workflowDropdownButton = getByDataCy(HistoryIds.workflowDropdownButton);

    fireEvent.mouseOver(workflowDropdownButton);
    await waitFor(() => {
      const dropdownOptions = document.getElementsByClassName('ant-dropdown-menu-item');
      fireEvent.click(dropdownOptions[0]);
      expect(mockHandleWorkflowSelect).toHaveBeenCalledTimes(1);
    });
  });

  it('Should call mockSetDateRange on datepicker ok click', async () => {
    const { getByDataCy } = setUp();
    const datePicker = getByDataCy(HistoryIds.datePicker);

    fireEvent.click(datePicker);
    await waitFor(() => {
      const dateItems = document.getElementsByClassName('ant-picker-cell');
      fireEvent.click(dateItems[31]);
      const okButtonContainer = document.getElementsByClassName('ant-picker-ok')[0];
      const okButton = okButtonContainer.firstChild;
      fireEvent.click(okButton);
      expect(mockSetDateRange).toHaveBeenCalledTimes(1);
    });
  });

  it('Should call mockSetDateRange on datepicker clear click', async () => {
    setUp();
    const clearButtons = document.getElementsByClassName('ant-picker-clear');
    fireEvent.click(clearButtons[0]);
    await waitFor(() => {
      expect(mockSetDateRange).toHaveBeenCalledTimes(1);
    });
  });
});
