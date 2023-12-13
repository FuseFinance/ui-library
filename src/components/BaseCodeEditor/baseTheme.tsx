import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';

import colors from '@/src/styles/colors';

// FIXME: The theme is intentionally dirty here to tweak quickly until we found the correct combination
const baseTheme = createTheme({
  theme: 'light',
  settings: {
    background: '#ffffff',
    foreground: colors.fuseGray1,
    caret: '#000000',
    selection: colors.fuseBlueLighter2,
    selectionMatch: '#515151',
    lineHighlight: '#314151',
  },
  styles: [
    { tag: t.number, color: colors.fuseAmber5 },
    { tag: t.operator, color: colors.fuseAmber5 },
    { tag: t.string, color: '#d4922f' },
    { tag: t.derefOperator, color: colors.fuseGray1 },
    { tag: t.propertyName, color: colors.fuseBlue3 },
    { tag: t.keyword, color: '#A626A4', fontWeight: 'bold' },
    // { tag: t.atom, color: '#77F' },
    { tag: t.comment, color: colors.green2, fontStyle: 'italic' },
    // { tag: t.definition(t.variableName), color: 'orange' },
    // { tag: t.variableName, color: 'blue' },
    { tag: t.function(t.variableName), color: '#062BF9' },
    // { tag: t.typeName, color: '#FFDD44' },
    // { tag: t.tagName, color: '#def' },
    // { tag: t.meta, color: '#C9F' },
    // { tag: t.qualifier, color: '#FFF700' },
    // { tag: t.builtin, color: '#30aabc' },
    // { tag: t.bracket, color: '#8a8a8a' },
    // { tag: t.attributeName, color: '#red' },
    // { tag: t.heading, color: 'aquamarine', fontWeight: 'bold' },
    // { tag: t.link, color: 'blueviolet', fontWeight: 'bold' },
  ],
});

export default baseTheme;
