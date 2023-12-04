import { v4 as uuidv4 } from 'uuid';

export const mockEnvironmentVariables = [
  {
    id: uuidv4(),
    name: 'test',
    type: 'STRING',
    prodValue: 'test',
    sandboxValue: 'test',
    devValue: 'test',
  },
];
