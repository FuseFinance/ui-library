import { VersionsSelector, DefaultSelectors } from "@/cypress/utils/selectors";

Cypress.Commands.add(
  'renameVersion',(newName: string, versionName: string) => {
    try {
      cy.visit('/versions')
      cy.waitForLoading();

      cy.get(VersionsSelector.editVersionTable)
        .find("p").contains(versionName)
        .closest(VersionsSelector.versionsTableWithMenuIdsRow)
        .find(DefaultSelectors.dropdown)
        .click()

      cy.get(".ant-dropdown-menu")
        .find("p").contains("Rename")
        .click()
      
      cy.get(VersionsSelector.renameModal)
        .find(VersionsSelector.inputRename)
        .clear()
        .type(newName)

      cy.get(VersionsSelector.renameModal)
        .find(".ant-btn").contains("OK")
        .click()

      cy.get(VersionsSelector.editVersionTable)
        .find("p").contains(newName)
        .click()

    } catch (error) {
      cy.log(error)
    }
  }
)
