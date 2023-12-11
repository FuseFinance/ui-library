/* eslint-disable @typescript-eslint/no-explicit-any */
import { buildDynamicRegex } from '@utils/regex';
import { PluginNames, IEditorPlugin } from '../types';

export const interpolationsPlugin = (
  options: Record<string, any>,
  name = PluginNames.Interpolations,
): IEditorPlugin => {
  const regexWithClosing = buildDynamicRegex('{{', '}}');

  const basePlugin: IEditorPlugin = {
    name,
    isModule: true,
    decorationClass: 'code-tag code-editor-hl-interpolations',
    options: [],
  };

  if (!options) {
    return basePlugin;
  }

  basePlugin.matchRegex = new RegExp(regexWithClosing, 'g');
  basePlugin.options = options;
  return basePlugin;
};
