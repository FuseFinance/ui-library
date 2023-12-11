import { useCallback, useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ITEMS_PER_PAGE, RoutesHref } from '@utils/types/sharedEnums';
import {
  useGetExecutionsByWfID,
  useGetAllExecutions,
  useGetExecutionById,
} from '@services/executions';
import { useGetEnvironments } from '@services/environments';
import { useGetWorkflows } from '@services/workflows';
import { ExecutionsList, SingleExecutionView } from '@components/Executions';
import { HistoryHeader } from '@components/History';
import { useErrorHandler } from '@hooks/errorHandlers';
import Loader from '@components/Loader';
import dayjs from 'dayjs';
import { getSortedExecutions } from '@/src/components/Executions/utils';
import { Execution } from '@/src/types/services/executions';
import { filterExecutionsByStatusUtil } from '../Tests/filterUtils';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [interNalExecutionId, setInterNalExecutionId] = useState<string | null>();
  const { environmentName, executionId, workflowId: selectedWorkflowId } = useParams();

  const {
    environments,
    isLoading: isLoadingEnvironments,
    error: environmentsError,
  } = useGetEnvironments();
  const environmentVersion = environments.find((env) => env.name === environmentName)?.versionId;
  const {
    workflows = [],
    isLoading: isLoadingWorkflows,
    error: workflowsError,
  } = useGetWorkflows(environmentVersion);

  const [dateRange, setDateRange] = useState([dayjs().subtract(1, 'hour'), dayjs()]);
  const [filterExpression, setFilterExpression] = useState<string>('');
  const [filteredExecutions, setFilteredExecutions] = useState<Execution[]>(null);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [executionsToRender, setExecutionsToRender] = useState<Execution[]>(null);
  const [totalExecutionsNumber, setTotalExecutionsNumber] = useState<number>(null);

  const { handleError } = useErrorHandler();

  const {
    allExecutions,
    total: allExecutionsTotal,
    isLoading: isLoadingAllExecutions,
    error: errorAllExecutions,
    refetch: refetchExecutions,
  } = useGetAllExecutions({
    environmentName,
    startDate: dateRange[0],
    endDate: dateRange[1],
    removeFields: 'input,output,steps',
    filterExpression: filterExpression,
    startIndex: startIndex,
    limit: ITEMS_PER_PAGE,
    requestDisabled: selectedWorkflowId !== undefined
  })

  const {
    executions: executionsByWf,
    total: executionsByWfTotal,
    isLoading: isLoadingExecutionsByWf,
    refetch: refetchExecutionsByWf,
    error: errorExecutionByWf,
  } = useGetExecutionsByWfID({
    environmentName,
    startDate: dateRange[0],
    endDate: dateRange[1],
    workflowId: selectedWorkflowId,
    removeFields: 'input,output,steps',
    filterExpression: filterExpression,
    startIndex: startIndex,
    limit: ITEMS_PER_PAGE,
    requestDisabled: selectedWorkflowId === undefined
  });

  useEffect(() => {
    let selectedExecutionId: string;

    if (selectedWorkflowId && executionsByWf && executionsByWf.length !== 0) {
      selectedExecutionId = getSortedExecutions(executionsByWf)[0].id;
      setExecutionsToRender(executionsByWf);
      setTotalExecutionsNumber(executionsByWfTotal);
    } else if (allExecutions && allExecutions.length !== 0) {
      selectedExecutionId = getSortedExecutions(allExecutions)[0].id;
      setExecutionsToRender(allExecutions);
      setTotalExecutionsNumber(allExecutionsTotal);
    }

    setInterNalExecutionId(selectedExecutionId);
    handleSelectExecution(selectedExecutionId);
  }, [allExecutions, executionsByWf, selectedWorkflowId]);

  const { execution: singleExecution, isLoading: isLoadingSingleExecution } = useGetExecutionById({
    executionId: executionId || interNalExecutionId,
    removeFields: 'steps.inputs,steps.outputs,steps.context',
  });

  const pageLoadError = useMemo(() => {
    return environmentsError || workflowsError || errorExecutionByWf || errorAllExecutions;
  }, [environmentsError, workflowsError, errorExecutionByWf, errorAllExecutions]);

  useEffect(() => {
    if (pageLoadError) {
      handleError(pageLoadError, 'Error loading history', 'history-error');
    }
  }, [pageLoadError, handleError]);

  const handlePagination = useCallback(
    async (page) => {
      const indexCalc =
        currentPage < page ? startIndex + ITEMS_PER_PAGE : startIndex - ITEMS_PER_PAGE;

      setStartIndex(indexCalc);
      setCurrentPage(page);

      if (selectedWorkflowId) {
        await refetchExecutionsByWf();
      } else {
        await refetchExecutions();
      }
    },
    [startIndex, setStartIndex, currentPage],
  );

  const handleSelectExecution = useCallback(
    (executionId) => {
      if (!executionsToRender) return;
      const selectedExecution = executionsToRender.find((exec) => exec.id === executionId);

      if (!environmentName || !selectedExecution) {
        return;
      }

      navigate(
        `${RoutesHref.HISTORY}/${environmentName}/${selectedExecution.workflowId}/${selectedExecution.id}`,
      );
    },
    [environmentName, executionsToRender, navigate, executionsToRender],
  );

  const resetHistory = useCallback(() => {
    setExecutionsToRender(null);
    setTotalExecutionsNumber(null);
    setInterNalExecutionId(null);
    setStartIndex(0);
    setCurrentPage(1);
  }, [
    setExecutionsToRender,
    setTotalExecutionsNumber,
    setInterNalExecutionId,
    setStartIndex,
    setCurrentPage,
  ]);

  const handleEnvSelect = useCallback(
    (env) => {
      resetHistory();

      const redirectUrl = `${RoutesHref.HISTORY}/${env.name}`;
      navigate(redirectUrl);
    },
    [navigate],
  );

  const handleWorkflowSelect = useCallback(
    async (workflow) => {
      if (!environmentName) {
        return;
      }

      if(workflow && workflow.id === selectedWorkflowId){
        return;
      }

      resetHistory();

      if(!workflow){
        await refetchExecutions();

        navigate(`${RoutesHref.HISTORY}/${environmentName}`);
        return;
      }

      await refetchExecutionsByWf();

      navigate(`${RoutesHref.HISTORY}/${environmentName}/${workflow.id}`);
    },
    [environmentName, navigate, selectedWorkflowId, resetHistory, refetchExecutionsByWf],
  );

  const searchExecution = useCallback(
    async (expression) => {
      resetHistory();

      setFilterExpression(expression);
      
      if (selectedWorkflowId) {
        await refetchExecutionsByWf();
      } else {
        await refetchExecutions();
      }
    },
    [setFilterExpression, refetchExecutions, refetchExecutionsByWf, selectedWorkflowId],
  );

  const filterByStatus = useCallback(
    (filters: string[]) => {
      const executionsToFilter = executionsToRender;
      filterExecutionsByStatusUtil(filters, executionsToFilter, setFilteredExecutions);
    },
    [executionsToRender, setFilteredExecutions],
  );

  useEffect(() => {
    if (singleExecution && selectedWorkflowId) {
      navigate(
        `${RoutesHref.HISTORY}/${environmentName}/${singleExecution.workflowId}/${singleExecution.id}/${singleExecution.version.versionNumber}`,
      );
    }
  }, [singleExecution]);

  if (
    isLoadingEnvironments ||
    isLoadingWorkflows ||
    isLoadingExecutionsByWf ||
    isLoadingAllExecutions
  ) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col w-full h-screen mb-8">
      <HistoryHeader
        environments={environments}
        selectedEnvironmentName={environmentName}
        handleEnvSelect={handleEnvSelect}
        workflows={workflows}
        selectedWorkflowId={selectedWorkflowId}
        handleWorkflowSelect={handleWorkflowSelect}
        startDate={dateRange[0]}
        endDate={dateRange[1]}
        setDateRange={setDateRange}
        searchExecution={searchExecution}
        filterToSearch={filterExpression}
        handleFilterByStatus={filterByStatus}
      />

      {Array.isArray(executionsToRender) && executionsToRender.length > 0 ? (
        <div className="p-6 pr-0 flex flex-1 gap-4 overflow-y-auto">
          <ExecutionsList
            executions={filteredExecutions ? filteredExecutions : executionsToRender}
            selectedExecutionId={executionId || interNalExecutionId}
            isLoadingExecutions={isLoadingExecutionsByWf || isLoadingAllExecutions}
            onSelectExecution={handleSelectExecution}
            showWorkflowName={false}
            handlePagination={handlePagination}
            showPagination={true}
            totalExecutionsNumber={totalExecutionsNumber}
            currentPageNumber={currentPage}
          />

          <SingleExecutionView
            execution={singleExecution}
            isLoadingExecution={isLoadingSingleExecution}
          />
        </div>
      ) : (
        <div className="m-6">
          <div className="bg-white py-16 flex flex-col items-center justify-center rounded">
            <img
              className="w-24 mb-4"
              src="/img/empty-states/empty-history.png"
              alt="Empty History"
            />
            <p className="text-blue-800 font-medium text-lg">No executions yet</p>
            <span className="text-gray-600 text-sm mt-1 mb-4">
              Executions will appear here when your workflow is run
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
