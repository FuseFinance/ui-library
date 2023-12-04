import FlowCanvas from '@components/Editor/FlowCanvas';
import { EditorIds } from '@/src/constants/appIDS';
import { fireEvent, render, waitFor } from '@utils/test/testUtils';
import { ReactFlow } from 'reactflow';
import { mockReactFlow, mockSimpleWorkFlow } from '../../../utils/ReactFlow';
import { IconList } from '@/src/components/Icons/types';
import { screen } from '@testing-library/react';

let mockWorkFlow = mockSimpleWorkFlow();
let mockNodes = mockWorkFlow[0];
let mockEdges = mockWorkFlow[1];
let mockIsEditing = true;

let mockDeleteCustomNode = jest.fn();
let mockMoveCustomNode = jest.fn();
let mockOnEdgeClick = jest.fn();
let mockSelectedNode = {
  id: 'nodeId',
  data: { isMoving: false, onMoveNode: mockMoveCustomNode },
};

jest.unmock('reactflow');

const setUp = () => {
  mockReactFlow();
  return render(
    <ReactFlow>
      <FlowCanvas
        initialEdges={[]}
        initialNodes={[]}
        width="800px"
        height="800px"
        reactFlowProps={{ nodesDraggable: false }}
      />
    </ReactFlow>,
    {},
  );
};

jest.mock('@contexts/WorkflowEditorProvider/hooks', () => ({
  useWorkflowEditor: () => ({
    selectedWorkflow: {
      id: 10,
    },
    nodes: mockNodes,
    edges: mockEdges,
    isSelectedWFImported: false,
    onNodesChange: jest.fn(),
    onPanelClick: jest.fn(),
    onEdgesChange: jest.fn(),
    setSelectedNode: jest.fn(),
    onEdgeClick: mockOnEdgeClick,
    isEditing: mockIsEditing,
    selectedNode: mockSelectedNode,
  }),
  useEditorModal: () => ({
    isEditorModalOpen: false,
    selectedModalType: null,
    onModalClose: jest.fn(),
    setIsEditorModalOpen: jest.fn(),
  }),
  useTraceModal: () => ({
    isTraceMode: false,
    setIsTraceMode: jest.fn(),
    traceSteps: [],
    setTraceSteps: jest.fn(),
  }),
}));

jest.mock('@constants/env', () => ({
  FRONT_CLIENT: 'test-client',
  BE_URL: '',
}));

jest.mock('@contexts/VersionProvider', () => ({
  useVersions: () => {},
}));

jest.mock('@contexts/UserProvider', () => ({
  useActiveUser: () => {},
}));

jest.mock('@components/Editor/FlowCanvas/hooks/useLayout', () => ({
  useLayout: () => jest.fn(),
}));

jest.mock('@services/workflows', () => ({
  useSaveWorkflow: () => ({
    updateWorkflow: jest.fn(),
  }),
}));

jest.mock('@components/Editor/EditorSteps/Common/hooks', () => ({
  useDeleteCustomNode: () => mockDeleteCustomNode,
  useMoveCustomNode: () => mockMoveCustomNode,
}));

