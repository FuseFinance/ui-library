import { BlockTypes } from "@/cypress/utils/blockTypes";
import { DefaultSelectors, IfConditionEditorSelector } from "@/cypress/utils/selectors";

Cypress.Commands.add(
  'createIfCondition',(blockName: string) => {
    try {
      cy.startBlockCreation(BlockTypes.IF_CONDITION, blockName);

      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalContent)
        .find(IfConditionEditorSelector.body)
        .find(IfConditionEditorSelector.ifInputContainer)
        .find(DefaultSelectors.codeEditor)
        .first()
        .type("values === 1");

      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalContent)
        .find(IfConditionEditorSelector.body)
        .find(IfConditionEditorSelector.ifInputContainer)
        .find(DefaultSelectors.codeEditor)
        .last()
        .type("test = 2");

      cy.get(IfConditionEditorSelector.addElseIfBtn)
        .click()

      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalContent)
        .find(IfConditionEditorSelector.body)
        .find(IfConditionEditorSelector.ifInputContainer)
        .last()
        .find(DefaultSelectors.codeEditor)
        .first()
        .type("values === 2000");

      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalContent)
        .find(IfConditionEditorSelector.body)
        .find(IfConditionEditorSelector.ifInputContainer)
        .find(DefaultSelectors.codeEditor)
        .last()
        .type("test = 2000");

      cy.get(IfConditionEditorSelector.addElseBtn)
        .click()

      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalContent)
        .find(IfConditionEditorSelector.body)
        .find(IfConditionEditorSelector.elseInputContainer)
        .find(DefaultSelectors.codeEditor)
        .last()
        .type("test = 0");

      cy.saveBlock();
    } catch (error) {
      cy.log(error)
    }
  }
)
