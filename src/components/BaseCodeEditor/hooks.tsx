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
function onBlurHandler(event, view, onBlur) {
  // Avoid blur when number zone is selected
  if (event.relatedTarget && event.relatedTarget.classList.contains('cm-scroller')) {
    view.focus();
    return;
  }

  if (onBlur) {
    onBlur(event, view);
  }
}

export const useBaseCodeEditorConfig = (
  {
    onChange,
    onBlur,
    onFocus,
    value,
    plugins,
    placeholder,
    theme,
    customCSSClass,
    maxLines,
    defaultValue,
    readonly = false,
    extensions,
    lineWrapping = false,
    minHeightLines,
    maxHeightLines,
  }: BaseCodeEditorConfig,
  externalRef: React.MutableRefObject<HTMLDivElement>,
  refContentAfter?: React.MutableRefObject<HTMLDivElement>,
) => {
  const [countReloadForBlue, setCountReloadForBlue] = useState<number>(0);
  const [view, setView] = useState<any>();
  const { loadedCount, showSuggestions } = useLoadEditorPlugins(plugins);
  const [width, setWidth] = useState('');
  const [isInputActive, setIsInputActive] = useState(false);

  const setupEditor = useCallback(() => {
    const view = new EditorView({
      parent: externalRef.current,
    });

    setupBaseExtensions(view);
    setupPluginsExtensions(view);
    setupAutoCompletionExtension(view);
    setupAdditionalContent(view);
    setupSizes(view);
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
        // Set initial height in the editor, because when the editor has content larger than the minimum size, it is displayed in full instead of showing only 3 lines
        view.dom.classList.add('h-10');

        const content = vu.state.doc.toString();
        const editorWidth = (vu.view as any)?.viewState?.editorWidth;

        if (editorWidth) setWidth(`${editorWidth}px`);

        if (onChange && vu.docChanged) {
          onChange(content);
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
      // Dom event handlers
      const extensionEventHandlers = EditorView.domEventHandlers({
        blur: (event, view) => {
          let newCountReloadForBlue = countReloadForBlue;

          newCountReloadForBlue++;

          setCountReloadForBlue(newCountReloadForBlue);
          onBlurHandler(event, view, onBlur);
        },
        focus: (event, view) => {
          if (onFocus) {
            onFocus(event, view);
          }
        },
        focusin: () => {
          setIsInputActive(true);
        },
        focusout: () => {
          setIsInputActive(false);

          // Set the default style
          view.dom.style.setProperty('height', '60px', 'important');
          view.dom.style.setProperty('width', '100%', 'important');
        },
      });

      // Define base extensions
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

      if (lineWrapping) {
        baseExtensions.push(EditorView.lineWrapping);
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

  const setupAdditionalContent = useCallback(
    (view: EditorView) => {
      if (!view.dom || !refContentAfter?.current) {
        return;
      }

      const contentAfterWidth = refContentAfter?.current.offsetWidth;

      // get code editor content dom
      const editorCodeContent: HTMLDivElement = view.dom.querySelector('.cm-content');

      // restar padding
      editorCodeContent.style.paddingRight = null;

      // get current padding right
      const editorCodeContentStyles = window.getComputedStyle(editorCodeContent);

      const editorCodeContentPaddingRight = parseInt(
        editorCodeContentStyles.getPropertyValue('padding-right'),
      );

      editorCodeContent.style.paddingRight =
        editorCodeContentPaddingRight + contentAfterWidth + 'px';
    },
    [view, refContentAfter],
  );

  const setupSizes = useCallback(
    (view: EditorView) => {
      if (!view.dom) {
        return;
      }

      // add default height
      const paddingHeight = 9;
      const lineHeight = 16;

      if (minHeightLines != null) {
        view.dom.style.minHeight = minHeightLines * lineHeight + paddingHeight * 2 + 'px';
      }

      // add max height
      if (maxHeightLines != null) {
        view.dom.style.maxHeight = maxHeightLines * lineHeight + paddingHeight + 1 + 'px';
      }
    },
    [view, minHeightLines, maxHeightLines],
  );

  useEffect(() => {
    if (loadedCount > 0) {
      resetEditor(view);
      setupBaseExtensions(view);
      setupPluginsExtensions(view);
      setupAutoCompletionExtension(view);
      setupAdditionalContent(view);
      setupSizes(view);
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

  return {
    width,
    isInputActive,
  };
};
