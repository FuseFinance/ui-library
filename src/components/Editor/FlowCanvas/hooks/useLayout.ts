import { minBy, maxBy } from 'lodash';
import { Edge, useReactFlow } from 'reactflow';
import { useCallback } from 'react';
import { INode } from 'src/utils/types/sharedTypes';
import { NodeTypesEnum } from '@/src/components/Editor/EditorSteps/Common/types';
import ELK, { ElkNode } from 'elkjs/lib/elk.bundled.js';
import { getBlockHeight, getBlockWidth } from '@/src/constants/workflowEditor';
import { EdgeTypesEnum } from '../../EditorSteps/Common/types/edges';
const getSiblingNodes = (node: INode, nodes: INode[], type) => {
  return nodes.filter((n) => n.data.parent === node.data.parent && n.type === type);
};

const adjustSplithPathLabelNodes = (node: INode, nodes: INode[] & ElkNode[]) => {
  const siblingNodes = getSiblingNodes(node, nodes, NodeTypesEnum.LABEL_NODE);
  const highestNode = minBy(siblingNodes, (n: INode & ElkNode) => n.y);
  return highestNode.y;
};

const adjustSplithPathCornerNodes = (node: INode, nodes: INode[] & ElkNode[]) => {
  const siblingNodes = getSiblingNodes(node, nodes, NodeTypesEnum.CORNER_NODE);
  const lowestNode = maxBy(siblingNodes, (n: INode & ElkNode) => n.y + n.height);
  return lowestNode.y;
};

const getElkLayoutedElements = (nodes: INode[], edges: Edge[]) => {
  const elk = new ELK();
  const nodesForElk = nodes.map((node) => {
    const isGroupOrSplitNode =
      node.type === NodeTypesEnum.GROUP_NODE || node.type === NodeTypesEnum.SPLIT_PATH_NODE;

    const nodeModified = {
      id: node.id,
      width:
        isGroupOrSplitNode && node.width ? node.width : getBlockWidth(node.type as NodeTypesEnum),
      height:
        node.type === NodeTypesEnum.GROUP_NODE && node.height > 160
          ? node.height
          : getBlockHeight(node.type as NodeTypesEnum),
      style: {
        width:
          isGroupOrSplitNode && node.width ? node.width : getBlockWidth(node.type as NodeTypesEnum),
        height:
          node.type === NodeTypesEnum.GROUP_NODE && node.height > 160
            ? node.height
            : getBlockHeight(node.type as NodeTypesEnum),
      },
    };
    return nodeModified;
  });
  const edgesForElk = edges.map((edge) => ({
    id: edge.id,
    sources: [edge.source],
    targets: [edge.target],
  }));

  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'DOWN',
      'elk.layered.spacing.nodeNodeBetweenLayers': '40',
      'elk.spacing.nodeNode': '40',
      'elk.edgeRouting': 'SPLINES',
      'elk.nodeSize': 'NODE_SIZE_FIXED',
      'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',
    },
    children: nodesForElk,
    edges: edgesForElk,
  };

  return elk.layout(graph);
};

// Function to calculate the layout for each group's children
const calcElkForGroupChildren = async (
  calcNodes: INode[],
  calcEdges: Edge[],
  group: INode & ElkNode,
) => {
  const elk = await getElkLayoutedElements(calcNodes, calcEdges);
  const groupWidth = 600;

  const layoutedNodes = calcNodes.map((node, index) => {
    const layoutNode = elk.children[index];

    const xValue = layoutNode.x - elk.children[0].x + groupWidth / 2 - node.width / 2;

    const position = {
      x: xValue,
      y: layoutNode.y,
    };

    return {
      ...node,
      width: node.width || layoutNode.width,
      height: node.height || layoutNode.height,
      hidden: !group?.data?.isExpanded,
      position,
    };
  });

  const layoutEdges = calcEdges.map((edge) => {
    return {
      ...edge,
      hidden: !group?.data?.isExpanded,
    };
  });

  return [layoutedNodes, layoutEdges];
};
const calcElkForGroupChildrenSecondPass = async (
  calcNodes: INode[],
  calcEdges: Edge[],
  group: INode & ElkNode,
) => {
  const elk = await getElkLayoutedElements(calcNodes, calcEdges);
  const mergedNodes = calcNodes.map((node: INode, index: number) => {
    const layoutNode = elk.children[index];
    const xValue = layoutNode.x - elk.children[0].x + group.width / 2 - node.width / 2;

    const position = {
      x: xValue,
      y: layoutNode.y,
    };

    if (node.type === NodeTypesEnum.LABEL_NODE) {
      position.x = layoutNode.x - elk.children[0].x + group.width / 2 - 360 / 2;
    }

    if (node.type === NodeTypesEnum.CORNER_NODE) {
      position.x = layoutNode.x - elk.children[0].x + group.width / 2 - 360 / 2;
    }

    if (node.type === NodeTypesEnum.GROUP_START) {
      position.y = 3;
    }
    return {
      ...node,
      ...layoutNode,
      width: node.width || layoutNode.width,
      height: node.height || layoutNode.height,
      position,
    };
  });

  const layoutedNodes = mergedNodes.map((node, index) => {
    const layoutNode = elk.children[index];

    const position = node.position;

    if (node.type === NodeTypesEnum.LABEL_NODE) {
      position.y = adjustSplithPathLabelNodes(node, mergedNodes);
    }
    if (node.type === NodeTypesEnum.CORNER_NODE) {
      position.y = adjustSplithPathCornerNodes(node, mergedNodes);
    }

    return {
      ...node,
      width: node.width || layoutNode.width,
      height: node.height || layoutNode.height,
      position,
    };
  });

  return [layoutedNodes, calcEdges];
};

