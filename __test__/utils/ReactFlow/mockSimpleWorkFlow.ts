export const mockSimpleWorkFlow = (nodesQuantity: number = 1) => {
  const mockNodes = [
    {
      id: 'start',
      type: 'defaultNode',
      data: {
        title: 'Start',
        icon: 'PlayCircle',
        executorType: 'START',
      },
      position: {
        x: 12,
        y: 12,
      },
      draggable: false,
      x: 12,
      y: 12,
    },
  ];

  const mockEdges = [];

  [...Array(nodesQuantity).keys()].forEach((qty, index) => {
    const newNode = {
      id: `${index}`,
      data: {
        title: 'Formula',
        description: 'This is a short description of this block.',
        icon: 'Fx',
        executorType: 'FORMULA',
        formulaText: 'test = false;',
        subTitle: 'This is a short description of this block.',
      },
      type: 'FORMULA',
      position: {
        x: 12,
        y: 92,
      },
      draggable: false,
      x: 12,
      y: 92,
      width: 360,
      height: 70,
      style: {
        width: 360,
        height: 70,
      },
      selected: false,
    };

    const newEdge = {
      id: `${mockNodes[index].id}-${index}`,
      source: `${mockNodes[index].id}`,
      data: {},
      target: `${index}`,
      type: 'addButtonEdge',
      markerEnd: {
        type: 'arrowclosed',
        width: 15,
        height: 15,
      },
    };

    mockNodes.push(newNode);
    mockEdges.push(newEdge);
  });

  mockNodes.push({
    id: 'end',
    type: 'defaultNode',
    data: {
      title: 'End',
      icon: 'Stop',
      executorType: 'FINISH',
    },
    position: {
      x: 12,
      y: 202,
    },
    draggable: false,
    x: 12,
    y: 202,
  });

  mockEdges.push({
    id: `${mockNodes[nodesQuantity].id}-end`,
    source: `${mockNodes[nodesQuantity].id}`,
    data: {},
    target: 'end',
    type: 'addButtonEdge',
    markerEnd: {
      type: 'arrowclosed',
      width: 15,
      height: 15,
    },
  });

  return [mockNodes, mockEdges];
};
