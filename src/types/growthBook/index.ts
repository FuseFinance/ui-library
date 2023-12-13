/* eslint-disable no-unused-vars */
export enum EStages {
  LOCAL = 'local', // Development
  PLAYGROUND = 'playground',
  LIVE = 'live',
}

export type TGetFeatureResponse = {
  stage: string[];
  client_stage: string[];
};
