/// <reference types="cypress" />

describe('Editor: If Condition Block', { testIsolation: false }, () => {
  const VersionName = `${new Date().getTime()}_CypressWorkflows`;
  const WorkflowName = `${new Date().getTime()}_CypressWF`;
  const ifConditionBlockName = `${new Date().getTime()}_IfCondition`;
  const NodeSelector = '[data-cy="EditorIds_nodeContainer"]';

  before(() => {
    cy.loginWithUi();
    cy.createVersion(VersionName);
    cy.createWorkflow(VersionName, WorkflowName)
  })

  after(() => {
    cy.deleteVersion(VersionName);
  })

  it('should successfully create the Default Block', () => {
    cy.createFormulaBlock('Default');
    cy.get(NodeSelector)
      .find("div")
      .contains('Default').should('exist');
  });

  it('should successfully create a If Condition block', () => {
    cy.createIfCondition(ifConditionBlockName);
    cy.get(NodeSelector)
      .find("div")
      .contains(ifConditionBlockName).should('exist');
  });

  it('should match test formula block', () => {
      cy.runIndividualTest(ifConditionBlockName, `{{}"values": 1{}}`, "test === 2", 'Success Criteria Met');
      cy.get('[data-cy="Icon-Cross"]')
        .click()
  });

  it('should successfully move a If Condition block', () => {
    cy.moveBlock(ifConditionBlockName);
    cy.get(NodeSelector)
      .last()
      .find("div")
      .contains(ifConditionBlockName).should('exist');
  });

  it('should successfully delete a If Condition block', () => {
    cy.wait(4000).then(() => {
      cy.deleteBlock(ifConditionBlockName);
      cy.get("div")
        .contains(ifConditionBlockName).should('not.exist');
      })
  });
});
