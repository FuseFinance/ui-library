import { WorkflowsSelector, DefaultSelectors } from "@/cypress/utils/selectors";

Cypress.Commands.add(
  'renameWorkflow',(wfName: string, newWfName: string, versionName: string) => {
    try {
      cy.visit(`/workflows/${versionName}`)
      cy.waitForLoading();

      cy.get(WorkflowsSelector.workflowsTable)
        .find("a").contains(wfName)
        .closest(WorkflowsSelector.workflowsTableRow)
        .find(DefaultSelectors.dropdown)
        .click()

      cy.get(".ant-dropdown-menu")
        .find("p").contains("Rename")
        .click()
      
      cy.get(WorkflowsSelector.modalRename)
        .find(WorkflowsSelector.inputRename)
        .clear()
        .type(newWfName)

      cy.get(WorkflowsSelector.modalRename)
        .find(".ant-btn").contains("OK")
        .click()
    } catch (error) {
      cy.log(error)
    }
  }
)
