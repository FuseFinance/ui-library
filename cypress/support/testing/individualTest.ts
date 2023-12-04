import { DefaultSelectors, EditorSelector, IndividualTestSelector } from "@/cypress/utils/selectors"

Cypress.Commands.add(
    'runIndividualTest',(blockName: string, inputValue: string, successCriteria: string, expectedOutput: string) => {
      try {
        cy.get(EditorSelector.nodeContainer)
          .find("div")
          .contains(blockName)
          .click()

        cy.get(DefaultSelectors.modal)
          .find(DefaultSelectors.modalFooter)
          .find("button").contains("Test")
          .click()

        cy.get(IndividualTestSelector.inputCodeEditor)
          .type("{backspace}{backspace}")
          .type(inputValue)

        cy.get(".ant-tabs-tab-btn")
          .contains("Success Criteria")
          .click()

        cy.get(IndividualTestSelector.outputContainer)
          .find(DefaultSelectors.codeEditor)
          .type(successCriteria)

        cy.get('button')
          .find("span").contains("Run Test")
          .click()

        cy.wait(4000).then(() => {
          cy.get(IndividualTestSelector.resultSection)
            .find("span").contains(expectedOutput)
            .should('exist')
        })
      } catch (error) {
        cy.log(error)
      }
    }
  )
  
  