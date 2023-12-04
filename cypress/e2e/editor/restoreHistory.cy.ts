/// <reference types="cypress" />

describe('Editor: Restore History', { testIsolation: false }, () => {
    const VersionName = `${new Date().getTime()}_CypressWorkflows`;
    const WorkflowName = `${new Date().getTime()}_CypressWF`;
    const formulaBlockName = `${new Date().getTime()}_Formula`;
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

    it('should successfully create a Formula block', () => {
      cy.createFormulaBlock(formulaBlockName);
      cy.get(NodeSelector)
        .find("div")
        .contains(formulaBlockName).should('exist');

      cy.checkAmountOfHistory(3);
      cy.get('[data-cy="Icon-Cross"]')
        .click();
    });

    it('should successfully delete a Formula block', () => {
      cy.wait(4000).then(() => {
        cy.deleteBlock(formulaBlockName);
        cy.get("div")
          .contains(formulaBlockName).should('not.exist');
        })
        cy.checkAmountOfHistory(4);
        cy.get('[data-cy="Icon-Cross"]')
          .click();
    });

    it('should successfully Restore to the fist Step', () => {
        cy.restoreWfToFistState(WorkflowName)
        cy.wait(4000).then(() => {
          cy.checkAmountOfHistory(5);
        })
        cy.get("h2")
          .contains("Version Restored")
          .should("exist")
        cy.get(NodeSelector)
          .find("div")
          .contains(formulaBlockName).should('not.exist');
    });
  });
  