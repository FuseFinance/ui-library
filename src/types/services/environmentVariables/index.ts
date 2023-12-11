/* eslint-disable no-unused-vars */
export enum EnvironmentVariableType {
  STRING = 'STRING',
}
/* eslint-enable no-unused-vars */

export interface EnvironmentVariable {
  id?: string;
  name: string;
  value: string;
  type?: EnvironmentVariableType;
}
