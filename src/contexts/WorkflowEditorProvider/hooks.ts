import { useContext } from 'react';
import { WorkflowContext } from './context';
import { useActiveUser } from '../UserProvider/hooks';

export const useWorkflowEditor = () => {
  const {
    isEditing,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    selectedEdge,
    selectedNode,
    isActionLoading,
    selectedWorkflow,
    isDeployed,
    refetchWorkflow,
    setSelectedNode,
    onPanelClick,
    onEdgeClick,
    setIsEditing,
  } = useContext(WorkflowContext);

  const { currentClient } = useActiveUser();
  const isSelectedWFImported = currentClient !== selectedWorkflow?.workflow?.client;
  return {
    isEditing,
    selectedEdge,
    selectedNode,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    selectedWorkflow,
    isActionLoading,
    isSelectedWFImported,
    isDeployed,
    refetchWorkflow,
    setSelectedNode,
    onPanelClick,
    onEdgeClick,
    setIsEditing,
  };
};

export const useEditorModal = () => {
  const {
    isEditorModalOpen,
    selectedModalType,
    isActionLoading,
    setSelectedEdge,
    setIsEditorModalOpen,
    setSelectedModalType,
    onModalClose,
  } = useContext(WorkflowContext);

  return {
    isEditorModalOpen,
    setIsEditorModalOpen,
    setSelectedModalType,
    selectedModalType,
    isActionLoading,
    setSelectedEdge,
    onModalClose,
  };
};

export const useTestModal = () => {
  const {
    selectedTest,
    testName,
    testBody,
    testsLoading,
    testSuccessCriteria,
    isTesting,
    tests,
    testExecution,
    onDeleteTest,
    onDuplicateTest,
    setSelectedTest,
    setTestName,
    setTestBody,
    setTestSuccessCriteria,
    setIsTesting,
    handleSaveTest,
    handleRunTest,
    refetchTestLastExecution,
    refetchTests,
    onTestRename,
    onNewTest,
  } = useContext(WorkflowContext);

  return {
    selectedTest,
    testName,
    testBody,
    testsLoading,
    testSuccessCriteria,
    isTesting,
    tests,
    testExecution,
    onDeleteTest,
    onDuplicateTest,
    setSelectedTest,
    setTestName,
    setTestBody,
    setTestSuccessCriteria,
    setIsTesting,
    handleSaveTest,
    handleRunTest,
    refetchTestLastExecution,
    refetchTests,
    onTestRename,
    onNewTest,
  };
};

export const useTraceModal = () => {
  const { isTraceMode, setIsTraceMode, traceSteps, setTraceSteps } = useContext(WorkflowContext);

  return {
    isTraceMode,
    setIsTraceMode,
    traceSteps,
    setTraceSteps,
  };
};
