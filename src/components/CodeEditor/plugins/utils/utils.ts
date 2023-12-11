import { PluginNames, IEditorPlugin } from '../types';

export const utilsPlugin = (
  options: Record<string, any>,
  name = PluginNames.Utils,
): IEditorPlugin => {
  const basePlugin: IEditorPlugin = {
    name,
    isModule: true,
    decorationClass: 'code-tag code-editor-hl-formula',
    options: [],
  };

  if (!options) {
    return basePlugin;
  }

  const functionNamesRe = `\\b${name}\\.(${Object.keys(options).join('|')})\\b`;
  const reString = `${functionNamesRe}\\((.*?)\\)`;

  basePlugin.matchRegex = new RegExp(reString, 'g');
  basePlugin.options = options;
  return basePlugin;
};
