import { NodeTypesEnum } from '@/src/components/Editor/EditorSteps/Common/types';
import { IconList } from '@/src/components/Icons/types';
import { ModalType } from '@/src/components/Modal/types';

export const TRANSFORMS_BLOCKS: {
  icon: IconList;
  title: string;
  type: ModalType;
  action?: (_item: any) => void;
  testId?: string;
}[] = [
  {
    icon: IconList.Fx,
    title: 'Formula',
    type: ModalType.FORMULA,
  },
  {
    icon: IconList.GitBranch,
    title: 'If Condition',
    type: ModalType.IF_THEN,
  },
  {
    icon: IconList.TableEdit,
    title: 'Condition Table',
    type: ModalType.CONDITION_TABLE,
  },
  {
    icon: IconList.StatusChange,
    title: 'Application Status Change',
    type: ModalType.APP_STATUS_CHANGE,
  },
];

export const ACTIONS_BLOCKS = [
  {
    icon: IconList.Branch,
    title: 'Split Path',
    type: ModalType.SPLIT_PATH,
  },
  {
    icon: IconList.Merge,
    title: 'Go To Block',
    type: ModalType.GO_TO_ACTION,
  },
];

export const DEFAULT_BLOCKS = [
  {
    icon: IconList.Input,
    title: 'Start',
    type: 'START',
  },
  {
    icon: IconList.Stop,
    title: 'Finish',
    type: 'FINISH',
  },
];

export const ADVANCED_BLOCKS = [
  {
    icon: IconList.Plug,
    title: 'Api Call',
    type: ModalType.API_CALL,
  },
  {
    icon: IconList.Code,
    title: 'Custom Code',
    type: ModalType.CUSTOM_CODE,
  },
  {
    icon: IconList.Workflow,
    title: 'Subworkflow',
    type: ModalType.SUB_WORKFLOW,
  },
  {
    icon: IconList.Converter,
    title: 'Converter',
    type: ModalType.CONVERTER,
  },
  {
    icon: IconList.Jsonata,
    title: 'Jsonata',
    type: ModalType.JSONATA,
  },
  {
    icon: IconList.DBQuery,
    title: 'DB Query',
    type: ModalType.DB_QUERY,
  },
  {
    icon: IconList.AsyncResponse,
    title: 'Async Response',
    type: ModalType.ASYNC_RESPONSE,
  },
  {
    icon: IconList.Bell,
    title: 'Alert',
    type: ModalType.ALERT,
  },
  {
    icon: IconList.Loop,
    title: 'Loop',
    type: ModalType.LOOP,
  },
  {
    icon: IconList.DBQuery,
    title: 'DB Connection',
    type: ModalType.DB_CONNECTION,
  },
  {
    icon: IconList.Aws,
    title: 'S3 Upload',
    type: ModalType.S3_UPLOAD,
  },
  {
    icon: IconList.Upload,
    title: 'SFTP Upload',
    type: ModalType.SFTP_UPLOAD,
  },
];

export const getAvailableTransformBlocks = (removeList: ModalType[]) => {
  return TRANSFORMS_BLOCKS.filter((block) => !removeList.includes(block.type));
};

export const getAvailableActionBlocks = (removeList: ModalType[]) => {
  return ACTIONS_BLOCKS.filter((block) => !removeList.includes(block.type));
};

export const getAvailableAdanceBlocks = (removeList: ModalType[]) => {
  return ADVANCED_BLOCKS.filter((block) => !removeList.includes(block.type));
};

export const ALL_BLOCK_TYPES = [
  ...DEFAULT_BLOCKS,
  ...TRANSFORMS_BLOCKS,
  ...ACTIONS_BLOCKS,
  ...ADVANCED_BLOCKS,
  {
    icon: IconList.GitBranch,
    title: 'If Condition',
    type: 'CONDITION',
  },
  {
    icon: IconList.Group,
    title: 'Group Start',
    type: NodeTypesEnum.GROUP_START,
  },
];
