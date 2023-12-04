/// <reference types="cypress" />

describe('Editor: Alert Block', { testIsolation: false }, () => {
  const VersionName = `${new Date().getTime()}_CypressWorkflows`;
  const WorkflowName = `${new Date().getTime()}_CypressWF`;
  const alertBlockName = `${new Date().getTime()}_Alert`;
  const NodeSelector = '[data-cy="EditorIds_nodeContainer"]';

  before(() => {
    cy.loginWithUi();
    cy.createVersion(VersionName);
    cy.createWorkflow(VersionName, WorkflowName);
  });

  after(() => {
    cy.deleteVersion(VersionName);
  });

  it('should successfully create the Default Block', () => {
    cy.createFormulaBlock('Default');
    cy.get(NodeSelector).find('div').contains('Default').should('exist');
  });

  it('should successfully create a Alert block', () => {
    cy.createAlertBlock(alertBlockName, 'Mocked Alert Message');
    cy.get(NodeSelector).find('div').contains(alertBlockName).should('exist');
  });

  it('should successfully move a Alert block', () => {
    cy.moveBlock(alertBlockName);
    cy.get(NodeSelector).last().find('div').contains(alertBlockName).should('exist');
  });

  it('should successfully delete a Alert block', () => {
    cy.wait(4000).then(() => {
      cy.deleteBlock(alertBlockName);
      cy.get('div').contains(alertBlockName).should('not.exist');
    });
  });
});
