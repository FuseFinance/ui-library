import { useEffect, useRef, useState } from 'react';
import { IEditLabelProps, WithSize } from './types';
import { Input } from 'antd';
import { InputRef } from 'antd/lib/input';
import { StrongText } from '@/src/types/globalDesign/text';
import './editableText.css';


const EditableText = ({
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
    inputRef.current.input.style.height = (mirrorRefDefaultHeight.current.clientHeight + 2) + "px" 


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

  // Set style
  // text class
  var textClass = [
    // main class
    "resize-text",
    // style tailwind
    "border",
    "border-transparent",
    "inline-block",
    "text-blue-900",
    "pt-1",
    "pb-1",
    "text-" + $size,
    "font-" + strongText,
    // hover tailwind 
    "hover:pt-1",
    "hover:pb-1",
    "hover:pr-2",
    "hover:pl-2",      
    "hover:rounded",
    !isEditing || !canEdit ? "hover:border-gray-200" : "",
    isEditing && canEdit ? "pl-2 pr-2" : ""      
  ]
  
  // text style with conditional
  var textStyle = isEditing && canEdit ? {color: "transparent"} : {}


  // input class
  var inputClass = [
    // main class
    "resize-input",
    // style tailwind
    "text-blue-900",
    "pt-1",
    "pb-1",
    "pr-2",
    "pl-2", 
    "text-" + $size,
    "font-" + strongText,
    // conditional style
    !isEditing || !canEdit ? "hidden" : ""
  ]

  return (
    <>
    <div className="resize-container">
      <span onClick={handleSpanClick} ref={mirrorRef} style={textStyle} className={textClass.join(" ")} {...customAttrText}></span>
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

export default EditableText;