// Final function to set positions and group node dimensions
const calcElkForMainFlow = async (
  calcNodes: INode[],
  calcEdges: Edge[],
  groupChildrenNodes: INode[] & ElkNode[],
) => {
  const elk = await getElkLayoutedElements(calcNodes, calcEdges);
  const layoutNodeMap = new Map();
  elk.children?.forEach((child) => layoutNodeMap.set(child.id, child));

  const groupChildrenNodesMap = new Map();
  groupChildrenNodes.forEach((child) => {
    if (!groupChildrenNodesMap.has(child.parentNode)) {
      groupChildrenNodesMap.set(child.parentNode, []);
    }
    groupChildrenNodesMap.get(child.parentNode).push(child);
  });

  const layoutedNodes = calcNodes.map((node) => {
    const layoutNode = layoutNodeMap.get(node.id);

    const editNode: INode & ElkNode = node;

    const position = {
      x: layoutNode.x - elk.children[0].x,
      y: layoutNode.y,
    };

    if (node.type === NodeTypesEnum.GROUP_NODE) {
      if (node.data.isExpanded) {
        const childNodesByCurrentGroup = groupChildrenNodesMap.get(node.id);
        const groupHight = 160;
        let minXPosition = Infinity;
        let maxXPosition = -Infinity;
        let groupStartNodePositionY = -Infinity;
        let groupEndNodePositionY = -Infinity;
        childNodesByCurrentGroup.forEach((childNode) => {
          minXPosition = Math.min(minXPosition, childNode.position.x);
          maxXPosition = Math.max(maxXPosition, childNode.position.x + childNode.width);
          if (childNode.type === NodeTypesEnum.GROUP_END) {
            groupEndNodePositionY = childNode.position.y;
          }
          if (childNode.type === NodeTypesEnum.GROUP_START) {
            groupStartNodePositionY = childNode.position.y;
          }
        });
        if (groupEndNodePositionY - groupStartNodePositionY > groupHight) {
          editNode.height = groupEndNodePositionY - groupStartNodePositionY + 40;
          editNode.style.height = groupEndNodePositionY - groupStartNodePositionY + 40;
        } else {
          editNode.height = groupHight;
          editNode.style.height = groupHight;
        }

        if (minXPosition !== Infinity && maxXPosition !== -Infinity) {
          const currentNodeWidth = maxXPosition - minXPosition;
          const padding = currentNodeWidth > 600 ? 40 : 0;
          editNode.width = currentNodeWidth < 600 ? 600 : currentNodeWidth + padding;
          editNode.style.width = currentNodeWidth < 600 ? 600 : currentNodeWidth + padding;
        }

        editNode.height = groupEndNodePositionY;
        editNode.style.height = groupEndNodePositionY;

        editNode.style.zIndex = -1;
      } else {
        editNode.width = 360;
        editNode.style.width = 360;
        editNode.height = 70;
        editNode.style.height = 70;
        editNode.style.zIndex = 1;
      }
    }

    if (node.type === NodeTypesEnum.LABEL_NODE) {
      position.y = node.highestY || position.y;
    }

    if (node.type === NodeTypesEnum.CORNER_NODE) {
      position.y = node.lowestY || position.y;
    }
    editNode.x = position.x;
    editNode.y = position.y;

    return editNode;
  });
  return layoutedNodes;
};

// Initial function to get base positions for all nodes
const calcBaseElk = async (
  calcNodes: INode[],
  calcEdges: Edge[],
  isSecondPass = false,
): Promise<INode[] & ElkNode[]> => {
  const elk = await getElkLayoutedElements(calcNodes, calcEdges);
  const mergedNodes = calcNodes.map((node: INode, index: number) => ({
    ...node,
    ...elk.children[index],
  }));

  const layoutedNodes = calcNodes.map((node: INode, index: number) => {
    const layoutNode = elk.children[index];

    const editNode: INode & ElkNode = node;
    const position = {
      x: layoutNode.x,
      y: layoutNode.y,
    };

    if (node.type === NodeTypesEnum.LABEL_NODE && isSecondPass) {
      position.y = adjustSplithPathLabelNodes(node, mergedNodes);
    }

    if (node.type === NodeTypesEnum.CORNER_NODE && isSecondPass) {
      position.y = adjustSplithPathCornerNodes(node, mergedNodes);
    }
    editNode.x = position.x;
    editNode.y = position.y;
    editNode.width = layoutNode.width || node.width;
    editNode.height = layoutNode.height || node.height;
    editNode.position = position;
    editNode.style = {
      ...(node.style || {}),
      width: layoutNode.width || node.width,
      height: layoutNode.height || node.height,
    };

    return editNode;
  });
  return layoutedNodes;
};

