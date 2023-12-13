import { PluginNames, IEditorPlugin } from '../types';

// This a weird plugin that highlights everything that
// starts with temp. but has no options to list.
export const tempVarsPlugin = (name = PluginNames.TempVars): IEditorPlugin => {
  const reString = `${name}\\.[^\\s]+`;
  const basePlugin: IEditorPlugin = {
    name,
    isModule: true,
    matchRegex: new RegExp(reString, 'g'),
    decorationClass: 'code-tag code-editor-temp-var',
    options: [],
  };

  return basePlugin;
};
