import { Button, Input, Modal, message } from 'antd';
import colors from '@/src/styles/colors';
import { useMemo, useState } from 'react';
import { CreateBranchModal } from '../../components/Modals/CreateBranch';
import VersionsTableWithMenu from '../../components/VersionsTableWithMenu';
import { DeployVersionModal } from '@/src/components/Modals/DeployVersion';
import { PublishVersionModal } from '@/src/components/Modals/PublishVersion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Roles } from '@/src/utils/types/sharedEnums';
import TitleHeader from '@/src/components/TitleHeader';
import { useVersions } from '@/src/contexts/VersionProvider/hooks';
import { useActiveUser } from '@/src/contexts/UserProvider/hooks';
import { useCreateBranch } from '@/src/services/environments';
import {
  useDeployVersion,
  useRenameFeaturedVersion,
  useDeleteFeaturedVersion,
  useRebaseFeaturedVersion,
} from '@/src/services/versions';
import { useErrorHandler } from '@/src/hooks/errorHandlers';
import UilPen from '@iconscout/react-unicons/icons/uil-pen';
import UilRocket from '@iconscout/react-unicons/icons/uil-rocket';
import UilExport from '@iconscout/react-unicons/icons/uil-export';
import UilTrash from '@iconscout/react-unicons/icons/uil-trash';
import { UilCloudDownload } from '@iconscout/react-unicons';
import { onlyStringAndNumbers } from '@/src/utils/regex';
import { CreateVersionIds, VersionsPageIds } from '@/src/constants/appIDS';

