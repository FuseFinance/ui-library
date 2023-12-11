import { isPlainObject } from 'lodash';
import {
  /* eslint-disable-next-line import/named */
  Completion,
} from '@codemirror/autocomplete';

import {
  ViewPlugin,
  ViewUpdate,
  Decoration,
  MatchDecorator,
  EditorView,
  /* eslint-disable-next-line import/named */
  DecorationSet,
} from '@codemirror/view';
import {
  StateEffect,
  /* eslint-disable-next-line import/named */
  Extension,
} from '@codemirror/state';

const decorator = (re: RegExp, cssClasses: string) => {
  const matchDecorator = new MatchDecorator({
    regexp: re,
    decoration: () => {
      return Decoration.mark({ class: cssClasses });
    },
  });

  return matchDecorator;
};

export const buildCodeEditorCompletions = (
  opts: Record<string, any>,
  name?: string,
  type = 'keyword',
): Completion[] =>
  Object.entries(opts).reduce((acc: Completion[], [label, value]) => {
    if (label === '__description__') return acc;

    let detail = value;
    if (isPlainObject(value)) {
      detail = value.__description__ || '';
    }

    acc.push({
      label: name ? `${name}.${label}` : label,
      apply: name ? `${name}.${label}` : label,
      detail,
      type,
    });

    return acc;
  }, []);

export const buildDecorator = (re: RegExp, cssClasses: string) => {
  class deco {
    sets: DecorationSet;
    constructor(ev: EditorView) {
      this.sets = decorator(re, cssClasses).createDeco(ev);
    }
    update(vu: ViewUpdate) {
      this.sets = decorator(re, cssClasses).updateDeco(vu, this.sets);
    }
  }

  return ViewPlugin.fromClass(deco, {
    decorations: (instance) => instance.sets,
  });
};

export const isWhitespace = (char: string) => /\s+/.test(char);
export const isDot = (char: string) => char === '.';

export const rewindUntilWhitespace = (text: string, pos: number) => {
  for (; pos >= 0 && !isWhitespace(text.charAt(pos)); pos--);
  return pos + 1;
};

export const getCurrentWord = (text: string, pos: number) => {
  const startPos = rewindUntilWhitespace(text, pos);
  return text.slice(startPos, pos - 1);
};

export const buildEffectAppendConfig = (extension: Extension) =>
  StateEffect.appendConfig.of(extension);

export const buildEffectReconfigure = () => StateEffect.reconfigure.of([]);

// FIXME: This probably should be in other place
export const generatePathsFromObject = (obj, prefix = '') => {
  const paths = [];

  for (const key in obj) {
    const fullPath = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === 'object' && obj[key] !== null) {
      paths.push(fullPath, ...generatePathsFromObject(obj[key], fullPath));
    } else {
      paths.push(fullPath);
    }
  }

  return paths;
};
