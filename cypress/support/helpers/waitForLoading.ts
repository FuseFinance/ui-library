import { Loaders } from "@/cypress/utils/selectors"

Cypress.Commands.add(
  'waitForLoading',() => {
    try {
      cy.get(Loaders.loading, { timeout: 80000 }).should('not.exist');
    } catch (error) {
      cy.log(error)
    }
  }
)
  