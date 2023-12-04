import { TestPageSelector } from '@/cypress/utils/selectors';

Cypress.Commands.add('createWorkflowTest', (VersionName?: string, workflowId?: string) => {
  try {
    if (workflowId) {
      cy.visit(`/tests/${VersionName}/${workflowId}`);
      cy.waitForLoading();
    }

    cy.get(TestPageSelector.createTestButton).then(($button) => {
      if ($button) {
        cy.get(TestPageSelector.createTestButton).click();
      } else {
        cy.get(TestPageSelector.addDropdownButton).click();
        cy.get('.ant-dropdown-menu').find('span').contains('Workflow Test').click();
      }
    });
  } catch (error) {
    cy.log(error);
  }
});
