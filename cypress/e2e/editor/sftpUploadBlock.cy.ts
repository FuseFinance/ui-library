/// <reference types="cypress" />

describe('Editor: Sftp Upload Block', { testIsolation: false }, () => {
  const VersionName = `${new Date().getTime()}_CypressWorkflows`;
  const WorkflowName = `${new Date().getTime()}_CypressWF`;
  const sftpUploadBlockName = `${new Date().getTime()}_Sftp_Upload`;
  const NodeSelector = '[data-cy="EditorIds_nodeContainer"]';

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

  it('should successfully create a Sftp Upload block', () => {
    cy.createSftpBlock(sftpUploadBlockName);
    cy.get(NodeSelector).find('div').contains(sftpUploadBlockName).should('exist');
  });

  it('should successfully move a Sftp Upload block', () => {
    cy.moveBlock(sftpUploadBlockName);
    cy.get(NodeSelector).last().find('div').contains(sftpUploadBlockName).should('exist');
  });

  it('should successfully delete a Sftp Upload block', () => {
    cy.wait(4000).then(() => {
      cy.deleteBlock(sftpUploadBlockName);
      cy.get('div').contains(sftpUploadBlockName).should('not.exist');
    });
  });
});