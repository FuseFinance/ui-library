import { BlockTypes } from '@/cypress/utils/blockTypes';
import { AsyncResponseSelector, DefaultSelectors } from '@/cypress/utils/selectors';

Cypress.Commands.add('createAsyncResponseBlock', (blockName: string, custom: boolean) => {
  try {
    cy.viewport(2000, 768)

    cy.startBlockCreation(BlockTypes.ASYNC_RESPONSE, blockName);
    let label = 'No';

    if (custom) label = 'Yes';

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .contains(label)
      .click()

    if (custom) {

      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalContent)
        .find(AsyncResponseSelector.inputHTTPStatus)
        .type('200')

      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalContent)
        .find(AsyncResponseSelector.inputHeader)
        .find("input")
        .first()
        .type("mykey")

      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalContent)
        .find(AsyncResponseSelector.inputHeader)
        .find("input")
        .last()
        .type("myvalue{enter}")

      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalContent)
        .find(AsyncResponseSelector.inputHeader)
        .should('have.length', 2)

      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalContent)
        .find(AsyncResponseSelector.inputHeader)
        .last()
        .find("input")
        .first()
        .type("{backspace}")

      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalContent)
        .find(AsyncResponseSelector.inputHeader)
        .should('have.length', 1)

      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalContent)
        .find(AsyncResponseSelector.inputHeader)
        .find("input")
        .first()
        .type("{enter}")

      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalContent)
        .find(AsyncResponseSelector.inputHeader)
        .last()
        .find("input")
        .first()
        .type("secondkey")

      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalContent)
        .find(AsyncResponseSelector.inputHeader)
        .last()
        .find("input")
        .last()
        .type("secondval")

      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalContent)
        .find(AsyncResponseSelector.inputHeader)
        .should('have.length', 2)

    }

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(AsyncResponseSelector.inputOutputVariable)
      .type("outputResult")

    cy.saveBlock();
  } catch (error) {
    cy.log(error);
  }
});
