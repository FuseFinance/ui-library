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
      <Icon icon={icon} />

      <EditableText canEdit={true} label={label} onLabelChange={onLabelChange} />
      
    </div>
  );
};

export default StepModalHead;