async function calcElkForGroups(groupNodes, edges, childGroupNodes, isSecondPass = false) {
  const results = await Promise.all(
    groupNodes.map(async (node) => {
      const childNodes = childGroupNodes
        .filter((nodeFromList) => nodeFromList.parentNode === node.id)
        .sort((a, b) => {
          if (a.type === NodeTypesEnum.GROUP_START) return -1;
          if (b.type === NodeTypesEnum.GROUP_START) return 1;
          if (a.type === NodeTypesEnum.GROUP_END) return 1;
          if (b.type === NodeTypesEnum.GROUP_END) return -1;
          return 0;
        });
      const childNodesIds = new Set(childNodes.map((nodeFromList) => nodeFromList.id));
      const edgesForChildNodes = edges.filter(
        (edgeFromList) =>
          childNodesIds.has(edgeFromList.source) || childNodesIds.has(edgeFromList.target),
      );
      return isSecondPass
        ? calcElkForGroupChildrenSecondPass(childNodes, edgesForChildNodes, node)
        : calcElkForGroupChildren(childNodes, edgesForChildNodes, node);
    }),
  );

  // Extract nodes and edges from results and flatten them
  const nodes = results.map((result) => result[0]).flat();
  const edgesArr = results.map((result) => result[1]).flat();

  return [nodes, edgesArr];
}

export const useLayout = () => {
  const { setEdges, setNodes } = useReactFlow();

  // Main function that controls the flow of the layout calculation
  const calcTree = useCallback(
    async (calcNodes: INode[], calcEdges: Edge[]) => {
      // Do a first pass of the layout to get base positions for all nodes
      const elkFirstPass = await calcBaseElk(calcNodes, calcEdges);

      const nodesWithoutChildGroupNodes = [];
      const childGroupNodes = [];
      const childGroupNodesIds = new Set();

      // Split nodes into two groups: nodes that are children of groups and nodes that are not
      elkFirstPass.forEach((node) => {
        if (node.parentNode) {
          childGroupNodes.push(node);
          childGroupNodesIds.add(node.id);
        } else {
          nodesWithoutChildGroupNodes.push(node);
        }
      });

      const allEdgesForNonChildGroups = calcEdges.filter(
        (edgeFromList) =>
          !childGroupNodesIds.has(edgeFromList.source) &&
          !childGroupNodesIds.has(edgeFromList.target),
      );

      let groupNodes = nodesWithoutChildGroupNodes.filter(
        (node) => node.type === NodeTypesEnum.GROUP_NODE,
      );

      // Calculate the first pass of the layout for all group's children
      const [firstPassGroupNodes, firstPassGroupEdges] = await calcElkForGroups(
        groupNodes,
        calcEdges,
        childGroupNodes,
      );
      let groupNodesLayoutFlat = firstPassGroupNodes;

      // Calculate the height and width of the group nodes
      const baseNodesLayout = await calcElkForMainFlow(
        nodesWithoutChildGroupNodes,
        allEdgesForNonChildGroups,
        groupNodesLayoutFlat,
      );

      // With the appropriate dimensions of the group nodes, recalculate the layout for the main flow (non groups)
      const elkFinalPass = await calcBaseElk(baseNodesLayout, allEdgesForNonChildGroups, true);

      groupNodes = elkFinalPass.filter((node) => node.type === NodeTypesEnum.GROUP_NODE);

      // Calculate the second pass of the layout for all group's children with the parent group's width
      const [secondPassGroupNodes] = await calcElkForGroups(
        groupNodes,
        calcEdges,
        groupNodesLayoutFlat,
        true,
      );
      groupNodesLayoutFlat = secondPassGroupNodes;

      const allNodesLayout = [...elkFinalPass, ...groupNodesLayoutFlat];
      // Add labels to LabelEdges
      const newCalcEdges = calcEdges.map((edge) => {
        const groupEdge = firstPassGroupEdges.find(
          (groupEdgeFromList) => groupEdgeFromList.id === edge.id,
        );
        if (edge.type === EdgeTypesEnum.LABEL) {
          const targetNode = allNodesLayout.find((node) => node.id === edge.target);
          if (targetNode) {
            return {
              ...edge,
              data: { ...edge?.data, label: targetNode?.data?.label || 'Branch' },
              hidden: groupEdge?.hidden,
            };
          }
        }
        return { ...edge, hidden: groupEdge?.hidden };
      });
      setNodes(allNodesLayout);
      setEdges(newCalcEdges);

      return allNodesLayout;
    },
    [setEdges, setNodes],
  );

  const calcLayout = useCallback(
    async (calcNodes: INode[], calcEdges: Edge[]): Promise<INode[] & ElkNode[]> => {
      const layoutNodesFirstPass = await calcTree(calcNodes, calcEdges);
      return layoutNodesFirstPass;
    },
    [calcTree],
  );
  return calcLayout;
};
