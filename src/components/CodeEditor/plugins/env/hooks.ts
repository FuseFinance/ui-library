import { useEffect, useState } from 'react';

import { useGetEnvironmentVariables } from '@/src/services/environmentVariables';
import { arrayToPlainObject } from '@/src/components/Editor/FlowCanvas/utils';
import { envPlugin } from '../';

export const useEnvEditorPlugin = () => {
  const [envEditorPlugin, setEnvEditorPlugin] = useState(null);
  const { environmentVariables } = useGetEnvironmentVariables();

  useEffect(() => {
    let envVarNames;
    if (environmentVariables?.length > 0) {
      envVarNames = arrayToPlainObject(environmentVariables.map((ev) => ev.name));
    }

    setEnvEditorPlugin(envPlugin(envVarNames));
  }, [environmentVariables]);

  return {
    envEditorPlugin,
  };
};
