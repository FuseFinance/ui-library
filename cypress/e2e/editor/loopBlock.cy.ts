/// <reference types="cypress" />

describe('Editor: Loop Block', { testIsolation: false }, () => {
  const VersionName = `${new Date().getTime()}_CypressWorkflows`;
  const WorkflowName = `${new Date().getTime()}_CypressWF`;
  const loopBlockName = `${new Date().getTime()}_Loop`;
  const nestedLoopBlockName = `${new Date().getTime()}_NestedLoop`;
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

  it('should successfully create a Loop block', () => {
    cy.createLoop(loopBlockName);
    cy.get(NodeSelector).find('div').contains(loopBlockName).should('exist');
  });

  it('should successfully create a Nested Loop block', () => {
    cy.createNestedLoop(nestedLoopBlockName, 2);
    cy.get(NodeSelector).find('div').contains(nestedLoopBlockName).should('exist');
  });

  it('should successfully move a Loop block', () => {
    cy.moveBlock(loopBlockName);
    cy.get(NodeSelector).eq(1).find('div').contains(loopBlockName).should('exist');
  });

  it('should successfully delete a Loop block', () => {
    cy.wait(4000).then(() => {
      cy.deleteBlock(loopBlockName);
      cy.get('div').contains(loopBlockName).should('not.exist');
    });
  });
});
