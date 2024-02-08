import { FUNCTIONAL_INPUT_TYPE, SIMPLE_INPUT_TYPE } from '../types';

const typeLabels = {
  // Funcitonal cases
  [FUNCTIONAL_INPUT_TYPE.CODE]: 'Code',
  [FUNCTIONAL_INPUT_TYPE.DYNAMIC_STRING]: 'Dynamic string',
  [FUNCTIONAL_INPUT_TYPE.FORMULA]: 'Formula',

  // Simple cases
  [SIMPLE_INPUT_TYPE.NUMBER]: 'Number',
  [SIMPLE_INPUT_TYPE.STRING]: 'String',
};

export const getLabelByType = (type: SIMPLE_INPUT_TYPE | FUNCTIONAL_INPUT_TYPE) => {
  const { [type]: label } = typeLabels;

  if (!label) {
    return `Unknown Type: "${type}", Maybe you need to add this one in "src/components/FuseInput/types.ts"`;
  }

  return label;
};
