import { BlockTypes } from '@/cypress/utils/blockTypes';
import { DefaultSelectors } from '@/cypress/utils/selectors';

Cypress.Commands.add(
  'createAlertBlock',
  (blockName: string, description: string) => {
    try {
      cy.startBlockCreation(BlockTypes.ALERT, blockName);

      cy.get(DefaultSelectors.modalContent)
        .find(DefaultSelectors.codeEditor)
        .eq(0)
        .find(".cm-line")
        .click()
        .type(description);

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
