import { BlockTypes } from '@/cypress/utils/blockTypes';
import { ApiCallSelector, DefaultSelectors, EditorSelector } from '@/cypress/utils/selectors';

Cypress.Commands.add('createApiCallBlock', (blockName: string, method: string, withCertificate: boolean) => {
  try {
    let label = 'No';
    if (withCertificate) label = 'Yes';

    cy.startBlockCreation(BlockTypes.API_CALL, blockName);

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(ApiCallSelector.selectMethodDropdown)
      .click()

    cy.get('.ant-dropdown-menu')
      .find("span").contains(method)
      .click()

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(ApiCallSelector.inputURL)
      .type(`http://mocked.com/${method}`)
    
    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(ApiCallSelector.inputHeader)
      .find("input")
      .first()
      .type("mykey")

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(ApiCallSelector.inputHeader)
      .find("input")
      .last()
      .type("myvalue{enter}")

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(ApiCallSelector.inputHeader)
      .should('have.length', 2)

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(ApiCallSelector.inputHeader)
      .last()
      .find("input")
      .first()
      .type("{backspace}")
    
    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(ApiCallSelector.inputHeader)
      .should('have.length', 1)

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(ApiCallSelector.inputHeader)
      .find("input")
      .first()
      .type("{enter}")

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(ApiCallSelector.inputHeader)
      .last()
      .find("input")
      .first()
      .type("secondkey")

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(ApiCallSelector.inputHeader)
      .last()
      .find("input")
      .last()
      .type("secondval")
    
    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(ApiCallSelector.inputHeader)
      .should('have.length', 2)
  
    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .contains(label)
      .click()

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(ApiCallSelector.inputOutputVariable)
      .type("outputResult")

    cy.saveBlock();
  } catch (error) {
    cy.log(error);
  }
});
