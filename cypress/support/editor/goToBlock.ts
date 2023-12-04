import { BlockTypes } from '@/cypress/utils/blockTypes';
import { DefaultSelectors, EditorSelector, GoToSelector } from '@/cypress/utils/selectors';

Cypress.Commands.add('createGoToBlock', (blockName: string, blockToConnect: string) => {
  try {
    cy.startBlockCreation(BlockTypes.GO_TO, blockName);

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(GoToSelector.autocompleteInput)
      .type(blockToConnect);

    cy.get('.ant-select-dropdown')
      .find("div").contains(blockToConnect)
      .click()

    cy.saveBlock();
  } catch (error) {
    cy.log(error);
  }
});

Cypress.Commands.add('checkIfGotoIsEmpty', (goToBlockName: string) => {
  try {
    cy.get(EditorSelector.nodeContainer)
      .find("div")
      .contains(goToBlockName)
      .click()
          
    cy.get(GoToSelector.autocompleteInput)
      .should('have.value', '')

    cy.get('[data-cy="Icon-Cross"]')
      .click()
  } catch (error) {
    cy.log(error);
  }
});
