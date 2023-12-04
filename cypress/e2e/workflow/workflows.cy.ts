/// <reference types="cypress" />

describe('Create Workflows', { testIsolation: false }, () => {
  const VersionName = `${new Date().getTime()}_CypressWorkflows`;
  const WorkflowName = `${new Date().getTime()}_CypressWF`;
  const WorkflowRenamed = `${WorkflowName}_Renamed`;
  const application_url = Cypress.env('application_url');

  before(() => {
    cy.loginWithUi();
  })

  it('should successfully create a version', () => {
    cy.createVersion(VersionName);
    cy.url().should('equal', `${application_url}/workflows/${VersionName}`)
  });

  it('should successfully create a workflow', () => {
    cy.createWorkflow(VersionName, WorkflowName)
    cy.url().should('include', `${application_url}/editor/${VersionName}/`)
  });

  it('should successfully rename a workflow', () => {
    cy.renameWorkflow(WorkflowName, WorkflowRenamed, VersionName)
    cy.get("a").contains(WorkflowRenamed).should('exist');
  });

  it('should successfully duplicate a workflow', () => {
    cy.duplicateWorkflow(VersionName, WorkflowRenamed)
    cy.get("a").contains(`${WorkflowRenamed} (copy)`).should('exist');
  });

  it('should successfully delete a workflow', () => {
    cy.deleteWorkflow(VersionName, WorkflowRenamed)
    cy.get("p").contains(WorkflowRenamed).should('not.exist');
  });

  it('should successfully Export workflow as JSON', () => {
    const ExportImportTest = `${new Date().getTime()}_ToExport`
    cy.createWorkflow(VersionName, ExportImportTest)
    cy.copyToClipboardWorkflow(VersionName, ExportImportTest)
  });

  it('should successfully delete a version', () => {
    cy.deleteVersion(VersionName);
    cy.get("p").contains(VersionName).should('not.exist');
  });
});
