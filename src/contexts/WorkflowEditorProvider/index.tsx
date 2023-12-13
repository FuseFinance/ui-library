/* eslint-disable no-unused-vars */
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useParams } from 'react-router';
import { Edge, useEdgesState, useNodesState } from 'reactflow';
import Loader from '@/src/components/Loader';
import { WorkflowContext } from './context';
import { INode, WithChildren } from '@/src/utils/types/sharedTypes';
import { ModalType } from '@/src/components/Modal/types';
import { useErrorHandler } from '@/src/hooks/errorHandlers';
import { useGetWorkflow } from '@/src/services/workflows';
import { useVersions } from '@/src/contexts/VersionProvider/hooks';
import { useActiveUser } from '../UserProvider/hooks';
import { useIndividualTesting } from '@/src/components/Editor/IndividualTestingContent/hooks';

export const WorkflowEditorProvider = ({ children }: WithChildren) => {
  const { environmentName, workflowId, versionNumber } = useParams();
  const [nodes, _setNodes, onNodesChange] = useNodesState([]);
  const [edges, _setEdges, onEdgesChange] = useEdgesState([]);
  const { handleError } = useErrorHandler();
  const { currentClient } = useActiveUser();
  const {
    workflow: selectedWorkflow,
    isLoading: isLoadingWorkflow,
    refetch: refetchWorkflow,
    error: workflowError,
  } = useGetWorkflow(versionNumber, workflowId, environmentName);

  const pageLoadError = useMemo(() => {
    return workflowError;
  }, [workflowError]);

  useEffect(() => {
    if (pageLoadError) {
      handleError(pageLoadError, 'Error while loading page', 'editor-error');
    }
  }, [pageLoadError, handleError]);

  useEffect(() => {
    if (
      selectedWorkflow?.envVarsNotFoundInWorkflow?.length &&
      selectedWorkflow?.envVarsNotFoundInWorkflow?.length > 0
    ) {
      const errorMessage = `Some environment variables were not found in the workflow`;
      handleError(new Error(errorMessage), errorMessage, 'editor-error');
    }
  }, [selectedWorkflow?.envVarsNotFoundInWorkflow?.length, handleError]);

  const { selectedVersion } = useVersions();
  const [selectedEdge, setSelectedEdge] = useState<Edge>();
  const [selectedNode, setSelectedNode] = useState<INode | null>(null);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [selectedModalType, setSelectedModalType] = useState<ModalType>();
  const [isActionLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const {
    testExecution,
    selectedTest,
    testName,
    testBody,
    testSuccessCriteria,
    isTesting,
    testsLoading,
    tests,
    onDeleteTest,
    onDuplicateTest,
    refetchTestLastExecution,
    refetchTests,
    setIsTesting,
    setSelectedTest,
    setTestName,
    setTestBody,
    setTestSuccessCriteria,
    handleSaveTest,
    handleRunTest,
    onTestRename,
    onNewTest,
  } = useIndividualTesting(versionNumber, selectedNode, selectedWorkflow);

  const [isTraceMode, setIsTraceMode] = useState(false);
  const [traceSteps, setTraceSteps] = useState([]);

  const onPanelClick = useCallback(() => {
    if (selectedNode?.data?.isMoving) {
      setSelectedNode({
        ...selectedNode,
        data: {
          ...selectedNode.data,
          isMoving: false,
          onMoveNode: null,
        },
      });
    }
  }, [setSelectedNode, selectedNode]);

  const handleEdgeClick = useCallback((edge: Edge) => {
    setSelectedNode(null);
    setSelectedEdge(edge);
    setSelectedModalType(ModalType.NEW_BLOCK);
    setIsEditorModalOpen(true);
  }, []);

  const onModalClose = () => {
    setIsEditorModalOpen(false);
    setIsTesting(false);
    setSelectedTest(null);
    setSelectedNode(null);
    setTestBody(null);
    setTestName(null);
    setTestSuccessCriteria(null);
  };

  useEffect(() => {
    if (isTraceMode) {
      setIsEditing(false);
    } else {
      setIsEditing(
        !selectedVersion?.deployedAt && selectedWorkflow?.workflow?.client === currentClient,
      );
    }
  }, [selectedVersion, selectedWorkflow, currentClient, isTraceMode]);

  if (isLoadingWorkflow || !selectedWorkflow) {
    return <Loader />;
  }

  return (
    <WorkflowContext.Provider
      value={{
        isEditing: isEditing,
        nodes,
        edges,
        tests,
        testsLoading,
        testExecution,
        selectedEdge,
        selectedNode,
        selectedWorkflow,
        isEditorModalOpen,
        isActionLoading,
        selectedModalType,
        isDeployed: !!selectedVersion?.deployedAt,
        selectedTest,
        testName,
        testBody,
        testSuccessCriteria,
        isTesting,
        onDeleteTest,
        onDuplicateTest,
        refetchTestLastExecution,
        refetchTests,
        onNodesChange,
        onEdgesChange,
        setSelectedTest,
        setTestName,
        setTestBody,
        setTestSuccessCriteria,
        setIsTesting,
        setIsEditorModalOpen,
        setSelectedModalType,
        onPanelClick,
        onEdgeClick: handleEdgeClick,
        setSelectedNode,
        refetchWorkflow,
        setSelectedEdge,
        handleSaveTest,
        handleRunTest,
        onTestRename,
        onNewTest,
        onModalClose,
        setIsEditing,
        isTraceMode,
        setIsTraceMode,
        traceSteps,
        setTraceSteps,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};
