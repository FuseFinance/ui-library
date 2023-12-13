import { useEffect, useRef, useState } from 'react';
import { IEditLabelProps, WithSize } from './types';
import { InputEditable, InputEditableContainer, Label } from './styles';
import colors from '@/src/styles/colors';
import { EditableTextIds } from '@constants/appIDS';
import { Input } from 'antd';
import { InputRef } from 'antd/lib/input';
import { StrongText } from '@/src/types/globalDesign/text';

const EditableText = ({
  label,
  onLabelChange,
  onSpanClick,
  canEdit,
  initEdit = false,
  $size = 'sm',
  strongText = 'medium'
}: IEditLabelProps & WithSize & StrongText) => {
  /* set useState */
  const [isEditing, setIsEditing] = useState(initEdit);
  const [inputValue, setInputValue] = useState(label);
  
  /* set inputRef */
  const inputRef = useRef<InputRef>(null);
  const mirrorRef = useRef(null);

  /* set useEffect */
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);


  useEffect(() => {

    if (inputRef.current && mirrorRef.current) {

      const mirrorWidth = mirrorRef.current.offsetWidth;
      inputRef.current.input.style.width = `${(mirrorWidth) + 20}px`;

    }

  }, [inputValue]);

  /* set handle */
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSpanClick = () => {
    setIsEditing(true);
    if(onSpanClick){
      onSpanClick();
    }
    
  };

  const handleInputBlur = (event) => {
    setIsEditing(false);
    onLabelChange(event.target.value);
  };

  const handlePressEnter = (event) => {
    setIsEditing(false);
    onLabelChange(event.target.value);
  };

  
  /* set style */
  var textClass = 'hover:p-1 hover:border-gray-200 hover:border hover:rounded border-transparent border-t-transparent border-b-transparent border-t border-b inline-block text-blue-900 pt-1 pb-1 text-' + $size + ' font-' + strongText;

  var styleClass: Record<string, any> = { cursor: 'pointer'}

  styleClass = isEditing && canEdit ? {...styleClass, visibility: 'hidden', position: 'absolute', whiteSpace: 'pre'} : styleClass

  var inputClass = 'text-blue-900 p-1 text-' + $size + ' font-' + strongText;

  inputClass += !isEditing || !canEdit ? ' hidden' : ""

  return (
    <>
      <Input
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onPressEnter={handlePressEnter}
        classNames={{"input": inputClass}}
        ref={inputRef}
      />
      <span  ref={mirrorRef} className={textClass}  onClick={handleSpanClick} style={{...styleClass}}>
        {inputValue}
      </span>
    </>
  );
};

export default EditableText;