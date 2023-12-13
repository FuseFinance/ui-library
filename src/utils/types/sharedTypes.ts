import { EdgeProps, Node, NodeProps } from 'reactflow';
import { Method, Roles } from './sharedEnums';
import { IProps } from '@/src/components/Modal/types';
import { EdgeTypesEnum } from '@components/Editor/EditorSteps/Common/types/edges';
import { NodeTypesEnum } from '.';

export interface INode extends Node {
  isMoving?: boolean;
  lowestY?: number;
  highestY?: number;
  isDisabled?: boolean;
  hasError?: boolean;
}

export interface INodeProps<T = any> extends NodeProps<T> {
  isDisabled?: boolean;
  hasError?: boolean;
}

export type IEdgeProps<T = any> = EdgeProps<T>;

export interface TMoveNodeArgs {
  nodeToMove: INode;
  position: {
    x: number;
    y: number;
  };
}

export interface FetchConfig {
  url: string;
  method: Method;
  body?: unknown;
}
export interface WithBorderRadius {
  borderRadius?: 'all' | 'top' | 'bottom' | 'left' | 'right';
}
export interface IModalContext {
  openModal: (_options: IProps) => void;
  closeModal: () => void;
  ModalToRender?: React.ReactNode;
  setModal: (_value: string) => void;
  modal: string;
}

export type WithChildren<T = object> = T & { children?: React.ReactNode };

export type WithEditing = {
  isEditing?: boolean;
  setIsEditing?: (_isEditing: boolean) => void;
};

export type WithUserLogged = {
  userLogged: Record<string, any>;
};
export interface IPageProps {
  versions?: any;
  featureBranches?: any;
  workflows?: any;
  variables?: any;
  environments?: any;
  selectedVersion?: any;
  selectedTest?: any;
  selectedWorkflow?: any;
  allExecutions?: any;
  currentExecution?: any;
  setSelectedWorkflow?: (_workflow: any) => void;

  role: Roles;
}

export interface IExecutorNode {
  id: string;
  type: string;
  paths: [{ id: string }];
}

interface StepResultExecution {
  msg: string;
  failed: boolean;
}

interface StepResult {
  execution: StepResultExecution;
  stepResults: Step[];
  subWorkflowsExecutions: any;
}

export type Step = {
  id: string;
  date: Date;
  name: string;
  type: NodeTypesEnum;
  inputs: any;
  output: any;
  executedPath: string;
  duration: number;
  durationPortion: number;
  context: {
    before: Record<string, any>;
    after: Record<string, any>;
  };
  result?: StepResult[];
};

type EdgeData = {
  id: string;
  source: string;
  data: {
    parent: string;
    parents: string[];
    parentNode?: string;
    splitTopLevel: string;
    loopParent?: string;
  };
  target: string;
  type: EdgeTypesEnum;
};

type NodeTuple = [INode, INode];

export type AddNewPathReturnType = [NodeTuple, EdgeData[]];
