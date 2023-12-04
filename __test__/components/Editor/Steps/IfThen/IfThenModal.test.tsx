import { fireEvent } from '@testing-library/react';
import { render } from '@utils/test/testUtils';
import { IfThenModalIds, TestInputContentIds, TestOutputContentIds } from '@constants/appIDS';
import { EditorModal } from '@components/Editor/EditorModal';

const setUp = () => {
  return render(<EditorModal />, {});
};

let mockIsDeployed = false;
let mockIsEditorModalOpen = true;
let mockIsTesting = false;
let mockTestExecution = false;
let mockSetIsTesting = jest.fn();
let mockRunTest = jest.fn();

jest.mock('@contexts/WorkflowEditorProvider/hooks', () => ({
  useEditorModal: () => ({
    isEditorModalOpen: mockIsEditorModalOpen,
    selectedModalType: 'IF_THEN',
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

jest.mock('src/components/Editor/EditorSteps/IfThen/Modal/hooks', () => ({
  useIfThen: jest.fn(() => ({
    ...jest.requireActual('src/components/Editor/EditorSteps/IfThen/Modal/hooks').useIfThen(),
    runTest: mockRunTest,
  })),
}));

// TODO JUAN A. Fix when we solve the EditorModal Problem.
describe('Test IfThen Step Modal when WF is not deployed', () => {
  // This suit mus to work with isDeployed in False.

  beforeEach(() => {
    mockIsEditorModalOpen = true;
    mockIsTesting = false;
    mockTestExecution = false;
    mockSetIsTesting = jest.fn();
    mockRunTest = jest.fn();
  });

  it('Should render modal when ModalType === IF_THEN', () => {
    const { getByDataCy } = setUp();
    const modalBody = getByDataCy(IfThenModalIds.body);
    const modalheader = getByDataCy(IfThenModalIds.header);
    const modalFooter = getByDataCy(IfThenModalIds.footer);

    expect(modalBody).toBeInTheDocument();
    expect(modalheader).toBeInTheDocument();
    expect(modalFooter).toBeInTheDocument();
  });

  it('Should have all footer Actions', () => {
    const { getByDataCy } = setUp();
    const elseIfBtn = getByDataCy(IfThenModalIds.addElseIfBtn);
    const elseBtn = getByDataCy(IfThenModalIds.addElseBtn);
    const testBtn = getByDataCy(IfThenModalIds.testBtn);
    const saveBtn = getByDataCy(IfThenModalIds.saveBtn);

    expect(elseIfBtn).toBeInTheDocument();
    expect(elseBtn).toBeInTheDocument();
    expect(testBtn).toBeInTheDocument();
    expect(saveBtn).toBeInTheDocument();
  });

  it('Adding else branch must disappear the addElseBtn', () => {
    const { getByDataCy, queryByDataCy } = setUp();
    const elseBtn = getByDataCy(IfThenModalIds.addElseBtn);
    const elseInputBeforeClick = queryByDataCy(IfThenModalIds.elseInput);
    expect(elseBtn).toBeInTheDocument();
    expect(elseInputBeforeClick).not.toBeInTheDocument();

    fireEvent.click(elseBtn);
    const elseInput = getByDataCy(IfThenModalIds.elseInput);
    const elseBtnAfterClick = queryByDataCy(IfThenModalIds.addElseBtn);
    expect(elseBtnAfterClick).not.toBeInTheDocument();
    expect(elseInput).toBeInTheDocument();
  });

  it('Should be able to add new ElseIf inputs', () => {
    const { getAllByDataCy, getByDataCy } = setUp();
    const initialIfInput = getAllByDataCy(IfThenModalIds.ifInput);
    expect(initialIfInput.length).toBe(1);

    const addElifBtn = getByDataCy(IfThenModalIds.addElseIfBtn);
    fireEvent.click(addElifBtn);
    fireEvent.click(addElifBtn);

    const allIfInputs = getAllByDataCy(IfThenModalIds.ifInput);
    expect(allIfInputs.length).toBe(3);
  });

  describe('Delete actions', () => {
    it('Firts If input should not have a delete Icon', () => {
      const { queryByDataCy } = setUp();
      const deleteIcon = queryByDataCy(IfThenModalIds.deleteBtn);
      expect(deleteIcon).toBeNull();
    });

    it('Delete Icons should appear when more ElseIf inputs are added', () => {
      const { getByDataCy, getAllByDataCy } = setUp();
      const addElifBtn = getByDataCy(IfThenModalIds.addElseIfBtn);
      fireEvent.click(addElifBtn);
      const deleteIcons = getAllByDataCy(IfThenModalIds.deleteBtn);
      expect(deleteIcons.length).toBe(1);
    });

    it('Delete Icons should delete inputs', () => {
      const { getByDataCy, getAllByDataCy } = setUp();
      const addElifBtn = getByDataCy(IfThenModalIds.addElseIfBtn);
      fireEvent.click(addElifBtn);
      fireEvent.click(addElifBtn);
      const allIfInputs = getAllByDataCy(IfThenModalIds.ifInput);
      expect(allIfInputs.length).toBe(3);

      const deleteIcons = getAllByDataCy(IfThenModalIds.deleteBtn);
      fireEvent.click(deleteIcons[0]);
      const inputsAfterDelete = getAllByDataCy(IfThenModalIds.ifInput);
      expect(inputsAfterDelete.length).toBe(2);
    });

    it('Remove Else Branch', () => {
      const { getByDataCy } = setUp();

      const elseBtn = getByDataCy(IfThenModalIds.addElseBtn);
      fireEvent.click(elseBtn);
      const elseInput = getByDataCy(IfThenModalIds.elseInput);
      expect(elseInput).toBeInTheDocument();

      const deleteElseIcon = getByDataCy(IfThenModalIds.deleteElseBtn);
      fireEvent.click(deleteElseIcon);
      expect(elseInput).not.toBeInTheDocument();
    });
  });
  describe('Cases when Open Test Options', () => {
    it('Should execute "setIsTesting" after click on "Show Test Button"', () => {
      const { queryByDataCy } = setUp();

      const testBtn = queryByDataCy(IfThenModalIds.testBtn);
      fireEvent.click(testBtn);

      expect(mockSetIsTesting).toBeCalledTimes(1);
    });

    it('Should render "Hide Test Button" ', () => {
      mockIsTesting = true;
      const { queryByDataCy } = setUp();

      const hideTestBtn = queryByDataCy(IfThenModalIds.hideTestBtn);
      expect(hideTestBtn).toBeInTheDocument();
    });

    it('Should render "Run Test ⏵ " button ', () => {
      mockIsTesting = true;
      const { queryByDataCy } = setUp();

      const runTestBtn = queryByDataCy(IfThenModalIds.runTestBtn);
      expect(runTestBtn).toBeInTheDocument();
    });

    it('Should not render "Run Test ⏵ " button if not is Testing', () => {
      const { queryByDataCy } = setUp();

      const runTestBtn = queryByDataCy(IfThenModalIds.runTestBtn);
      expect(runTestBtn).toBeNull();
    });

    it('Should Execute the "Run Test" function after click on "Run Test ⏵ " button', () => {
      mockIsTesting = true;
      const { queryByDataCy } = setUp();

      const runTestBtn = queryByDataCy(IfThenModalIds.runTestBtn);

      fireEvent.click(runTestBtn);
      expect(mockRunTest).toHaveBeenCalledTimes(1);
    });

    describe('Render the principal InputContent elements', () => {
      it('Should render Container', () => {
        mockIsTesting = true;
        const { queryByDataCy } = setUp();

        const container = queryByDataCy(TestInputContentIds.container);
        expect(container).toBeInTheDocument();
      });

      it('Should render Dropdown', () => {
        mockIsTesting = true;
        const { queryByDataCy } = setUp();

        const dropdown = queryByDataCy(TestInputContentIds.dropdown);
        expect(dropdown).toBeInTheDocument();
      });

      it('Should render Text Input (Code Editor)', () => {
        mockIsTesting = true;
        const { queryByDataCy } = setUp();

        const codeEditor = queryByDataCy(TestInputContentIds.inputCodeEditor);
        expect(codeEditor).toBeInTheDocument();
      });

      it('Should render menu actions', () => {
        mockIsTesting = true;
        const { queryByDataCy } = setUp();

        const select = queryByDataCy(TestInputContentIds.select);
        expect(select).toBeInTheDocument();
      });
    });

    describe('Render the principal OutputContent elements', () => {
      it('Should render Container', () => {
        mockIsTesting = true;
        const { queryByDataCy } = setUp();

        const container = queryByDataCy(TestOutputContentIds.container);
        expect(container).toBeInTheDocument();
      });

      it('Should render the Tabs', () => {
        mockIsTesting = true;
        const { queryByDataCy } = setUp();

        const tabs = queryByDataCy(TestOutputContentIds.tabs);
        expect(tabs).toBeInTheDocument();
      });

      it('Should render Result Section', () => {
        mockIsTesting = true;
        mockTestExecution = true;

        const { queryByDataCy } = setUp();

        const result = queryByDataCy(TestOutputContentIds.resultSection);
        expect(result).toBeInTheDocument();
      });
    });
  });
});

describe('Test IfThen Step Modal when WF is deployed', () => {
  beforeAll(() => {
    mockIsDeployed = true;
  });
  // afterEach(cleanup);

  it('Should not have any footer actions', () => {
    const { queryByDataCy } = setUp();
    const elseIfBtn = queryByDataCy(IfThenModalIds.addElseIfBtn);
    const elseBtn = queryByDataCy(IfThenModalIds.addElseBtn);
    const testBtn = queryByDataCy(IfThenModalIds.testBtn);
    const saveBtn = queryByDataCy(IfThenModalIds.saveBtn);

    expect(elseIfBtn).not.toBeInTheDocument();
    expect(elseBtn).not.toBeInTheDocument();
    expect(testBtn).not.toBeInTheDocument();
    expect(saveBtn).not.toBeInTheDocument();
  });
});
