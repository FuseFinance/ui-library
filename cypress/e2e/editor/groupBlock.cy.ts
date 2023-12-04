/// <reference types="cypress" />

describe('Editor: Group Block', { testIsolation: false }, () => {
    const VersionName = `${new Date().getTime()}_CypressWorkflows`;
    const WorkflowName = `${new Date().getTime()}_CypressWF`;
    const groupBlockName = `${new Date().getTime()}_Group`;
    const defaultGroupName = "Group Block";
    const NodeSelector = '[data-cy="EditorIds_nodeContainer"]';
    const NodeSelectorGroup = '[data-cy="NodeGroupBlockIds_container"]';
    const blockNameInsideGroup = new Date().getTime() + '_InsideGroupBlock';

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

    it('should successfully create a Group block', () => {
      cy.createGroupBlock();
      cy.get(NodeSelector)
        .find("div")
        .contains(defaultGroupName).should('exist');
    });

    it('should successfully rename a Group block', () => {
      cy.renameGroupBlock(groupBlockName, defaultGroupName);
      cy.get('body').click(0,0);
      cy.get(NodeSelectorGroup)
        .find("div")
        .contains(groupBlockName).should('exist');
    });

    it('should successfully move a Group block', () => {
      cy.wait(4000).then(() => {
        cy.moveGroupBlock(groupBlockName);
        cy.get(NodeSelectorGroup)
          .last()
          .find("div")
          .contains(groupBlockName).should('exist');
      });
    });

    it('should successfully collapse a Group block', () => {
      cy.wait(4000).then(() => {
        cy.collapseOrExpandGroup(groupBlockName, true);
        cy.get(NodeSelector)
          .last()
          .find("div")
          .contains(groupBlockName).should('exist');
      });
    });

    it('should successfully expand a Group block', () => {
      cy.wait(4000).then(() => {
        cy.collapseOrExpandGroup(groupBlockName, false);
        cy.get(NodeSelectorGroup)
          .last()
          .find("div")
          .contains(groupBlockName).should('exist');
      });
    });

    it('should successfully create a Block inside Group Block', () => {
      cy.createBlockInsideGroup(blockNameInsideGroup);
      cy.get(NodeSelector)
        .find("div")
        .contains(blockNameInsideGroup).should('exist');
    });

    it('should successfully delete a Group block', () => {
      cy.wait(4000).then(() => {
        cy.deleteGroupBlock(groupBlockName);
        cy.get("div")
          .contains(groupBlockName).should('not.exist');
        })
    });
  });
  