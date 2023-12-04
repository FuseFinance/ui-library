import { render } from '@utils/test/testUtils';
import { AsyncResponseModalIds } from '@constants/appIDS';
import { EditorModal } from '@components/Editor/EditorModal';
import { ModalType as mockModalType } from '@components/Modal/types';
import { act, fireEvent, waitFor } from '@testing-library/react';

const setUp = (customResponse?: boolean, testExecutionMode?: boolean) => {
  if (testExecutionMode) {
    mockTestExecution = true;
  }
  return render(<EditorModal />, {});
};

// Mock Variables
let mockIsDeployed = true;
let mockIsEditorModalOpen = true;
let mockIsTesting = false;
let mockTestExecution = false;
let mockSelectedNode = false;

let mockSetIsTesting = jest.fn();
let mockCreate = jest.fn();
let mockUpdate = jest.fn();
let mockRunTest = jest.fn();

jest.mock('@contexts/WorkflowEditorProvider/hooks', () => ({
  useEditorModal: () => ({
    isEditorModalOpen: mockIsEditorModalOpen,
    selectedModalType: mockModalType.ASYNC_RESPONSE,
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

jest.mock('@components/Editor/EditorSteps/AsyncResponse/Modal/hooks', () => ({
  useAsyncResponse: jest.fn(() => ({
    ...jest.requireActual('@components/Editor/EditorSteps/AsyncResponse/Modal/hooks').useAsyncResponse(),
    selectedNode: mockSelectedNode,
    create: mockCreate,
    update: mockUpdate,
    runTest: mockRunTest,
  })),
}));

describe('Async Response Modal', () => {
  beforeAll(() => {
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
    mockIsDeployed = false;
    mockIsEditorModalOpen = true;
    mockIsTesting = false;
    mockTestExecution = false;
    mockSelectedNode = false;

    mockSetIsTesting = jest.fn();
    mockCreate = jest.fn();
    mockUpdate = jest.fn();
    mockRunTest = jest.fn();
  });

  it('Should render the principal parts of the components modal', () => {
    const { getByDataCy } = setUp();
    const modalBody = getByDataCy(AsyncResponseModalIds.body);
    const modalheader = getByDataCy(AsyncResponseModalIds.header);
    const modalFooter = getByDataCy(AsyncResponseModalIds.footer);

    expect(modalBody).toBeInTheDocument();
    expect(modalheader).toBeInTheDocument();
    expect(modalFooter).toBeInTheDocument();
  });

  it('Should have the Custom Response switch', () => {
    const { getByDataCy } = setUp();
    const selectCustomResponseDropdown = getByDataCy(AsyncResponseModalIds.customResponseOptions);

    expect(selectCustomResponseDropdown).toBeInTheDocument();
  });

  it('Should have the Output variable input', () => {
    const { getByDataCy } = setUp();
    const inputOutput = getByDataCy(AsyncResponseModalIds.inputOutputVariable);

    expect(inputOutput).toBeInTheDocument();
  });

  it('Should not show HTTP Status input, headers input, body type input and body input when custom response is not selected', async () => {
    const { getByText, queryByDataCy} = setUp(false);
    const noOption = getByText('No');

    act(() => {
      fireEvent.click(noOption);
    });

    const httpStatusInput = queryByDataCy(AsyncResponseModalIds.httpStatusVariable);
    const headersContainerInput = queryByDataCy(AsyncResponseModalIds.inputHeaderContainer);
    const bodyTypeDropdown = queryByDataCy(AsyncResponseModalIds.selectBodyTypeDropdown);
    const bodyInput = queryByDataCy(AsyncResponseModalIds.inputBody);

    expect(httpStatusInput).not.toBeInTheDocument();
    expect(headersContainerInput).not.toBeInTheDocument();
    expect(bodyTypeDropdown).not.toBeInTheDocument();
    expect(bodyInput).not.toBeInTheDocument();
  });

  it('Should show HTTP Status input when custom response is selected', async () => {
    const { getByText, getByDataCy } = setUp(true);
    const yesOption = getByText('Yes');

    act(() => {
      fireEvent.click(yesOption);
    });

    const httpStatus = getByDataCy(AsyncResponseModalIds.httpStatusVariable);
    expect(httpStatus).toBeInTheDocument();
  });

  it('Should show Headers input when custom response is selected', async () => {
    const { getByText, getByDataCy } = setUp(true);
    const yesOption = getByText('Yes');

    act(() => {
      fireEvent.click(yesOption);
    });

    const inputHeaderContainer = getByDataCy(AsyncResponseModalIds.inputHeaderContainer);
    expect(inputHeaderContainer).toBeInTheDocument();
  });

  it('Should show the List of body types when custom response is selected', async () => {
    const { getByText, getByDataCy } = setUp(true);
    const yesOption = getByText('Yes');

    act(() => {
      fireEvent.click(yesOption);
    });

    const selectBodyTypeDropdown = getByDataCy(AsyncResponseModalIds.selectBodyTypeDropdown);

    expect(selectBodyTypeDropdown).toBeInTheDocument();
  });

  it('Should show input body types when custom response is selected', async () => {
    const { getByText, getByDataCy, queryByDataCy } = setUp(true);
    const yesOption = getByText('Yes');

    act(() => {
      fireEvent.click(yesOption);
    });

    const bodyInput = queryByDataCy(AsyncResponseModalIds.inputBody);

    expect(bodyInput).not.toBeInTheDocument();
  });

  it('Should have the footer actions (Test and Save) buttons', () => {
    const { getByDataCy } = setUp();

    const testBtn = getByDataCy(AsyncResponseModalIds.testBtn);
    const saveBtn = getByDataCy(AsyncResponseModalIds.saveBtn);

    expect(testBtn).toBeInTheDocument();
    expect(saveBtn).toBeInTheDocument();
  });

  it('Should execute the functions after click on each button', () => {
    const { getByDataCy } = setUp();

    const testBtn = getByDataCy(AsyncResponseModalIds.testBtn);
    const saveButton = getByDataCy(AsyncResponseModalIds.saveBtn);

    act(() => {
      fireEvent.click(testBtn);
      fireEvent.click(saveButton);
    });

    expect(mockSetIsTesting).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('Should execute UPDATE Function if selectedNode true (save button)', () => {
    mockSelectedNode = true;
    const { getByDataCy } = setUp();

    const saveButton = getByDataCy(AsyncResponseModalIds.saveBtn);

    act(() => {
      fireEvent.click(saveButton);
    });

    expect(mockUpdate).toHaveBeenCalledTimes(1);
  });

  it('Should Execute the "Run Test" function after click on "Run Test ⏵ " button', async () => {
    mockIsTesting = true;
    const { queryByDataCy } = setUp();

    const runTestBtn = queryByDataCy(AsyncResponseModalIds.runTestBtn);

    act(() => {
      fireEvent.click(runTestBtn);
    });
    await waitFor(() => {
      expect(mockRunTest).toHaveBeenCalledTimes(1);
    });
  });
});
