import { TestPageSelector } from '@/cypress/utils/selectors';

Cypress.Commands.add('renameWorkflowTest', (testName: string) => {
  try {
    cy.get(TestPageSelector.testSidebarItemDropdownButton).click();
    cy.get('.ant-dropdown-menu').find('span').contains('Rename').click();
    cy.get(TestPageSelector.testSidebarItemInput).focus().type(`${testName}{enter}`);
  } catch (error) {
    cy.log(error);
  }
});
