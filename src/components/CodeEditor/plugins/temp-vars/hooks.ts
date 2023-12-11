import { useEffect, useState } from 'react';

import { tempVarsPlugin } from './';

export const useTempVarsEditorPlugin = () => {
  const [tempVarsEditorPlugin, setTempVarsPlugin] = useState(null);

  useEffect(() => {
    setTempVarsPlugin(tempVarsPlugin());
  }, []);

  return {
    tempVarsEditorPlugin,
  };
};
