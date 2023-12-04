/// <reference types="cypress" />

describe('Editor: Jsonata Block', { testIsolation: false }, () => {
  const VersionName = `${new Date().getTime()}_CypressWorkflows`;
  const WorkflowName = `${new Date().getTime()}_CypressWF`;
  const JsonataBlockName = `${new Date().getTime()}_Jsonata`;
  const NodeSelector = '[data-cy="EditorIds_nodeContainer"]';
  const JsonataResultName = 'MockedName';

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

  it('should successfully create a Jsonata block', () => {
    cy.createJsonataBlock(JsonataBlockName, `{{}"STIPULATIONS" : stipulations.name{}}`);
    cy.get(NodeSelector).find('div').contains(JsonataBlockName).should('exist');
  });

  it('should match test Jsonata block', () => {
    cy.runIndividualTest(JsonataBlockName, 
      `{{}"stipulations" : {{} "name": "${JsonataResultName}"{}}{}}`, 
      `outputResult.STIPULATIONS === "${JsonataResultName}"`, 
      'Success Criteria Met');
    cy.get('[data-cy="Icon-Cross"]')
      .click()
  }); 

  it('should successfully move a Jsonata block', () => {
    cy.moveBlock(JsonataBlockName);
    cy.get(NodeSelector).last().find('div').contains(JsonataBlockName).should('exist');
  });

  it('should successfully delete a Jsonata block', () => {
    cy.wait(4000).then(() => {
      cy.deleteBlock(JsonataBlockName);
      cy.get('div').contains(JsonataBlockName).should('not.exist');
    });
  });
});
