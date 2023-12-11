import { INode, Step } from '@/src/utils/types/sharedTypes';

import { Edge, OnEdgesChange, OnNodesChange } from 'reactflow';
import { ModalType } from '@/src/components/Modal/types';
import { IWorkflowEnvResponse } from '@/src/types/services/workflows';
import { Test } from '@/src/types/services/tests';

export interface IWorkflowContext {
  isEditing: boolean;
  setIsEditing: (_value: boolean) => void;
  // TOOD: Add type
  testExecution: any;
  tests: Test[];
  testsLoading: boolean;
  selectedWorkflow: IWorkflowEnvResponse & { rfData: [INode[], Edge[]] };
  // TODO check if still needed
  // selectedWorkflow: {
  //   id: string;
  //   name: string;
  //   rfData: [INode[], Edge[]];
  //   workflow: {
  //     id: string;
  //     name: string;
  //     steps: WorkflowStep[];
  //     client: string;
  //     rfData: null;
  //     secrets: null;
  //     variables: null;
  //     versionId: string;
  //     callbackURL: string;
  //     engineVersion: number;
  //     versionNumber: string;
  //     environmentName: string;
  //     isWorkflowAsync: boolean;
  //     configurationVariables: ConfigVar[];
  //   };
  // };
  nodes: INode[];
  edges: Edge[];
  selectedNode: INode;
  isEditorModalOpen: boolean;
  selectedModalType: ModalType;
  isActionLoading: boolean;
  selectedEdge: Edge;
  isDeployed: boolean;
  selectedTest?: Test;
  testName: string;
  testBody: string;
  testSuccessCriteria: string;
  isTesting: boolean;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  setSelectedTest: (_value: Test) => void;
  setTestName: (_value: string) => void;
  setTestBody: (_value: string) => void;
  setTestSuccessCriteria: (_value: string) => void;
  setIsTesting: (_value: boolean) => void;
  setSelectedNode: (_node: INode) => void;
  onPanelClick: () => void;
  onEdgeClick: (_edge: Edge) => void;
  setIsEditorModalOpen: (_value: boolean) => void;
  setSelectedModalType: (_value: ModalType) => void;
  setSelectedEdge: (_value: any) => void;
  refetchWorkflow: () => void;
  handleSaveTest: (_stepId?: string, _showAlert?: boolean) => void;
  handleRunTest: (_newTest?: Test) => void;
  onDuplicateTest: () => void;
  onDeleteTest: () => void;
  refetchTests: () => void;
  refetchTestLastExecution: () => void;
  onTestRename: () => void;
  onNewTest: (_stepId?: string, _showAlert?: boolean) => void;
  onModalClose: () => void;
  isTraceMode: boolean;
  setIsTraceMode: (_value: boolean) => void;
  traceSteps: Array<Step>;
  setTraceSteps: (_value: Array<Step>) => void;
}
