import { NodeTypesEnum } from './types';

export const getClosestValidNode = (nodeId, nodes, edges) => {
  let tempNodeFound;

  const InvalidNodeTypes: NodeTypesEnum[] = [
    NodeTypesEnum.CORNER_NODE,
    NodeTypesEnum.INVISIBLE_NODE,
    NodeTypesEnum.GROUP_NODE,
  ];

  const getNext = (id) => {
    tempNodeFound = nodes.find((node) => node.id === id);

    if (!tempNodeFound || tempNodeFound?.type === NodeTypesEnum.GO_TO) {
      return;
    }

    if (InvalidNodeTypes.includes(tempNodeFound.type)) {
      const edgeSource = edges.find((edge) => edge.target === tempNodeFound.id);
      getNext(edgeSource.source);
    } else {
      return tempNodeFound;
    }
  };

  getNext(nodeId);

  return tempNodeFound;
};

export const customEdgeTraceRules = (isTraceMode, traceSteps, target, nodes, edges) => {
  if (!isTraceMode) return false;

  const closestValidNode = getClosestValidNode(target, nodes, edges);
  for (const step of traceSteps) {
    if (
      closestValidNode &&
      (closestValidNode.id === step?.executedPath || closestValidNode.id === step?.id)
    ) {
      return true;
    }
  }

  return false;
};

export const labelEdgeTraceRules = (isTraceMode, traceSteps, target, source, nodes, edges) => {
  const targetNode = nodes.find((node) => node.id === target);
  const sourceNode = nodes.find((node) => node.id === source);
  if (!isTraceMode || !targetNode || !sourceNode) return false;

  const targetEdge = edges.find((edge) => edge.source === targetNode.id);
  if (!targetEdge) return false;

  for (const step of traceSteps) {
    if (
      (step.id === targetEdge.target || step?.executedPath === targetNode.id) &&
      sourceNode.id === step.id
    ) {
      return true;
    }
  }

  return false;
};

export const stepEdgeTraceRules = (isTraceMode, traceSteps, source, data, nodes, edges) => {
  const targetNode = nodes.find((node) => node.id === source);
  if (!isTraceMode || !targetNode) return false;

  const edge = edges.find((edge) => edge.target === targetNode.id);
  const closestValidNode = getClosestValidNode(source, nodes, edges);
  if (closestValidNode.type === NodeTypesEnum.GO_TO || !edge) return false;

  for (const step of traceSteps) {
    if (
      (step.id === edge.source && step.type !== NodeTypesEnum.GO_TO) ||
      edge.source === step?.executedPath ||
      data?.fromLabelNode === step?.executedPath ||
      closestValidNode.id === step?.executedPath ||
      closestValidNode.id === step?.id
    ) {
      return true;
    }
  }

  return false;
};