describe('Test FlowCanvas component', () => {
  beforeEach(() => {
    const mockWorkFlow = mockSimpleWorkFlow();
    mockNodes = mockWorkFlow[0];
    mockEdges = mockWorkFlow[1];
    mockIsEditing = true;
    mockSelectedNode.data.isMoving = false;
    mockDeleteCustomNode = jest.fn();
    mockOnEdgeClick = jest.fn();
  });

  it('Should render', () => {
    const { getByDataCy } = setUp();
    const flowCanvas = getByDataCy(EditorIds.flowcanvas);
    expect(flowCanvas).toBeInTheDocument();
  });

  // CUSTOM EDGES TESTS
  it('Should not render edges buttons if isEditing = false', async () => {
    mockIsEditing = false;
    const { getByDataCy } = setUp();
    const flowCanvas = getByDataCy(EditorIds.flowcanvas);
    const edgesContainer = flowCanvas.getElementsByClassName('react-flow__edgelabel-renderer');
    const edgesButtons = edgesContainer[0].getElementsByTagName('button');
    expect(edgesButtons.length).toBe(0);
  });

  it('Should render edges buttons if isEditing = true', async () => {
    const { getByDataCy } = setUp();
    const flowCanvas = getByDataCy(EditorIds.flowcanvas);
    const edgesContainer = flowCanvas.getElementsByClassName('react-flow__edgelabel-renderer');
    const edgesButtons = edgesContainer[0].getElementsByTagName('button');
    expect(edgesButtons.length).toBeGreaterThan(1);
  });

  it('Should open block modal on edge add button click', async () => {
    const { getAllByDataCy } = setUp();
    const addButtons = getAllByDataCy(EditorIds.addButton);
    fireEvent.click(addButtons[0]);
    await waitFor(() => {
      expect(mockOnEdgeClick).toHaveBeenCalled();
    });
  });

  // CUSTOM NODES TESTS
  it('Should not render options button if isEditing = false', async () => {
    mockIsEditing = false;
    const { getByDataCy } = setUp();
    const flowCanvas = getByDataCy(EditorIds.flowcanvas);
    const dropDownTrigger = flowCanvas.getElementsByClassName('ant-dropdown-trigger');
    expect(dropDownTrigger.length).toBe(0);
  });

  it('Should render dropdown on trigger click', async () => {
    const { getByDataCy } = setUp();
    const nodeOptionsButton = getByDataCy(EditorIds.nodeOptionsButton);
    fireEvent.click(nodeOptionsButton);
    await waitFor(() => {
      const dropdown = screen.getByRole('menu');
      expect(dropdown).toBeInTheDocument();
    });
  });

  it('CustomNode dropdown should contain move and delete options', async () => {
    const { getByDataCy } = setUp();
    const nodeOptionsButton = getByDataCy(EditorIds.nodeOptionsButton);
    fireEvent.click(nodeOptionsButton);
    await waitFor(() => {
      const moveOption = getByDataCy(`Icon-${IconList.Drag}`);
      const deleteOption = getByDataCy(`Icon-${IconList.Trash}`);
      expect(moveOption && deleteOption).toBeInTheDocument();
    });
  });

  it('Should render place here buttons when more than 3 nodes and move click', async () => {
    const mockWorkFlow = mockSimpleWorkFlow(2);
    mockNodes = mockWorkFlow[0];
    mockEdges = mockWorkFlow[1];
    mockSelectedNode.data.isMoving = true;

    const { getAllByDataCy, getByDataCy } = setUp();
    const nodeOptionsButton = getAllByDataCy(EditorIds.nodeOptionsButton);
    fireEvent.click(nodeOptionsButton[0]);
    await waitFor(() => {
      const moveOption = getByDataCy(`Icon-${IconList.Drag}`);
      fireEvent.click(moveOption);
    });
    const placeHereButtons = getAllByDataCy(EditorIds.placeHereButton);
    expect(placeHereButtons.length).toBeGreaterThan(0);
  });

  it('Should call moveCustomNode fuction on place here button click', async () => {
    const mockWorkFlow = mockSimpleWorkFlow(2);
    mockNodes = mockWorkFlow[0];
    mockEdges = mockWorkFlow[1];
    mockSelectedNode.data.isMoving = true;

    const { getAllByDataCy, getByDataCy } = setUp();
    const nodeOptionsButton = getAllByDataCy(EditorIds.nodeOptionsButton);
    fireEvent.click(nodeOptionsButton[0]);
    await waitFor(() => {
      const moveOption = getByDataCy(`Icon-${IconList.Drag}`);
      fireEvent.click(moveOption);
    });
    const placeHereButtons = getAllByDataCy(EditorIds.placeHereButton);
    fireEvent.click(placeHereButtons[0]);
    await waitFor(() => {
      expect(mockMoveCustomNode).toHaveBeenCalledTimes(1);
    });
  });

  it('Should call deleteCustomNode fuction on delete confirm', async () => {
    mockDeleteCustomNode = jest.fn().mockReturnValue([[], []]);

    const { getByDataCy } = setUp();
    const nodeOptionsButton = getByDataCy(EditorIds.nodeOptionsButton);
    fireEvent.click(nodeOptionsButton);
    await waitFor(() => {
      const deleteOption = getByDataCy(`Icon-${IconList.Trash}`);
      fireEvent.click(deleteOption);
    });
    const yesButton = screen.getByText('Yes');
    fireEvent.click(yesButton);
    await waitFor(() => {
      expect(mockDeleteCustomNode).toHaveBeenCalledTimes(1);
    });
  });
});
