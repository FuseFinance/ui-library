import { useEffect, useState } from 'react';
import { PluginNames } from '../types';

import { dataEntity } from './data-entity';

import applicationschema from './application/schema';
import applicantSchema from './applicant/schema';
import carfaxSchema from './carfax/schema';
import coApplicantSchema from './coapplicant/schema';
import creditApplicantSchema from './credit-applicant/schema';
import creditCoApplicantSchema from './credit-coapplicant/schema';
import currentLoanSchema from './current-loan/schema';
import dealOfferedSchema from './deal-offered/schema';
import dealRequestedSchema from './deal-requested/schema';
import fraudApplicantSchema from './fraud-applicant/schema';
import fraudCoApplicantSchema from './fraud-coapplicant/schema';
import riskViewApplicantSchema from './riskview-applicant/schema';
import riskViewCoApplicantSchema from './riskview-coapplicant/schema';
import sourceSchema from './source/schema';
import vehicleSchema from './vehicle/schema';
import vehicleValuationSchema from './vehicle-valuation/schema';
import zestSchema from './zest/schema';

export const useDataEntityPlugin = () => {
  const [dataEntityApplicantPlugin, setDataEntityApplicantPlugin] = useState(null);
  const [dataEntityApplicationPlugin, setDataEntityApplicationPlugin] = useState(null);
  const [dataEntityCarfaxPlugin, setDataEntityCarfaxPlugin] = useState(null);
  const [dataEntityCoApplicantPlugin, setDataEntityCoApplicantPlugin] = useState(null);
  const [dataEntityCreditApplicantPlugin, setDataEntityCreditApplicantPlugin] = useState(null);
  const [dataEntityCreditCoApplicantPlugin, setDataEntityCreditCoApplicantPlugin] = useState(null);
  const [dataEntityCurrentLoanPlugin, setDataEntityCurrentLoanPlugin] = useState(null);
  const [dataEntityDealOfferedPlugin, setDataEntityDealOfferedPlugin] = useState(null);
  const [dataEntityDealRequestedPlugin, setDataEntityDealRequestedPlugin] = useState(null);
  const [dataEntityFraudApplicantPlugin, setDataEntityFraudApplicantPlugin] = useState(null);
  const [dataEntityFraudCoApplicantPlugin, setDataEntityFraudCoApplicantPlugin] = useState(null);
  const [dataEntityRiskViewApplicantPlugin, setDataEntityRiskViewApplicantPlugin] = useState(null);
  const [dataEntityRiskViewCoApplicantPlugin, setDataEntityRiskViewCoApplicantPlugin] =
    useState(null);
  const [dataEntitySourcePlugin, setDataEntitySourcePlugin] = useState(null);
  const [dataEntityVehiclePlugin, setDataEntityVehiclePlugin] = useState(null);
  const [dataEntityVehicleValuationPlugin, setDataEntityVehicleValuationPlugin] = useState(null);
  const [dataEntityZestPlugin, setDataEntityZestPlugin] = useState(null);

  useEffect(() => {
    setDataEntityApplicantPlugin(dataEntity(applicantSchema, PluginNames.Applicant));
    setDataEntityApplicationPlugin(dataEntity(applicationschema, PluginNames.Application));
    setDataEntityCarfaxPlugin(dataEntity(carfaxSchema, PluginNames.Carfax));
    setDataEntityCoApplicantPlugin(dataEntity(coApplicantSchema, PluginNames.CoApplicant));
    setDataEntityCreditApplicantPlugin(
      dataEntity(creditApplicantSchema, PluginNames.CreditApplicant),
    );
    setDataEntityCreditCoApplicantPlugin(
      dataEntity(creditCoApplicantSchema, PluginNames.CreditCoApplicant),
    );
    setDataEntityCurrentLoanPlugin(dataEntity(currentLoanSchema, PluginNames.CurrentLoan));
    setDataEntityDealOfferedPlugin(dataEntity(dealOfferedSchema, PluginNames.DealOffered));
    setDataEntityDealRequestedPlugin(dataEntity(dealRequestedSchema, PluginNames.DealRequested));
    setDataEntityFraudApplicantPlugin(dataEntity(fraudApplicantSchema, PluginNames.FraudApplicant));
    setDataEntityFraudCoApplicantPlugin(
      dataEntity(fraudCoApplicantSchema, PluginNames.FraudCoApplicant),
    );
    setDataEntityRiskViewApplicantPlugin(
      dataEntity(riskViewApplicantSchema, PluginNames.RiskViewApplicant),
    );
    setDataEntityRiskViewCoApplicantPlugin(
      dataEntity(riskViewCoApplicantSchema, PluginNames.RiskViewCoApplicant),
    );
    setDataEntitySourcePlugin(dataEntity(sourceSchema, PluginNames.Source));
    setDataEntityVehiclePlugin(dataEntity(vehicleSchema, PluginNames.Vehicle));
    setDataEntityVehicleValuationPlugin(
      dataEntity(vehicleValuationSchema, PluginNames.VehicleValuation),
    );
    setDataEntityZestPlugin(dataEntity(zestSchema, PluginNames.Zest));
  }, []);

  return {
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
  };
};
