import { fireEvent } from '@testing-library/react';
import { render } from '@utils/test/testUtils';
import { SplitPathModalIds } from '@constants/appIDS';
import { EditorModal } from '@components/Editor/EditorModal';
import { ModalType as mockModalType } from '@/src/components/Modal/types';

// SETUP Function
const setUp = () => {
  return render(<EditorModal />, {});
};

// Mock Variables
let mockIsDeployed = false;
let mockIsEditorModalOpen = true;
let mockTitle = '';
let mockSelectedNode = false;

let mockOnModalClose = jest.fn();
let mockHandleSave = jest.fn();
let mockHandleEdit = jest.fn();

// Mock dependencies
jest.mock('@contexts/WorkflowEditorProvider/hooks', () => ({
  useEditorModal: () => ({
    isEditorModalOpen: mockIsEditorModalOpen,
    selectedModalType: mockModalType.SPLIT_PATH,
    setIsEditorModalOpen: jest.fn(),
    setSelectedModalType: jest.fn(),
    onModalClose: mockOnModalClose,
  }),
  useWorkflowEditor: () => ({
    isDeployed: mockIsDeployed,
    selectedWorkflow: {
      id: 10,
    },
  }),
  useTraceModal: () => ({
    isTraceMode: false,
    setIsTraceMode: jest.fn(),
    traceSteps: [],
    setTraceSteps: jest.fn(),
  }),
  useTestModal: () => ({
    isTesting: false,
  }),
}));

jest.mock('@components/Editor/EditorSteps/SplitPath/Modal/hooks', () => ({
  useSplitPath: jest.fn(() => ({
    ...jest.requireActual('@components/Editor/EditorSteps/SplitPath/Modal/hooks').useSplitPath(),
    title: mockTitle,
    selectedNode: mockSelectedNode,
    handleEdit: mockHandleEdit,
    handleSave: mockHandleSave,
  })),
}));

