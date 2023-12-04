/// <reference types="cypress" />

describe('Editor: Api Call Block', { testIsolation: false }, () => {
    const VersionName = `${new Date().getTime()}_CypressWorkflows`;
    const WorkflowName = `${new Date().getTime()}_CypressWF`;
    const apiCallBlockName = `${new Date().getTime()}_ApiCall`;
    const NodeSelector = '[data-cy="EditorIds_nodeContainer"]';

    const Methods = {
      GET: 'GET',
      POST: 'POST',
    }

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

    it('should successfully CREATE and TEST a GET ApiCall block without certificate', () => {
      const blockByMethod = `${apiCallBlockName}_${Methods.GET}`;
      const withCertificate = false;
      cy.createApiCallBlock(blockByMethod, Methods.GET, withCertificate);
      cy.get(NodeSelector)
        .find("div")
        .contains(blockByMethod).should('exist');

      cy.runIndividualTest(blockByMethod, `{{}{}}`, `outputResult.request && outputResult.request.method === "${Methods.GET}" && outputResult.response`, 'Success');
      cy.get('[data-cy="Icon-Cross"]')
        .click()
    });

    it('should successfully CREATE and TEST a POST ApiCall block with certificate', () => {
      const blockByMethod = `${apiCallBlockName}_${Methods.POST}`
      const withCertificate = true;
      cy.createApiCallBlock(blockByMethod, Methods.POST, withCertificate);
      cy.get(NodeSelector)
        .find("div")
        .contains(blockByMethod).should('exist');
    
      cy.runIndividualTest(blockByMethod, `{{}{}}`, `outputResult.request && outputResult.request.method === "${Methods.POST}" && outputResult.response`, 'Success');
      cy.get('[data-cy="Icon-Cross"]')
        .click()
    });

    it('should successfully move a ApiCall block', () => {
      cy.moveBlock(apiCallBlockName);
      cy.get(NodeSelector)
        .last()
        .find("div")
        .contains(apiCallBlockName).should('exist');
    });

    it('should successfully delete the GET ApiCall block', () => {
      cy.wait(4000).then(() => {
        const blockByMethod = `${apiCallBlockName}_${Methods.GET}`
        cy.deleteBlock(blockByMethod);
        cy.get("div")
          .contains(blockByMethod).should('not.exist');
        })
    });
  });
  