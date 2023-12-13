/* eslint-disable no-case-declarations */

import { INode, IExecutorNode } from 'src/utils/types/sharedTypes';
import { IHeaders } from '@/src/components/StepContent/ConditionTable/types';
import { compact } from 'lodash';

const isValidNodeType = (
  type: string,
  invalidNodeTypes = ['LABEL_NODE', 'INVISIBLE_NODE', 'GROUP'],
) => !invalidNodeTypes.includes(type);

export const getNodeType = (node: INode) => node.data.executorType;
export const getNodeByCalledById = (calledById: string, workflow: Map<string, any>) =>
  workflow.get(calledById);
export const isValidNode = (node: IExecutorNode) => isValidNodeType(node.type);
export const extractInputsByNodeType = (step: Record<string, any>) => {
  const { type, nodeOrigData } = step;

  switch (type) {
    case 'START':
    case 'FINISH':
      return [{}];
    case 'FORMULA':
      return [{ formula: nodeOrigData.data.formulaText }];
    case 'CONDITION': {
      const conditionInputs = nodeOrigData.data.ifThenInputFields.map((e: any) => ({
        condition: e.if,
        formula: e.then,
      }));

      // Else handling
      conditionInputs.push({
        isElse: true,
        condition: 'true', // XXX: Executor doesnt like expressions, it need strings to be evaluated
        formula: nodeOrigData.data.elseInputField,
      });

      return conditionInputs;
    }
    case 'SPLIT_PATH':
      const { paths } = step;
      const completePaths = [...nodeOrigData.data.paths, nodeOrigData.data.elsePath];
      const splitPathInputs = completePaths.map((path: any, index: number) => ({
        step: paths[index].id,
        id: path.id,
        condition: path.value,
        branchName: path.name,
        isElse: !!path.isElse,
      }));

      return splitPathInputs;
    case 'API_CALL':
      const apiCallInputs: any = {
        method: nodeOrigData.data.method,
        url: nodeOrigData.data.url,
        output: nodeOrigData.data.output,
        customCertificate: nodeOrigData.data.customCertificate,
        certificateFile: nodeOrigData.data.certificateFile,
        keyFile: nodeOrigData.data.keyFile,
      };

      if (nodeOrigData.data.body) apiCallInputs.body = nodeOrigData.data.body;

      if (nodeOrigData.data.bodyFormat) apiCallInputs.bodyType = nodeOrigData.data.bodyFormat;

      if (nodeOrigData.data.headers) {
        const head = nodeOrigData.data.headers
          .filter((header) => header.key)
          .reduce((acc: Record<string, string>, item: any) => {
            acc[item.key] = item.value;
            return acc;
          }, {});
        // TODO: Good candidate to add to our utils for data structure transformation
        apiCallInputs.headers = head;
      }

      if (nodeOrigData.data.params) {
        // TODO: Good candidate to add to our utils for data structure transformation
        apiCallInputs.params = nodeOrigData.data.params.reduce(
          (acc: Record<string, string>, item: any) => {
            acc[item.key] = item.value;
            return acc;
          },
          {},
        );
      }

      return [apiCallInputs];
    case 'ASYNC_RESPONSE':
      const asyncResponseInputs: any = {
        customResponse: nodeOrigData.data.customResponse,
        httpStatus: nodeOrigData.data.httpStatus,
        output: nodeOrigData.data.output,
      };
      if (nodeOrigData.data.body) asyncResponseInputs.body = nodeOrigData.data.body;

      if (nodeOrigData.data.bodyFormat) asyncResponseInputs.bodyType = nodeOrigData.data.bodyFormat;

      if (nodeOrigData.data.headers) {
        // TODO: Good candidate to add to our utils for data structure transformation
        asyncResponseInputs.headers = nodeOrigData.data.headers.reduce(
          (acc: Record<string, string>, item: any) => {
            acc[item.key] = item.value;
            return acc;
          },
          {},
        );
      }
      return [asyncResponseInputs];

    case 'GROUP_START':
    case 'GROUP_END':
      return [];
    case 'CONDITION_TABLE':
      const { headersX, headersY, rows, outputVariable } = nodeOrigData.data;
      const conditionTableInputs = rows.map((row: string[], rowIndex: number) => {
        return row.map((cell: string, cellIndex: number) => {
          const yConditions = headersY.map((header: IHeaders) => {
            const yValue = header.conditions[rowIndex];
            if (!yValue || yValue === 'null') return null;
            return `${header.title} ${header.conditions[rowIndex]}`;
          });

          const xConditions = headersX.map((header: IHeaders) => {
            const xValue = header.conditions[cellIndex];
            if (!xValue || xValue === 'null') return null;
            return `${header.title} ${header.conditions[cellIndex]}`;
          });
          return {
            y: compact(yConditions),
            x: compact(xConditions),
            value: cell,
          };
        });
      });
      return [
        {
          output_variable: outputVariable,
          condition_table: conditionTableInputs,
        },
      ];

    case 'SUB_WORKFLOW':
      return [
        {
          inputData: nodeOrigData.data.useFullContext ? null : nodeOrigData.data.inputData,
          workflowId: nodeOrigData.data.workflowId,
          environmentName: nodeOrigData.data.environmentName,
          output_variable: nodeOrigData.data.outputVariable,
          useFullContext: nodeOrigData.data.useFullContext,
        },
      ];
    case 'GO_TO_ACTION':
      return [
        {
          action: nodeOrigData.data.action,
        },
      ];
    case 'CUSTOM_CODE':
      return [
        {
          code: nodeOrigData.data.code,
          outputVariable: nodeOrigData.data.outputVariable,
        },
      ];
    case 'CONVERTER':
      return [
        {
          input_data: nodeOrigData.data.inputData,
          output_variable: nodeOrigData.data.outputVariable,
          parse_numbers_to_string: nodeOrigData.data.parseNumbersToString,
          remove_namespace_prefix: nodeOrigData.data.removeNamespacePrefix,
          convert_from_to_selection: nodeOrigData.data.convertFromToSelection,
        },
      ];
    case 'JSONATA':
      return [
        {
          expression: nodeOrigData.data.jsonata,
          output_variable: nodeOrigData.data.outputVariable,
        },
      ];
    case 'ALERT':
      return [
        {
          description: nodeOrigData.data.description,
          output_variable: nodeOrigData.data.outputVariable,
        },
      ];
    case 'DB_QUERY':
      const {
        action,
        schema,
        query,
        values,
        filters,
        allowModify: allow_modify,
        outputVariable: output_var_dbquery,
      } = nodeOrigData.data;
      return [
        {
          action,
          query,
          schema,
          values,
          filters,
          allow_modify,
          output_variable: output_var_dbquery,
        },
      ];
    case 'APP_STATUS_CHANGE': {
      return [
        {
          query: nodeOrigData.data.query,
          status: nodeOrigData.data.status,
          reasons: nodeOrigData.data.reasons,
          isQueryFunction: nodeOrigData.data.isQueryFunction,
          queryFunction: nodeOrigData.data.queryFunction,
        },
      ];
    }
    case 'LOOP': {
      const { loopFor, outputVariable } = nodeOrigData.data;
      const forToNum = parseInt(loopFor);
      return [
        {
          loopFor: forToNum ? forToNum : typeof loopFor === 'string' ? loopFor : undefined,
          output_variable: outputVariable,
        },
      ];
    }
    case 'LOOP_END': {
      return [
        {
          loopParent: nodeOrigData.data.loopParent,
        },
      ];
    }
    case 'DB_CONNECTION': {
      const {
        schema,
        query,
        outputVariable: output_var_dbconnection,
        schemaName,
      } = nodeOrigData.data;
      return [
        {
          schemaName,
          schema,
          query,
          output_variable: output_var_dbconnection,
        },
      ];
    }
    case 'S3_UPLOAD': {
      const {
        fileContents,
        awsRegion,
        bucketName,
        objectKeys,
        accessKeyId,
        secretAccessKey,
        outputVariable,
      } = nodeOrigData.data;

      return [
        {
          fileContents,
          awsRegion,
          bucketName,
          objectKeys,
          accessKeyId,
          secretAccessKey,
          output_variable: outputVariable,
        },
      ];
    }

    case 'SFTP_UPLOAD': {
      const {
        fileContents,
        userName,
        password,
        portNumber,
        serverAddress,
        pathForFile,
        outputVariable,
      } = nodeOrigData.data;

      return [
        {
          fileContents,
          userName,
          password,
          portNumber,
          serverAddress,
          pathForFile,
          output_variable: outputVariable,
        },
      ];
    }
    default:
      console.error(
        type,
        'Node unknow. You may need to add it here: src/components/Editor/FlowCanvas/utils.ts',
      );
      throw new Error(`${type} Unknown.`);
  }
};

export const arrayToMap = (arr: Record<any, any>) => {
  const map = new Map();
  arr.forEach((node: IExecutorNode) => map.set(node.id, node));

  return map;
};

export const uniqArray = (key: string, array: any[]) => {
  return [...new Map(array.map((item) => [item[key], item])).values()];
};

export const arrayToPlainObject = (arr: string[], defaultValue: any = '') => {
  return arr.reduce((acc, s) => {
    acc[s] = defaultValue;
    return acc;
  }, {});
};
