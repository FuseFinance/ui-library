/// <reference types="cypress" />

describe('Create Version', { testIsolation: false }, () => {
  const VersionName = `${new Date().getTime()}_CypressVersion`;
  const VersionToRename = `CypressVersion_renamed`;
  const application_url = Cypress.env('application_url');

  before(() => {
    cy.loginWithUi();
  })

  it('should successfully create a version', () => {
    cy.createVersion(VersionName);
    cy.url().should('equal', `${application_url}/workflows/${VersionName}`)
  });

  it('should successfully rename a version', () => {
    cy.renameVersion(VersionToRename, VersionName);
    cy.url().should('equal', `${application_url}/workflows/${VersionToRename}`)
  });

  it('should successfully delete a version', () => {
    cy.deleteVersion(VersionToRename);
    cy.get("p").contains(VersionToRename).should('not.exist');
  });
});
