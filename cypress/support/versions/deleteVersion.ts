import { VersionsSelector, DefaultSelectors } from "@/cypress/utils/selectors";

Cypress.Commands.add(
  'deleteVersion',(versionName: string) => {
    try {
      cy.visit('/versions')
      cy.waitForLoading();

      cy.get(VersionsSelector.editVersionTable)
        .find("p").contains(versionName)
        .closest(VersionsSelector.versionsTableWithMenuIdsRow)
        .find(DefaultSelectors.dropdown)
        .click()

      cy.get(".ant-dropdown-menu")
        .find("p").contains("Delete")
        .click()
      
      cy.get(VersionsSelector.deleteModal)
        .find(".ant-btn").contains("OK")
        .click()

    } catch (error) {
      cy.log(error)
    }
  }
)
