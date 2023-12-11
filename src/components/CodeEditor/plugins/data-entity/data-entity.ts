import { IEditorPlugin, PluginNames } from '../types';
import { generatePathsFromObject } from '@/src/utils/codeEditorHelper';

export const dataEntity = (options: Record<string, any>, name: PluginNames): IEditorPlugin => {
  const namespacedOptions = generatePathsFromObject(options).map((opcion) => `${name}.${opcion}`);
  const reString = `((?<=^|\\s|\\b)${namespacedOptions.join('|')})(?=\\s|$)`;

  return {
    name,
    isModule: true,
    matchRegex: new RegExp(reString, 'g'),
    decorationClass: 'code-tag code-editor-hl-entity',
    options,
  };
};
