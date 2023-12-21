import { ReactComponent as Avatar } from './Avatar.svg';
import { ReactComponent as Branch } from './Branch.svg';
import { ReactComponent as ChevronDown } from './Chevron-down.svg';
import { ReactComponent as ChevronUp } from './Chevron-up.svg';
import { ReactComponent as ChevronLeft } from './Chevron-left.svg';
import { ReactComponent as ChevronRight } from './Chevron-right.svg';
import { ReactComponent as Config } from './Config.svg';
import { ReactComponent as Copy } from './Copy.svg';
import { ReactComponent as Cross } from './Cross.svg';
import { ReactComponent as Drag } from './Drag.svg';
import { ReactComponent as Drag2 } from './Drag2.svg';
import { ReactComponent as Edit } from './Edit.svg';
import { ReactComponent as File } from './File.svg';
import { ReactComponent as Fx } from './Fx.svg';
import { ReactComponent as GitBranch } from './GitBranch.svg';
import { ReactComponent as Groups } from './Groups.svg';
import { ReactComponent as Help } from './Help.svg';
import { ReactComponent as If } from './If.svg';
import { ReactComponent as Input } from './Input.svg';
import { ReactComponent as Menu } from './Menu.svg';
import { ReactComponent as Merge } from './Merge.svg';
import { ReactComponent as More } from './More.svg';
import { ReactComponent as Play } from './Play.svg';
import { ReactComponent as Plug } from './Plug.svg';
import { ReactComponent as Plus } from './Plus.svg';
import { ReactComponent as PlusFill } from './PlusFill.svg';
import { ReactComponent as Queues } from './Queues.svg';
import { ReactComponent as Redo } from './Redo.svg';
import { ReactComponent as RightArrow } from './RightArrow.svg';
import { ReactComponent as LeftArrow } from './LeftArrow.svg';
import { ReactComponent as Resize } from './Resize.svg';
import { ReactComponent as Stop } from './Stop.svg';
import { ReactComponent as SuccessState } from './SuccessState.svg';
import { ReactComponent as TableEdit } from './TableEdit.svg';
import { ReactComponent as Trash } from './Trash.svg';
import { ReactComponent as Undo } from './Undo.svg';
import { ReactComponent as Workflow } from './Workflow.svg';
import { ReactComponent as Check } from './check.svg';
import { ReactComponent as CheckCircle } from './CheckCircle.svg';
import { ReactComponent as AlertCircle } from './AlertCircle.svg';
import { ReactComponent as AlertTriangle } from './AlertTriangle.svg';
import { ReactComponent as Clock } from './Clock.svg';
import { ReactComponent as Logout } from './Logout.svg';
import { ReactComponent as Calendar } from './Calendar.svg';
import { ReactComponent as ArrowLeft } from './ArrowLeft.svg';
import { ReactComponent as Link } from './Link.svg';
import { ReactComponent as PlusCircle } from './PlusCircle.svg';
import { ReactComponent as PlayCircle } from './PlayCircle.svg';
import { ReactComponent as Group } from './Group.svg';
import { ReactComponent as Code } from './Code.svg';
import { ReactComponent as Converter } from './Converter.svg';
import { ReactComponent as ArrowRight } from './ArrowRight.svg';
import { ReactComponent as Jsonata } from './Jsonata.svg';
import { ReactComponent as DBQuery } from './DBQuery.svg';
import { ReactComponent as StatusChange } from './StatusChange.svg';
import { ReactComponent as AsyncResponse } from './AsyncResponse.svg';
import { ReactComponent as Data } from './Data.svg';
import { ReactComponent as Bell } from './Bell.svg';
import { ReactComponent as Loop } from './Loop.svg';
import { ReactComponent as Aws } from './Aws.svg';
import { ReactComponent as Upload } from './Upload.svg';

import { IProps } from './types';
import { useState } from 'react';

const icons = {
  Edit,
  Fx,
  Branch,
  Cross,
  Plus,
  Copy,
  Drag,
  Resize,
  Help,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  PlusFill,
  Menu,
  Input,
  Stop,
  GitBranch,
  Groups,
  Plug,
  TableEdit,
  Merge,
  If,
  Trash,
  Drag2,
  Play,
  SuccessState,
  Check,
  Workflow,
  Queues,
  Avatar,
  More,
  File,
  Config,
  Undo,
  Redo,
  RightArrow,
  LeftArrow,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Clock,
  Logout,
  Calendar,
  ArrowLeft,
  Link,
  PlusCircle,
  PlayCircle,
  Group,
  Code,
  Converter,
  Bell,
  ArrowRight,
  Jsonata,
  DBQuery,
  StatusChange,
  AsyncResponse,
  Data,
  Loop,
  Aws,
  Upload,
};

const Icon = ({
  icon,
  width = '20',
  height = '20',
  fill = 'currentColor',
  hoverFill,
  onClick,
  cursor = 'default',
  className,
  testId = `Icon-${icon}`,
}: IProps) => {
  const IconSVG = icons[icon];
  
  const [isHover, setHover] = useState(false);


  const handleClick = () => {
    onClick && onClick();
  };
  const handleMouseEnter = function() {
    setHover(true)
  } 
  const handleMouseLeave = function() {
    setHover(false)
  } 

  var classSpan = hoverFill ? "inline-block rounded p-0.8 " : ""; 
  classSpan += isHover && hoverFill ? "blog bg-gray-100" : ""; 

  var colorFill = isHover && hoverFill ? hoverFill : fill;

  return (
    <span className={classSpan} data-cy={testId} onClick={handleClick} role="button" tabIndex={0} aria-hidden="true">
      <IconSVG onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={className} style={{ cursor }} width={width} height={height} fill={colorFill} />
    </span>
  );
};

export default Icon;
