/// <reference types="cypress" />

import { DefaultSelectors, SharedWorkflowsSelector, WorkflowsSelector } from '../../utils/selectors';
import { workflowJson } from '../../utils/workflowJson';

describe('Create Workflows', { testIsolation: false }, () => {
  const VersionName = `${new Date().getTime()}_CypressWorkflows`;
  const application_url = Cypress.env('application_url');
  const workflowJsonString = JSON.stringify(workflowJson, null, 2);

  // Commented lines covers Import Shared Workflow tests that will not be used until we can implement necesary infra for them
  /*const application_second_url = Cypress.env('application_second_url');
  const WorkflowName = `${new Date().getTime()}_CypressWF`; */

  before(() => {
    /*  cy.loginWithUi(application_second_url);
    cy.createVersion(VersionName, application_second_url);
    cy.createWorkflow(VersionName, WorkflowName, application_second_url);
    cy.publishVersion(VersionName, 'production', application_second_url); */
    cy.loginWithUi(application_url);
    cy.createVersion(VersionName, application_url);
  });

  after(() => {
    cy.deleteVersion(VersionName);
  });

  it('should successfully render Import Shared Workflow and Import Workflow from JSON option on Create Workflow dropdown', () => {
    cy.get(WorkflowsSelector.createBtnDropDown).click();
    cy.get('.ant-dropdown-menu-item')
      .find('span')
      .contains('Import Shared Workflow')
      .should('exist');

    cy.get('.ant-dropdown-menu-item')
      .find('span')
      .contains('Import Workflow from JSON')
      .should('exist');
  });

  it('should successfully render Import Workflow from JSON modal after Import Workflow from JSON option click', () => {
    cy.get('.ant-dropdown-menu').find('span').contains('Import Workflow from JSON').click();
    cy.get(SharedWorkflowsSelector.modalImportSharedWfJson).should('exist');
  });

  it('should successfully type workflow json on textarea', () => {
    cy.get('textarea').type(workflowJsonString, { parseSpecialCharSequences: false, delay: 0 });
  });

  it('should successfully import JSON workflow on import click', () => {
    cy.get(DefaultSelectors.modalFooter).find('span').contains('Import').click();
    cy.get(WorkflowsSelector.workflowsTableRow).should('exist');
  });

  /*
    it('should successfully render Import Shared Workflow modal after Import Shared Workflow option click', () => {
    cy.get('.ant-dropdown-menu').find('span').contains('Import Shared Workflow').click();
    cy.get(SharedWorkflowsSelector.modalImportSharedWf).should('exist');
  });
  
  it('should have published versions table populated', () => {
    cy.get(VersionsSelector.versionsTableWithMenuIdsRow).should('exist');
  });
    it('should successfully import shared workflow on import click', () => {
    cy.get(SharedWorkflowsSelector.modalImportSharedWf)
      .find(VersionsSelector.versionsTableWithMenuIdsRow)
      .click();
    cy.get(SharedWorkflowsSelector.importButton).click();
    cy.get(WorkflowsSelector.workflowsTableRow).should('exist');
  });


  it('should successfully import shared workflow on import click', () => {
    cy.get(SharedWorkflowsSelector.modalImportSharedWf)
      .find(VersionsSelector.versionsTableWithMenuIdsRow)
      .click();
    cy.get(SharedWorkflowsSelector.importButton).click();
    cy.get(WorkflowsSelector.workflowsTableRow).should('exist');
  });
  
  */
});
