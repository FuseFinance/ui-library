import { useEffect, useState } from 'react';

import { IEditorPlugin } from './plugins/types';

import { useEnvEditorPlugin } from './plugins/env/hooks';
import { useFormulasEditorPlugin } from './plugins/formula/hooks';
import { useTempVarsEditorPlugin } from './plugins/temp-vars/hooks';
import { useDataEntityPlugin } from './plugins/data-entity/hooks';
import { useUtilsEditorPlugin } from './plugins/utils/hooks';
import { useInterpolationsPlugin } from './plugins/interpolations/hooks';

export const useCodeEditorPlugin = () => {
  const { envEditorPlugin } = useEnvEditorPlugin();
  const { formulaEditorPlugin } = useFormulasEditorPlugin();
  const { utilsEditorPlugin } = useUtilsEditorPlugin();
  const { interpolationsEditorPlugin } = useInterpolationsPlugin();
  const { tempVarsEditorPlugin } = useTempVarsEditorPlugin();
  const {
    dataEntityApplicantPlugin,
    dataEntityApplicationPlugin,
    dataEntityCarfaxPlugin,
    dataEntityCoApplicantPlugin,
    dataEntityCreditApplicantPlugin,
    dataEntityCreditCoApplicantPlugin,
    dataEntityCurrentLoanPlugin,
    dataEntityDealOfferedPlugin,
    dataEntityDealRequestedPlugin,
    dataEntityFraudApplicantPlugin,
    dataEntityFraudCoApplicantPlugin,
    dataEntityRiskViewApplicantPlugin,
    dataEntityRiskViewCoApplicantPlugin,
    dataEntitySourcePlugin,
    dataEntityVehiclePlugin,
    dataEntityVehicleValuationPlugin,
    dataEntityZestPlugin,
  } = useDataEntityPlugin();

  const [plugins, setPlugins] = useState<IEditorPlugin[]>([]);

  useEffect(() => {
    const pluginsList = [
      envEditorPlugin,
      formulaEditorPlugin,
      utilsEditorPlugin,
      interpolationsEditorPlugin,
      tempVarsEditorPlugin,
      dataEntityApplicantPlugin,
      dataEntityApplicationPlugin,
      dataEntityCarfaxPlugin,
      dataEntityCoApplicantPlugin,
      dataEntityCreditApplicantPlugin,
      dataEntityCreditCoApplicantPlugin,
      dataEntityCurrentLoanPlugin,
      dataEntityDealOfferedPlugin,
      dataEntityDealRequestedPlugin,
      dataEntityFraudApplicantPlugin,
      dataEntityFraudCoApplicantPlugin,
      dataEntityRiskViewApplicantPlugin,
      dataEntityRiskViewCoApplicantPlugin,
      dataEntitySourcePlugin,
      dataEntityVehiclePlugin,
      dataEntityVehicleValuationPlugin,
      dataEntityZestPlugin,
    ];

    const pluginsLoaded = pluginsList.every((p) => p);

    if (pluginsLoaded) {
      setPlugins(pluginsList);
    }
  }, [
    envEditorPlugin,
    formulaEditorPlugin,
    utilsEditorPlugin,
    interpolationsEditorPlugin,
    tempVarsEditorPlugin,
    dataEntityApplicantPlugin,
    dataEntityApplicationPlugin,
    dataEntityCarfaxPlugin,
    dataEntityCoApplicantPlugin,
    dataEntityCreditApplicantPlugin,
    dataEntityCreditCoApplicantPlugin,
    dataEntityCurrentLoanPlugin,
    dataEntityDealOfferedPlugin,
    dataEntityDealRequestedPlugin,
    dataEntityFraudApplicantPlugin,
    dataEntityFraudCoApplicantPlugin,
    dataEntityRiskViewApplicantPlugin,
    dataEntityRiskViewCoApplicantPlugin,
    dataEntitySourcePlugin,
    dataEntityVehiclePlugin,
    dataEntityVehicleValuationPlugin,
    dataEntityZestPlugin,
  ]);

  return {
    plugins,
  };
};
