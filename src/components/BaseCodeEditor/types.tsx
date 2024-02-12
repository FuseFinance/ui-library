/* eslint-disable-next-line import/named */
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { ReactNode  } from 'react';


export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type PluginPrecedence = 'highest' | 'high' | 'default' | 'low' | 'lowest';

export type BaseCodeEditorConfig = {
  onChange?: (_value: string) => void;
  onBlur?: (_event: any, _view: EditorView) => void;
  onFocus?: (_event: any, _view: EditorView) => void;
  placeholder: string;
  theme: any;
  value?: string;
  plugins?: IEditorPlugin[];
  customCSSClass?: string;
  maxLines?: number;
  defaultValue?: string;
  containerCSSClass?: string;
  readonly?: boolean;
  lineWrapping?: boolean;
  customContainerAttr?: Record<string, string>;
  extensions?: Extension[];
  positionCenterContentAfter?: "top" | "center" | "bottom"; 
  resizingAboveElements?: boolean; 
  maxHeightLines?: number;
  minHeightLines?: number;
  contentAfter?: ReactNode
};

export interface IEditorPlugin {
  name: string;
  isModule: boolean;
  decorationClass: string;
  matchRegex?: RegExp;
  options?: Record<string, any>;
  precedence?: PluginPrecedence;
}

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface IProps extends Optional<BaseCodeEditorConfig, 'placeholder' | 'theme'> {}
