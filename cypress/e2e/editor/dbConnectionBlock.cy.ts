/// <reference types="cypress" />

describe('Editor: DB Coonection Block', { testIsolation: false }, () => {
  const VersionName = `${new Date().getTime()}_CypressWorkflows`;
  const WorkflowName = `${new Date().getTime()}_CypressWF`;
  const dbConnectionBlockName = `${new Date().getTime()}_DB_Connection`;
  const NodeSelector = '[data-cy="EditorIds_nodeContainer"]';

  before(() => {
    cy.loginWithUi();
    cy.createVersion(VersionName);
    cy.createWorkflow(VersionName, WorkflowName);
  });

  after(() => {
    cy.deleteVersion(VersionName);
  });

  it('Should successfully create the Default Block', () => {
    cy.createDBConnectionBlock(dbConnectionBlockName);
    cy.get(NodeSelector).find('div').contains(dbConnectionBlockName).should('exist');
  });

  it('Should successfully create a DB Connection block', () => {
    cy.createDBConnectionBlock(dbConnectionBlockName);

    cy.get(NodeSelector).find('div').contains(dbConnectionBlockName).should('exist');
  });

  it('Should successfully move a DB Connection block', () => {
    cy.moveBlock(dbConnectionBlockName);
    cy.get(NodeSelector).last().find('div').contains(dbConnectionBlockName).should('exist');
  });

  it('Should successfully delete a DB Connection block', () => {
    cy.wait(4000).then(() => {
      cy.deleteBlock(dbConnectionBlockName);
      cy.get('div').contains(dbConnectionBlockName).should('not.exist');
    });
  });
});
