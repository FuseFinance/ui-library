import { Edge } from 'reactflow';

import { INode, IExecutorNode } from 'src/utils/types/sharedTypes';
import { ModalType } from '@/src/components/Modal/types';

import {
  arrayToMap,
  getNodeByCalledById,
  getNodeType,
  isValidNode,
  extractInputsByNodeType,
} from '../utils';
import { NodeTypesEnum } from '../../EditorSteps/Common/types';

const generate = (node: INode, edges: Edge[]) => {
  const type = getNodeType(node);
  if (!type) throw new Error(`die because ${node.id}`);
  const ids = edges.map((e) => ({ id: e.target }));
  const generated: {
    id: string;
    name: string;
    type: NodeTypesEnum;
    paths: { id: string }[];
    nodeOrigData: INode;
    initialNodeId?: string;
  } = {
    id: node.id,
    name: node.data.title,
    type,
    paths: ids,
    nodeOrigData: node, // We store this because we need to use it later for generating the inputs for Executor
  };

  return generated;
};

const setupGroupNode = (reactWorkflow: [INode[], Edge[]], childs: Edge[], node: INode) => {
  let generatedGroupNode = generate(node, childs);
  const childNodes = reactWorkflow[0].filter((nodeFromList) => nodeFromList.parentNode === node.id);
  const initialNode = childNodes.find(
    (nodeFromList) => nodeFromList.type === NodeTypesEnum.GROUP_START,
  );
  const childNodeIds = childNodes.map((nodeFromList) => nodeFromList.id);
  const childEdges = reactWorkflow[1].filter(
    (edgeFromList) =>
      childNodeIds.includes(edgeFromList.source) || childNodeIds.includes(edgeFromList.target),
  );
  generatedGroupNode = {
    ...generatedGroupNode,
    initialNodeId: initialNode.id,
  };

  return { generatedGroupNode, childNodes, childEdges, initialNode };
};

const serializeReactWorkflow = (
  reactWorkflow: [INode[], Edge[]], //FIXME: This both could be maps to make it faster
  rootNodeId: string | number,
) => {
  const visited = new Set();
  const queue = [rootNodeId];
  const output = [];

  while (queue.length) {
    const nodeId = queue.shift();
    const node = reactWorkflow[0].find((node) => node.id === nodeId);

    if (!node || visited.has(nodeId)) continue;

    const childs = reactWorkflow[1].filter((edge) => edge.source === nodeId);
    visited.add(nodeId);

    if (node.type === NodeTypesEnum.GROUP_NODE) {
      const { initialNode, childEdges, childNodes, generatedGroupNode } = setupGroupNode(
        reactWorkflow,
        childs,
        node,
      );
      const serializedGroupContent = serializeReactWorkflow(
        [childNodes, childEdges],
        initialNode.id,
      );
      output.push(...serializedGroupContent, generatedGroupNode);
    } else {
      output.push(generate(node, childs));
    }

    queue.push(...childs.map((c) => c.target));
  }
  return output;
};

const walkUntilValidNode = (node: IExecutorNode, workflow: Map<string, any>) => {
  let currentNode = node;
  let isValid = isValidNode(currentNode);
  while (!isValid) {
    currentNode = workflow.get(currentNode.paths[0].id);
    isValid = isValidNode(currentNode);
  }

  return { ...currentNode, calledById: node.id };
};

const removeInvalidNodes = (workflow: Map<string, any>, results = new Map()) => {
  workflow.forEach((step, key) => {
    if (!isValidNode(step)) {
      const nextValidNode = walkUntilValidNode(step, workflow);
      results.set(nextValidNode.calledById, nextValidNode);
    } else {
      results.set(key, step);
    }
  });

  return results;
};

