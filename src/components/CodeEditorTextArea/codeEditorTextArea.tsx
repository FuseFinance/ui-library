import React, { useRef } from 'react';
import { IProps } from './types';
import { BaseCodeEditorConfig } from '@components/BaseCodeEditor/types';
import { BaseCodeEditor } from '@components/BaseCodeEditor'
import { lineNumbers, highlightActiveLineGutter } from '@codemirror/view';
import './codeEditorTextArea.css'

const EditorTextArea = ({
  onChange,
  onBlur,
  onFocus,
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
  contentAfter,
  extensions = [],
  positionCenterContentAfter = "top"
}: IProps) => {
  const editorRef = useRef(null);

  extensions.push(lineNumbers())
  extensions.push(highlightActiveLineGutter())

  const editorConfig: BaseCodeEditorConfig = {
    onChange,
    onBlur,
    onFocus,
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
    containerCSSClass,
    contentAfter,
    maxHeightLines,
    minHeightLines,
    positionCenterContentAfter
  };

  return (<BaseCodeEditor ref={editorRef} {...editorConfig}></BaseCodeEditor>)
};

export default EditorTextArea;
