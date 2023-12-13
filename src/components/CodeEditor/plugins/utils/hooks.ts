import { useEffect, useState } from 'react';

import { arrayToPlainObject } from '@/src/components/Editor/FlowCanvas/utils';
import { utilsPlugin } from './';

export const useUtilsEditorPlugin = () => {
  const [utilsEditorPlugin, setUtilsEditorPlugin] = useState({});

  useEffect(() => {
    // TODO - maybe we want to move this utils fns to the BE
    const utils = ['toCSV', 'soapSign', 'base64encode', 'base64decode', 'unzip'];
    if (utils?.length > 0) {
      const utilsFns = utils.map((f) => `${f}()`);
      const utilsObj = arrayToPlainObject(utilsFns, 'Utils');
      setUtilsEditorPlugin(utilsPlugin(utilsObj));
    }
  }, []);

  return {
    utilsEditorPlugin,
  };
};
