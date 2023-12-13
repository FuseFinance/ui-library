import Loader from '@/src/components/Loader';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Button } from 'antd';
import { useActiveUser } from '@/src/contexts/UserProvider/hooks';
import { useErrorHandler } from '@/src/hooks/errorHandlers';
import TitleHeader from '@/src/components/TitleHeader';
import { VariablesIds } from '@/src/constants/appIDS';
import { useGetTempData, useMutateTempData } from '@/src/services/tempData';
import { getPermissions } from '@/src/utils/permissionsHelper';
import CodeEditor from '@/src/components/CodeEditor';

import { linter } from '@codemirror/lint';
import { json, jsonParseLinter } from '@codemirror/lang-json';

export default function TempData() {
  const { currentClient, role, permissions } = useActiveUser();
  const { isViewer } = getPermissions(role, permissions);

  const {
    tempData,
    isLoading: isTempDataLoading,
    error: tempDataError,
  } = useGetTempData(currentClient);
  const { createTempData, updateTempData } = useMutateTempData();
  const [inputData, setInputData] = useState<string>('{}');

  const { handleError } = useErrorHandler();

  const pageLoadError = useMemo(() => {
    return tempDataError;
  }, [tempDataError]);

  useEffect(() => {
    if (pageLoadError) {
      handleError(pageLoadError, 'There was an error loading temp data', 'tempData-error');
    }
  }, [pageLoadError, handleError]);

  useEffect(() => {
    if (tempData?.data) {
      setInputData(tempData.data);
    }
  }, [tempData?.data]);

  const validateJsonInput = (input: string) => {
    try {
      JSON.parse(input);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleCreateOrUpdate = useCallback(async () => {
    try {
      if (validateJsonInput(inputData)) {
        if (tempData?.id) {
          await updateTempData(tempData.id, currentClient, inputData);
          message.success('Temporary data saved');
        } else {
          await createTempData(currentClient, inputData);
          message.success('Temporary data saved');
        }
      } else {
        message.error('Invalid JSON format');
      }
    } catch (error) {
      handleError(error, 'There was an error saving temp data', 'tempData-error');
    }
  }, [inputData]);

  if (isTempDataLoading) return <Loader />;

  return (
    <>
      <div className="px-6">
        <div className="py-8 flex items-center justify-between">
          <div>
            <TitleHeader>{'Temporary Data'}</TitleHeader>
            <p className="mt-4 text-sm max-w-xl text-gray-800">
              Store data on JSON format for creating useful searchable keys
            </p>
          </div>

          {!isViewer && (
            <Button
              type="primary"
              className="mb-auto"
              onClick={handleCreateOrUpdate}
              data-cy={VariablesIds.createEnvVarButton}
            >
              Save Changes
            </Button>
          )}
        </div>

        <div className="grid gap-8">
          <CodeEditor
            defaultValue={tempData?.data || '{}'}
            value={inputData}
            onChange={setInputData}
            customCSSClass="h-96 w-full !bg-white"
            lineWrapping={true}
            extensions={[
              json(),
              linter(jsonParseLinter(), {
                delay: 300,
              }),
            ]}
          />
        </div>
      </div>
    </>
  );
}
