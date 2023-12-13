import styled from 'styled-components';
import tw from 'tailwind-styled-components';
import Loader from '@/src/components/Loader';
import { useEffect, useMemo, useState } from 'react';
import { useErrorHandler } from '@/src/hooks/errorHandlers';
import TitleHeader from '@/src/components/TitleHeader';
import { Button, Dropdown, message } from 'antd';
import { CreateScheduledConfigModal } from '@/src/components/Modals/CreateScheduledConfig';
import { getPermissions } from '@/src/utils/permissionsHelper';
import { useActiveUser } from '@/src/contexts/UserProvider/hooks';
import UilAngleDown from '@iconscout/react-unicons/icons/uil-angle-down';
import { useGetEnvironments } from '@/src/services/environments';
import { VersionEnvironments } from '@/src/utils/types/sharedEnums';
import { useGetWorkflows } from '@/src/services/workflows';
import { useGetScheduler, useMutateScheduler } from '@/src/services/scheduler';
import TableScheduler from '@/src/components/TableScheduler/TableScheduler';

const Container = styled.div``;

const HeaderContainer = tw.div`
  py-8 flex items-center justify-between
`;
const ScheduledContainer = tw.div`grid gap-8`;

const errorMessage = 'There was an error saving the Scheduler';

export default function SchedulerConfig() {
  const [selectedEnvironmentName, setSelectedEnvironmentName] = useState<string>(
    VersionEnvironments.PRODUCTION,
  );

  const { environments } = useGetEnvironments();

  const envOptions = environments.map((env) => ({
    label: env.name,
    key: env.name,
  }));

  const environmentVersion = environments.find((env) => env.name === selectedEnvironmentName)
    ?.versionId;

  const {
    data: schedulersList,
    refetch,
    isLoading,
    error: schedulerError,
  } = useGetScheduler(selectedEnvironmentName);

  const { createScheduler, deleteScheduler, updateScheduler } = useMutateScheduler();

  const { workflows } = useGetWorkflows(environmentVersion);

  const { role, permissions } = useActiveUser();
  const { isViewer } = getPermissions(role, permissions);

  const { handleError } = useErrorHandler();

  const [showUpdateScheduledConfigModal, setShowUpdateScheduledConfigModal] =
    useState<boolean>(false);
  const [selectedScheduledConfig, setSelectedScheduledConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const pageLoadError = useMemo(() => {
    return schedulerError;
  }, [schedulerError]);

  useEffect(() => {
    if (pageLoadError) {
      handleError(
        pageLoadError,
        'There was an error loading the Scheduler config page',
        'scheduler-error',
      );
    }
  }, [pageLoadError, handleError]);

  const handleCreateOrUpdate = async (payload) => {
    let createOrUpdateResult;

    setLoading(true);

    try {
      if (payload.id) {
        createOrUpdateResult = await updateScheduler(payload);
      } else {
        createOrUpdateResult = await createScheduler(payload);
      }

      await refetch();

      if (createOrUpdateResult && createOrUpdateResult.statusCode <= 202) {
        message.success('Scheduler saved successfully');
      }else{
        message.error(errorMessage);
      }
    } catch (error) {
      handleError(error, errorMessage, 'scheduler-error');
    } finally {
      setLoading(false);
      setShowUpdateScheduledConfigModal(false);
      setSelectedScheduledConfig(null);
    }
  };

  const handleSelectScheduler = (schedulerConfigSelected) => {
    setSelectedScheduledConfig(schedulerConfigSelected);
    setShowUpdateScheduledConfigModal(true);
  };

  const handleDelete = async (id: string) => {
    setLoadingDelete(true);

    try {
      const deleteResult = await deleteScheduler(id);
      await refetch();

      if (deleteResult && deleteResult.statusCode <= 202) {
        message.success('Scheduler deleted successfully');
      }else{
        message.error(errorMessage);
      }
    } catch (error) {
      handleError(error, errorMessage, 'scheduler-error');
    } finally {
      setLoadingDelete(false);
      setShowUpdateScheduledConfigModal(false);
      setSelectedScheduledConfig(null);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <Container className="px-6" style={{ height: 'calc(100vh - 4.5rem)' }}>
        <HeaderContainer>
          <TitleHeader>{'Scheduled Triggers'}</TitleHeader>
          {!isViewer && (
            <Button
              type="primary"
              onClick={() => {
                setSelectedScheduledConfig(null);
                setShowUpdateScheduledConfigModal(true);
              }}
            >
              Add Trigger
            </Button>
          )}
        </HeaderContainer>
        <div>
          <div className={`env-dropdown-${selectedEnvironmentName} capitalize`}>
            <Dropdown
              menu={{
                items: envOptions,
                onClick: (env: any) => setSelectedEnvironmentName(env.key),
              }}
            >
              <Button className="inline-flex items-center pr-2 capitalize font-medium text-gray-800">
                <span className="mr-2">{selectedEnvironmentName || `Environment`}</span>
                <UilAngleDown size="18" className="relative" />
              </Button>
            </Dropdown>
          </div>
        </div>

        <ScheduledContainer className="mt-6">
          {schedulersList && schedulersList.length > 0 ? (
            <TableScheduler handleSelectScheduler={handleSelectScheduler} items={schedulersList} />
          ) : (
            <div className="bg-white py-16 flex flex-col items-center justify-center rounded">
              <img className="w-24 mb-4" src="/img/empty-states/empty-vars.png" alt="Empty" />
              <p className="text-blue-900 font-medium text-lg">No scheduled triggers configured</p>
            </div>
          )}
        </ScheduledContainer>
      </Container>

      <CreateScheduledConfigModal
        workflows={workflows}
        environmentName={selectedEnvironmentName}
        open={showUpdateScheduledConfigModal}
        selectedScheduler={selectedScheduledConfig}
        onClose={() => {
          setSelectedScheduledConfig(null);
          setShowUpdateScheduledConfigModal(false);
        }}
        onDelete={handleDelete}
        onSave={(payload) => handleCreateOrUpdate(payload as any)}
        loading={loading}
        loadingDelete={loadingDelete}
      />
    </>
  );
}
