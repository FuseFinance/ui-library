import { INode } from '@/src/utils/types/sharedTypes';
import { Edge, ReactFlowProps } from 'reactflow';

export type FlowCanvasProps = {
  workflowName?: string;
  environmentName?: string;
  initialNodes?: INode[];
  initialEdges?: Edge[];
  rfDataToOverwrite?: [INode[], Edge[]];
  workflowId?: string;
  isEditing?: boolean;
  isTraceMode?: boolean;
  width?: string;
  height?: string;
  reactFlowProps?: Omit<
    ReactFlowProps,
    'nodes' | 'onNodesChange' | 'edges' | 'onEdgesChange' | 'nodeTypes' | 'edgeTypes' | 'proOptions'
  >;
};
