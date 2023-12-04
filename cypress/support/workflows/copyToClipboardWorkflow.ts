import { WorkflowsSelector, DefaultSelectors } from "@/cypress/utils/selectors";

Cypress.Commands.add(
  'copyToClipboardWorkflow',(versionName: string, wfName: string) => {
    try {
      cy.visit(`/workflows/${versionName}`)
      cy.waitForLoading();

      cy.get(WorkflowsSelector.workflowsTable)
        .find("a").contains(wfName)
        .closest(WorkflowsSelector.workflowsTableRow)
        .find(DefaultSelectors.dropdown)
        .click()

      cy.get(".ant-dropdown-menu")
        .find("p").contains("Copy to Clipboard")
        .click()
      
      cy.get("span").contains("Workflow Exported and Copied with success!")
        .should('exist')

    } catch (error) {
      cy.log(error)
    }
  }
)
