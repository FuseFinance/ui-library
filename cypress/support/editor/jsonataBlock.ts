import { BlockTypes } from '@/cypress/utils/blockTypes';
import { DefaultSelectors } from '@/cypress/utils/selectors';

Cypress.Commands.add(
  'createJsonataBlock',
  (blockName: string, expression: string) => {
    try {
      cy.startBlockCreation(BlockTypes.JSONATA, blockName);

      cy.get(DefaultSelectors.modalContent)
        .find(DefaultSelectors.codeEditor)
        .eq(0)
        .find(".cm-line")
        .click()
        .type(expression);

      cy.get(DefaultSelectors.modalContent)
        .find(DefaultSelectors.codeEditor)
        .eq(1)
        .type('outputResult');

      cy.saveBlock();
    } catch (error) {
      cy.log(error);
    }
  },
);
