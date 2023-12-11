import { PluginNames, IEditorPlugin } from '../types';

export const envPlugin = (options: Record<string, any>, name = PluginNames.Env): IEditorPlugin => {
  const basePlugin: IEditorPlugin = {
    name,
    isModule: true,
    decorationClass: 'code-tag code-editor-hl-env-var',
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
