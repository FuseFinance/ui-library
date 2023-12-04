import { BlockTypes } from '@/cypress/utils/blockTypes';
import { ConverterSelector, DefaultSelectors } from '@/cypress/utils/selectors';
import { BodyType } from '@/src/types/services/workflows';

Cypress.Commands.add('createConverterBlock', (blockName: string) => {
  try {
    cy.startBlockCreation(BlockTypes.CONVERTER, blockName);

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(ConverterSelector.outputVariable)
      .type('outputResult');

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(ConverterSelector.convertFrom)
      .type(BodyType.JSON);

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(ConverterSelector.convertTo)
      .type(BodyType.XML);

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(ConverterSelector.inputData)
      .find('.cm-line')
      .click()
      .type('inputData');

    cy.saveBlock();
  } catch (error) {
    cy.log(`Error creating CONVERTER block CY ${error}`);
  }
});
