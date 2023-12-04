/// <reference types="cypress" />

import { BlockTypes } from "@/cypress/utils/blockTypes";
import { DefaultSelectors } from "@/cypress/utils/selectors";

describe('CodeEditor', { testIsolation: false }, () => {
  const VersionName = `${new Date().getTime()}_CypressWorkflows`;
  const WorkflowName = `${new Date().getTime()}_CypressWF`;
  const formulaBlockName = `${new Date().getTime()}_Formula`;
  const envVarName = `${new Date().getTime()}_testName`;
  const envVarInput = `${new Date().getTime()}_testName`;

  before(() => {
    cy.loginWithUi();
    cy.createEnvironmentVariable(envVarName, envVarInput);
    cy.createVersion(VersionName);
    cy.createWorkflow(VersionName, WorkflowName);
  });

  after(() => {
    cy.deleteVersion(VersionName);
    cy.deleteEnvironmentVariable(envVarName);
  });

  beforeEach(() => {
    cy.startBlockCreation(BlockTypes.FORMULA, formulaBlockName);
    cy.waitForLoading();
  });

  afterEach(() => {
    cy.get(DefaultSelectors.modalCloseIcon).click();
  });

  it('should successfully write on CodeEditor', () => {
    const text = 'testing code editor';
    cy.get(DefaultSelectors.codeEditor).type(text);
    cy.get(DefaultSelectors.codeEditor).should('contain', text);
  });

  it('should successfully display env var suggestion', () => {
    const text = envVarName;
    cy.get(DefaultSelectors.codeEditor)
      .type(text)
      .then(() => {
        cy.get('.cm-tooltip-autocomplete').should('exist');
      });
  });

  it('should successfully write env var on suggestion click', () => {
    const text = envVarName;
    cy.get(DefaultSelectors.codeEditor)
      .type(text)
      .then(() => {
        cy.get('.cm-tooltip-autocomplete').click();
      });
    cy.get(DefaultSelectors.codeEditor).find('span').as('codeEditorContent');
    cy.get('@codeEditorContent').contains('env').should('exist');
    cy.get('@codeEditorContent').contains('.').should('exist');
    cy.get('@codeEditorContent').contains(envVarName).should('exist');
  });

  it('should successfully display formulas suggestions', () => {
    const text = 'calc.';
    cy.get(DefaultSelectors.codeEditor)
      .type(text)
      .then(() => {
        cy.get('.cm-tooltip-autocomplete').should('exist');
      });
  });

  it('should successfully write formula on suggestion click', () => {
    const text = 'calc.max';
    cy.get(DefaultSelectors.codeEditor)
      .type(text)
      .then(() => {
        cy.get('.cm-tooltip-autocomplete').click();
      });
    cy.get(DefaultSelectors.codeEditor).find('span').as('codeEditorContent');
    cy.get('@codeEditorContent').contains('calc').should('exist');
    cy.get('@codeEditorContent').contains('.').should('exist');
    cy.get('@codeEditorContent').contains('MAX').should('exist');
    cy.get('@codeEditorContent').contains('(').should('exist');
    cy.get('@codeEditorContent').contains(')').should('exist');
  });
});
