/* eslint-disable no-unused-vars */
export enum IconList {
  Edit = 'Edit',
  Fx = 'Fx',
  Branch = 'Branch',
  Cross = 'Cross',
  Plus = 'Plus',
  PlusFill = 'PlusFill',
  Copy = 'Copy',
  Drag = 'Drag',
  Resize = 'Resize',
  Help = 'Help',
  ChevronDown = 'ChevronDown',
  ChevronLeft = 'ChevronLeft',
  ChevronRight = 'ChevronRight',
  Menu = 'Menu',
  Input = 'Input',
  Stop = 'Stop',
  GitBranch = 'GitBranch',
  Groups = 'Groups',
  Group = 'Group',
  Plug = 'Plug',
  TableEdit = 'TableEdit',
  Merge = 'Merge',
  If = 'If',
  Trash = 'Trash',
  Drag2 = 'Drag2',
  Play = 'Play',
  SuccessState = 'SuccessState',
  Check = 'Check',
  Workflow = 'Workflow',
  Queues = 'Queues',
  Avatar = 'Avatar',
  More = 'More',
  File = 'File',
  Config = 'Config',
  Undo = 'Undo',
  Redo = 'Redo',
  RightArrow = 'RightArrow',
  LeftArrow = 'LeftArrow',
  ChevronUp = 'ChevronUp',
  CheckCircle = 'CheckCircle',
  AlertCircle = 'AlertCircle',
  AlertTriangle = 'AlertTriangle',
  Clock = 'Clock',
  Logout = 'Logout',
  Calendar = 'Calendar',
  ArrowLeft = 'ArrowLeft',
  Link = 'Link',
  PlusCircle = 'PlusCircle',
  PlayCircle = 'PlayCircle',
  Code = 'Code',
  Converter = 'Converter',
  ArrowRight = 'ArrowRight',
  Jsonata = 'Jsonata',
  DBQuery = 'DBQuery',
  StatusChange = 'StatusChange',
  AsyncResponse = 'AsyncResponse',
  Data = 'Data',
  Bell = 'Bell',
  Loop = 'Loop',
  Aws = 'Aws',
  Upload = 'Upload',
  MenuVertiacal = 'MenuVertiacal',
  UpArrow = 'UpArrow',
  DownArrow = 'DownArrow',
  LeftInsertArrow = 'LeftInsertArrow',
  RightInsertArrow = 'RightInsertArrow' 
}

export interface IProps {
  icon: IconList;
  width?: string;
  className?: string;
  height?: string;
  fill?: string;
  cursor?: string;
  onClick?: () => void;
  testId?: string;
  hoverFill?: string;
} 
