import { useEffect, useState } from 'react';

import BaseCodeEditor from '@/src/components/BaseCodeEditor';

import { useConfigVarsEditorPlugin } from './plugins/config-vars/hooks';
import { useCodeEditorPlugin } from './hooks';
import { IEditorPlugin } from './plugins/types';
import { IProps } from './types';

const CodeEditor = ({
  onChange,
  onBlur,
  value,
  placeholder,
  customCSSClass,
  maxLines,
  defaultValue,
  containerCSSClass,
  readonly,
  lineWrapping,
  configVars = [],
  testId,
  extensions,
}: IProps) => {
  const { plugins: defaultPlugins } = useCodeEditorPlugin();
  const { configVarsEditorPlugin } = useConfigVarsEditorPlugin(configVars);

  const [plugins, setPlugins] = useState<IEditorPlugin[]>([]);

  useEffect(() => {
    if (defaultPlugins.length > 0) {
      const pluginsList = [...defaultPlugins];

      if (configVarsEditorPlugin) {
        pluginsList.push(configVarsEditorPlugin);
      }

      setPlugins(pluginsList);
    }
  }, [defaultPlugins, configVarsEditorPlugin]);

  return (
    <>
      <BaseCodeEditor
        defaultValue={defaultValue}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        plugins={plugins}
        customCSSClass={customCSSClass}
        containerCSSClass={containerCSSClass}
        maxLines={maxLines} // TODO: We can migrate this to a plugin
        readonly={readonly}
        lineWrapping={lineWrapping}
        testId={testId}
        extensions={extensions}
      />
    </>
  );
};

export default CodeEditor;
