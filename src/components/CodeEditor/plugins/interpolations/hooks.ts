import { useEffect, useState } from 'react';

import { interpolationsPlugin } from '.';

export const useInterpolationsPlugin = () => {
  const [interpolationsEditorPlugin, setInterpolationsEditorPlugin] = useState({});

  useEffect(() => {
    setInterpolationsEditorPlugin(interpolationsPlugin({}));
  }, []);

  return {
    interpolationsEditorPlugin,
  };
};
