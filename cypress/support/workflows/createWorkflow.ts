import { WorkflowsSelector } from '@/cypress/utils/selectors';

Cypress.Commands.add(
  'createWorkflow',
  (VersionName: string, workflowNameToSave?: string, applicationUrl?: string) => {
    const url = applicationUrl
      ? `${applicationUrl}/workflows/${VersionName}`
      : `/workflows/${VersionName}`;

    try {
      cy.visit(url);
      cy.waitForLoading();

      const WorkflowName = workflowNameToSave ? workflowNameToSave : 'My First Workflow';

      cy.get(WorkflowsSelector.page).then(($page) => {
        if ($page.find(WorkflowsSelector.createBtn).length > 0) {
          cy.get(WorkflowsSelector.createBtn).click({ force: true });
        } else {
          cy.get(WorkflowsSelector.createBtnDropDown).click();
          cy.get('.ant-dropdown-menu').find('span').contains('Create Workflow').click();
        }
      });

      cy.get(WorkflowsSelector.modalCreate)
        .find(WorkflowsSelector.inputCreate)
        .clear()
        .type(WorkflowName);

      cy.get(WorkflowsSelector.modalCreate).find('.ant-btn').contains('Create').click();
    } catch (error) {
      cy.log(error);
    }
  },
);
