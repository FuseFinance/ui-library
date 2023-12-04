/// <reference types="cypress" />

describe('Editor: Go To Block', { testIsolation: false }, () => {
    const VersionName = `${new Date().getTime()}_CypressWorkflows`;
    const WorkflowName = `${new Date().getTime()}_CypressWF`;
    const goToBlockName = `${new Date().getTime()}_GoTo`;
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

    it('should successfully create a Go To block', () => {
      cy.createGoToBlock(goToBlockName, 'Default');
      cy.get(NodeSelector)
        .find("div")
        .contains(goToBlockName).should('exist');
    });

    it('should successfully move a Go To block', () => {
      cy.moveBlock(goToBlockName);
      cy.get(NodeSelector)
        .last()
        .find("div")
        .contains(goToBlockName).should('exist');

      cy.wait(4000).then(() => {
        cy.checkIfGotoIsEmpty(goToBlockName)
      })
    });

    it('should successfully move a Target and reset Go To Block', () => {
      const goToBlockNameToReset = `${new Date().getTime()}_GoToReset`;
      cy.createGoToBlock(goToBlockNameToReset, goToBlockName);
      
      cy.wait(4000).then(() => {
        cy.moveBlock(goToBlockName);
      })
      cy.wait(4000).then(() => {
        cy.checkIfGotoIsEmpty(goToBlockNameToReset)
      })
    });

    it('should successfully delete a Go To block', () => {
      cy.wait(4000).then(() => {
        cy.deleteBlock(goToBlockName);
        cy.get("div")
          .contains(goToBlockName).should('not.exist');
        })
    });
  });
  