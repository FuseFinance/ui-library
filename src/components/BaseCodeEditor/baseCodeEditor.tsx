import baseTheme from './baseTheme';
import { useBaseCodeEditorConfig } from './hooks';
import { BaseCodeEditorConfig, IProps } from './types';

const BaseCodeEditor = ({
  onChange,
  onBlur,
  value,
  plugins,
  customCSSClass,
  placeholder = '',
  theme = baseTheme,
  maxLines,
  defaultValue,
  containerCSSClass,
  readonly,
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
  };

  if (customCSSClass) {
    editorConfig.customCSSClass = customCSSClass;
  }

  const ref = useBaseCodeEditorConfig(editorConfig);
  return (
    <>
      <div ref={ref} className={`overflow-hidden ${containerCSSClass || ''}`} data-cy={"testId"} />
    </>
  );
};

export default BaseCodeEditor;
