/// <reference types="cypress" />

describe('Rebase Version', { testIsolation: false }, () => {
  const VersionName = `${new Date().getTime()}_ToPublish`;
  const VersionNameToRebase = `${new Date().getTime()}_ToRebase`;
  const application_url = Cypress.env('application_url');

  before(() => {
    cy.loginWithUi();
    cy.createVersion(VersionName);
    cy.createWorkflow(VersionName);
    cy.publishVersion(VersionName, 'production');
  })

  after(() => {
    cy.deleteVersion(VersionNameToRebase);
  })

  it('should successfully create a Version To Rebase', () => {
    cy.createVersion(VersionNameToRebase);
    cy.url().should('equal', `${application_url}/workflows/${VersionNameToRebase}`)
  });

   it('should successfully rebase a Version', () => {
    cy.checkVersionRebase(VersionNameToRebase, false)
    cy.rebaseVersion(VersionNameToRebase)
    cy.checkVersionRebase(VersionNameToRebase, true)
  });
});
