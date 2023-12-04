import { act, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@utils/test/testUtils';
import { ConverterModalIds } from '@constants/appIDS';
import { EditorModal } from '@components/Editor/EditorModal';
import { ModalType as mockModalType } from '@components/Modal/types';
import { runTestsModalIndividualCases } from '@/__test__/utils/reusableTestCases/ModalIndividualTes';
import { CONVERTER_CONTENT_TYPE } from '@components/Editor/EditorSteps/Converter/types';

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

const generateDataCyIds = (type: 'FROM' | 'TO') => {
  const options = ['XML', 'JSON', 'FORM_URL_ENCODED'];

  return options.map((opt) => `${type}_${opt}`);
};

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
    selectedModalType: mockModalType.CONVERTER,
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

jest.mock('@components/Editor/EditorSteps/Converter/hooks', () => ({
  useConverterBlock: jest.fn(() => ({
    ...jest.requireActual('@components/Editor/EditorSteps/Converter/hooks').useConverterBlock(),
    update: mockUpdate,
    create: mockCreate,
    runTest: mockRunTest,
  })),
}));

describe('Test CONVERTER Modal', () => {
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

    const modalBody = getByDataCy(ConverterModalIds.body);
    const modalheader = getByDataCy(ConverterModalIds.header);
    const modalFooter = getByDataCy(ConverterModalIds.footer);

    expect(modalBody).toBeInTheDocument();
    expect(modalheader).toBeInTheDocument();
    expect(modalFooter).toBeInTheDocument();
  });

  it('Should render all the elements inside of each part of the modal', () => {
    const { getByDataCy, queryByDataCy } = setUp();

    // Header
    const headerIcon = getByDataCy(ConverterModalIds.headerIcon);
    const headerTitle = getByDataCy(ConverterModalIds.headerTitle);

    // Body
    const inputData = getByDataCy(ConverterModalIds.inputData);
    const outputVariable = getByDataCy(ConverterModalIds.outputVariable);
    const convertFrom = getByDataCy(ConverterModalIds.convertFrom);
    const convertTo = getByDataCy(ConverterModalIds.convertTo);
    const switchCont = queryByDataCy(ConverterModalIds.switch);

    // Footer
    const saveBtn = getByDataCy(ConverterModalIds.saveBtn);
    const testBtn = getByDataCy(ConverterModalIds.testBtn);

    // Header
    expect(headerIcon).toBeInTheDocument();
    expect(headerTitle).toBeInTheDocument();

    // Body
    expect(inputData).toBeInTheDocument();
    expect(outputVariable).toBeInTheDocument();
    expect(convertFrom).toBeInTheDocument();
    expect(convertTo).toBeInTheDocument();
    expect(switchCont).toBeNull();

    // Footer
    expect(saveBtn).toBeInTheDocument();
    expect(testBtn).toBeInTheDocument();
  });

  it('Should render the Switch for parse numbers if the FROM selection is XML', async () => {
    const { getByDataCy } = setUp();
    const convertFrom = getByDataCy(ConverterModalIds.convertFrom).firstElementChild;

    fireEvent.mouseDown(convertFrom);

    await waitFor(() => {
      const optFromXML = getByDataCy('FROM_XML');
      expect(optFromXML).toBeVisible();
      fireEvent.click(optFromXML);
    });

    const switchCont = getByDataCy(ConverterModalIds.switch);
    expect(switchCont).toBeInTheDocument();
  });

  it('Should execute CREATE function', () => {
    const { getByDataCy } = setUp();
    const saveButton = getByDataCy(ConverterModalIds.saveBtn);

    fireEvent.click(saveButton);
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('Should execute UPDATE function if mockSelectedNode = true', () => {
    mockSelectedNode = true;
    const { getByDataCy } = setUp();
    const saveButton = getByDataCy(ConverterModalIds.saveBtn);

    fireEvent.click(saveButton);
    expect(mockUpdate).toHaveBeenCalledTimes(1);
  });

  it('Should execute TEST function ', () => {
    const { getByDataCy } = setUp();
    const saveButton = getByDataCy(ConverterModalIds.testBtn);

    fireEvent.click(saveButton);
    expect(mockSetIsTesting).toHaveBeenCalledTimes(1);
  });

  it('Should Switch the options when change FROM selection', async () => {
    const { getByDataCy } = setUp();
    const convertFrom = getByDataCy(ConverterModalIds.convertFrom).firstElementChild;
    const convertTo = getByDataCy(ConverterModalIds.convertTo).firstElementChild;

    expect(convertFrom.textContent).toBe(CONVERTER_CONTENT_TYPE.JSON);
    expect(convertTo.textContent).toBe(CONVERTER_CONTENT_TYPE.XML);

    fireEvent.mouseDown(convertFrom);

    await waitFor(() => {
      const optFromXML = getByDataCy('FROM_XML');
      expect(optFromXML).toBeVisible();
      fireEvent.click(optFromXML);
    });

    expect(convertFrom.textContent).toBe(CONVERTER_CONTENT_TYPE.XML);
    expect(convertTo.textContent).toBe(CONVERTER_CONTENT_TYPE.JSON);
  });

  it('Should render all FROM options', async () => {
    const { getByDataCy } = setUp();
    const convertFrom = getByDataCy(ConverterModalIds.convertFrom).firstElementChild;

    fireEvent.mouseDown(convertFrom);

    const fromOptions = generateDataCyIds('FROM');

    await waitFor(() => {
      fromOptions.forEach((opt) => {
        const optNode = getByDataCy(opt);
        expect(optNode).toBeVisible();
      });
    });
  });

  it('Should have 3 options in FROM [JSON - XML - FORM_URL_ENCODED]', async () => {
    const { getByDataCy, queryAllByRole } = setUp();
    const convertFrom = getByDataCy(ConverterModalIds.convertFrom).firstElementChild;

    fireEvent.mouseDown(convertFrom);

    await waitFor(() => {
      const options = queryAllByRole('menuitem');

      expect(options.length).toBe(3);
    });
  });

  describe('Should render the correct TO Options depending of the FROM selection', () => {
    it('XML should have 1 option [JSON]', async () => {
      const { queryByDataCy } = setUp();
      const convertFrom = queryByDataCy(ConverterModalIds.convertFrom).firstElementChild;
      const convertTo = queryByDataCy(ConverterModalIds.convertTo).firstElementChild;

      const [FROM_XML] = generateDataCyIds('FROM');
      const [TO_XML, TO_JSON, TO_FORM_URL_ENCODED] = generateDataCyIds('TO');
      fireEvent.mouseDown(convertFrom);

      await waitFor(() => {
        const xmlFrom = queryByDataCy(FROM_XML);
        expect(xmlFrom).toBeVisible();

        fireEvent.click(xmlFrom);
      });

      fireEvent.mouseDown(convertTo);

      await waitFor(() => {
        const toJson = queryByDataCy(TO_JSON);
        const toXml = queryByDataCy(TO_XML);
        const toFormEncoded = queryByDataCy(TO_FORM_URL_ENCODED);

        expect(toJson).toBeVisible();
        expect(toXml).not.toBeInTheDocument();
        expect(toFormEncoded).not.toBeInTheDocument();
      });
    });

    it('JSON should have 2 option [XML - FROM_FORM_URL_ENCODED]', async () => {
      const { queryByDataCy, getByDataCy } = setUp();
      const convertFrom = getByDataCy(ConverterModalIds.convertFrom).firstElementChild;
      const convertTo = getByDataCy(ConverterModalIds.convertTo).firstElementChild;

      const [, FROM_JSON] = generateDataCyIds('FROM');
      const [TO_XML, TO_JSON, TO_FORM_URL_ENCODED] = generateDataCyIds('TO');

      fireEvent.mouseDown(convertFrom);

      await waitFor(() => {
        const jsonFrom = queryByDataCy(FROM_JSON);
        expect(jsonFrom).toBeVisible();
        fireEvent.click(jsonFrom);
      });

      fireEvent.mouseDown(convertTo);

      await waitFor(() => {
        const toJson = queryByDataCy(TO_JSON);
        const toXml = getByDataCy(TO_XML);
        const toFormEncoded = queryByDataCy(TO_FORM_URL_ENCODED);

        expect(toJson).not.toBeInTheDocument();
        expect(toXml).toBeVisible();
        expect(toFormEncoded).toBeVisible();
      });
    });

    it('FROM_FORM_URL_ENCODED should have 1 option [JSON]', async () => {
      const { queryByDataCy, getByDataCy } = setUp();
      const convertFrom = getByDataCy(ConverterModalIds.convertFrom).firstElementChild;
      const convertTo = getByDataCy(ConverterModalIds.convertTo).firstElementChild;

      const [, , FROM_FORM_URL_ENCODED] = generateDataCyIds('FROM');
      const [TO_XML, TO_JSON, TO_FORM_URL_ENCODED] = generateDataCyIds('TO');

      fireEvent.mouseDown(convertFrom);

      await waitFor(() => {
        const formEncodedFrom = queryByDataCy(FROM_FORM_URL_ENCODED);
        expect(formEncodedFrom).toBeVisible();
        fireEvent.click(formEncodedFrom);
      });

      fireEvent.mouseDown(convertTo);

      await waitFor(() => {
        const toJson = queryByDataCy(TO_JSON);
        const toXml = queryByDataCy(TO_XML);
        const toFormEncoded = queryByDataCy(TO_FORM_URL_ENCODED);

        expect(toJson).toBeVisible();
        expect(toXml).not.toBeInTheDocument();
        expect(toFormEncoded).not.toBeInTheDocument();
      });
    });
  });
  it('Should Execute the "Run Test" function after click on "Run Test ⏵ " button', async () => {
    mockIsTesting = true;
    const { queryByDataCy } = setUp();

    const runTestBtn = queryByDataCy(ConverterModalIds.runTestBtn);

    act(() => {
      fireEvent.click(runTestBtn);
    });
    await waitFor(() => {
      expect(mockRunTest).toHaveBeenCalledTimes(1);
    });
  });
});

runTestsModalIndividualCases(setUp);
