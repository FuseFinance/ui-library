import React, { forwardRef, ForwardedRef, useRef } from 'react';
import baseTheme from './baseTheme';
import { useBaseCodeEditorConfig, } from './hooks';
import { BaseCodeEditorConfig, IProps } from './types';
import './baseCodeEditor.css'

const BaseCodeEditor = forwardRef(({
  onChange,
  onBlur,
  value,
  plugins = [],
  customCSSClass = "",
  placeholder = "",
  theme = baseTheme,
  maxLines,
  defaultValue,
  containerCSSClass,
  customContainerAttr,
  readonly = false,
  lineWrapping,
  extensions,
}: IProps, parentRef: ForwardedRef<HTMLDivElement>) => {
  
  const internalRef = useRef();
  const ref = parentRef || internalRef;  
  
  const editorConfig: BaseCodeEditorConfig = {
    onChange,
    onBlur,
    value,
    placeholder,
    theme,
    plugins,
    maxLines,
    defaultValue,
    readonly,
    lineWrapping,
    extensions,
    customCSSClass : "editor-code-globla-style " + customCSSClass
    
  };

  useBaseCodeEditorConfig(editorConfig, ref);
  return (
    <>
      <div ref={ref} className={`content-editor-code-globla-style overflow-hidden ${containerCSSClass || ''}`} {...customContainerAttr}/>
    </>
  );
});

BaseCodeEditor.displayName = 'BaseCodeEditor';

export default BaseCodeEditor;
