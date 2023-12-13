import Loader from '@/src/components/Loader';
import { KeyValueObj } from '@/src/components/RequestParameters/types';
import { useGetTestById, useRunTest, useUpdateTest } from '@/src/services/tests';
import {
  arrayObjKeyValueToObjectFormater,
  objectToArrayObjKeyValueFormater,
} from '@/src/utils/dataFormatters';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router';
import { Container } from './styles';
import { TestConfig, TestHistory, TestingHeader, TestsTabs } from '@/src/components/Testing';
import { useVersions } from '@/src/contexts/VersionProvider/hooks';
import { useErrorHandler } from '@/src/hooks/errorHandlers';
import { Tabs, message } from 'antd';
import { useGetTestExecutions } from '@/src/services/executions';
import { RoutesHref } from '@/src/utils/types/sharedEnums';
import { IndividualTestOutletContextProps } from './types';
import { TestPageIds } from '@/src/constants/appIDS';
import { Test } from '@/src/types/services/tests';
import { useGetWorkflow } from '@/src/services/workflows';
import { fromReactFlowToExecutor } from '@/src/components/Editor/FlowCanvas/hooks';
import { Execution } from '@/src/types/services/executions';
import { filterExecutionsByStatusUtil } from './filterUtils';

const IndividualTest = () => {
  const [testBody, setTestBody] = useState(null);
  const [testSuccessCriteria, setTestSuccessCriteria] = useState(null);
  const [testHeaders, setTestHeader] = useState<KeyValueObj[]>([{ key: '', value: '' }]);
  const [testParams, setTestParams] = useState('');
  const [filterExpression, setFilterExpression] = useState<string>('');
  const [isLoadingTestRun, setIsLoadingTestRun] = useState(false);
  const [stepIds, setStepIds] = useState<string[]>([]);
  const [tab, setTab] = useState<TestsTabs>(TestsTabs.Config);
  const [filteredExecutions, setFilteredExecutions] = useState<Execution[]>(null);

  const { testId, executionId, workflowId } = useParams();
  const { refetchTests } = useOutletContext<IndividualTestOutletContextProps>();
  const navigate = useNavigate();

  const { selectedVersion } = useVersions();

  const { workflow: selectedWorkflow } = useGetWorkflow(
    selectedVersion.versionNumber,
    workflowId,
    selectedVersion.environment,
  );

  const { test, isLoading: isTestLoading, refetch: refetchTest } = useGetTestById(testId);

  const {
    testExecutions,
    isLoading: isLoadingTestExecutions,
    refetch: refetchTestExecutions,
  } = useGetTestExecutions(
    selectedVersion?.versionNumber,
    testId,
    {
      fields:
        'id,workflowFile,createdAt,duration,code,success,successCriteriaMatched,statusMessage,alertBlockExecuted',
      filterExpression: filterExpression,
    },
    tab !== TestsTabs.History,
  );

  const { runTest } = useRunTest();
  const { updateTest } = useUpdateTest();

  const { handleError } = useErrorHandler();

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!isTestLoading && test) {
      const formatedHeaders = objectToArrayObjKeyValueFormater(test.headers);
      let urlParams = '';

      if (Object.keys(test.params).length > 0) {
        const urlParamsStringified = new URLSearchParams(test.params).toString();
        urlParams = `?${urlParamsStringified}`;
      }

      setTestParams(urlParams);
      setTestBody(test.body);
      setTestSuccessCriteria(test.successCriteria);
      setTestHeader(formatedHeaders);
      setStepIds(test.stepsIds);
    }
  }, [isTestLoading, test]);

  useEffect(() => {
    if (tab === TestsTabs.History && !executionId) {
      if (testExecutions && testExecutions.length > 0) {
        handleSelectExecution(testExecutions[0].id);
      }
    }
  }, [tab, testExecutions, executionId]);

  const filterByStatus = useCallback(
    (filters: string[]) => {
      filterExecutionsByStatusUtil(filters, testExecutions, setFilteredExecutions);
    },
    [testExecutions, setFilteredExecutions],
  );

  const handleSelectExecution = useCallback(
    (executionId: string) => {
      navigate(
        `${RoutesHref.TEST}/${selectedVersion.versionNumber}/${workflowId}/${testId}/${executionId}`,
      );
    },
    [navigate, testId, selectedVersion?.versionNumber, workflowId],
  );

  const onSaveTest = async () => {
    try {
      const updatedTest = {
        ...test,
        body: testBody,
        successCriteria: testSuccessCriteria,
        headers: arrayObjKeyValueToObjectFormater(testHeaders),
        params: testParams,
        stepsIds: stepIds,
      };
      await onUpdateTest(updatedTest);
      messageApi.open({
        type: 'success',
        content: 'Test saved',
      });
    } catch (error) {
      handleError(error, 'Error saving test');
    }
  };

  const getUpdatedSteps = useCallback(() => {
    if (stepIds.length !== 0 && selectedWorkflow) {
      const { rfData } = selectedWorkflow;
      const startStep = stepIds[0];
      const endStep = stepIds.at(-1);
      const steps = fromReactFlowToExecutor(rfData, startStep, endStep);
      return [...steps.map((step) => step.id), endStep];
    }
    return [];
  }, [selectedWorkflow, stepIds]);

  const handleRunTest = useCallback(async () => {
    try {
      const urlParams = new URLSearchParams(testParams);
      const params = {};
      urlParams.forEach((value, key) => {
        params[key] = value;
      });

      setIsLoadingTestRun(true);
      const execution = await runTest(
        selectedVersion.versionNumber,
        workflowId,
        {
          body: testBody,
          headers: arrayObjKeyValueToObjectFormater(testHeaders),
          params,
          successCriteria: testSuccessCriteria,
          stepsIds: getUpdatedSteps(),
        },
        testId,
      );
      if (!execution) return;
      setFilteredExecutions(null);
      await refetchTest();
      const executionsList = testExecutions || [];
      await refetchTestExecutions([...executionsList, execution]);
      handleSelectExecution(execution.id);
    } catch (error) {
      console.log(error);
      handleError(error, 'Error running test');
    } finally {
      setIsLoadingTestRun(false);
      setTab(TestsTabs.History);
    }
  }, [
    selectedVersion.versionNumber,
    workflowId,
    testBody,
    testId,
    runTest,
    refetchTest,
    testHeaders,
    testParams,
    testSuccessCriteria,
    refetchTestExecutions,
    testExecutions,
    handleError,
    stepIds,
    selectedWorkflow,
  ]);

  const onUpdateTest = useCallback(
    async (testData: Test) => {
      if (!test) return;
      await updateTest(workflowId, testData, testData.id);
      await refetchTests();
    },
    [workflowId, test, updateTest, refetchTests],
  );

  const onTitleChange = useCallback(
    async (value: string) => {
      await onUpdateTest({ ...test, name: value });
    },
    [test, onUpdateTest],
  );

  const onTabChange = (key: TestsTabs) => {
    setTab(key);
    setFilterExpression('');
  };

  const searchExecution = useCallback(
    async (expression) => {
      setFilterExpression(expression);
      setFilteredExecutions(null);
      await refetchTestExecutions();
      navigate(`${RoutesHref.TEST}/${selectedVersion.versionNumber}/${workflowId}/${testId}`);
    },
    [setFilterExpression, refetchTestExecutions, navigate, selectedVersion, workflowId, testId],
  );

  const handleStepIdsChange = useCallback(
    (stepsSelected) => {
      setStepIds(structuredClone(stepsSelected));
    },
    [setStepIds],
  );

  if (isTestLoading) {
    return (
      <div className="m-auto">
        <Loader />
      </div>
    );
  }

  return (
    <Container data-cy={TestPageIds.individualTestContainer}>
      {contextHolder}
      <TestingHeader
        selectedWorkflowId={workflowId}
        title={test?.name}
        onTitleChange={onTitleChange}
        handleRunTest={handleRunTest}
        testParams={testParams}
        onTestParamsChange={setTestParams}
        tab={tab}
        onSaveTest={onSaveTest}
        isLoadingTestRun={isLoadingTestRun}
        searchExecution={searchExecution}
        handleFilterByStatus={filterByStatus}
      />
      <Tabs
        activeKey={tab}
        tabBarStyle={{ paddingLeft: '2rem', backgroundColor: '#FFFFFF', borderTop: 'none' }}
        onChange={onTabChange}
        items={[
          {
            label: 'Configuration',
            key: TestsTabs.Config,
          },
          {
            label: 'History',
            key: TestsTabs.History,
          },
        ]}
      />
      <div className="overflow-y-scroll p-6 flex-1">
        {tab === TestsTabs.Config ? (
          <TestConfig
            setStepIds={handleStepIdsChange}
            stepIds={test?.stepsIds}
            selectedWorkflow={selectedWorkflow}
            testHeaders={testHeaders}
            setTestHeaders={setTestHeader}
            testParams={testParams}
            setTestParams={setTestParams}
            testBody={testBody}
            testSuccessCriteria={testSuccessCriteria}
            testBodyDefaultValue={test?.body}
            testSuccessCriteriaDefaultValue={test?.successCriteria}
            setTestSuccessCriteria={setTestSuccessCriteria}
            setTestBody={setTestBody}
          />
        ) : (
          <TestHistory
            executions={filteredExecutions ? filteredExecutions : testExecutions}
            selectedExecutionId={executionId}
            handleSelectExecution={handleSelectExecution}
            isLoadingExecutions={isLoadingTestExecutions}
          />
        )}
      </div>
    </Container>
  );
};

export default IndividualTest;
