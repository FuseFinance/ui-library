/* eslint-disable no-unused-vars */
import { act, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@utils/test/testUtils';
import { DBConnectionModalIds } from '@constants/appIDS';
import { EditorModal } from '@components/Editor/EditorModal';
import { ModalType as mockModalType } from '@components/Modal/types';
import { runTestsModalIndividualCases } from '@/__test__/utils/reusableTestCases/ModalIndividualTes';

enum MOCK_TABLES {
  USERS = 'USERS',
  COMPANIES = 'COMPANIES',
  CITIES = 'CITIES',
  MOCK = 'MOCK',
}

const mockSchemas = [
  {
    value: '1',
    label: MOCK_TABLES.USERS,
  },
  {
    value: '2',
    label: MOCK_TABLES.COMPANIES,
  },
  {
    value: '3',
    label: MOCK_TABLES.CITIES,
  },
];

// Mock Variables
let mockIsDeployed = false;
let mockIsEditorModalOpen = true;
let mockSelectedNode = false;
let mockTestExecution = false;
let mockIsTesting = false;

let mockOnModalClose = jest.fn();
let mockCreate = jest.fn();
let mockUpdate = jest.fn();
let mockSetIsTesting = jest.fn();
let mockRunTest = jest.fn();

// SETUP Function
const setUp = (testExecutionMode?: boolean) => {
  if (testExecutionMode) {
    mockTestExecution = true;
  }
  return render(<EditorModal />, {});
};

// Mock dependencies
jest.mock('@contexts/WorkflowEditorProvider/hooks', () => ({
  useEditorModal: () => ({
    isEditorModalOpen: mockIsEditorModalOpen,
    selectedModalType: mockModalType.DB_CONNECTION,
    setIsEditorModalOpen: jest.fn(),
    setSelectedModalType: jest.fn(),
    onModalClose: mockOnModalClose,
  }),
  useWorkflowEditor: () => ({
    isDeployed: mockIsDeployed,
    selectedNode: mockSelectedNode,
    selectedWorkflow: {
      id: 10,
    },
  }),
  useTestModal: () => ({
    isTesting: mockIsTesting,
    setIsTesting: mockSetIsTesting,
    testExecution: mockTestExecution,
  }),
  useTraceModal: () => ({
    isTraceMode: false,
    setIsTraceMode: jest.fn(),
    traceSteps: [],
    setTraceSteps: jest.fn(),
  }),
}));

const hookUrl = '@components/Editor/EditorSteps/DBConnection/hooks';

jest.mock(hookUrl, () => ({
  useDBConnectionNode: jest.fn(() => ({
    ...jest.requireActual(hookUrl).useDBConnectionNode(),
    update: mockUpdate,
    create: mockCreate,
    runTest: mockRunTest,
    schemas: mockSchemas,
  })),
}));

describe('Test DB Connection Step', () => {
  beforeEach(() => {
    mockIsEditorModalOpen = true;
    mockSelectedNode = false;
    mockIsDeployed = false;
    mockTestExecution = false;
    mockIsTesting = false;
    mockOnModalClose = jest.fn();
    mockRunTest = jest.fn();
    mockCreate = jest.fn();
    mockUpdate = jest.fn();
    mockSetIsTesting = jest.fn();
  });

  it('Should render the main parts of the modal (Header - Body - Footer)', () => {
    const { getByDataCy } = setUp();

    const modalBody = getByDataCy(DBConnectionModalIds.body);
    const modalheader = getByDataCy(DBConnectionModalIds.header);
    const modalFooter = getByDataCy(DBConnectionModalIds.footer);

    expect(modalBody).toBeInTheDocument();
    expect(modalheader).toBeInTheDocument();
    expect(modalFooter).toBeInTheDocument();
  });

  it('Should render all the elements inside of each part of the modal', () => {
    const { getByDataCy } = setUp();

    // Header
    const headerIcon = getByDataCy(DBConnectionModalIds.headerIcon);
    const headerTitle = getByDataCy(DBConnectionModalIds.headerTitle);

    // Body
    const selectSchema = getByDataCy(DBConnectionModalIds.selectSchema);
    const inputData = getByDataCy(DBConnectionModalIds.query);
    const outputVariable = getByDataCy(DBConnectionModalIds.outputVariable);

    // Footer
    const saveBtn = getByDataCy(DBConnectionModalIds.saveBtn);
    const testBtn = getByDataCy(DBConnectionModalIds.testBtn);

    // Header
    expect(headerIcon).toBeInTheDocument();
    expect(headerTitle).toBeInTheDocument();

    // Body
    expect(inputData).toBeInTheDocument();
    expect(outputVariable).toBeInTheDocument();
    expect(selectSchema).toBeInTheDocument();

    // Footer
    expect(saveBtn).toBeInTheDocument();
    expect(testBtn).toBeInTheDocument();
  });

  it('Should render the Select Schema list', () => {
    const { getByDataCy, getAllByDataCy, queryByText } = setUp();
    const selectSchema = getByDataCy(DBConnectionModalIds.selectSchema).firstElementChild;

    fireEvent.mouseDown(selectSchema);

    const schemaMenuItems = getAllByDataCy(DBConnectionModalIds.schemaMenuItem);
    expect(schemaMenuItems.length).toBe(mockSchemas.length);

    const CITIES = queryByText(MOCK_TABLES.CITIES);
    expect(CITIES).toBeInTheDocument();

    const USERS = queryByText(MOCK_TABLES.USERS);
    expect(USERS).toBeInTheDocument();

    const COMPANIES = queryByText(MOCK_TABLES.COMPANIES);
    expect(COMPANIES).toBeInTheDocument();

    const MOCK = queryByText(MOCK_TABLES.MOCK);
    expect(MOCK).not.toBeInTheDocument();
  });

  it('Should execute CREATE function', () => {
    const { getByDataCy } = setUp();
    const saveButton = getByDataCy(DBConnectionModalIds.saveBtn);

    fireEvent.click(saveButton);
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('Should execute UPDATE function if mockSelectedNode = true', () => {
    mockSelectedNode = true;
    const { getByDataCy } = setUp();
    const saveButton = getByDataCy(DBConnectionModalIds.saveBtn);

    fireEvent.click(saveButton);
    expect(mockUpdate).toHaveBeenCalledTimes(1);
  });

  it('Should execute TEST function ', () => {
    const { getByDataCy } = setUp();
    const saveButton = getByDataCy(DBConnectionModalIds.testBtn);

    fireEvent.click(saveButton);
    expect(mockSetIsTesting).toHaveBeenCalledTimes(1);
  });

  it('Should Execute the "Run Test" function after click on "Run Test ⏵ " button', async () => {
    mockIsTesting = true;
    const { queryByDataCy } = setUp();
    const runTestBtn = queryByDataCy(DBConnectionModalIds.runTestBtn);

    act(() => {
      fireEvent.click(runTestBtn);
    });

    await waitFor(() => {
      expect(mockRunTest).toHaveBeenCalledTimes(1);
    });
  });
});

runTestsModalIndividualCases(setUp);
