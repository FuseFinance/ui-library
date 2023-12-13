import ReactFlow, { Background, ConnectionLineType, Controls } from 'reactflow';
import { useEffect } from 'react';
import { FlowCanvasProps } from './types';
import { nodeTypes } from '@/src/components/Editor/EditorSteps/Common/types';
import edgeTypes from '@/src/components/Editor/EditorSteps/Common/types/edges';
import { ReactFlowContainer } from './styles';
import { useWorkflowEditor } from '@/src/contexts/WorkflowEditorProvider/hooks';
import { useLayout } from './hooks/useLayout';
import { ConfigureVarsButton } from '../ConfigVars/Button/ConfigureVarsButton';
import { useActiveUser } from '@/src/contexts/UserProvider/hooks';
import { EditorIds } from '@/src/constants/appIDS';
import { MarkerDefinition } from './MarkerDefinition';
import colors from '@/src/styles/colors';

const FlowCanvas = ({
  width = '100vw',
  height = '100vh',
  initialEdges,
  initialNodes,
  reactFlowProps,
  rfDataToOverwrite,
  isTraceMode,
}: FlowCanvasProps) => {
  const defaultViewport = { x: window.innerWidth / 3, y: window.innerHeight / 3.5, zoom: 0.75 };

  const {
    selectedWorkflow,
    nodes,
    edges,
    isSelectedWFImported,
    onNodesChange,
    onPanelClick,
    onEdgesChange,
    isDeployed,
  } = useWorkflowEditor();

  const layoutTree = useLayout();
  const { isFuseUserInFuseClient } = useActiveUser();

  useEffect(() => {
    if (rfDataToOverwrite) {
      const [workflowNodes, workflowEdges] = rfDataToOverwrite;
      layoutTree(workflowNodes, workflowEdges);
    } else if (selectedWorkflow?.rfData?.length > 0) {
      const [workflowNodes, workflowEdges] = selectedWorkflow.rfData;
      layoutTree(workflowNodes, workflowEdges);
    } else {
      layoutTree(initialNodes, initialEdges);
    }
  }, [layoutTree, initialEdges, initialNodes, rfDataToOverwrite, selectedWorkflow?.updatedAt]);

  return (
    <ReactFlowContainer width={width} height={height} data-cy={EditorIds.flowcanvas}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        deleteKeyCode={null}
        onPaneClick={onPanelClick}
        connectionLineType={ConnectionLineType.SmoothStep}
        nodeTypes={nodeTypes}
        minZoom={0.01}
        edgeTypes={edgeTypes}
        proOptions={{ hideAttribution: true }}
        defaultViewport={defaultViewport}
        {...reactFlowProps}
      >
        <MarkerDefinition id="trace" color={colors.fuseBlue} />
        <MarkerDefinition id="default" color={colors.fuseGray3} />
        {!isTraceMode && !isDeployed ? <Background /> : null}
        {!isTraceMode && <Controls showInteractive={false}></Controls>}
        {(isFuseUserInFuseClient || isSelectedWFImported) && <ConfigureVarsButton />}
      </ReactFlow>
    </ReactFlowContainer>
  );
};

export default FlowCanvas;
