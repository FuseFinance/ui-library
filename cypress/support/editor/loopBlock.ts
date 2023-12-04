import { BlockTypes } from '@/cypress/utils/blockTypes';
import {
  AddNewBlockModalSelector,
  DefaultSelectors,
  EditableTextSelector,
  EditorSelector,
} from '@/cypress/utils/selectors';

Cypress.Commands.add('createLoop', (blockName: string) => {
  try {
    cy.startBlockCreation(BlockTypes.LOOP, blockName);

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(DefaultSelectors.codeEditor)
      .first()
      .type('2');

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(DefaultSelectors.codeEditor)
      .last()
      .type('loopTest');

    cy.saveBlock();
  } catch (error) {
    cy.log(error);
  }
});

Cypress.Commands.add('createNestedLoop', (blockName: string, edgePos: number) => {
  try {
    cy.get(EditorSelector.flowcanvas).find(EditorSelector.addButton).eq(edgePos).click();

    cy.get(AddNewBlockModalSelector.addBlockContent).find('span').contains(BlockTypes.LOOP).click();

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalHeader)
      .find(EditableTextSelector.editButton)
      .click();

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalHeader)
      .find(EditableTextSelector.input)
      .clear()
      .type(blockName);

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(DefaultSelectors.codeEditor)
      .first()
      .type('2');

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(DefaultSelectors.codeEditor)
      .last()
      .type('loopTest');

    cy.saveBlock();
  } catch (error) {
    cy.log(error);
  }
});
