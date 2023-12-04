import { render } from '@utils/test/testUtils';
import { ApiCallModalIds } from '@constants/appIDS';
import { EditorModal } from '@components/Editor/EditorModal';
import { ModalType as mockModalType } from '@components/Modal/types';
import { act, fireEvent, waitFor } from '@testing-library/react';
import { runTestsModalIndividualCases } from '@/__test__/utils/reusableTestCases/ModalIndividualTes';

const setUp = (testExecutionMode?: boolean) => {
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
    selectedModalType: mockModalType.API_CALL,
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

jest.mock('@components/Editor/EditorSteps/ApiCall/Modal/hooks', () => ({
  useApiCall: jest.fn(() => ({
    ...jest.requireActual('@components/Editor/EditorSteps/ApiCall/Modal/hooks').useApiCall(),
    selectedNode: mockSelectedNode,
    create: mockCreate,
    update: mockUpdate,
    runTest: mockRunTest,
  })),
}));

jest.mock('@hooks/growthBook/index.tsx', () => ({
  useGrowthBook: jest.fn(() => ({
    evalFlag: (_val) => true
  })),
}));

describe('API CALL Modal', () => {
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

  it('Should render the principal parts of the modal', () => {
    const { getByDataCy } = setUp();
    const modalBody = getByDataCy(ApiCallModalIds.body);
    const modalheader = getByDataCy(ApiCallModalIds.header);
    const modalFooter = getByDataCy(ApiCallModalIds.footer);

    expect(modalBody).toBeInTheDocument();
    expect(modalheader).toBeInTheDocument();
    expect(modalFooter).toBeInTheDocument();
  });

  it('Should have the Dropdown to select the HTTP Method', () => {
    const { getByDataCy } = setUp();
    const selectMethodDropdown = getByDataCy(ApiCallModalIds.selectMethodDropdown);

    expect(selectMethodDropdown).toBeInTheDocument();
  });

  it('Should show the List of HTTP methods when hover the dropdown (GET - POST - PUT - PATCH - DELETE)', async () => {
    const { getByDataCy, getAllByRole } = setUp();

    const selectMethodDropdown = getByDataCy(ApiCallModalIds.selectMethodDropdown);
    expect(selectMethodDropdown).toBeInTheDocument();

    act(() => {
      fireEvent.mouseOver(selectMethodDropdown);
    });

    await waitFor(() => {
      const HTTPMethods = getAllByRole('menuitem');
      expect(HTTPMethods.length).toBe(5);

      const GET = HTTPMethods.find((method) => method.textContent === 'GET');
      const POST = HTTPMethods.find((method) => method.textContent === 'POST');
      const PUT = HTTPMethods.find((method) => method.textContent === 'PUT');
      const PATCH = HTTPMethods.find((method) => method.textContent === 'PATCH');
      const DELETE = HTTPMethods.find((method) => method.textContent === 'DELETE');

      expect(GET).toBeInTheDocument();
      expect(POST).toBeInTheDocument();
      expect(PUT).toBeInTheDocument();
      expect(PATCH).toBeInTheDocument();
      expect(DELETE).toBeInTheDocument();
    });
  });

  it('Should have the Certificate switch', () => {
    const { getByDataCy } = setUp();
    const customCertificateRadioButton = getByDataCy(ApiCallModalIds.customCertificateOptions);
  
    expect(customCertificateRadioButton).toBeInTheDocument();
  });

  it('Should not show Certificate File input and Key File input', async () => {
    const { getByText, queryByDataCy } = setUp();
    const noOption = getByText('No');

    act(() => {
      fireEvent.click(noOption);
    });

    const certificateFileInput = queryByDataCy(ApiCallModalIds.inputCertificateFile);
    const keyFileInput = queryByDataCy(ApiCallModalIds.inputKeyFile);

    expect(certificateFileInput).not.toBeInTheDocument();
    expect(keyFileInput).not.toBeInTheDocument();
  });

  it('Should show Certificate File input and Key File input when certificate is selected "YES"', async () => {
    const { getByText, queryByDataCy } = setUp();
    const yesOption = getByText('Yes');

    act(() => {
      fireEvent.click(yesOption);
    });

    const certificateFileInput = queryByDataCy(ApiCallModalIds.inputCertificateFile);
    const keyFileInput = queryByDataCy(ApiCallModalIds.inputKeyFile);
    
    expect(certificateFileInput).toBeInTheDocument();
    expect(keyFileInput).toBeInTheDocument();
  });

  it('POST: Should set the method when click on it and show the body input', async () => {
    const { getByDataCy, getAllByRole, queryByDataCy } = setUp();

    const selectMethodDropdown = getByDataCy(ApiCallModalIds.selectMethodDropdown);
    act(() => {
      fireEvent.mouseOver(selectMethodDropdown);
    });

    await waitFor(() => {
      const HTTPMethods = getAllByRole('menuitem');

      // Find the method in the optons list
      const POST = HTTPMethods.find((method) => method.textContent === 'POST');
      expect(POST).toBeInTheDocument();

      // Should not existes before click on the opction
      const inputBody = queryByDataCy(ApiCallModalIds.inputBody);
      expect(inputBody).toBeNull();

      act(() => {
        fireEvent.click(POST);
      });

      // Check if exists
      const inputBodyAfterClick = queryByDataCy(ApiCallModalIds.inputBody);
      expect(inputBodyAfterClick).toBeInTheDocument();
    });
  });

  it('PUT: Should set the method when click on it and show the body input', async () => {
    const { getByDataCy, getAllByRole, queryByDataCy } = setUp();

    const selectMethodDropdown = getByDataCy(ApiCallModalIds.selectMethodDropdown);
    act(() => {
      fireEvent.mouseOver(selectMethodDropdown);
    });

    await waitFor(() => {
      const HTTPMethods = getAllByRole('menuitem');

      // Find the method in the optons list
      const PUT = HTTPMethods.find((method) => method.textContent === 'PUT');
      expect(PUT).toBeInTheDocument();

      // Should not existes before click on the opction
      const inputBody = queryByDataCy(ApiCallModalIds.inputBody);
      expect(inputBody).toBeNull();

      act(() => {
        fireEvent.click(PUT);
      });

      // Check if exists
      const inputBodyAfterClick = queryByDataCy(ApiCallModalIds.inputBody);
      expect(inputBodyAfterClick).toBeInTheDocument();
    });
  });

  it('PATCH: Should set the method when click on it and show the body input', async () => {
    const { getByDataCy, getAllByRole, queryByDataCy } = setUp();

    const selectMethodDropdown = getByDataCy(ApiCallModalIds.selectMethodDropdown);
    act(() => {
      fireEvent.mouseOver(selectMethodDropdown);
    });

    await waitFor(() => {
      const HTTPMethods = getAllByRole('menuitem');

      // Find the method in the optons list
      const PATCH = HTTPMethods.find((method) => method.textContent === 'PATCH');
      expect(PATCH).toBeInTheDocument();

      // Should not existes before click on the opction
      const inputBody = queryByDataCy(ApiCallModalIds.inputBody);
      expect(inputBody).toBeNull();

      act(() => {
        fireEvent.click(PATCH);
      });

      // Check if exists
      const inputBodyAfterClick = queryByDataCy(ApiCallModalIds.inputBody);
      expect(inputBodyAfterClick).toBeInTheDocument();
    });
  });

  it('Should have the General Elements in all the methods (URL Input - Headers Input - Output Variables Input)', async () => {
    const { getByDataCy, getAllByRole } = setUp();

    const selectMethodDropdown = getByDataCy(ApiCallModalIds.selectMethodDropdown);
    act(() => {
      fireEvent.mouseOver(selectMethodDropdown);
    });

    await waitFor(() => {
      const HTTPMethods = getAllByRole('menuitem');

      HTTPMethods.map((methodHTTP) => {
        // methodHTTP = (GET - POST - PUT - PATCH - DELETE)
        expect(methodHTTP).toBeInTheDocument();

        const inputURL = getByDataCy(ApiCallModalIds.inputURL);
        const inputHeader = getByDataCy(ApiCallModalIds.inputHeader);
        const inputOutputVariable = getByDataCy(ApiCallModalIds.inputOutputVariable);

        // Each method has in common these elements, and they must be rendered
        expect(inputURL).toBeInTheDocument();
        expect(inputHeader).toBeInTheDocument();
        expect(inputOutputVariable).toBeInTheDocument();
      });
    });
  });

  it('Should have the footer actions (Test and Save) buttons', () => {
    const { getByDataCy } = setUp();

    const testBtn = getByDataCy(ApiCallModalIds.testBtn);
    const saveBtn = getByDataCy(ApiCallModalIds.saveBtn);

    expect(testBtn).toBeInTheDocument();
    expect(saveBtn).toBeInTheDocument();
  });

  it('Should execute the functions after click on each button', () => {
    const { getByDataCy } = setUp();

    const testBtn = getByDataCy(ApiCallModalIds.testBtn);
    const saveButton = getByDataCy(ApiCallModalIds.saveBtn);

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

    const saveButton = getByDataCy(ApiCallModalIds.saveBtn);

    act(() => {
      fireEvent.click(saveButton);
    });

    expect(mockUpdate).toHaveBeenCalledTimes(1);
  });

  it('Should Execute the "Run Test" function after click on "Run Test ⏵ " button', async () => {
    mockIsTesting = true;
    const { queryByDataCy } = setUp();

    const runTestBtn = queryByDataCy(ApiCallModalIds.runTestBtn);

    act(() => {
      fireEvent.click(runTestBtn);
    });
    await waitFor(() => {
      expect(mockRunTest).toHaveBeenCalledTimes(1);
    });
  });
});

runTestsModalIndividualCases(setUp);
