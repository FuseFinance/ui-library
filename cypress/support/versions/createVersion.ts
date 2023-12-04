import { VersionsSelector } from '@/cypress/utils/selectors';

Cypress.Commands.add('createVersion', (VersionName: string, applicationUrl?: string) => {
  const url = applicationUrl ? `${applicationUrl}/versions` : '/versions';
  try {
    cy.visit(url);
    cy.waitForLoading();

    cy.get(VersionsSelector.openModalBtn).click({ force: true });
    cy.get(VersionsSelector.input).type(VersionName);
    cy.get(VersionsSelector.versionsTable)
      .find(VersionsSelector.versionsTableWithMenuIdsRow)
      .last()
      .click();
      
    cy.get(VersionsSelector.createBtn).click({ force: true });
  } catch (error) {
    cy.log(error);
  }
});
