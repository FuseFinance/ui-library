import React, { forwardRef,  useRef } from 'react';
import baseTheme from './baseTheme';
import { useBaseCodeEditorConfig, } from './hooks';
import { BaseCodeEditorConfig, IProps } from './types';
import './baseCodeEditor.css'

const BaseCodeEditor = forwardRef(({
  onChange,
  onBlur,
  onFocus,
  value,
  plugins = [],
  theme = baseTheme,
  placeholder = "",
  maxLines,
  defaultValue,
  readonly = false,
  extensions,
  lineWrapping,
  minHeightLines,
  maxHeightLines ,
  contentAfter,
  positionCenterContentAfter = "top",
  customCSSClass = "",
  containerCSSClass,
  customContainerAttr,
  resizingAboveElements = false,
}: IProps, parentRef: React.MutableRefObject<HTMLDivElement>) => {
  
  // Get code editor ref 
  const internalRef = useRef();
  const ref: React.MutableRefObject<HTMLDivElement> = parentRef || internalRef;  

  // Get content after
  const refContentAfter: React.MutableRefObject<HTMLDivElement> = useRef(null);

  // Code editor config
  const editorConfig: BaseCodeEditorConfig = {
    onChange,
    onBlur,
    onFocus,
    value,
    plugins,
    theme,
    placeholder,
    maxLines,
    defaultValue,
    readonly,
    extensions,
    lineWrapping,
    minHeightLines,
    maxHeightLines,
    customCSSClass : `editor-code-globla-style ${lineWrapping && 'line-wrapping'} ${resizingAboveElements && 'resizing-above-elements'} ${customCSSClass}`
  };

  useBaseCodeEditorConfig(editorConfig, ref, refContentAfter);
  return (
    <>
    <div className={`content-editor-code-all ${containerCSSClass || ''}`}  {...customContainerAttr}>
      <div ref={ref} className={`content-editor-code-globla-style overflow-hidden`}/>
      {contentAfter && <div ref={refContentAfter} className={`editor-code-content-after editor-code-content-after-${positionCenterContentAfter}`}>{contentAfter}</div>}
    </div>
    </>
  );
});

BaseCodeEditor.displayName = 'BaseCodeEditor';

export default BaseCodeEditor;
