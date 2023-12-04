import { fireEvent } from '@testing-library/react';
import { render, screen } from '@utils/test/testUtils';
import { ConfigVarsModalIds } from '@constants/appIDS';
import { EditorModal } from '@components/Editor/EditorModal';
import { ModalType as mockModalType } from '@components/Modal/types';

// SETUP Function
const setUp = () => {
  return render(<EditorModal />, {});
};

// Mock Variables
let mockIsFuseUserInFuseClient = false;
let mockIsDeployed = true;
let mockIsEditorModalOpen = true;
let mockHandleSave = jest.fn();

// Mock dependcies
jest.mock('@contexts/WorkflowEditorProvider/hooks', () => ({
  useEditorModal: () => ({
    isEditorModalOpen: mockIsEditorModalOpen,
    selectedModalType: mockModalType.CONFIG_VARIABLES,
    onModalClose: jest.fn(),
    setIsEditorModalOpen: jest.fn(),
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

jest.mock('@contexts/UserProvider/hooks', () => ({
  useActiveUser: jest.fn(() => ({
    isFuseUserInFuseClient: mockIsFuseUserInFuseClient,
    accessToken: 'test-access-token-9999-aabbcc',
  })),
}));

jest.mock('@components/Editor/ConfigVars/hooks', () => ({
  useConfigureVars: jest.fn(() => ({
    ...jest.requireActual('@components/Editor/ConfigVars/hooks').useConfigureVars(),
    handleSave: mockHandleSave,
  })),
}));

describe('Test Config Variables Modal', () => {
  beforeEach(() => {
    mockIsFuseUserInFuseClient = false;
    mockIsDeployed = false;
    mockIsEditorModalOpen = true;
    mockHandleSave = jest.fn();
  });

  it('Should render modal when ModalType === CONFIG_VARIABLES', () => {
    const { getByDataCy } = setUp();

    const modalBody = getByDataCy(ConfigVarsModalIds.body);
    const modalheader = getByDataCy(ConfigVarsModalIds.header);
    const modalFooter = getByDataCy(ConfigVarsModalIds.footer);

    expect(modalBody).toBeInTheDocument();
    expect(modalheader).toBeInTheDocument();
    expect(modalFooter).toBeInTheDocument();
  });

  it('Should render DELETE Button when isFuseUserInFuseClient and Can Edit', () => {
    mockIsFuseUserInFuseClient = true;
    const { getAllByDataCy } = setUp();
    const deleteButtons = getAllByDataCy(ConfigVarsModalIds.deleteBtn);
    expect(deleteButtons.length).toBeGreaterThan(1);
  });

  it('Should render 3 initial inputs to show/edit variables', () => {
    const { getAllByDataCy } = setUp();
    const inputs = getAllByDataCy(ConfigVarsModalIds.input);

    expect(inputs.length).toBe(3);
  });

  it('Should have 3 types of Vars to ADD -> DB Connection - Code - String)', () => {
    mockIsFuseUserInFuseClient = true;
    const { getByDataCy, getAllByRole } = setUp();
    const addBtn = getByDataCy(ConfigVarsModalIds.addBtn);

    expect(addBtn).toBeInTheDocument();

    fireEvent.click(addBtn);

    const configVars = getAllByRole('menuitem');
    expect(configVars.length).toBe(3);

    const String = configVars.find((vars) => vars.textContent === 'String');
    const Code = configVars.find((vars) => vars.textContent === 'Code');
    const DBConnection = configVars.find((vars) => vars.textContent === 'DB Connection');

    expect(String).toBeInTheDocument();
    expect(Code).toBeInTheDocument();
    expect(DBConnection).toBeInTheDocument();
  });
  it('Should ADD a new input (Should be 4) after Click on "Add String Config Var" Option)', () => {
    mockIsFuseUserInFuseClient = true;
    const { getByDataCy, getAllByRole, getAllByDataCy } = setUp();
    const addBtn = getByDataCy(ConfigVarsModalIds.addBtn);

    fireEvent.click(addBtn);

    const configVars = getAllByRole('menuitem');

    const String = configVars.find((vars) => vars.textContent === 'String');

    fireEvent.click(String);

    const inputs = getAllByDataCy(ConfigVarsModalIds.input);
    expect(inputs.length).toBe(4);
  });

  it('Shouldnt have actions (buttons) if WF is deployed', () => {
    mockIsDeployed = true;
    const { queryByDataCy } = setUp();

    const modalFooter = queryByDataCy(ConfigVarsModalIds.footer);

    expect(modalFooter).toBeNull();
  });

  it('If not is a Fuse User in Fuse Client the Save Button Should be Render but the Add Button no', () => {
    const { queryByDataCy } = setUp();

    const addBtn = queryByDataCy(ConfigVarsModalIds.addBtn);
    const saveBtn = queryByDataCy(ConfigVarsModalIds.saveBtn);

    expect(saveBtn).toBeInTheDocument();
    expect(addBtn).toBeNull();
  });

  it('Should Render both buttons Add and Save: If is a Fuse User in Fuse Client', () => {
    mockIsFuseUserInFuseClient = true;
    const { queryByDataCy } = setUp();

    const addBtn = queryByDataCy(ConfigVarsModalIds.addBtn);
    const saveBtn = queryByDataCy(ConfigVarsModalIds.saveBtn);

    expect(saveBtn).toBeInTheDocument();
    expect(addBtn).toBeInTheDocument();
  });

  it('Should show Pop Up confirmation before Delete', () => {
    mockIsFuseUserInFuseClient = true;

    const { getAllByDataCy } = setUp();
    const deleteButtons = getAllByDataCy(ConfigVarsModalIds.deleteBtn);

    // first checking if not exist
    const popConfirmBefore = screen.queryByRole('tooltip');
    expect(popConfirmBefore).toBeNull();

    // Delete Button
    const deleteIcon = deleteButtons[0];
    expect(deleteIcon).toBeInTheDocument();
    fireEvent.click(deleteIcon);

    // Pop Up container
    const popConfirmAfter = screen.queryByRole('tooltip');
    expect(popConfirmAfter).toBeInTheDocument();
  });

  it('Should have 2 inputs after Click on Delete Button (Yes)', () => {
    mockIsFuseUserInFuseClient = true;

    const { getAllByDataCy } = setUp();
    const deleteButtons = getAllByDataCy(ConfigVarsModalIds.deleteBtn);

    // Delete Button
    const deleteIcon = deleteButtons[0];
    expect(deleteIcon).toBeInTheDocument();
    fireEvent.click(deleteIcon);

    // Yes button in Pop Up
    const buttonConfirmDelete = screen.getByText('Yes');
    expect(buttonConfirmDelete).toBeInTheDocument();

    // Check number of inputs BEFORE Delete
    const inputsBefore = getAllByDataCy(ConfigVarsModalIds.input);
    expect(inputsBefore.length).toBe(3);

    fireEvent.click(buttonConfirmDelete);

    // Check number of inputs AFTER Delete
    const inputsAfter = getAllByDataCy(ConfigVarsModalIds.input);
    expect(inputsAfter.length).toBe(2);
  });

  it('Should Save and Close modal', () => {
    const { queryByDataCy } = setUp();

    const saveBtn = queryByDataCy(ConfigVarsModalIds.saveBtn);
    expect(saveBtn).toBeInTheDocument();

    fireEvent.click(saveBtn);
    expect(mockHandleSave).toHaveBeenCalledTimes(1);
  });
});