export default function Versions() {
  const {
    versions,
    totalVersions,
    versionsPage,
    editVersionsPage,
    totalUnpublishedVersions,
    featureBranches,
    setPublishedVersionsPage,
    setUnPublishedVersionsPage,
    refetchUnpublishedVersions,
    refetchPublishedVersions,
  } = useVersions();

  const { renameFeaturedVersion } = useRenameFeaturedVersion();
  const { deleteFeaturedVersion } = useDeleteFeaturedVersion();
  const { rebaseFeaturedVersion } = useRebaseFeaturedVersion();

  const { role } = useActiveUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { createBranch } = useCreateBranch();
  const { deployVersion } = useDeployVersion();
  const { handleError } = useErrorHandler();

  const [currentItem, setCurrentItem] = useState(null);
  const [newName, setNewName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showPublishVersionModal, setShowPublishVersionModal] = useState(false);
  const [selectedVersionFromContextMenu, setSelectedVersionFromContextMenu] = useState<any>(null);
  const [isLoadingItemChange, setIsLoadingItemChange] = useState(false);
  const [isDeleteModalOpen, setDeleteIsModalOpen] = useState(false);
  const [isRebaseIsModalOpen, setRebaseIsModalOpen] = useState(false);

  const versionsDropdownItems = useMemo(() => {
    const dropdownOptions = [];

    if (role === Roles.ADMIN || role === Roles.FUSE_ADMIN) {
      dropdownOptions.push({
        key: 'Deploy',
        label: (
          <p className="flex items-center gap-2">
            <UilRocket className="cursor-pointer" size="16" color={colors.fuseGray2} />
            Deploy
          </p>
        ),
      });
    }
    return dropdownOptions;
  }, [role]);

  const editVersionsDropdownItems = useMemo(() => {
    const dropdownOptions = [
      {
        key: 'Rename',
        label: (
          <p className="flex items-center gap-2">
            <UilPen className="cursor-pointer" size="16" color={colors.fuseGray2} />
            Rename
          </p>
        ),
      },
    ];

    if (role === Roles.ADMIN || role === Roles.FUSE_ADMIN) {
      dropdownOptions.unshift({
        key: 'Rebase',
        label: (
          <p className="flex items-center gap-2">
            <UilCloudDownload className="cursor-pointer" size="16" color={colors.fuseGray2} />
            Rebase
          </p>
        ),
      });
    }

    if (role === Roles.ADMIN || role === Roles.FUSE_ADMIN) {
      dropdownOptions.unshift({
        key: 'Publish',
        label: (
          <p className="flex items-center gap-2">
            <UilExport className="cursor-pointer" size="16" color={colors.fuseGray2} />
            Publish
          </p>
        ),
      });

      dropdownOptions.push({
        key: 'Delete',
        label: (
          <p className="flex items-center gap-2">
            <UilTrash className="cursor-pointer" size="16" color={colors.fuseGray2} />
            Delete
          </p>
        ),
      });
    }

    return dropdownOptions;
  }, [role]);

  const handleSetNewName = (e: any) => {
    e.preventDefault();
    setNewName(onlyStringAndNumbers(e.target.value));
  };

  const handleRenameLocal = async () => {
    try {
      setIsLoadingItemChange(true);
      await renameFeaturedVersion(currentItem.name, newName);
      await refetchUnpublishedVersions();
      setIsLoadingItemChange(false);
      message.success('Edit Version Renamed successfully');
    } finally {
      setIsLoadingItemChange(false);
      setIsModalOpen(false);
    }
  };

  const handleConfirmRebase = async (currentItem: any) => {
    try {
      setIsLoadingItemChange(true);
      await rebaseFeaturedVersion(currentItem.name);
      await refetchUnpublishedVersions();
      message.success(`Rebased successfully`);
    } catch (error) {
      handleError(error, 'There was an error trying to rebase branch');
    } finally {
      setIsLoadingItemChange(false);
      setRebaseIsModalOpen(false);
    }
  };

  const handleConfirmDelete = async (currentItem: any) => {
    try {
      setIsLoadingItemChange(true);
      await deleteFeaturedVersion(currentItem.name);
      await refetchUnpublishedVersions();
      setIsLoadingItemChange(false);
      message.success('Edit Version deleted successfully');
    } finally {
      setIsLoadingItemChange(false);
      setDeleteIsModalOpen(false);
    }
  };

  const handleSaveBranch = async (payload: any) => {
    try {
      const result: any = await createBranch(payload.branchNameToSave, payload.branchFrom);
      await refetchUnpublishedVersions();
      setShowBranchModal(false);
      navigate(`/workflows/${result?.name}`);
    } catch (error) {
      handleError(error, 'There was an error trying to save branch!');
    }
  };

  const handleDeployVersion = async (payload: any) => {
    try {
      const { environments } = payload;
      await deployVersion(environments, selectedVersionFromContextMenu?.id);
      await refetchPublishedVersions();
      setShowDeployModal(false);
      navigate(location.pathname, { replace: true });
    } catch (error) {
      handleError(error, 'There was an error trying to deploy version!');
    }
  };

  const handleOnPublishSave = async () => {
    await refetchPublishedVersions();
    await refetchUnpublishedVersions();
  };

  const getHeight = () => {
    if (role === Roles.ADMIN) return 'calc(100vh - 4.5rem)';
    return 'calc(100vh)';
  };

  const handleVersionsClick = (key, version) => {
    setSelectedVersionFromContextMenu(version);
    switch (key) {
      case 'Deploy':
        setShowDeployModal(true);
        break;
      default:
        break;
    }
  };

  const handleEditVersionsClick = (key, version) => {
    setSelectedVersionFromContextMenu(version);
    switch (key) {
      case 'Publish':
        setShowPublishVersionModal(true);
        break;
      case 'Rebase':
        setCurrentItem(version);
        setRebaseIsModalOpen(true);
        break;
      case 'Rename':
        showModal();
        setCurrentItem(version);
        setNewName(version.name);
        break;
      case 'Delete':
        setDeleteIsModalOpen(true);
        setCurrentItem(version);
        break;
      default:
        break;
    }
  };

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const handlePagination = (page: any) => {
    setPublishedVersionsPage(page);
  };

  const handleUnpublishedPagination = (page: any) => {
    setUnPublishedVersionsPage(page);
  };

  return (
    <div className="px-6" style={{ height: getHeight() }}>
      <div className="py-8 flex items-center justify-between">
        <TitleHeader>Versions</TitleHeader>
        {role !== Roles.VIEWER && (
          <Button
            data-cy={CreateVersionIds.openModalBtn}
            type="primary"
            onClick={() => setShowBranchModal(true)}
          >
            Create Version
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        <div data-cy={VersionsPageIds.publishVersionsTable}>
          <VersionsTableWithMenu
            withDropDown={role !== Roles.VIEWER && versionsDropdownItems.length > 0}
            title="Published Versions"
            dropdownOptions={versionsDropdownItems}
            type="Published"
            versions={versions}
            handleOptionClick={(key, version) => handleVersionsClick(key, version)}
            totalVersions={totalVersions}
            defaultCurrent={versionsPage}
            handlePagination={handlePagination}
          />
        </div>

        <div data-cy={VersionsPageIds.editVersionsTable}>
          <VersionsTableWithMenu
            withDropDown={role !== Roles.VIEWER}
            title="Edit Versions"
            dropdownOptions={editVersionsDropdownItems}
            type="Edit"
            versions={featureBranches}
            handleOptionClick={(key, version) => handleEditVersionsClick(key, version)}
            totalVersions={totalUnpublishedVersions}
            defaultCurrent={editVersionsPage}
            handlePagination={handleUnpublishedPagination}
          />
        </div>
      </div>

      <CreateBranchModal
        versionsToBranchFrom={versions}
        onSave={handleSaveBranch}
        onClose={() => setShowBranchModal(false)}
        open={showBranchModal}
      />

      <PublishVersionModal
        showDevelopmentEnv={role === Roles.FUSE_ADMIN}
        selectedVersion={selectedVersionFromContextMenu}
        open={showPublishVersionModal}
        onClose={() => setShowPublishVersionModal(false)}
        onSave={handleOnPublishSave}
      />

      <DeployVersionModal
        showDevelopmentEnv={role === Roles.FUSE_ADMIN}
        selectedVersion={selectedVersionFromContextMenu}
        onSave={handleDeployVersion}
        onClose={() => setShowDeployModal(false)}
        open={showDeployModal}
      />

      <Modal
        title={`Rename ${currentItem ? currentItem.name : 'workflow'}`}
        open={isModalOpen}
        onOk={() => handleRenameLocal()}
        onCancel={handleCancel}
        confirmLoading={isLoadingItemChange}
        data-cy={VersionsPageIds.modalRename}
        centered
      >
        <Input data-cy={VersionsPageIds.inputRename} onChange={handleSetNewName} value={newName} />
      </Modal>

      <Modal
        title={`Rebase ${currentItem ? currentItem.name : 'version'}`}
        open={isRebaseIsModalOpen}
        onOk={() => handleConfirmRebase(currentItem)}
        onCancel={() => setRebaseIsModalOpen(false)}
        confirmLoading={isLoadingItemChange}
        data-cy={VersionsPageIds.modalRebase}
        centered
      >
        <p>Are you sure? This can not be undone</p>
      </Modal>

      <Modal
        title={`Delete ${currentItem ? currentItem.name : 'Edit Version'}`}
        open={isDeleteModalOpen}
        onOk={() => handleConfirmDelete(currentItem)}
        onCancel={() => setDeleteIsModalOpen(false)}
        confirmLoading={isLoadingItemChange}
        data-cy={VersionsPageIds.modalDelete}
        centered
      >
        <p>Are you sure to delete this Edit Version?</p>
      </Modal>
    </div>
  );
}
