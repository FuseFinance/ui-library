import { useEffect, useRef, useState } from 'react';
import { IEditLabelProps, WithSize } from './types';
import { InputEditable, InputEditableContainer, Label } from './styles';
import Icon from '../Icons';
import { IconList } from '../Icons/types';
import colors from '@/src/styles/colors';
import { EditableTextIds } from '@constants/appIDS';

const EditableText = ({
  label,
  onLabelChange,
  canEdit,
  $size = 'sm',
}: IEditLabelProps & WithSize) => {
  const [labelText, setLabelText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const inputRef: React.RefObject<HTMLInputElement> | null = useRef(null);

  const onChange = (value: string) => {
    setLabelText(value);
  };

  const handleSaveChanges = () => {
    if (inputRef && inputRef.current) {
      onLabelChange(inputRef.current?.value);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    setLabelText(label);
  }, [label]);

  return (
    <InputEditableContainer>
      {!isEditing ? (
        <Label data-cy={EditableTextIds.label} $size={$size}>
          {labelText}
        </Label>
      ) : (
        <InputEditable
          data-cy={EditableTextIds.input}
          $size={$size}
          ref={inputRef}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleSaveChanges}
          onKeyDown={(ev) => {
            if (ev.key === 'Enter') {
              handleSaveChanges();
            }
          }}
          value={labelText}
          style={{ background: 'none' }}
        />
      )}

      {!isEditing && canEdit && (
        <button
          className="ml-2 cursor-pointer"
          data-cy={EditableTextIds.editButton}
          onClick={() => {
            setIsEditing(!isEditing);

            setTimeout(() => {
              if (inputRef && inputRef.current) {
                inputRef.current.focus();
              }
            }, 100);
          }}
        >
          <Icon
            icon={IconList.Edit}
            width="1rem"
            height="1rem"
            cursor="pointer"
            fill={colors.fuseGray2}
          />
        </button>
      )}
    </InputEditableContainer>
  );
};

export default EditableText;
