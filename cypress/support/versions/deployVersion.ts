import { VersionsSelector, DeployModalSelector, DefaultSelectors, PublishVersionSelector } from "@/cypress/utils/selectors";

Cypress.Commands.add(
  'deployVersion',(versionName: string) => {
    const publishedName = `${versionName}_PublishName`;
    try {
      cy.visit('/versions')
      cy.waitForLoading();

      cy.findInVersionTable(versionName, VersionsSelector.publishVersionsTable)
        .then($row => {
          if($row ){
            cy.get(VersionsSelector.publishVersionsTable)
              .find("p").contains(publishedName)
              .closest(VersionsSelector.versionsTableWithMenuIdsRow)
              .find(DefaultSelectors.dropdown)
              .click()
          }
        })

      cy.get(".ant-dropdown-menu")
        .find("p").contains("Deploy")
        .click()
      
      cy.get(DeployModalSelector.modal)
        .find(DeployModalSelector.options)
        .find("label[for=production]")
        .click()

      cy.get(DeployModalSelector.deployBtn)
        .click()
    } catch (error) {
      cy.log(error)
    }
  }
)
