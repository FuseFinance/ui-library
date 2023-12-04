import { LogoutSelector } from "@/cypress/utils/selectors";

Cypress.Commands.add(
    'logout',() => {
        try {
          const application_url = Cypress.env('application_url');
          cy.get(LogoutSelector.logoutBtn).click()
          cy.url().should('not.equal', `${application_url}`)
          } catch (error) {
            cy.log(error)
          }
    }
  )
