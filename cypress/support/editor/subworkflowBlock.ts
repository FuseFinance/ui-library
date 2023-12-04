import { BlockTypes } from '@/cypress/utils/blockTypes';
import { DefaultSelectors, SubworkflowSelector } from '@/cypress/utils/selectors';

Cypress.Commands.add(
  'createSubworkflowBlock',
  (blockName: string, blockToConnect: string, variableName?: string) => {
    try {
      cy.startBlockCreation(BlockTypes.SUB_WORKFLOW, blockName);

      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalContent)
        .find(SubworkflowSelector.autocompleteInput)
        .type(blockToConnect);

      cy.get('.ant-select-dropdown').find('div').contains(blockToConnect).click();

      cy.get(SubworkflowSelector.variableNameInput).type(variableName || 'test');

      cy.saveBlock();
    } catch (error) {
      cy.log(error);
    }
  },
);