describe('Test Split Path Modal', () => {
  beforeEach(() => {
    mockIsEditorModalOpen = true;
    mockSelectedNode = false;
    mockIsDeployed = false;
    mockTitle = '';
    mockOnModalClose = jest.fn();
    mockHandleSave = jest.fn();
    mockHandleEdit = jest.fn();
  });

  describe('Case: Not Deployed or is not Imported WF', () => {
    it('Should render modal when ModalType === SPLIT PATH', () => {
      const { getByDataCy } = setUp();

      const modalBody = getByDataCy(SplitPathModalIds.body);
      const modalheader = getByDataCy(SplitPathModalIds.header);
      const modalFooter = getByDataCy(SplitPathModalIds.footer);

      expect(modalBody).toBeInTheDocument();
      expect(modalheader).toBeInTheDocument();
      expect(modalFooter).toBeInTheDocument();
    });

    it('Should Close Modal when click on X button', async () => {
      const { getByDataCy, queryByDataCy } = setUp();

      const modalBody = getByDataCy(SplitPathModalIds.body);
      expect(modalBody).toBeInTheDocument();

      const closeButton = queryByDataCy(SplitPathModalIds.closeBtn);

      expect(closeButton).toBeInTheDocument();
      fireEvent.click(closeButton);

      expect(mockOnModalClose).toHaveBeenCalledTimes(1);
    });
    // TODO JUAN A: Fix this test
    // it('Should reset state when close modal', async () => {
    //   mockTitle = 'Test Title Split Path';
    //   const { getByText, getByDataCy, queryByDataCy } = setUp();

    //   const customModalTitle = getByText(mockTitle);

    //   const closeBtn = getByDataCy(SplitPathModalIds.closeBtn);
    //   expect(closeBtn).toBeInTheDocument();

    //   await act(async () => {
    //     mockIsEditorModalOpen = false;
    //     await new Promise((resolve) => setTimeout(resolve, 0));
    //   });

    //   const closeBtnAfter = queryByDataCy(SplitPathModalIds.closeBtn);
    //   expect(closeBtnAfter).toBeNull();
    // });

    it('Should render the correct custom modal Title', () => {
      mockTitle = 'Test Title Split Path';
      const { getByText } = setUp();

      const customModalTitle = getByText(mockTitle);
      expect(customModalTitle).toBeInTheDocument();
    });

    it('Should render CodeEditor', () => {
      const { getByDataCy } = setUp();

      const codeEditor = getByDataCy(SplitPathModalIds.codeEditor);
      expect(codeEditor).toBeInTheDocument();
    });

    it('Should Add a new CodeEditor after Click on + Branch Button', () => {
      const { getAllByDataCy, getByDataCy } = setUp();

      // Check initial quantity of Inputs
      const codeEditor = getAllByDataCy(SplitPathModalIds.codeEditor);
      expect(codeEditor.length).toBe(1);

      // Adding a new Input
      const addBranchBtn = getByDataCy(SplitPathModalIds.addBranchBtn);
      expect(addBranchBtn).toBeInTheDocument();
      fireEvent.click(addBranchBtn);

      // Check if the new Input already exists
      const codeEditorAfterClick = getAllByDataCy(SplitPathModalIds.codeEditor);
      expect(codeEditorAfterClick.length).toBe(2);
    });

    it('Should have the correct delete button if we have 1 or more Inputs', () => {
      const { getAllByDataCy, queryByDataCy } = setUp();

      // Check initial quantity of Inputs
      const codeEditorBefore = getAllByDataCy(SplitPathModalIds.codeEditor);
      expect(codeEditorBefore.length).toBe(1);

      // The Delete btn dont be shown if we have 1 Input
      const deleteButtonSingle = queryByDataCy(SplitPathModalIds.deleteBtn);
      expect(deleteButtonSingle).toBeNull();

      // Add a new Input should be add the Delete button if > 1 Input

      const addBranchBtn = queryByDataCy(SplitPathModalIds.addBranchBtn);
      expect(addBranchBtn).toBeInTheDocument();
      fireEvent.click(addBranchBtn);

      // After add a new Input we should have 2 delete button
      const deleteButtons = getAllByDataCy(SplitPathModalIds.deleteBtn);
      expect(deleteButtons.length).toBe(2);
    });

    it('Should ADD and then DELETE an Input and the Delete button should not appear', () => {
      const { getAllByDataCy, getByDataCy, queryByDataCy } = setUp();

      // Add a new Input should add the Delete button if > 1 Input
      const addBranchBtn = getByDataCy(SplitPathModalIds.addBranchBtn);
      fireEvent.click(addBranchBtn);

      const codeEditorAfter = getAllByDataCy(SplitPathModalIds.codeEditor);
      expect(codeEditorAfter.length).toBe(2);

      const deleteButtons = getAllByDataCy(SplitPathModalIds.deleteBtn);
      expect(deleteButtons.length).toBe(2);

      const buttonToDelete = deleteButtons[1];

      fireEvent.click(buttonToDelete);

      const deleteButtonSingle = queryByDataCy(SplitPathModalIds.deleteBtn);
      expect(deleteButtonSingle).toBeNull();
    });

    it('Should execute handleSave and not handleEdit if node is Selected', () => {
      const { queryByDataCy } = setUp();
      const saveButton = queryByDataCy(SplitPathModalIds.saveBtn);
      expect(saveButton).toBeInTheDocument();

      fireEvent.click(saveButton);

      expect(mockHandleSave).toHaveBeenCalledTimes(1);
      expect(mockHandleEdit).toHaveBeenCalledTimes(0);
    });

    it('Should execute HANDLE EDIT and not HANDLE SAVE if node is not Selected', () => {
      mockSelectedNode = true;
      const { queryByDataCy } = setUp();
      const saveButton = queryByDataCy(SplitPathModalIds.saveBtn);
      expect(saveButton).toBeInTheDocument();

      fireEvent.click(saveButton);

      expect(mockHandleSave).toHaveBeenCalledTimes(0);
      expect(mockHandleEdit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Case: its Deployed or is Imported WF', () => {
    it('Should not have actions btns if WF is Deployed', () => {
      mockIsDeployed = true;
      const { queryByDataCy } = setUp();

      const modalFooter = queryByDataCy(SplitPathModalIds.footer);

      expect(modalFooter).toBeNull();
    });

    it('Should not have EDIT icon in Title', () => {
      mockIsDeployed = true;
      const { queryByDataCy } = setUp();

      const modalFooter = queryByDataCy('Icon-Edit');

      expect(modalFooter).toBeNull();
    });
  });
});
