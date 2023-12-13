import { Button } from 'antd';
import { RoutesHref, Roles } from '@/src/utils/types/sharedEnums';
import { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { PublishVersionModal } from '@/src/components/Modals/PublishVersion';
import { useVersions } from '@/src/contexts/VersionProvider/hooks';
import { useGetTestsByWorkflowId, useCreateTest } from '@/src/services/tests';
import { useActiveUser } from '@/src/contexts/UserProvider/hooks';
import { TestingNavbar } from '@/src/components/Testing';
import TestingSidebar from '@/src/components/TestingSidebar';
import Loader from '@/src/components/Loader';
import { getNextTestNameAvailable } from '@/src/components/TestingSidebar/utils';
import { TestPageIds } from '@/src/constants/appIDS';

export default function TestPage() {
  const navigate = useNavigate();

  const { selectedVersion } = useVersions();
  const { role } = useActiveUser();
  const { testId, workflowId, versionNumber } = useParams();

  const {
    tests,
    isLoading: isTestsLoading,
    refetch: refetchTests,
  } = useGetTestsByWorkflowId(selectedVersion.id, workflowId, true);

  const { createTest } = useCreateTest();

  const [publishVersionModalOpen, setPublishVersionModalOpen] = useState(false);

  useEffect(() => {
    if (!testId) {
      selectFirstTestOfFolder();
    }
  }, [tests]);

  const selectFirstTestOfFolder = useCallback(async () => {
    if (!tests) return;
    if (tests.length === 0) return;
    const firstTest = tests[0];
    handleSelectTest(firstTest.id);
  }, [tests]);

  const handleSelectTest = useCallback(
    (testId: string) => {
      navigate(`${RoutesHref.TEST}/${selectedVersion.versionNumber}/${workflowId}/${testId}`, {
        replace: true,
      });
    },
    [navigate, selectedVersion?.versionNumber, workflowId],
  );

  const handleBackToEditor = useCallback(() => {
    navigate(`/editor/${selectedVersion.versionNumber}/${workflowId}`);
  }, [selectedVersion?.versionNumber, workflowId, navigate]);

  const onCreateTest = async () => {
    const newTestName = getNextTestNameAvailable([]);
    const newTest = await createTest(workflowId, selectedVersion.id, {
      name: newTestName,
      position: 0,
    });
    if (!newTest) return;
    navigate(`/tests/${versionNumber}/${workflowId}/${newTest.id}`, { replace: true });
    await refetchTests([newTest]);
  };

  if (isTestsLoading) {
    return (
      <div className="m-auto">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="w-full">
        <TestingNavbar handleBackToEditor={handleBackToEditor} />
      </div>
      <div className="flex h-full flex-1">
        <TestingSidebar
          tests={tests}
          selectedTest={testId}
          selectedVersionId={selectedVersion.id}
          refetchTests={refetchTests}
        />
        {tests && tests.length > 0 ? (
          <Outlet context={{ refetchTests }} />
        ) : (
          <section className="flex items-center h-full w-full p-16">
            <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
              <div className="max-w-md text-center flex flex-col justify-center items-center">
                <img
                  className="w-24 mb-4"
                  src="/img/empty-states/empty-history.png"
                  alt="Empty Tests"
                />
                <p className="text-blue-900 font-medium text-lg mb-1">
                  No tests found for this workflow.
                </p>
                <p className="text-gray-600 font-medium text-md mb-5">
                  But dont worry, you can create the first one.
                </p>
                <Button
                  onClick={onCreateTest}
                  type="primary"
                  data-cy={TestPageIds.createTestButton}
                >
                  Create Test
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>
      <PublishVersionModal
        showDevelopmentEnv={role === Roles.FUSE_ADMIN}
        selectedVersion={selectedVersion}
        open={publishVersionModalOpen}
        onClose={() => setPublishVersionModalOpen(false)}
        onSave={() => {
          navigate(RoutesHref.VERSIONS, { replace: true });
        }}
      />
    </div>
  );
}
