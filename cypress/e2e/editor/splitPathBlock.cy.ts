/// <reference types="cypress" />

describe('Editor: Split Path Block', { testIsolation: false }, () => {
  const VersionName = `${new Date().getTime()}_CypressWorkflows`;
  const WorkflowName = `${new Date().getTime()}_CypressWF`;
  const ifConditionBlockName = `${new Date().getTime()}_SplitPath`;
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

  it('should successfully create a Split Path block', () => {
    cy.createSplitPath(ifConditionBlockName);
    cy.get(NodeSelector)
      .find("div")
      .contains(ifConditionBlockName).should('exist');
  });

  it('should successfully create a Block inside Split Path', () => {
    const blockNameInsideSplitpath = new Date().getTime() + '_InsideSplitPath';

    cy.createBlockInsideSplitPath(4, blockNameInsideSplitpath);
    cy.get(NodeSelector)
      .find("div")
      .contains(blockNameInsideSplitpath).should('exist');
  });

  it('should successfully move a Split Path block', () => {
    cy.moveBlock(ifConditionBlockName);
    cy.get(NodeSelector)
      .eq(1)
      .find("div")
      .contains(ifConditionBlockName).should('exist');
  });

  it('should successfully delete a Split Path block', () => {
    cy.wait(4000).then(() => {
      cy.deleteBlock(ifConditionBlockName);
      cy.get("div")
        .contains(ifConditionBlockName).should('not.exist');
      })
  });
});
