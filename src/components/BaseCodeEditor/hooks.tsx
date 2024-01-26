import { useCallback, useEffect, useMemo, useState } from 'react';

import { get } from 'lodash';
import { autocompletion, closeBrackets } from '@codemirror/autocomplete';
import { indentOnInput, bracketMatching, foldGutter } from '@codemirror/language';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { keymap, drawSelection, EditorView, ViewUpdate, placeholder as ph } from '@codemirror/view';
import {
  Prec,
  EditorState,
  /* eslint-disable-next-line import/named */
  Extension,
} from '@codemirror/state';

import {
  buildDecorator,
  buildEffectAppendConfig,
  buildEffectReconfigure,
  buildCodeEditorCompletions,
  getCurrentWord,
  isDot,
  isWhitespace,
} from './codeEditorHelper';

import { BaseCodeEditorConfig, IEditorPlugin } from './types';

const useLoadEditorPlugins = (plugins: IEditorPlugin[]) => {
  const [pluginsLoaded, setPluginsLoaded] = useState<IEditorPlugin[]>([]);
  const [allSuggestions, setAllSuggestions] = useState<any>([]); // TODO: Properly type this

  const memoizedPlugins = useMemo(() => plugins, [plugins]);

  useEffect(() => {
    if (plugins.length > 0) {
      const globalOptions = [];
      memoizedPlugins.forEach((p) => {
        if (!p.options) {
          return;
        }

        let editorOptions = buildCodeEditorCompletions(p.options);

        if (p.isModule) {
          editorOptions = buildCodeEditorCompletions(p.options, p.name);
        }

        globalOptions.push(...editorOptions);
      });

      setAllSuggestions(allSuggestions.concat(globalOptions));
      setPluginsLoaded(memoizedPlugins);
    }
  }, [memoizedPlugins]);

  const showSuggestions = useCallback(
    (context) => {
      const value = context.state.doc.toString();
      if (!value) return null;

      const word = context.matchBefore(/\w*/);
      const startChar = value[word.from - 1];
      const currentChar = value[word.to - 1];

      if (isWhitespace(currentChar)) return null;

      const list = {
        from: word.from,
        options: allSuggestions, // By default render all possible suggestions
      };

      const isDotPressed = word.from === word.to && isDot(currentChar);
      const isInsideModule = word.from < word.to && isDot(startChar);
      if (isDotPressed || isInsideModule) {
        const input = getCurrentWord(value, word.from);
        const [moduleName, ...inputOptions] = input.split('.');
        const pluginFound = memoizedPlugins.find((p) => p.name === moduleName.trim());
        if (!pluginFound) {
          return null;
        }

        if (inputOptions.length === 0) {
          list.options = buildCodeEditorCompletions(pluginFound.options) || [];
          return list;
        }

        const optionsPath = inputOptions.join('.');
        const nestedOptions = get(pluginFound.options, optionsPath);

        if (!nestedOptions) {
          return null;
        }

        list.options = buildCodeEditorCompletions(nestedOptions) || [];
        return list;
      }

      if (!word.text) return null;
      return list;
    },
    [pluginsLoaded],
  );

  return {
    loadedCount: pluginsLoaded.length,
    showSuggestions,
  };
};


// Define the focus event handler
function onFocusHandler(event, view) {
  const target = event.relatedTarget
  if(!target){
    return;
  }

  // Avoid blur when number zone is selected
  if (event.relatedTarget.classList.contains("cm-scroller")) {
    view.focus();
  }  
}

// Create an extension that handles events
const extensionEventHandlers = EditorView.domEventHandlers({
  blur: onFocusHandler
});

