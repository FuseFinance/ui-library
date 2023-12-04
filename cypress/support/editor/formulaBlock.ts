import { BlockTypes } from '@/cypress/utils/blockTypes';
import { DefaultSelectors } from '@/cypress/utils/selectors';

Cypress.Commands.add('createFormulaBlock', (blockName: string, formula?: string) => {
  try {
    cy.startBlockCreation(BlockTypes.FORMULA, blockName);

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(DefaultSelectors.codeEditor)
      .type(formula || 'test = values + 1');

    cy.saveBlock();
  } catch (error) {
    cy.log(error);
  }
});
