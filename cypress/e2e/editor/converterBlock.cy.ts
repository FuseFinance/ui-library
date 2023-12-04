/// <reference types="cypress" />

describe('Editor: Converter Block', { testIsolation: false }, () => {
  const VersionName = `${new Date().getTime()}_CypressWorkflows`;
  const WorkflowName = `${new Date().getTime()}_CypressWF`;
  const converterBlockName = `${new Date().getTime()}_Converter`;
  const NodeSelector = '[data-cy="EditorIds_nodeContainer"]';

  before(() => {
    cy.loginWithUi();
    cy.createVersion(VersionName);
    cy.createWorkflow(VersionName, WorkflowName);
  });

  after(() => {
    cy.deleteVersion(VersionName);
  });

  it('Should successfully create the Default Block', () => {
    cy.createConverterBlock(converterBlockName);
    cy.get(NodeSelector).find('div').contains(converterBlockName).should('exist');
  });

  it('Should successfully create a Converter block', () => {
    cy.createConverterBlock(converterBlockName);

    cy.get(NodeSelector).find('div').contains(converterBlockName).should('exist');
  });

  it('Should successfully move a Converter block', () => {
    cy.moveBlock(converterBlockName);
    cy.get(NodeSelector).last().find('div').contains(converterBlockName).should('exist');
  });

  it('Should successfully delete a Converter block', () => {
    cy.wait(4000).then(() => {
      cy.deleteBlock(converterBlockName);
      cy.get('div').contains(converterBlockName).should('not.exist');
    });
  });
});
