import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';

import colors from '@/src/styles/colors';

// FIXME: The theme is intentionally dirty here to tweak quickly until we found the correct combination
const baseTheme = createTheme({
  theme: 'light',
  settings: {
    background: '#ffffff',
    foreground: colors.gray[700],
    caret: '#000000',
    selection: colors.blue[100],
    selectionMatch: colors.blue[700],
    lineHighlight: colors.blue[700],
  },
  styles: [
    { tag: t.number, color: colors.yellow[500] },
    { tag: t.operator, color: colors.yellow[500] },
    { tag: t.string, color: colors.yellow[600] },
    { tag: t.derefOperator, color: colors.gray[800] },
    { tag: t.propertyName, color: colors.blue[600] },
    { tag: t.keyword, color: colors.violet[800], fontWeight: 'bold' },
    { tag: t.comment, color: colors.green[800], fontStyle: 'italic' },
    { tag: t.function(t.variableName), color: colors.blue[600] },
  ],
});

export default baseTheme;
