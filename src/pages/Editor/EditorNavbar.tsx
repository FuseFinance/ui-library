import { useCallback, useEffect, useState, useMemo } from 'react';
import Navbar from '@/src/layouts/TopNavbar';
import EditableText from '@/src/components/EditableText';
import { useWorkflowEditor } from '@/src/contexts/WorkflowEditorProvider/hooks';
import { useVersions } from '@/src/contexts/VersionProvider/hooks';
import { useShowNotification } from '@/src/hooks/notifications/showNotifications';
import { versionRestored } from '@/src/components/Notification/variants';
import { useErrorHandler } from '@/src/hooks/errorHandlers';
import {
  useGetWorkflowHistory,
  useJumpToWorkflowHistory,
  useRenameWorkflow,
} from '@/src/services/workflows';
import { SelectModalOverlay } from '@/src/components/SelectVersions/styles';
import RestoreModal from '@/src/components/RestoreModal';
import { useParams, useNavigate } from 'react-router';
import { Roles, RoutesHref } from '@/src/utils/types/sharedEnums';
import { useActiveUser } from '@/src/contexts/UserProvider/hooks';
import { IconUndoRedo } from '@/src/layouts/TopNavbar/styles';
import colors from '@/src/styles/colors';
import Icon from '@/src/components/Icons';
import { Button } from 'antd';
import { IconList } from 'src/components/Icons/types';
import { useLayout } from '@/src/components/Editor/FlowCanvas/hooks/useLayout';
import { EditorIds } from '@/src/constants/appIDS';

const EditorNavbarActionArea = ({
  handleTest,
  setShowRestoreWorkflowModal,
}: {
  handleTest: () => void;
  role: Roles;
  setShowRestoreWorkflowModal: (_value) => void;
}) => {
  return (
    <div className="flex flex-row items-center h-12">
      <>
        <IconUndoRedo
          data-cy={EditorIds.restoreNavBarBtn}
          onClick={() => setShowRestoreWorkflowModal((prevState) => !prevState)}
        >
          <Icon
            cursor="pointer"
            icon={IconList.Clock}
            width="20px"
            height="20px"
            fill={colors.fuseGray2}
          />
        </IconUndoRedo>
        <Button className="mr-2" onClick={handleTest} data-cy={EditorIds.testButton}>
          Test
        </Button>
      </>
    </div>
  );
};

const EditorNavbar = () => {
  const navigate = useNavigate();
  const { selectedVersion } = useVersions();
  const { selectedWorkflow, isDeployed, refetchWorkflow } = useWorkflowEditor();
  const { workflowId, versionNumber } = useParams();

  const [showRestoreWorkflowModal, setShowRestoreWorkflowModal] = useState(false);
  const [isLoadingOpenHistory, setIsLoadingOpenHistory] = useState<boolean>(false);
  const [isLoadingRevertHistory, setIsLoadingRevertHistory] = useState<string>('');

  const {
    workflowHistory,
    isLoading: isLoadingWorkflowHistory,
    refetch: refetchHistory,
    error: historyError,
  } = useGetWorkflowHistory(versionNumber, workflowId, showRestoreWorkflowModal);

  const pageLoadError = useMemo(() => {
    return historyError;
  }, [historyError]);

  const { jumpToHystory } = useJumpToWorkflowHistory();
  const { handleErrorWithLockError, handleError } = useErrorHandler();
  const { renameWorkflow } = useRenameWorkflow();
  const { role } = useActiveUser();

  const updateLayout = useLayout();

  const { showNotificationWithNotifComponent } = useShowNotification();

  const isLoadingHistoryModal = useMemo(
    () => isLoadingOpenHistory || isLoadingWorkflowHistory,
    [isLoadingOpenHistory, isLoadingWorkflowHistory],
  );

  const handleRestoreWorkflow = useCallback(
    async (historyId: string, historyDescription: string) => {
      try {
        setIsLoadingRevertHistory(historyId);
        await jumpToHystory(historyId);
        await refetchHistory();
        const updatedWorkflowResult: any = await refetchWorkflow();

        if (updatedWorkflowResult && updatedWorkflowResult.rfData) {
          const [workflowNodes, workflowEdges] = JSON.parse(updatedWorkflowResult.rfData);
          updateLayout(workflowNodes, workflowEdges);
        }

        showNotificationWithNotifComponent({ ...versionRestored(historyDescription) });
      } catch (error) {
        handleErrorWithLockError(error);
      } finally {
        setIsLoadingRevertHistory('');
        setShowRestoreWorkflowModal(false);
      }
    },
    [
      handleErrorWithLockError,
      refetchHistory,
      refetchWorkflow,
      showNotificationWithNotifComponent,
      jumpToHystory,
    ],
  );

  const handleWorkflowRename = useCallback(
    async (newName: string) => {
      try {
        await renameWorkflow(selectedWorkflow?.id, selectedVersion?.id, newName);
        await refetchHistory();
      } catch (error) {
        handleErrorWithLockError(error);
      }
    },
    [selectedVersion, selectedWorkflow, handleErrorWithLockError, refetchHistory, renameWorkflow],
  );

  const handleOpenHistoryModal = useCallback(async () => {
    try {
      setIsLoadingOpenHistory(true);
      setShowRestoreWorkflowModal(true);
      await refetchHistory();
    } catch (error) {
      handleError(error, 'Error reloading workflow history', 'editor-error');
    } finally {
      setIsLoadingOpenHistory(false);
    }
  }, []);

  const handleTest = useCallback(async () => {
    navigate(`${RoutesHref.TEST}/${selectedVersion.versionNumber}/${selectedWorkflow?.id}`);
  }, [selectedVersion, selectedWorkflow, navigate]);

  const handleRestoreModalClose = useCallback(() => {
    setShowRestoreWorkflowModal(false);
  }, []);

  useEffect(() => {
    if (pageLoadError) {
      handleError(pageLoadError, 'Error while loading page', 'editor-error');
    }
  }, [pageLoadError, handleError]);
  return (
    <>
      <Navbar
        showNavIcon
        displayWorkflowName={
          <div className="mx-4">
            <EditableText
              label={selectedWorkflow?.name}
              onLabelChange={handleWorkflowRename}
              canEdit={!selectedVersion?.deployedAt}
            />
          </div>
        }
        actionArea={
          !isDeployed && (
            <EditorNavbarActionArea
              handleTest={handleTest}
              role={role}
              setShowRestoreWorkflowModal={handleOpenHistoryModal}
            />
          )
        }
      />

      {showRestoreWorkflowModal ? (
        <>
          <SelectModalOverlay onClick={handleRestoreModalClose} />
          <RestoreModal
            handleRestoreWorkflow={handleRestoreWorkflow}
            workflowHistory={workflowHistory}
            isLoadingHistory={isLoadingHistoryModal}
            isLoadingRevertHistory={isLoadingRevertHistory}
            handleClose={handleRestoreModalClose}
          />
        </>
      ) : null}
    </>
  );
};

export default EditorNavbar;
