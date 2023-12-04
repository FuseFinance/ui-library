import { BlockTypes } from "@/cypress/utils/blockTypes";
import { AddNewBlockModalSelector, DefaultSelectors, EditableTextSelector, EditorSelector, SplitPathEditorSelector } from "@/cypress/utils/selectors";

Cypress.Commands.add(
  'createSplitPath',(blockName: string) => {
    try {
      cy.startBlockCreation(BlockTypes.SPLIT_PATH, blockName);

      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalContent)
        .find(SplitPathEditorSelector.body)
        .find(EditableTextSelector.editButton)
        .first()
        .click()
      
      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalContent)
        .find(EditableTextSelector.input)
        .first()
        .clear()
        .type('First Path')

      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalContent)
        .find(SplitPathEditorSelector.body)
        .find(SplitPathEditorSelector.input)
        .first()
        .type("values === 1");

      cy.get(SplitPathEditorSelector.addSplitPath)
        .click()

      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalContent)
        .find(SplitPathEditorSelector.body)
        .find(EditableTextSelector.editButton)
        .eq(1)
        .click()
      
      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalContent)
        .find(EditableTextSelector.input)
        .first()
        .clear()
        .type('Second Path')

      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalContent)
        .find(SplitPathEditorSelector.body)
        .find(SplitPathEditorSelector.input)
        .eq(1)
        .type("values === 1000");

      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalContent)
        .find(SplitPathEditorSelector.body)
        .find(EditableTextSelector.editButton)
        .last()
        .click()
      
      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalContent)
        .find(EditableTextSelector.input)
        .first()
        .clear()
        .type('Last or Else Path')

      cy.saveBlock();
    } catch (error) {
      cy.log(error)
    }
  }
)

Cypress.Commands.add(
  'createBlockInsideSplitPath',(pathIndex: number, blockName: string) => {
    try {
      cy.get(EditorSelector.flowcanvas)
        .find(EditorSelector.addButton)
        .eq(pathIndex)
        .click()

      cy.get(AddNewBlockModalSelector.addBlockContent)
        .find("span").contains(BlockTypes.FORMULA)
        .click()

      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalHeader)
        .find(EditableTextSelector.editButton)
        .click()
      
      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalHeader)
        .find(EditableTextSelector.input)
        .clear()
        .type(blockName)

      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalContent)
        .find(DefaultSelectors.codeEditor)
        .type("insidePath = true");

      cy.saveBlock()
      
    } catch (error) {
      cy.log(error)
    }
  }
)
