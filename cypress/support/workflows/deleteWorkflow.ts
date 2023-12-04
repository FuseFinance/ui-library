import { WorkflowsSelector, DefaultSelectors } from "@/cypress/utils/selectors";

Cypress.Commands.add(
  'deleteWorkflow',(versionName: string, wfName: string) => {
    try {
      cy.visit(`/workflows/${versionName}`)
      cy.waitForLoading();

      cy.get(WorkflowsSelector.workflowsTable)
        .find("a").contains(wfName)
        .closest(WorkflowsSelector.workflowsTableRow)
        .find(DefaultSelectors.dropdown)
        .click()

      cy.get(".ant-dropdown-menu")
        .find("p").contains("Delete")
        .click()
      
      cy.get(WorkflowsSelector.modalDelete)
        .find(".ant-btn").contains("OK")
        .click()

    } catch (error) {
      cy.log(error)
    }
  }
)
