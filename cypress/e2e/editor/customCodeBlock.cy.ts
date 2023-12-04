/// <reference types="cypress" />

describe('Editor: Custom Code Block', { testIsolation: false }, () => {
  const VersionName = `${new Date().getTime()}_CypressWorkflows`;
  const WorkflowName = `${new Date().getTime()}_CypressWF`;
  const customCodeBlockName = `${new Date().getTime()}_CustomCode`;
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

  it('should successfully create a Custom Code block', () => {
    cy.createCustomCodeBlock(customCodeBlockName, 'return 2 + 2');
    cy.get(NodeSelector).find('div').contains(customCodeBlockName).should('exist');
  });

  it('should successfully move a Custom Code block', () => {
    cy.moveBlock(customCodeBlockName);
    cy.get(NodeSelector).last().find('div').contains(customCodeBlockName).should('exist');
  });

  it('should successfully delete a Custom Code block', () => {
    cy.wait(4000).then(() => {
      cy.deleteBlock(customCodeBlockName);
      cy.get('div').contains(customCodeBlockName).should('not.exist');
    });
  });
});
