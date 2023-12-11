import { useCallback, useEffect, useMemo, useState } from 'react';
import { Roles, RoutesHref, VersionEnvironments } from '@/src/utils/types/sharedEnums';
import { Button, Modal, Input, message, Dropdown, MenuProps } from 'antd';
import Table from '@/src/components/Table';
import TitleHeader from '@/src/components/TitleHeader';
import { useNavigate, useParams } from 'react-router-dom';
import { isPublishedVersion } from '@/src/utils/dataFormatters';
import { useVersions } from '@/src/contexts/VersionProvider/hooks';
import {
  useSaveWorkflow,
  useGetWorkflows,
  useDuplicateWorkflow,
  useRenameWorkflow,
  useDeleteWorkflow,
  useExportWorkflow,
} from '@/src/services/workflows';
import Navbar from '@/src/layouts/TopNavbar';
import { useErrorHandler } from '@/src/hooks/errorHandlers';
import { PublishVersionModal } from '@/src/components/Modals/PublishVersion';
import UilAngleDown from '@iconscout/react-unicons/icons/uil-angle-down';
import { ShareWorkflowModal } from '@/src/components/SharedWorkflows/ImportModal/ShareWorkflowModal';
import { useActiveUser } from '@/src/contexts/UserProvider/hooks';
import { EModalWFAction } from '@/src/components/SharedWorkflows/ImportModal/types';
import { useImportWorkflowStore } from '@/src/components/SharedWorkflows/ImportModal/hooks';
import { ImportWorkflowJsonModal } from '@/src/components/SharedWorkflows/ImportJsonModal/ImportJsonModal';
import { getPermissions } from '@/src/utils/permissionsHelper';
import { WorkflowsPageIds } from '@/src/constants/appIDS';
import { Version } from '@/src/types/services/versions';
import { Workflow } from '@/src/types/services/workflows';
import env from '@constants/env';

const WorkflowsNavActionArea = ({
  selectedVersion,
  handleGoToBranchToEdit,
  setPublishVersionModalOpen,
  canDeploy,
}: {
  selectedVersion: Version;
  isCreateWorkflowLoading: boolean;
  handleGoToBranchToEdit: () => void;
  handleCreateWorkflow: () => void;
  setPublishVersionModalOpen: (_value: boolean) => void;
  canDeploy: boolean;
}) => {
  return (
    <>
      {isPublishedVersion(selectedVersion) && (
        <Button type="primary" onClick={handleGoToBranchToEdit}>
          Create Edit Version
        </Button>
      )}
      {canDeploy && !isPublishedVersion(selectedVersion) && (
        <Button onClick={() => setPublishVersionModalOpen(true)}>Publish Version</Button>
      )}
    </>
  );
};

