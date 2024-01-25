import React, { useRef, useEffect } from 'react';
import { IProps } from './types';
import { BaseCodeEditorConfig } from '@components/BaseCodeEditor/types';
import { BaseCodeEditor } from '@components/BaseCodeEditor'
import { lineNumbers, highlightActiveLineGutter } from '@codemirror/view';
import './codeEditorTextArea.css'

const EditorTextArea = ({
  onChange,
  onBlur,
  value,
  plugins = [],
  customCSSClass = "",
  placeholder = "",
  theme,
  maxLines,
  maxHeightLines = null,
  minHeightLines = null,
  defaultValue = "",
  containerCSSClass,
  customContainerAttr,
  readonly = false,
  lineWrapping,
  extensions = [],
}: IProps) => {
  const editorRef = useRef(null);

  extensions.push(lineNumbers())
  extensions.push(highlightActiveLineGutter())

  useEffect(() => {
    // add default height

    const paddingHeight = 9;
    const lineHeight = 18;

    if(editorRef.current && minHeightLines != null){
      
      editorRef.current.querySelector(".cm-editor").style.minHeight = ((minHeightLines * lineHeight) + (paddingHeight * 2)) + "px";

    }

    // add max height
    if(editorRef.current && maxHeightLines != null){
      
      editorRef.current.querySelector(".cm-editor").style.maxHeight = ((maxHeightLines * lineHeight) + paddingHeight + 1) + "px";

    }    
  }, [editorRef]);

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
    customCSSClass : "editor-code-text-area-globla-style " + customCSSClass,
    customContainerAttr,
    containerCSSClass
  };

  return (<BaseCodeEditor ref={editorRef} {...editorConfig}></BaseCodeEditor>)
};

export default EditorTextArea;
