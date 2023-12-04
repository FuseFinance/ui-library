/// <reference types="cypress" />

describe('Editor: S3 Upload Block', { testIsolation: false }, () => {
  const VersionName = `${new Date().getTime()}_CypressWorkflows`;
  const WorkflowName = `${new Date().getTime()}_CypressWF`;
  const s3UploadBlockName = `${new Date().getTime()}_S3_Upload`;
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

  it('should successfully create a S3 Upload block', () => {
    cy.createS3Block(s3UploadBlockName);
    cy.get(NodeSelector).find('div').contains(s3UploadBlockName).should('exist');
  });

  it('should successfully move a S3 Upload block', () => {
    cy.moveBlock(s3UploadBlockName);
    cy.get(NodeSelector).last().find('div').contains(s3UploadBlockName).should('exist');
  });

  it('should successfully delete a S3 Upload block', () => {
    cy.wait(4000).then(() => {
      cy.deleteBlock(s3UploadBlockName);
      cy.get('div').contains(s3UploadBlockName).should('not.exist');
    });
  });
});
