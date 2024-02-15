/* eslint-disable no-unused-vars */

export type ComplexInputType = {
  Simple: React.FC;
  FunctionalCode: React.FC;
};

export enum SIMPLE_INPUT_TYPE {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
}
export enum INPUT_TYPES {
  SIMPLE = 'SIMPLE',
  FUNCTIONAL = 'FUNCTIONAL',
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
