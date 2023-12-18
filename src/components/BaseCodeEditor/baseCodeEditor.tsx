import baseTheme from './baseTheme';
import { useBaseCodeEditorConfig } from './hooks';
import { BaseCodeEditorConfig, IProps } from './types';
import './baseCodeEditor.css'

const BaseCodeEditor = ({
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
}: IProps) => {
  
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

  const ref = useBaseCodeEditorConfig(editorConfig);
  return (
    <>
      <div ref={ref} className={`overflow-hidden ${containerCSSClass || ''}`} {...customContainerAttr}/>
    </>
  );
};

export default BaseCodeEditor;
