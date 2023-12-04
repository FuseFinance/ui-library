import { VersionsSelector, DefaultSelectors } from "@/cypress/utils/selectors";

Cypress.Commands.add(
  'rebaseVersion',(versionName: string) => {
    try {
      cy.visit('/versions')
      cy.waitForLoading();

      cy.get(VersionsSelector.editVersionTable)
        .find("p").contains(versionName)
        .closest(VersionsSelector.versionsTableWithMenuIdsRow)
        .find(DefaultSelectors.dropdown)
        .click()

      cy.get(".ant-dropdown-menu")
        .find("p").contains("Rebase")
        .click()

      cy.get(VersionsSelector.rebaseModal)
        .find(".ant-btn").contains("OK")
        .click()
    } catch (error) {
      cy.log(error)
    }
  }
)

Cypress.Commands.add(
  'checkVersionRebase',(versionName: string, isRebased: boolean) => {
    try {
      cy.visit('/versions')
      cy.waitForLoading();

      cy.get(VersionsSelector.editVersionTable)
        .find("p").contains(versionName)
        .closest(VersionsSelector.versionsTableWithMenuIdsRow)
        .find(VersionsSelector.tagRebase)
        .should((isRebased) ? "not.exist" : "exist")

    } catch (error) {
      cy.log(error)
    }
  }
)
