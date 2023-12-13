import styled from 'styled-components';
import tw from 'tailwind-styled-components';
import Loader from '@/src/components/Loader';
import { useNavigate } from 'react-router-dom';
import { RoutesHref } from '@/src/utils/types/sharedEnums';
import { CreateEnvVariableModal } from '@/src/components/Modals/CreateEnvVariable';
import { useEffect, useMemo, useState } from 'react';
import { message, Button } from 'antd';
import { checkMissingFields } from '@/src/utils/payloadHelper';
import TableVariables from '@/src/components/TableVariables';
import { getPermissions } from '@/src/utils/permissionsHelper';
import { useActiveUser } from '@/src/contexts/UserProvider/hooks';
import {
  useGetEnvironmentVariables,
  useMutateEnvironmentVariable,
} from '@/src/services/environmentVariables';
import { useErrorHandler } from '@/src/hooks/errorHandlers';
import TitleHeader from '@/src/components/TitleHeader';
import { VariablesIds } from '@/src/constants/appIDS';

const Container = styled.div``;

const HeaderContainer = tw.div`
  py-8 flex items-center justify-between
`;
const VersionsContainer = tw.div`grid gap-8`;

export default function Versions() {
  const { role, permissions } = useActiveUser();
  const { environmentVariables, isLoading, error: envVasrError } = useGetEnvironmentVariables();
  const { deleteEnvironmentVariable, updateEnvironmentVariable, createEnvironmentVariable } =
    useMutateEnvironmentVariable();

  const { handleError } = useErrorHandler();

  const navigate = useNavigate();

  const [showCreateEnvModal, setShowCreateEnvModal] = useState<boolean>(false);
  const [selectedEnvVariable, setSelectedEnvVariable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeteling] = useState(false);

  const { isFuseUser, isFuseAdmin, isViewer } = getPermissions(role, permissions);

  const pageLoadError = useMemo(() => {
    return envVasrError;
  }, [envVasrError]);

  useEffect(() => {
    if (pageLoadError) {
      handleError(
        pageLoadError,
        'There was an error loading the environment variables',
        'envVar-error',
      );
    }
  }, [pageLoadError, handleError]);

  const getHeight = () => {
    if (isFuseAdmin) return 'calc(100vh - 4.5rem)';
    return 'calc(100vh)';
  };

  const handleDelete = async (id: string) => {
    setDeteling(true);
    try {
      await deleteEnvironmentVariable(id);
      environmentVariables.splice(
        environmentVariables.findIndex((variable) => variable.id === id),
        1,
      );
      navigate(RoutesHref.VARIABLES);
      message.info('Variable deleted successfully');
    } catch (error) {
      handleError(error, 'There was an error deleting the environment variable', 'envVar-error');
    } finally {
      setDeteling(false);
      setShowCreateEnvModal(false);
      setSelectedEnvVariable(null);
    }
  };

  const handleCreateOrUpdate = async (payload) => {
    setLoading(true);
    try {
      if (!checkMissingFields(['prodValue', 'name', 'sandboxValue'], payload)) {
        if (payload.id) {
          await updateEnvironmentVariable(
            payload.id,
            payload.name,
            payload.prodValue,
            payload.sandboxValue,
            payload.devValue,
          );
        } else {
          const data = await createEnvironmentVariable(
            payload.name,
            payload.prodValue,
            payload.sandboxValue,
            payload.devValue,
          );
          environmentVariables.push(data);
          message.success('Variable created successfully');
        }

        navigate(RoutesHref.VARIABLES);
      } else {
        message.error('All fields required');
      }
    } catch (error) {
      handleError(error, 'There was an error saving the environment variable', 'envVar-error');
    } finally {
      setLoading(false);
      setShowCreateEnvModal(false);
      setSelectedEnvVariable(null);
    }
  };

  const handleSelectVariable = (variableSelected) => {
    if (isViewer) return;

    setSelectedEnvVariable(variableSelected);
    setShowCreateEnvModal(true);
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <Container className="px-6" style={{ height: getHeight() }}>
        <HeaderContainer>
          <TitleHeader>{'Environment Variables'}</TitleHeader>
          {!isViewer && (
            <Button
              type="primary"
              onClick={() => {
                setSelectedEnvVariable(null);
                setShowCreateEnvModal(true);
              }}
              data-cy={VariablesIds.createEnvVarButton}
            >
              Create Variable
            </Button>
          )}
        </HeaderContainer>

        <VersionsContainer>
          {environmentVariables && environmentVariables.length > 0 ? (
            <TableVariables
              handleSelectVariable={handleSelectVariable}
              items={environmentVariables}
              isFuseUser={isFuseUser}
            />
          ) : (
            <div className="bg-white py-16 flex flex-col items-center justify-center rounded">
              <img className="w-24 mb-4" src="/img/empty-states/empty-vars.png" alt="Empty Vars" />
              <p className="text-blue-900 font-medium text-lg">No variables yet</p>
              <span className="text-gray-600 text-sm mt-1 mb-4">
                Create your first variable to get started
              </span>
              <Button
                type="primary"
                onClick={() => {
                  setSelectedEnvVariable(null);
                  setShowCreateEnvModal(true);
                }}
              >
                Create Variable
              </Button>
            </div>
          )}
        </VersionsContainer>
      </Container>

      <CreateEnvVariableModal
        open={showCreateEnvModal}
        selectedEnvVariable={selectedEnvVariable}
        isFuseUser={isFuseUser}
        isViewer={isViewer}
        onClose={() => {
          setSelectedEnvVariable(null);
          setShowCreateEnvModal(false);
        }}
        onSave={(payload) => handleCreateOrUpdate(payload)}
        handleDelete={handleDelete}
        loading={loading}
        deleting={deleting}
      />
    </>
  );
}