export const useBaseCodeEditorConfig = ({
  onChange,
  onBlur,
  value,
  plugins,
  placeholder,
  theme,
  customCSSClass,
  maxLines,
  defaultValue,
  readonly = false,
  lineWrapping = false,
  extensions,
}: BaseCodeEditorConfig, externalRef) => {

  const [view, setView] = useState<any>();
  const { loadedCount, showSuggestions } = useLoadEditorPlugins(plugins);

  const setupEditor = useCallback(() => {
    const view = new EditorView({
      parent: externalRef.current
    });

    setupBaseExtensions(view);
    setupPluginsExtensions(view);
    setupAutoCompletionExtension(view);
    setListeners(view);

    const editorValue = defaultValue !== undefined ? defaultValue : value;

    if (editorValue !== undefined) {
      view.dispatch({
        changes: { from: 0, insert: editorValue },
      });
    }

    return view;
  }, [externalRef, defaultValue, value]);

  const setListeners = useCallback(
    (view: EditorView) => {
      const extension = EditorView.updateListener.of((vu: ViewUpdate) => {
        const content = vu.state.doc.toString();
        if (onChange && vu.docChanged) {
          onChange(content);
        }
        if (onBlur && vu.focusChanged) {
          onBlur(content);
        }
      });

      view.dispatch({
        effects: buildEffectAppendConfig(extension),
      });
    },
    [onChange, onBlur],
  );

  const resetEditor = useCallback(
    (view: EditorView) => {
      view.dispatch({
        effects: buildEffectReconfigure(),
      });
    },
    [view],
  );

  const setupBaseExtensions = useCallback(
    (view: EditorView) => {
      const baseExtensions = [
        theme,
        ph(placeholder),
        history(),
        foldGutter(),
        drawSelection(),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        extensionEventHandlers,
        keymap.of([...defaultKeymap, ...historyKeymap]),
      ];

      if (extensions) {
        baseExtensions.push(...extensions);
      }
      if (customCSSClass) {
        baseExtensions.push(EditorView.editorAttributes.of({ class: customCSSClass }));
      }

      baseExtensions.push(
        EditorView.contentAttributes.of({
          'data-enable-grammarly': 'false',
          'data-gramm_editor': 'false',
        }),
      );

      if (maxLines && maxLines > 0) {
        baseExtensions.push(
          EditorState.transactionFilter.of((tr) => {
            return tr.newDoc.lines > maxLines ? [] : [tr];
          }),
        );
      }

      if (readonly) {
        baseExtensions.push(EditorState.readOnly.of(true));
      }

      if (lineWrapping) {
        baseExtensions.push(EditorView.lineWrapping);
      }

      view.dispatch({
        effects: baseExtensions.map(buildEffectAppendConfig),
      });
    },
    [view, customCSSClass, readonly],
  );

  const setupPluginsExtensions = useCallback(
    (view: EditorView) => {

      const extensions = [];

      plugins.forEach((p) => {
        if (!p.matchRegex) {
          return;
        }

        let extension: Extension;
        if (p.precedence === 'lowest') {
          // FIXME: This is a hack, right now only one plugin should have the lowest priority
          extension = Prec.lowest(buildDecorator(p.matchRegex, p.decorationClass));
        } else {
          extension = buildDecorator(p.matchRegex, p.decorationClass);
        }

        extensions.push(buildEffectAppendConfig(extension));
      });

      view.dispatch({
        effects: extensions,
      });
    },
    [view, plugins],
  );

  const setupAutoCompletionExtension = useCallback(
    (view: EditorView) => {
      const extension = autocompletion({
        override: [showSuggestions],
        icons: false,
      });

      view.dispatch({
        effects: buildEffectAppendConfig(extension),
      });
    },
    [view, showSuggestions],
  );

  useEffect(() => {
    if (loadedCount > 0) {
      resetEditor(view);
      setupBaseExtensions(view);
      setupPluginsExtensions(view);
      setupAutoCompletionExtension(view);
      setListeners(view);
    }
  }, [loadedCount, showSuggestions]);

  useEffect(() => {
    if ((onChange || onBlur) && view) {
      setListeners(view);
    }
  }, [onChange, onBlur]);

  useEffect(() => {
    if (externalRef.current) {
      const view = setupEditor();
      setView(view);

      return () => view.destroy();
    }
  }, [externalRef, defaultValue]);

  // return ref;
};
