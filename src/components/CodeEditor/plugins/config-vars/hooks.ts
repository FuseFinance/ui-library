import { useEffect, useState } from 'react';

// import { useGetEnvironmentVariables } from '@/src/services/environmentVariables';
import { arrayToPlainObject } from '@/src/components/Editor/FlowCanvas/utils';
import { configVarsPlugin } from './config-vars';
import { ConfigVar } from '@/src/types/services/workflows';

export const useConfigVarsEditorPlugin = (configVars: ConfigVar[] = []) => {
  const [configVarsEditorPlugin, setConfigVarsEditorPlugin] = useState(null);

  useEffect(() => {
    if (configVars.length > 0) {
      const configVarNames = configVars.map((cv) => cv.name);
      setConfigVarsEditorPlugin(configVarsPlugin(arrayToPlainObject(configVarNames)));
    }
  }, [configVars.length]);

  return {
    configVarsEditorPlugin,
  };
};