export default function WorkflowsPage() {
  const { versionNumber } = useParams();
  const navigate = useNavigate();
  const { selectedVersion, featureBranches } = useVersions();
  const [workflowsPage, setWorkflowsPage] = useState(1);

  const {
    workflows,
    totalWorkflows,
    error: workflowsError,
    isLoading: isLoadingWorkflows,
    refetch: refetchWorkflows,
  } = useGetWorkflows(selectedVersion.id, workflowsPage);

  const { createWorkflow } = useSaveWorkflow();
  const { role, permissions, isFuseUserAnyClient } = useActiveUser();
  const { canUserDeploy } = getPermissions(role, permissions);

  const [isCreateWorkflowLoading, setIsCreateWorkflowLoading] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSharedModalOpen, setIsSharedModalOpen] = useState(false);
  const [isJSONImporterModalOpen, setIsJSONImporterModalOpen] = useState(false);
  const { deleteWorkflow } = useDeleteWorkflow();
  const { duplicateWorkflow } = useDuplicateWorkflow();
  const { renameWorkflow } = useRenameWorkflow();
  const { exportWorkflow } = useExportWorkflow();
  const { handleErrorWithLockError, handleError } = useErrorHandler();

  const [publishVersionModalOpen, setPublishVersionModalOpen] = useState(false);
  const { refetchUnpublishedVersions, refetchPublishedVersions } = useVersions();

  const handlePuslishModalsave = useCallback(async () => {
    await refetchUnpublishedVersions();
    await refetchPublishedVersions();
    navigate(RoutesHref.VERSIONS, { replace: true });
  }, [navigate, refetchPublishedVersions, refetchUnpublishedVersions]);

  const handlePublishModalClose = useCallback(() => {
    setPublishVersionModalOpen(false);
  }, []);

  const { setSelectedSW } = useImportWorkflowStore();
  const pageLoadError = useMemo(() => workflowsError, [workflowsError]);
  const [modalMode, setModalMode] = useState<EModalWFAction>(EModalWFAction.IMPORT);

  useEffect(() => {
    if (pageLoadError) {
      handleError(pageLoadError, 'Error loading workflows', 'workflowPage-error');
    }
  }, [pageLoadError, handleError]);

  useEffect(() => {
    if (!versionNumber) {
      navigate(`/workflows/${selectedVersion.versionNumber}`);
    }
  }, [navigate, selectedVersion.versionNumber, versionNumber]);
  const handleGoToBranchToEdit = () => {
    if (featureBranches && featureBranches.length === 1) {
      navigate(`${RoutesHref.WORKFLOWS}/${featureBranches[0].name}`);
    } else if (featureBranches.length > 1) {
      navigate(RoutesHref.VERSIONS);
    } else {
      navigate(RoutesHref.VERSIONS);
    }
  };

  const handleCreateWorkflow = useCallback(async () => {
    try {
      if (selectedVersion?.deployedAt) {
        message.warning(
          'You cannot create a workflow on a published version. Please create an edit version first',
          5,
        );
        return;
      }
      setIsCreateWorkflowLoading(true);
      if (!workflowName || workflowName === '') {
        message.warning('Please enter a name for the workflow');
        return;
      }
      const newWorkflow = await createWorkflow(
        workflowName,
        selectedVersion.name,
        `Created workflow: ${workflowName}`,
      );
      navigate(`/editor/${selectedVersion.name}/${newWorkflow.workflowId}`);
    } catch (error) {
      handleErrorWithLockError(error, 'There was an error creating the workflow!');
    } finally {
      setIsCreateWorkflowLoading(false);
    }
  }, [
    createWorkflow,
    handleErrorWithLockError,
    navigate,
    selectedVersion?.name,
    selectedVersion?.deployedAt,
    workflowName,
  ]);

  const handleDeleteWorkflow = useCallback(
    async (workflowId: string) => {
      try {
        if (selectedVersion?.deployedAt) {
          message.warning(
            'You cannot delete a workflow on a published version. Please create an edit version first',
            5,
          );
          return;
        }
        await deleteWorkflow(workflowId, selectedVersion.name);
        await refetchWorkflows();
      } catch (error) {
        handleErrorWithLockError(error, 'There was an error deleting the workflow!');
      }
    },
    [
      selectedVersion?.name,
      selectedVersion?.deployedAt,
      deleteWorkflow,
      refetchWorkflows,
      handleErrorWithLockError,
    ],
  );

  const handleRenameWorkflow = useCallback(
    async (workflowId: string, newName: string) => {
      try {
        if (selectedVersion?.deployedAt) {
          message.warning(
            'You cannot rename a workflow on a published version. Please create an edit version first',
            5,
          );
          return;
        }
        await renameWorkflow(workflowId, selectedVersion.id, newName);
        await refetchWorkflows();
      } catch (error) {
        handleErrorWithLockError(error, 'There was an error renaming the workflow!');
      }
    },
    [
      selectedVersion?.deployedAt,
      selectedVersion?.id,
      renameWorkflow,
      refetchWorkflows,
      handleErrorWithLockError,
    ],
  );

  const handleDuplicateWorkflow = useCallback(
    async (workflowId: string) => {
      try {
        if (selectedVersion?.deployedAt) {
          message.warning(
            'You cannot duplicate a workflow on a published version. Please create an edit version first',
            5,
          );
          return;
        }
        await duplicateWorkflow(workflowId, selectedVersion.name);
        await refetchWorkflows();
      } catch (error) {
        handleErrorWithLockError(error, 'There was an error duplicating the workflow!');
      }
    },
    [
      selectedVersion?.deployedAt,
      selectedVersion?.name,
      duplicateWorkflow,
      refetchWorkflows,
      handleErrorWithLockError,
    ],
  );

  const handleCopyExecutorUrl = (selectedWorkflow) => {
    let versionEnv = '';

    if (selectedVersion.isProduction) {
      versionEnv = VersionEnvironments.PRODUCTION;
    } else if (selectedVersion.isSandbox) {
      versionEnv = VersionEnvironments.SANDBOX;
    } else if (selectedVersion.isDevelopment) {
      versionEnv = VersionEnvironments.DEVELOPMENT;
    }

    navigator.clipboard.writeText(
      `${env.BE_URL}/workflow/run/${versionEnv}/${selectedWorkflow.id}/${selectedVersion.id}`,
    );

    message.success('Executor URL copied with success!', 5);
  };

  const handleCopyToClipboard = useCallback(
    async (selectedWorkflow: Workflow) => {
      try {
        const result = await exportWorkflow(
          selectedWorkflow.id,
          selectedWorkflow.versionId,
          versionNumber,
        );
        if (result && result.id) {
          navigator.clipboard.writeText(JSON.stringify(result));
          message.success('Workflow Exported and Copied with success!', 5);
        }
      } catch (error) {
        message.error('Error Exporting the Workflow!', 5);
      }
    },
    [versionNumber, exportWorkflow],
  );

  const handleUpdateWfVersion = (id: string, name: string) => {
    setModalMode(EModalWFAction.UPDATE);
    setIsSharedModalOpen(true);
    setSelectedSW({
      workflow: { id, name },
    });
  };
  const handleSetName = useCallback((e: any) => {
    e.preventDefault();
    setWorkflowName(e.target.value);
  }, []);

  const handleWorkflowsPagination = useCallback((page: any) => {
    setWorkflowsPage(page);
  }, []);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setWorkflowName('');
  }, []);

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'Create Workflow',
    },
    {
      key: '2',
      label: 'Import Shared Workflow',
    },
    {
      key: '3',
      label: 'Import Workflow from JSON',
    },
  ];

  const handleWorkflowClick = ({ key }) => {
    switch (key) {
      // Create
      case '1':
        showModal();
        break;
      // Import
      case '2':
        setModalMode(EModalWFAction.IMPORT);
        setIsSharedModalOpen(true);
        break;
      case '3':
        setIsJSONImporterModalOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="fixed right-0 top-0 z-[10]" style={{ width: 'calc(100% - 16rem)' }}>
        <Navbar
          actionArea={
            <WorkflowsNavActionArea
              canDeploy={canUserDeploy}
              selectedVersion={selectedVersion}
              handleGoToBranchToEdit={handleGoToBranchToEdit}
              handleCreateWorkflow={handleCreateWorkflow}
              isCreateWorkflowLoading={isCreateWorkflowLoading}
              setPublishVersionModalOpen={setPublishVersionModalOpen}
            />
          }
        />
      </div>
      <div data-cy={WorkflowsPageIds.page} className="block px-6 mt-20">
        <div className="my-8 flex justify-between items-center">
          <TitleHeader>Workflows</TitleHeader>
          {!selectedVersion.deployedAt && (
            <>
              {isFuseUserAnyClient ? (
                <Dropdown
                  menu={{ items, onClick: handleWorkflowClick }}
                  placement="bottomRight"
                  trigger={['click']}
                  className="text-white hover:text-white"
                >
                  <Button
                    data-cy={WorkflowsPageIds.createBtnDropDown}
                    type="primary"
                    loading={isCreateWorkflowLoading}
                    className="flex items-center justify-center bg-blue-600"
                  >
                    <span>Create Workflow</span>
                    <UilAngleDown size="18" />
                  </Button>
                </Dropdown>
              ) : (
                <Button
                  data-cy={WorkflowsPageIds.createBtn}
                  type="primary"
                  onClick={showModal}
                  loading={isCreateWorkflowLoading}
                >
                  Create Workflow
                </Button>
              )}
            </>
          )}
        </div>

        <Table
          editMode={!selectedVersion.deployedAt}
          items={workflows}
          isLoadingWorkflows={isLoadingWorkflows}
          handleDelete={handleDeleteWorkflow}
          handleRename={handleRenameWorkflow}
          handleDuplicate={handleDuplicateWorkflow}
          totalItems={totalWorkflows}
          defaultCurrent={workflowsPage}
          handlePagination={handleWorkflowsPagination}
          handleUpdateVersion={handleUpdateWfVersion}
          handleCopyExecutorUrl={handleCopyExecutorUrl}
          handleCopyToClipboard={handleCopyToClipboard}
        />
      </div>

      <Modal
        title="Enter a name"
        open={isModalOpen}
        onOk={handleCreateWorkflow}
        onCancel={handleCancel}
        confirmLoading={isCreateWorkflowLoading}
        okText="Create"
        centered
        data-cy={WorkflowsPageIds.modalCreate}
      >
        <Input
          data-cy={WorkflowsPageIds.inputCreate}
          placeholder="Workflow Name"
          onChange={handleSetName}
          value={workflowName}
        />
      </Modal>

      {publishVersionModalOpen ? (
        <PublishVersionModal
          showDevelopmentEnv={role === Roles.FUSE_ADMIN}
          selectedVersion={selectedVersion}
          open={publishVersionModalOpen}
          onClose={handlePublishModalClose}
          onSave={handlePuslishModalsave}
        />
      ) : null}
      <ShareWorkflowModal
        isOpen={isSharedModalOpen}
        setIsOpen={setIsSharedModalOpen}
        action={modalMode}
        refetchWfs={refetchWorkflows}
      />
      <ImportWorkflowJsonModal
        isOpen={isJSONImporterModalOpen}
        setIsOpen={setIsJSONImporterModalOpen}
        refetchWfs={refetchWorkflows}
      />
    </>
  );
}
