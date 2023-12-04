import { BlockTypes } from '@/cypress/utils/blockTypes';
import { DefaultSelectors, CustomCodeSelector } from '@/cypress/utils/selectors';

Cypress.Commands.add(
  'createCustomCodeBlock',
  (blockName: string, code: string, variableName?: string) => {
    try {
      cy.startBlockCreation(BlockTypes.CUSTOM_CODE, blockName);

      /*       cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalContent)
        .find(DefaultSelectors.codeEditor)
        .type(code); */

      cy.get(CustomCodeSelector.outputVariableInput).type(variableName || 'test');

      cy.saveBlock();
    } catch (error) {
      cy.log(error);
    }
  },
);
