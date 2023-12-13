import React from 'react';
import Icon from '@/src/components/Icons';
import { IconList } from '@/src/components/Icons/types';
import EditableText from '@components/EditableText/editableText';

const StepModalHead = ({
    onLabelChange,
    icon = IconList.Plug,
    label = ""
}) => {
  return (
    <div className="flex items-center gap-x-3">
      <Icon fill='#0A38C2' icon={icon} />

      <EditableText $size='base' strongText='semibold' canEdit={true} label={label} onLabelChange={onLabelChange} />
      
    </div>
  );
};

export default StepModalHead;
