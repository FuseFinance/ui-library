import { fireEvent, render } from '@utils/test/testUtils';
import GroupNode from '@components/Editor/EditorSteps/Group/Node';
import { CustomNodeIds, NodeGroupBlockIds } from '@constants/appIDS';

const title = 'Mock Title Group Block';
let mockIsExpanded = false;

let mockIsDeployed = false;
let mockIsEditing = true;
let mockToggleCollapse = jest.fn();
let mockUpdateLayout = jest.fn();

const setup = () => {
  return render(
    <GroupNode
      data={{
        title,
        isExpanded: mockIsExpanded,
      }}
      id="1"
    />,
    {},
  );
};

const hookPath = '@components/Editor/EditorSteps/Group/hooks/useGroupActions';

jest.mock(hookPath, () => ({
  useGroupNodeActions: jest.fn(() => ({
    ...jest.requireActual(hookPath).useGroupNodeActions('1', { title, isExpanded: false }),
    isEditing: mockIsEditing,
    isExpanded: mockIsExpanded,
    toggleCollapse: mockToggleCollapse,
  })),
}));

jest.mock('@/src/components/Editor/FlowCanvas/hooks/useLayout', () => ({
  useLayout: jest.fn(() => mockUpdateLayout),
}));

jest.mock('@contexts/WorkflowEditorProvider/hooks', () => ({
  ...jest.requireActual('@contexts/WorkflowEditorProvider/hooks'),
  useWorkflowEditor: jest.fn(() => ({
    ...jest.requireActual('@contexts/WorkflowEditorProvider/hooks').useWorkflowEditor(),
    isDeployed: mockIsDeployed,
    selectedWorkflow: {
      id: 1,
    },
    nodes: [],
    edges: [],
  })),
}));

jest.mock('reactflow', () => {
  const Handle = ({ type, position }) => {
    return `<MockedHandle type="${type}" position="${position}" />`;
  };

  return {
    useReactFlow: () => ({
      setEdges: jest.fn(),
      setNodes: jest.fn(),
    }),
    Position: {
      Top: 'top',
      Bottom: 'bottom',
    },
    Handle: Handle,
  };
});

describe('Node Block', () => {
  beforeEach(() => {
    mockIsDeployed = false;
    mockIsExpanded = false;
    mockIsEditing = true;
    mockToggleCollapse = jest.fn();
    mockUpdateLayout = jest.fn();
  });

  it('Should render Group Block Container', () => {
    const { queryByDataCy } = setup();

    const container = queryByDataCy(NodeGroupBlockIds.container);
    expect(container).toBeInTheDocument();
  });

  it('Should have delete btn (Tooltip)', () => {
    const { queryByDataCy, getByText } = setup();

    // Actions
    const actionsBtn = queryByDataCy(CustomNodeIds.actions);
    fireEvent.click(actionsBtn);

    // Delete Node Option
    const deleteOption = getByText('Delete');
    expect(deleteOption).toBeInTheDocument();

    fireEvent.click(deleteOption);

    const buttonConfirmDelete = getByText('Yes');
    expect(buttonConfirmDelete).toBeInTheDocument();
  });

  it('Should not have actions if not is Editing', () => {
    mockIsEditing = false;
    const { queryByDataCy } = setup();

    // Actions
    const actionsBtn = queryByDataCy(CustomNodeIds.actions);
    expect(actionsBtn).toBeNull();
  });

  it('Should have actions if is Editing', () => {
    const { queryByDataCy } = setup();

    // Actions
    const actionsBtn = queryByDataCy(CustomNodeIds.actions);
    expect(actionsBtn).toBeInTheDocument();
  });

  it('Should renders the Title', () => {
    const { queryByDataCy } = setup();

    const title = queryByDataCy(CustomNodeIds.title);
    expect(title).toBeInTheDocument();
  });

  describe('When Node isn`t Expanded', () => {
    it('Should show content if not exapanded', () => {
      const { queryByDataCy } = setup();

      // Should be Start in false
      const expandedContent = queryByDataCy(NodeGroupBlockIds.nodeExpanded);
      expect(expandedContent).toBeNull();

      // Should render the default content
      const notExpandedContent = queryByDataCy(NodeGroupBlockIds.defaultNode);
      expect(notExpandedContent).toBeInTheDocument();
    });
    it('Should render Actions (Just 2 actions) when click on Menu (Delete - Expand)', () => {
      const { queryByDataCy, getByText, getAllByRole } = setup();

      // Actions
      const actionsBtn = queryByDataCy(CustomNodeIds.actions);
      expect(actionsBtn).toBeInTheDocument();

      fireEvent.click(actionsBtn);

      const options = getAllByRole('menuitem');
      expect(options.length).toBe(2);

      // Delete Node Option
      const deleteOption = getByText('Delete');
      expect(deleteOption).toBeInTheDocument();

      // Expand Node Option
      const ExpandOption = getByText('Expand');
      expect(ExpandOption).toBeInTheDocument();
    });

    describe('Check if the acctions was called', () => {
      it('Should excecute toggleCollapse when click on Node Body', () => {
        const { queryByDataCy } = setup();
        const defaultNode = queryByDataCy(CustomNodeIds.nodeBody);
        expect(defaultNode).toBeInTheDocument();

        fireEvent.click(defaultNode);

        expect(mockToggleCollapse).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('When Node is Expanded', () => {
    beforeEach(() => {
      mockIsExpanded = true;
    });

    it('Should render the Node Content when is Expanded', () => {
      const { queryByDataCy } = setup();

      const notExpandedContent = queryByDataCy(NodeGroupBlockIds.defaultNode);
      expect(notExpandedContent).toBeNull();

      const expandedContent = queryByDataCy(NodeGroupBlockIds.nodeExpanded);
      expect(expandedContent).toBeInTheDocument();
    });
  });
});