const reLinkNodes = (wf: Map<string, any>, endNodeId?: string) => {
  const processedNodes: Map<string, any> = new Map();
  for (const node of wf.values()) {
    if (endNodeId && node.id === endNodeId) {
      break;
    }
    const updatedPaths: any[] = [];
    for (const path of node.paths) {
      const nextNode = getNodeByCalledById(path.id, wf);
      updatedPaths.push({ id: nextNode.id });
    }

    node.paths = updatedPaths;

    delete node.calledById;

    if (!processedNodes.get(node.id)) {
      processedNodes.set(node.id, node);
    }
  }

  return Array.from(processedNodes.values());
};

const reLinkNodesWithGroups = (wf: Map<string, any>): Map<any, any> => {
  const updated: any[] = [];
  for (const node of wf.values()) {
    const updatedPaths: any[] = [];
    let nodePaths = node.paths;
    if (node.type === NodeTypesEnum.GROUP_END) {
      const groupNode = getNodeByCalledById(node.nodeOrigData?.parentNode, wf);
      nodePaths = groupNode.paths;
    }
    for (const path of nodePaths) {
      let nextNode = getNodeByCalledById(path.id, wf);
      if (nextNode.type === NodeTypesEnum.GROUP_NODE) {
        nextNode = getNodeByCalledById(nextNode.initialNodeId, wf);
      }
      updatedPaths.push({ id: nextNode.id });
    }

    node.paths = updatedPaths;

    delete node.initialNodeId;
    updated.push(node);
  }

  return new Map(updated.map((item) => [item.id, item]));
};

const serializeWorkflow = (rf: [INode[], Edge[]]) => {
  const firstNodeId = rf[0][0].id;

  const serializedWorkflow = serializeReactWorkflow(rf, firstNodeId);
  return arrayToMap(serializedWorkflow);
};

const generateInputs = (wf: [Record<string, any>]) => {
  const updatedWf: any[] = wf.map((step) => ({
    ...step,
    inputs: extractInputsByNodeType(step),
  }));

  // Cleanup
  updatedWf.forEach((step) => {
    delete step.nodeOrigData;
  });

  return updatedWf;
};

export const fromReactFlowToExecutor = (
  rf: [INode[], Edge[]],
  startNodeId = rf[0][0].id,
  endNodeId?: string,
) => {
  const serializedWorkflowMap = serializeWorkflow(rf);
  // Maybe the node selected is not valid (i.e: INVISIBLE_NODE, LABEL_NODE).
  // So we follow the path until we found the first valid one.
  const serializedWithGroupsMap = reLinkNodesWithGroups(serializedWorkflowMap);

  const firstNode = serializedWithGroupsMap.get(startNodeId);
  const firstValidNode = walkUntilValidNode(firstNode, serializedWithGroupsMap);
  const cleanWorkflow = removeInvalidNodes(serializedWithGroupsMap);
  const workflowMapFromFirstStep = getWorkflowMapFromFirstStep(cleanWorkflow, firstValidNode.id);
  const relinkedWorkflow = reLinkNodes(workflowMapFromFirstStep, endNodeId);

  const workflow = generateInputs(relinkedWorkflow as any);
  return workflow;
};

export const translateTypeForExecutor = (type: ModalType) => {
  if (type === ModalType.IF_THEN) return 'CONDITION';

  return type;
};

export const transformExecutorForType = (type: string) => {
  if (type === 'CONDITION') return ModalType.IF_THEN;

  return type;
};

export const useTransformWorkflow = () => {
  return {
    fromReactFlowToExecutor,
  };
};

export const addQueryParamsToString = (urlString: string, params: Record<string, string>) => {
  const queryParams = new URLSearchParams(params).toString();
  if (queryParams) {
    urlString += '?' + queryParams;
  }
  return urlString;
};

const getWorkflowMapFromFirstStep = (workflowMap: Map<string, any>, firstStepkey: string) => {
  const newWorkflowMap = new Map();
  let encontrado = false;

  workflowMap.forEach((value, key) => {
    if (key === firstStepkey) {
      encontrado = true;
    }

    if (encontrado) {
      newWorkflowMap.set(key, value);
    }
  });

  return newWorkflowMap;
};
