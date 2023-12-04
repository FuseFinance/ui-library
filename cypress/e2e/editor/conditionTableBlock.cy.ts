/// <reference types="cypress" />

describe('Editor: Condition Table Block', { testIsolation: false }, () => {
    const VersionName = `${new Date().getTime()}_CypressWorkflows`;
    const WorkflowName = `${new Date().getTime()}_CypressWF`;
    const conditionTabBlockName = `${new Date().getTime()}_ConditionTable`;
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

    it('should successfully create a Condition Table block', () => {
      cy.createConditionTableBlock(conditionTabBlockName);
      cy.get(NodeSelector)
        .find("div")
        .contains(conditionTabBlockName).should('exist');
    });

    it('should match test Condition Table block', () => {
        cy.runIndividualTest(conditionTabBlockName, `{{}"var1": 0, "var2": 1{}}`, 'outputResult === "a1"', 'Success Criteria Met');
        cy.get('[data-cy="Icon-Cross"]')
          .click()
    });

    it('should successfully add Cols and Rows in Table block', () => {
      cy.addTopAndSideColAndRows(conditionTabBlockName);
      cy.get('[data-cy="Icon-Cross"]')
          .click()
    });

    it('should successfully add Left and Top Headers in Table block', () => {
      cy.addTopAndSideHeaders(conditionTabBlockName);
      cy.get('[data-cy="Icon-Cross"]')
          .click()
    });

    it('should successfully move a Condition Table block', () => {
      cy.moveBlock(conditionTabBlockName);
      cy.get(NodeSelector)
        .last()
        .find("div")
        .contains(conditionTabBlockName).should('exist');
    });

    it('should successfully delete a Condition Table block', () => {
      cy.wait(4000).then(() => {
        cy.deleteBlock(conditionTabBlockName);
        cy.get("div")
          .contains(conditionTabBlockName).should('not.exist');
        })
    });
  });
  