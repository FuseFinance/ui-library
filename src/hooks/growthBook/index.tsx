import { useFeatureIsOn, useFeatureValue } from '@growthbook/growthbook-react';
import { EStages, TGetFeatureResponse } from '@/src/types/growthBook';
import { FuseFlags } from '@/src/types/growthBook/featureFlags';
import env from '@/src/constants/env';
export const useGrowthBook = () => {
  const _isOn = useFeatureIsOn;
  const _getValue = useFeatureValue;

  // Helps to identify if we're on a local or dev stage, so we have all features.
  const __evaluateDevelopmentStage = env.STAGE?.toLowerCase().includes(EStages.LOCAL);

  const isFeatureOn = (flag: FuseFlags) => {
    return _isOn(flag);
  };

  const getValue = (flag: FuseFlags): TGetFeatureResponse => {
    return _getValue<TGetFeatureResponse>(flag, { stage: [], client_stage: [] });
  };

  const evalFeaturebyClientAndStage = (flag: FuseFlags) => {
    if (__evaluateDevelopmentStage) return true;

    const dataFlag = getValue(flag);
    return dataFlag.client_stage.includes(env.FRONT_CLIENT + '_' + env.STAGE);
  };

  const evalFeaturebyStage = (flag: FuseFlags) => {
    if (__evaluateDevelopmentStage) return true;

    const dataFlag = getValue(flag);
    return dataFlag.stage.includes(env.STAGE);
  };

  const evalFlag = (flag: FuseFlags) => {
    if (__evaluateDevelopmentStage) return true;

    const isInStage = evalFeaturebyStage(flag);
    if (isInStage) return true;
    return evalFeaturebyClientAndStage(flag);
  };

  return {
    isFeatureOn,
    getValue,
    evalFeaturebyClientAndStage,
    evalFeaturebyStage,
    evalFlag,
  };
};
