/// <reference types="cypress" />

describe('Editor: Subworkflow Block', { testIsolation: false }, () => {
  const VersionName = `${new Date().getTime()}_CypressWorkflows`;
  const firstWorkflowName = `${new Date().getTime()}_CypressWF`;
  const secondWorkflowName = `${new Date().getTime()}_CypressWF`;
  const subworkflowBlockName = `${new Date().getTime()}_Subworkflow`;
  const NodeSelector = '[data-cy="EditorIds_nodeContainer"]';

  before(() => {
    cy.loginWithUi();
    cy.createVersion(VersionName);
    cy.createWorkflow(VersionName, firstWorkflowName);
    cy.createFormulaBlock('Default');
    cy.createWorkflow(VersionName, secondWorkflowName);
  });

  after(() => {
    cy.deleteVersion(VersionName);
  });

  it('should successfully create the Default Block', () => {
    cy.createFormulaBlock('Default');
    cy.get(NodeSelector).find('div').contains('Default').should('exist');
  });

  it('should successfully create a Subworkflow block', () => {
    cy.createSubworkflowBlock(subworkflowBlockName, firstWorkflowName, 'test');
    cy.get(NodeSelector).find('div').contains(subworkflowBlockName).should('exist');
  });

  it('should successfully move a Subworkflow block', () => {
    cy.moveBlock(subworkflowBlockName);
    cy.get(NodeSelector).last().find('div').contains(subworkflowBlockName).should('exist');
  });

  it('should successfully delete a Subworkflow block', () => {
    cy.wait(4000).then(() => {
      cy.deleteBlock(subworkflowBlockName);
      cy.get('div').contains(subworkflowBlockName).should('not.exist');
    });
  });
});
