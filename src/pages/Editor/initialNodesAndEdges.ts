import { v4 as uuidv4 } from 'uuid';
import { EdgeTypesEnum, NodeTypesEnum } from '@/src/components/Editor/EditorSteps/Common/types';
import { IconList } from 'src/components/Icons/types';

const position = { x: 0, y: 0 };

export const initialNodes = [
  {
    id: uuidv4(),
    type: NodeTypesEnum.DEFAULT_NODE,
    data: {
      title: 'Start',
      icon: IconList.PlayCircle,
      dimension: { width: 128, height: 48 },
      executorType: 'START',
    },
    position,
    draggable: false,
  },
  {
    id: uuidv4(),
    type: NodeTypesEnum.DEFAULT_NODE,
    data: {
      title: 'End',
      icon: IconList.Stop,
      dimension: { width: 128, height: 48 },
      executorType: 'FINISH',
    },
    position,
    draggable: false,
  },
];

export const initialEdges = [
  {
    id: `${initialNodes[0].id}-${initialNodes[1].id}`,
    source: initialNodes[0].id,
    target: initialNodes[1].id,
    type: EdgeTypesEnum.ADD_BUTTON,
  },
];
