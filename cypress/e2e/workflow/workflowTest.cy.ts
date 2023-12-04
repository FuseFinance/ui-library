/// <reference types="cypress" />

import { HistorySelector, TestPageSelector, WorkflowsSelector } from "@/cypress/utils/selectors";

describe('Test workflows', { testIsolation: false }, () => {
  const VersionName = `${new Date().getTime()}_CypressWorkflows`;
  const WorkflowName = `${new Date().getTime()}_CypressWF`;
  const TestName = `${new Date().getTime()}_CypressTest`;
  const formulaBlockName = `${new Date().getTime()}_Formula`;

  before(() => {
    cy.loginWithUi();
    cy.createVersion(VersionName);
    cy.createWorkflow(VersionName, WorkflowName);
    cy.createFormulaBlock(formulaBlockName, 'test = true');
  });

  after(() => {
    cy.deleteVersion(VersionName);
  });

  it('should successfully create a test', () => {
    cy.get(WorkflowsSelector.testWorkflowButton).click();
    cy.createWorkflowTest();
    cy.get(TestPageSelector.individualTestContainer).should('exist');
  });

  it('should successfully rename a test', () => {
    cy.renameWorkflowTest(TestName);
    cy.get(TestPageSelector.testSidebarItem).find('span').contains(TestName).should('exist');
  });

  it('should successfully execute a passing successCriteria test', () => {
    cy.get(TestPageSelector.successCriteria).click().type('test == true');
    cy.runWorkflowTest();
    cy.get(HistorySelector.executionResult)
      .find('span')
      .contains('Success Criteria Met')
      .should('exist');
  });

  it('should successfully execute a not passing successCriteria test', () => {
    cy.get('.ant-tabs-tab').contains('Configuration').click();
    cy.get(TestPageSelector.successCriteria).click().type('test != true');
    cy.runWorkflowTest();
    cy.get(HistorySelector.executionResult)
      .find('span')
      .contains('Success Criteria Not Met')
      .should('exist');
  });

  it('should successfully search a test execution', () => {
    cy.get('.ant-tabs-tab').contains('Configuration').click();
    cy.get(TestPageSelector.configBody)
      .click()
      .type("{backspace}{backspace}")
      .type(`{{}"values": 1{}}`);

    cy.runWorkflowTest();

    cy.get(HistorySelector.executionItem).should('have.length', 3)

    cy.get(TestPageSelector.searchExecutionInput)
      .type(`$.input.body.values == 1`)
    
    cy.get(TestPageSelector.searchExecutionInput)
      .type(`{enter}`)

    cy.get(HistorySelector.executionItem).should('have.length', 1)
  });

  it('should successfully delete a test', () => {
    cy.deleteWorkflowTest();
    cy.wait(4000).then(() => {
      cy.get(TestPageSelector.testSidebarItem).should('not.exist');
    });
  });
});
