import React from 'react';
import Icon from '@/src/components/Icons';
import { IconList } from '@/src/components/Icons/types';
import EditableTitle from '@/src/components/EditableTitle/editableTitle';


const StepModalHead: React.FC<StepModalHeadProps> = ({
    onLabelChange,
    icon = IconList.Plug,
    label = ""
}) => {
  return (
    <div className="flex items-center gap-x-3">
      <Icon fill='#0A38C2' icon={icon} />

      <EditableTitle $size='base' strongText='semibold' canEdit={true} label={label} onLabelChange={onLabelChange} />
      
    </div>
  );
};

interface StepModalHeadProps {
  onLabelChange: (_newLabel: string) => void,
  icon : IconList,
  label : string
}


export default StepModalHead;
