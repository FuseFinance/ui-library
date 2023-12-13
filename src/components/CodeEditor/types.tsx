import { ConfigVar } from '@/src/types/services/workflows';
/* eslint-disable-next-line import/named */
import { Extension } from '@codemirror/state';

export interface IProps {
  onChange?: (_value: string) => void;
  onBlur?: (_value: any) => void;
  value?: string;
  placeholder?: string;
  customCSSClass?: string;
  maxLines?: number;
  defaultValue?: any;
  containerCSSClass?: string;
  readonly?: boolean;
  lineWrapping?: boolean;
  configVars?: ConfigVar[];
  testId?: string;
  extensions?: Extension[];
}
