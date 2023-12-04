import { RestoreHistorySelector } from "@/cypress/utils/selectors";

Cypress.Commands.add('checkAmountOfHistory', (amount: number) => {
  try {
    cy.get(RestoreHistorySelector.navBtn)
      .click();

    cy.get(RestoreHistorySelector.restoreModal)
      .find(RestoreHistorySelector.restoreLink)
      .should('have.length', amount)
  } catch (error) {
    cy.log(error);
  }
});


Cypress.Commands.add('restoreWfToFistState', (wfName: string) => {
  try {
    cy.get(RestoreHistorySelector.navBtn)
      .click();

      cy.wait(4000).then(() => {
        cy.get(RestoreHistorySelector.restoreModal)
          .find("div").contains(`Created workflow: ${wfName}`)
          .closest(RestoreHistorySelector.restoreBlock)
          .find(RestoreHistorySelector.restoreLink)
          .click()
      })
  } catch (error) {
    cy.log(error);
  }
});