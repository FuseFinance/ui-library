import { PluginNames, IEditorPlugin } from '../types';

export const configVarsPlugin = (
  options: Record<string, any>,
  name = PluginNames.ConfigVars,
): IEditorPlugin => {
  const basePlugin: IEditorPlugin = {
    name,
    isModule: true,
    decorationClass: 'code-editor-config-var',
    options: [],
  };

  if (!options) {
    return basePlugin;
  }

  const reString = `\\b${name}\\.(${Object.keys(options).join('|')})\\b`;

  basePlugin.matchRegex = new RegExp(reString, 'g');
  basePlugin.options = options;
  return basePlugin;
};
