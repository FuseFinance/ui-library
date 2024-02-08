import React from 'react';
import { Functional } from './cases/Functional';
import { Simple } from './cases/Simple';

type FuseInputType = {
  Simple: React.FC;
  Functional: React.FC;
};

const FuseInput: React.FC & FuseInputType = () => {
  throw new Error(
    'You must use a subcomponent of FuseInput, for example FuseInput.Simple, or create a new input type in "src/components/BaseCodeEditor/cases"',
  );
};

FuseInput.Functional = Functional;
FuseInput.Simple = Simple;

export default FuseInput;
