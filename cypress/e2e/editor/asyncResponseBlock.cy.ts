/// <reference types="cypress" />

describe('Editor: Async Response Block', { testIsolation: false }, () => {
  const VersionName = `${new Date().getTime()}_CypressWorkflows`;
  const WorkflowName = `${new Date().getTime()}_CypressWF`;
  const asyncResponseBlockName = `${new Date().getTime()}_Async`;
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

  it('should successfully CREATE and TEST a non Custom Response block', () => {
    const blockByMethod = `${asyncResponseBlockName}_NoCustom`
    const custom = false;
    cy.createAsyncResponseBlock(blockByMethod, custom);
    cy.get(NodeSelector)
      .find("div")
      .contains(blockByMethod).should('exist');
    cy.runIndividualTest(blockByMethod, `{{}{}}`, `outputResult.response && outputResult.request.httpStatus === 200`, 'Success');
    cy.get('[data-cy="Icon-Cross"]')
      .click()
  });

  it('should successfully CREATE and TEST a Custom Response block', () => {
    const blockByMethod = `${asyncResponseBlockName}_Custom`
    const custom = true;
    cy.createAsyncResponseBlock(blockByMethod, custom);
    cy.get(NodeSelector)
      .find("div")
      .contains(blockByMethod).should('exist');
    cy.runIndividualTest(blockByMethod, `{{}{}}`, `outputResult.response && outputResult.request.httpStatus === 200`, 'Success');
    cy.get('[data-cy="Icon-Cross"]')
      .click()
  });

  it('should successfully move a Async Response block', () => {
    cy.moveBlock(asyncResponseBlockName);
    cy.get(NodeSelector)
      .last()
      .find("div")
      .contains(asyncResponseBlockName).should('exist');
  });

  it('should successfully delete the non Custom Response block', () => {
    cy.wait(4000).then(() => {
      const blockByMethod = `${asyncResponseBlockName}_NoCustom`
      cy.deleteBlock(blockByMethod);
      cy.get("div")
        .contains(blockByMethod).should('not.exist');
    })
  });

  it('should successfully delete the Custom Response block', () => {
    cy.wait(4000).then(() => {
      const blockByMethod = `${asyncResponseBlockName}_Custom`
      cy.deleteBlock(blockByMethod);
      cy.get("div")
        .contains(blockByMethod).should('not.exist');
    })
  });
});
