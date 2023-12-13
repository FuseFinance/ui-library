/* eslint-disable no-unused-vars */

export const scopes = `
read:environments read:workflows 
read:tests write:environments write:workflows 
write:tests deploy:environments admin:clients write:clients
`;

export enum FILTERS_TYPE {
  ALERT = 'Alert',
  SUCCESS = 'Success',
  ERROR = 'Error',
}

export const EXECUTION_FILTERS = [
  { value: FILTERS_TYPE.ALERT },
  { value: FILTERS_TYPE.SUCCESS },
  { value: FILTERS_TYPE.ERROR },
];
