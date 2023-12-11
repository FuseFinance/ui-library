export type PluginPrecedence = 'highest' | 'high' | 'default' | 'low' | 'lowest';

// These are being used as default parameters
/* eslint-disable no-unused-vars */
export enum PluginNames {
  Env = 'env',
  Formula = 'calc',
  Zest = 'zest',
  Carfax = 'carfax',
  Source = 'source',
  Vehicle = 'vehicle',
  Applicant = 'applicant',
  Application = 'application',
  CoApplicant = 'coapplicant',
  CurrentLoan = 'current_loan',
  DealOffered = 'deal_offered',
  DealRequested = 'deal_requested',
  FraudApplicant = 'fraud_applicant',
  CreditApplicant = 'credit_applicant',
  FraudCoApplicant = 'fraud_coapplicant',
  VehicleValuation = 'vehicle_valuation',
  CreditCoApplicant = 'credit_coapplicant',
  RiskViewApplicant = 'riskview_applicant',
  RiskViewCoApplicant = 'riskview_coapplicant',
  ConfigVars = 'config',
  TempVars = 'temp',
  Utils = 'Utils',
  Interpolations = 'interpolations',
}

export interface IEditorPlugin {
  name: PluginNames;
  isModule: boolean;
  decorationClass: string;
  matchRegex?: RegExp;
  options?: Record<string, any>;
  precedence?: PluginPrecedence;
}
