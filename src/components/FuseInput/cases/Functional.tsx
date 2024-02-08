import { lineNumbers, highlightActiveLineGutter } from '@codemirror/view';
import { BaseCodeEditorConfig, IProps } from '../../BaseCodeEditor/types';
import { useBaseCodeEditorConfig } from '../../BaseCodeEditor/hooks';
import { ForwardedRef, forwardRef, useRef } from 'react';
import baseTheme from '../../BaseCodeEditor/baseTheme';
import { javascript } from '@codemirror/lang-javascript';
import { TooltipFuse } from '../Tooltip';
import { getLabelByType } from './utils';
import { FUNCTIONAL_INPUT_TYPE } from '../types';

export const Functional = forwardRef(
  (
    {
      onChange,
      onBlur,
      onFocus,
      value,
      plugins = [],
      customCSSClass = '',
      placeholder = '',
      theme = baseTheme,
      maxLines,
      defaultValue,
      containerCSSClass,
      customContainerAttr,
      readonly = false,
      lineWrapping,
      extensions = [],
      hasNumberLines,
      type = FUNCTIONAL_INPUT_TYPE.CODE,
    }: IProps,
    parentRef: ForwardedRef<HTMLDivElement>,
  ) => {
    const internalRef = useRef();
    const ref = parentRef || internalRef;

    const localExtensions = [...extensions, javascript(), highlightActiveLineGutter()];

    if (hasNumberLines) localExtensions.push(lineNumbers());

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
      extensions: localExtensions,
      customCSSClass: 'editor-code-globla-style ' + customCSSClass,
    };

    const { isInputActive, width } = useBaseCodeEditorConfig(editorConfig, ref);

    return (
      <div>
        <div
          id="functional-input"
          ref={ref}
          className={` ${containerCSSClass || ''}`}
          {...customContainerAttr}
        />
        <TooltipFuse type={getLabelByType(type)} active={isInputActive} width={width} />
      </div>
    );
  },
);
Functional.displayName = 'Functional';
