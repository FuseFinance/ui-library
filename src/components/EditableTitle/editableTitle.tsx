import { useEffect, useRef, useState } from 'react';
import { IEditLabelProps, WithSize } from './types';
import { Input } from 'antd';
import { InputRef } from 'antd/lib/input';
import { StrongText } from '../../types/globalDesign/text';
import './editableTitle.css';


const EditableTitle = ({
  label,
  onLabelChange,
  onSpanClick,
  canEdit = true,
  customAttrInput,
  customAttrText,
  initEdit = false,
  $size = 'sm',
  strongText = 'medium',
}: IEditLabelProps & WithSize & StrongText )=> {

  // Set useState
  const [isEditing, setIsEditing] = useState(initEdit);
  const [valueInput, setInputValue] = useState(label);
  
  // Set inputRef
  const inputRef = useRef<InputRef>(null);
  const mirrorRef = useRef(null);
  const mirrorRefDefaultHeight = useRef(null);
  const containerHeight = useRef(null);

  // Set useEffect
  useEffect(() => {

    // initial recize widht
    mirrorRef.current.textContent = valueInput;

    // event recize widht
    inputRef.current.input.addEventListener('input', event => {

      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;

      mirrorRef.current.textContent = target.value;        
    });

    mirrorRef.current.style.minHeight = mirrorRefDefaultHeight.current.offsetHeight + "px"

  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Set handle
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

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        handleSpanClick();
    }
  }

  // Set style
  // text class

  const resizeContainerClass = [
    "editable-title",
    "resize-container",
    isEditing && canEdit ? "active" : "",
    isEditing && canEdit ? "pl-1 pr-1" : ""        
  ]
  
  // text class
  const textClass = [
    // main class
    "resize-text",
    // style tailwind
    "text-blue-900",
    "border",
    "border-transparent",
    "rounded", 
    "text-" + $size,
    "font-" + strongText,
  ]
  
  // text style with conditional
  const textStyle = isEditing && canEdit ? {color: "transparent"} : {}

  // input class
  const inputClass = [
    // main class
    "resize-input",
    // style tailwind
    "text-blue-900",
    "pt-0",
    "pb-0",
    "pr-1",
    "pl-1", 
    "text-" + $size,
    "font-" + strongText,
    // conditional style
    !isEditing || !canEdit ? "hidden" : "inline"
  ]


  return (
    <>
    <div ref={containerHeight} className={resizeContainerClass.join(" ")}>
      <span role="button" onClick={handleSpanClick} onKeyDown={handleKeyPress} tabIndex={0} ref={mirrorRef} style={textStyle} className={textClass.join(" ")} {...customAttrText}></span>
      <span className={textClass.join(" ")} ref={mirrorRefDefaultHeight} style={{visibility: "hidden", position: "absolute"}}>A</span>          
      <Input
        value={valueInput}
        onInput={handleInputChange}
        onBlur={handleInputBlur}
        onPressEnter={handlePressEnter}
        classNames={{"input": inputClass.join(" ")}}
        ref={inputRef}
        {...customAttrInput}
      />        
    </div>
    </>
  );
};

export default EditableTitle;