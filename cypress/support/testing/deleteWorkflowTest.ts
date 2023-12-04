import { TestPageSelector } from '@/cypress/utils/selectors';

Cypress.Commands.add('deleteWorkflowTest', (VersionName?: string, workflowId?: string) => {
  try {
    if (workflowId) {
      cy.visit(`/tests/${VersionName}/${workflowId}`);
      cy.waitForLoading();
    }

    cy.get(TestPageSelector.testSidebarItemDropdownButton).click();
    cy.get('.ant-dropdown-menu').find('span').contains('Delete').click();
  } catch (error) {
    cy.log(error);
  }
});
