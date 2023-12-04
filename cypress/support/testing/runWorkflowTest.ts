import { TestPageSelector } from '@/cypress/utils/selectors';

Cypress.Commands.add('runWorkflowTest', () => {
  try {
    cy.get(TestPageSelector.runTestButton).click();
  } catch (error) {
    cy.log(error);
  }
});
