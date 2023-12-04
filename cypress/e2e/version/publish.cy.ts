/// <reference types="cypress" />

describe('Publish Version', { testIsolation: false }, () => {
  const VersionName = `${new Date().getTime()}_ToPublish`;
  const application_url = Cypress.env('application_url');

  before(() => {
    cy.loginWithUi();
  })

  it('should successfully create a version', () => {
    cy.createVersion(VersionName);
    cy.url().should('equal', `${application_url}/workflows/${VersionName}`)
  });

  it('should successfully create a workflow', () => {
    cy.createWorkflow(VersionName)
    cy.url().should('include', `${application_url}/editor/${VersionName}/`)
  });

  it('should successfully publish a version', () => {
    cy.publishVersion(VersionName);
    cy.url().should('include', `${application_url}/workflows/v.`)
  });

  it('should successfully deploy a version', () => {
    const PublishedTableSelector = '[data-cy="VersionsPageIds_publishVersionsTable"]';
    cy.deployVersion(VersionName);
    cy.findInVersionTable(VersionName, PublishedTableSelector).then($row => {
      if($row){
        cy.get(PublishedTableSelector)
          .find("p").contains(VersionName)
          .closest('[data-cy="VersionsTableWithMenuIds_row"]')
          .find("span")
          .contains("Production")
          .should("exist")
      }
    })
  });

  it('should successfully go to the deployed version', () => {
    const PublishedTableSelector = '[data-cy="VersionsPageIds_publishVersionsTable"]';
    cy.findInVersionTable(VersionName, PublishedTableSelector).then($row => {
      if($row){
        cy.get(PublishedTableSelector)
          .find("p").contains(VersionName)
          .closest('[data-cy="VersionsTableWithMenuIds_row"]')
          .find("span")
          .contains("Production")
          .closest('[data-cy="VersionsTableWithMenuIds_row"]')
          .find("p").contains(VersionName)
          .click()
      }
    })

    cy.url().should('include', `${application_url}/workflows/v.`)
  });
});
