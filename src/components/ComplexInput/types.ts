/* eslint-disable no-unused-vars */

export enum SIMPLE_INPUT_TYPE {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
}

export enum FUNCTIONAL_INPUT_TYPE {
  DYNAMIC_STRING = 'DYNAMIC_STRING',
  FORMULA = 'FORMULA',
  CODE = 'CODE',
}

export type SimpleInputCaseProps = {
  onChange?: (_value: string) => void;
  onBlur?: (_value: any) => void;
  value: string;
  placeholder: string;
  readonly: boolean;
  type: SIMPLE_INPUT_TYPE;
};
