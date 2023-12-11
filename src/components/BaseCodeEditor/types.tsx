import { IEditorPlugin } from '@/src/components/CodeEditor/plugins/types';
import { Optional } from '@/src/utils/types/utility';
/* eslint-disable-next-line import/named */
import { Extension } from '@codemirror/state';

export type BaseCodeEditorConfig = {
  onChange?: (_value: string) => void;
  onBlur?: (_value: any) => void;
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
  testId?: string;
  extensions?: Extension[];
};

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface IProps extends Optional<BaseCodeEditorConfig, 'placeholder' | 'theme'> {}
