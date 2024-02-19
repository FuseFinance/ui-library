import React from 'react';
import { Simple } from './cases/Simple';
import { FunctionalCode } from './cases/FunctionalCode';
import { ComplexInputType } from './types';

const ComplexInput: React.FC & ComplexInputType = () => {
  throw new Error(
    'You must use a subcomponent of ComplexInput, for example ComplexInput.Simple, or create a new input type in "src/components/BaseCodeEditor/cases"',
  );
};

ComplexInput.FunctionalCode = FunctionalCode;
ComplexInput.Simple = Simple;

export default ComplexInput;
