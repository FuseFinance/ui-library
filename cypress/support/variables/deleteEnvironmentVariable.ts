import { VariableSelector } from '@/cypress/utils/selectors';

Cypress.Commands.add('deleteEnvironmentVariable', (variableName: string) => {
  try {
    cy.visit('/variables');
    cy.waitForLoading();
    
    cy.get(VariableSelector.tableRow).find('div').contains(variableName).click();
    cy.get(VariableSelector.deleteEnvVarButton).click();
    cy.get('button').find('span').contains('Yes').click();
  } catch (error) {
    cy.log(error);
  }
});
