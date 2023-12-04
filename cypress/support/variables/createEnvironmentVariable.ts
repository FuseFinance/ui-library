import { VariableSelector } from '@/cypress/utils/selectors';

Cypress.Commands.add('createEnvironmentVariable', (variableName: string, variableInput: string) => {
  try {
    cy.visit('/variables');
    cy.waitForLoading();
    
    cy.get(VariableSelector.createEnvVarButton).click();
    cy.get(VariableSelector.envVarNameInput).type(variableName);
    cy.get(VariableSelector.envVarProdInput).type(variableInput);
    cy.get(VariableSelector.envVarSandboxInput).type(variableInput);
    cy.get(VariableSelector.envVarDevInput).type(variableInput);

    cy.get(VariableSelector.saveEnvVarButton).click();
  } catch (error) {
    cy.log(error);
  }
});
