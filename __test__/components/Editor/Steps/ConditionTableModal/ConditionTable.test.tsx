import { act, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@utils/test/testUtils';
import { ConditionTableModalIds } from '@constants/appIDS';
import { EditorModal } from '@components/Editor/EditorModal';
import { ModalType as mockModalType } from '@components/Modal/types';
import { runTestsModalIndividualCases } from '@/__test__/utils/reusableTestCases/ModalIndividualTes';

// Mock Variables
let mockIsDeployed = true;
let mockIsEditorModalOpen = true;
let mockIsTesting = false;
let mockTestExecution = false;
let mockSelectedNode = false;

let mockUpdate = jest.fn();
let mockCreate = jest.fn();
let mockRunTest = jest.fn();
let mockSetIsTesting = jest.fn();

const setup = (testExecutionMode?: boolean) => {
  if (testExecutionMode) {
    mockTestExecution = true;
  }
  return render(<EditorModal />, {});
};

jest.mock('@contexts/WorkflowEditorProvider/hooks', () => ({
  useEditorModal: () => ({
    isEditorModalOpen: mockIsEditorModalOpen,
    selectedModalType: mockModalType.CONDITION_TABLE,
    onModalClose: jest.fn(),
    setIsEditorModalOpen: jest.fn(),
  }),
  useWorkflowEditor: () => ({
    isDeployed: mockIsDeployed,
    selectedWorkflow: {
      id: 1,
    },
  }),
  useTraceModal: () => ({
    isTraceMode: false,
    setIsTraceMode: jest.fn(),
    traceSteps: [],
    setTraceSteps: jest.fn(),
  }),
  useTestModal: () => ({
    isTesting: mockIsTesting,
    setIsTesting: mockSetIsTesting,
    testExecution: mockTestExecution,
  }),
}));

jest.mock('@components/Editor/EditorSteps/ConditionTable/Modal/hooks', () => ({
  useConditionTable: jest.fn(() => ({
    ...jest
      .requireActual('@components/Editor/EditorSteps/ConditionTable/Modal/hooks')
      .useConditionTable(),
    selectedNode: mockSelectedNode,
    create: mockCreate,
    update: mockUpdate,
    runTest: mockRunTest,
  })),
}));

describe('Condition Table Modal', () => {
  beforeEach(() => {
    mockIsTesting = false;
    mockIsDeployed = false;
    mockSelectedNode = false;
    mockTestExecution = false;
    mockIsEditorModalOpen = true;

    mockCreate = jest.fn();
    mockUpdate = jest.fn();
    mockRunTest = jest.fn();
    mockSetIsTesting = jest.fn();
  });
  it('Should render the principal parts of the modal', () => {
    const { getByDataCy } = setup();
    const modalBody = getByDataCy(ConditionTableModalIds.body);
    const modalheader = getByDataCy(ConditionTableModalIds.header);
    const modalFooter = getByDataCy(ConditionTableModalIds.footer);

    expect(modalBody).toBeInTheDocument();
    expect(modalheader).toBeInTheDocument();
    expect(modalFooter).toBeInTheDocument();
  });

  it('Should render initial Elements', () => {
    const { getByDataCy } = setup();

    const tableContainer = getByDataCy(ConditionTableModalIds.tableContainer);
    const testBtn = getByDataCy(ConditionTableModalIds.testBtn);
    const saveBtn = getByDataCy(ConditionTableModalIds.saveBtn);
    const outputVarInput = getByDataCy(ConditionTableModalIds.outputVarInput);

    expect(tableContainer).toBeInTheDocument();
    expect(testBtn).toBeInTheDocument();
    expect(saveBtn).toBeInTheDocument();
    expect(outputVarInput).toBeInTheDocument();
  });

  it('Should render initially 4 ROWS and 4 COLS', () => {
    const { queryAllByDataCy } = setup();

    const rows = queryAllByDataCy(ConditionTableModalIds.conditionRow);
    const col4 = queryAllByDataCy(ConditionTableModalIds.conditionCol(4));

    expect(rows.length).toBe(4);
    expect(col4.length).toBe(4);

    // Check COL 5, should not exist
    const col5 = queryAllByDataCy(ConditionTableModalIds.conditionCol(5));
    expect(col5.length).toBe(0);
  });

  it('Should ADD a new Condition ROW (4 rows -> 5 rows)', () => {
    const { queryAllByDataCy, queryByDataCy } = setup();

    const rows = queryAllByDataCy(ConditionTableModalIds.conditionRow);
    expect(rows.length).toBe(4);

    const addRowBtn = queryByDataCy(ConditionTableModalIds.addRowBtn);
    expect(addRowBtn).toBeInTheDocument();

    fireEvent.click(addRowBtn);
    const rowsAfter = queryAllByDataCy(ConditionTableModalIds.conditionRow);
    expect(rowsAfter.length).toBe(5);
  });

  it('Should ADD a new Condition COL (4 cols -> 5 cols)', () => {
    const { queryAllByDataCy, queryByDataCy } = setup();

    const col4 = queryAllByDataCy(ConditionTableModalIds.conditionCol(4));

    expect(col4.length).toBe(4);

    const addColBtn = queryByDataCy(ConditionTableModalIds.addColBtn);
    expect(addColBtn).toBeInTheDocument();

    fireEvent.click(addColBtn);

    const col5 = queryAllByDataCy(ConditionTableModalIds.conditionCol(5));
    expect(col5.length).toBeGreaterThan(0);
  });

  it('Should render Delete button when HOVER a Cell - COLUMN', () => {
    const { queryAllByDataCy, queryByDataCy } = setup();

    const cell = queryByDataCy(ConditionTableModalIds.cellPosition(1, 1));
    expect(cell).toBeInTheDocument();

    // COL
    const delColBtnContainer = queryAllByDataCy(ConditionTableModalIds.delColIconContainer);
    const firstDelColBtn = delColBtnContainer[0];

    expect(firstDelColBtn).toHaveClass('invisible');

    fireEvent.mouseOver(cell);

    expect(firstDelColBtn).toHaveClass('visible');
  });

  it('Should render Delete button when HOVER a Cell - ROW', async () => {
    const { queryByDataCy, queryAllByDataCy } = setup();

    const delLeftHeadBtnContainer = queryAllByDataCy(
      ConditionTableModalIds.delLeftHeadBtnContainer,
    );

    expect(delLeftHeadBtnContainer.length).toBe(4);

    const delRowIcon = queryByDataCy(ConditionTableModalIds.delRowIcon);

    expect(delRowIcon).not.toBeInTheDocument();

    fireEvent.mouseOver(delLeftHeadBtnContainer[0]);

    await waitFor(() => {
      const delRowIconAfter = queryAllByDataCy(ConditionTableModalIds.delRowIcon);
      expect(delRowIconAfter[0]).toBeInTheDocument();
    });
  }, 20000);

  it('Should have 2 options to add a new header in the dropdown [Top Header - Left Header]', async () => {
    const { getByDataCy, getAllByRole } = setup();

    const addHeaderDropdown = getByDataCy(ConditionTableModalIds.addHeaderDropdown);
    expect(addHeaderDropdown).toBeInTheDocument();

    act(() => {
      fireEvent.mouseOver(addHeaderDropdown);
    });

    await waitFor(() => {
      const options = getAllByRole('menuitem');
      expect(options.length).toBe(2);

      const topHeader = options.find((opt) => opt.textContent === 'Top Header');
      const leftHeader = options.find((opt) => opt.textContent === 'Left Header');

      expect(topHeader).toBeInTheDocument();
      expect(leftHeader).toBeInTheDocument();
    });
  }, 20000);

  it('Should add a new TOP Header', async () => {
    const { getByDataCy, getAllByDataCy } = setup();

    const topHeaderContainer = getByDataCy(ConditionTableModalIds.topHeaderContainer);
    expect(topHeaderContainer).toBeInTheDocument();

    const addHeaderDropdown = getByDataCy(ConditionTableModalIds.addHeaderDropdown);

    act(() => {
      fireEvent.mouseOver(addHeaderDropdown);
    });

    await waitFor(() => {
      const addTopHeadBtn = getByDataCy(ConditionTableModalIds.addTopHeadBtn);

      fireEvent.click(addTopHeadBtn);

      const topHeaderContainerAfter = getAllByDataCy(ConditionTableModalIds.topHeaderContainer);
      expect(topHeaderContainerAfter.length).toBe(2);
    });
  }, 20000);

  it('Should add a new LEFT Header', async () => {
    const { getByDataCy, getAllByDataCy } = setup();

    const leftHeaderContainer = getByDataCy(ConditionTableModalIds.leftHeaderContainer);
    expect(leftHeaderContainer).toBeInTheDocument();

    const addHeaderDropdown = getByDataCy(ConditionTableModalIds.addHeaderDropdown);

    act(() => {
      fireEvent.mouseOver(addHeaderDropdown);
    });

    await waitFor(() => {
      const addLeftHeadBtn = getByDataCy(ConditionTableModalIds.addLeftHeadBtn);

      fireEvent.click(addLeftHeadBtn);

      const leftHeaderContainerAfter = getAllByDataCy(ConditionTableModalIds.leftHeaderContainer);
      expect(leftHeaderContainerAfter.length).toBe(2);
    });
  }, 20000);

  it('Should DELETE one LEFT Header', async () => {
    const { getByDataCy, getAllByDataCy, getByText, queryByDataCy, queryAllByDataCy } = setup();

    const addHeaderDropdown = getByDataCy(ConditionTableModalIds.addHeaderDropdown);

    fireEvent.mouseOver(addHeaderDropdown);

    await waitFor(() => {
      const addLeftHeadBtn = queryByDataCy(ConditionTableModalIds.addLeftHeadBtn);
      fireEvent.click(addLeftHeadBtn);
    });

    const delLeftHeadBtnContainer = getAllByDataCy(ConditionTableModalIds.delLeftHeadBtnContainer);
    const firstDelBtnContainer = delLeftHeadBtnContainer[0];

    fireEvent.mouseOver(firstDelBtnContainer);

    await waitFor(() => {
      const delBtn = queryAllByDataCy(ConditionTableModalIds.delLeftHeadBtn);

      expect(delBtn[1]).toBeInTheDocument();

      fireEvent.click(delBtn[1]);

      const buttonConfirmDelete = getByText('Yes');
      expect(buttonConfirmDelete).toBeInTheDocument();

      fireEvent.click(buttonConfirmDelete);

      const topHeaderContainers = getAllByDataCy(ConditionTableModalIds.topHeaderContainer);

      expect(topHeaderContainers.length).toBe(1);
    });
  }, 20000);
  it('Should DELETE one TOP Header', async () => {
    const { getByDataCy, getAllByDataCy, getByText } = setup();

    const addHeaderDropdown = getByDataCy(ConditionTableModalIds.addHeaderDropdown);

    fireEvent.mouseOver(addHeaderDropdown);

    await waitFor(() => {
      const addTopHeadBtn = getByDataCy(ConditionTableModalIds.addTopHeadBtn);
      fireEvent.click(addTopHeadBtn);

      const delTopHeadBtnContainer = getAllByDataCy(ConditionTableModalIds.delTopHeadBtnContainer);
      const firstDelBtnContainer = delTopHeadBtnContainer[0];

      fireEvent.mouseOver(firstDelBtnContainer);

      const delBtns = getAllByDataCy(ConditionTableModalIds.delColIcon);
      const delBtn = delBtns[0];
      expect(delBtn).toBeInTheDocument();

      fireEvent.click(delBtn);
      const buttonConfirmDelete = getByText('Yes');
      expect(buttonConfirmDelete).toBeInTheDocument();

      act(() => {
        fireEvent.click(buttonConfirmDelete);
      });

      const leftHeaderContainer = getAllByDataCy(ConditionTableModalIds.leftHeaderContainer);

      expect(leftHeaderContainer.length).toBe(1);
    });
  }, 20000);

  describe('Should Execute the actions', () => {
    it('Should execute the functions after click on each button', () => {
      const { getByDataCy } = setup();

      const testBtn = getByDataCy(ConditionTableModalIds.testBtn);
      const saveButton = getByDataCy(ConditionTableModalIds.saveBtn);

      act(() => {
        fireEvent.click(testBtn);
        fireEvent.click(saveButton);
      });

      expect(mockSetIsTesting).toHaveBeenCalledTimes(1);
      expect(mockCreate).toHaveBeenCalledTimes(1);
    });

    it('Should execute UPDATE Function if selectedNode true (save button)', () => {
      mockSelectedNode = true;
      const { getByDataCy } = setup();

      const saveButton = getByDataCy(ConditionTableModalIds.saveBtn);

      act(() => {
        fireEvent.click(saveButton);
      });

      expect(mockUpdate).toHaveBeenCalledTimes(1);
    });

    it('Should Execute the "Run Test" function after click on "Run Test ⏵ " button', async () => {
      mockIsTesting = true;
      const { queryByDataCy } = setup();

      const runTestBtn = queryByDataCy(ConditionTableModalIds.runTestBtn);

      act(() => {
        fireEvent.click(runTestBtn);
      });
      await waitFor(() => {
        expect(mockRunTest).toHaveBeenCalledTimes(1);
      });
    });
  });
});

runTestsModalIndividualCases(setup);
