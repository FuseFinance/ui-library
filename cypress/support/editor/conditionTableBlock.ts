import { BlockTypes } from '@/cypress/utils/blockTypes';
import { ConditionTableSelector, DefaultSelectors, EditorSelector } from '@/cypress/utils/selectors';

const deleteCol = () => {
  cy.get(DefaultSelectors.modal)
  .find(DefaultSelectors.modalContent)
  .find(ConditionTableSelector.tableContainer)
  .find(ConditionTableSelector.delCol)
  .last()
  .click({force: true})

  cy.get(".ant-popover-content")
  .find("span")
  .contains("Yes")
  .click()
}

const addValueInConditionRow = (index) => {
  cy.get(DefaultSelectors.modal)
    .find(DefaultSelectors.modalContent)
    .find(ConditionTableSelector.tableContainer)
    .find(ConditionTableSelector.leftHeaderContainer)
    .find(DefaultSelectors.codeEditor)
    .eq(index)
    .type(`== ${index}`);
}

const addValueInRow = (index) => {
  cy.get(DefaultSelectors.modal)
    .find(DefaultSelectors.modalContent)
    .find(ConditionTableSelector.tableContainer)
    .find(ConditionTableSelector.conditionRow)
    .eq(index)
    .find(DefaultSelectors.codeEditor)
    .eq(0)
    .type(`"a${index}"`);

  cy.get(DefaultSelectors.modal)
    .find(DefaultSelectors.modalContent)
    .find(ConditionTableSelector.tableContainer)
    .find(ConditionTableSelector.conditionRow)
    .eq(index)
    .find(DefaultSelectors.codeEditor)
    .eq(1)
    .type(`"b${index}"`);
}

Cypress.Commands.add('createConditionTableBlock', (blockName: string) => {
  try {
    cy.startBlockCreation(BlockTypes.CONDITION_TABLE, blockName);

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(ConditionTableSelector.outputVariable)
      .type("outputResult");

    deleteCol();
    deleteCol();

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(ConditionTableSelector.tableContainer)
      .find(ConditionTableSelector.variablesContainer)
      .find(DefaultSelectors.codeEditor)
      .eq(0)
      .type("var1");

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(ConditionTableSelector.tableContainer)
      .find(ConditionTableSelector.variablesContainer)
      .find(DefaultSelectors.codeEditor)
      .eq(1)
      .type("var2");
      
    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(ConditionTableSelector.tableContainer)
      .find(ConditionTableSelector.topHeaderContainer)
      .find(DefaultSelectors.codeEditor)
      .eq(0)
      .type("== 0");

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(ConditionTableSelector.tableContainer)
      .find(ConditionTableSelector.topHeaderContainer)
      .find(DefaultSelectors.codeEditor)
      .eq(1)
      .type("== 1");


    addValueInConditionRow(0)
    addValueInConditionRow(1)
    addValueInConditionRow(2)
    addValueInConditionRow(3)

    addValueInRow(0)
    addValueInRow(1)
    addValueInRow(2)
    addValueInRow(3)

    cy.saveBlock();
  } catch (error) {
    cy.log(error);
  }
});


Cypress.Commands.add('addTopAndSideColAndRows', (blockName: string) => {
  try {
    cy.get(EditorSelector.nodeContainer)
      .find("div")
      .contains(blockName)
      .click()

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(ConditionTableSelector.tableContainer)
      .find(ConditionTableSelector.addColBtn)
      .click()

    cy.get(ConditionTableSelector.topHeaderContainer)
      .find(DefaultSelectors.codeEditor)
      .should('have.length', 3)

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(ConditionTableSelector.tableContainer)
      .find(ConditionTableSelector.addRowBtn)
      .click()
    
    cy.get(ConditionTableSelector.leftHeaderContainer)
      .find(DefaultSelectors.codeEditor)
      .should('have.length', 5)
  } catch (error) {
    cy.log(error);
  }
});

Cypress.Commands.add('addTopAndSideHeaders', (blockName: string) => {
  try {
    cy.get(EditorSelector.nodeContainer)
      .find("div")
      .contains(blockName)
      .click()

    cy.get(DefaultSelectors.modal)
      .find(ConditionTableSelector.addHeaderDropdown)
      .trigger('mouseover')

    cy.get("p").contains("Top Header")
      .click()

    cy.get(ConditionTableSelector.variablesContainer)
      .find(DefaultSelectors.codeEditor)
      .should('have.length', 3)

    cy.get(DefaultSelectors.modal)
      .find(ConditionTableSelector.addHeaderDropdown)
      .trigger('mouseover')

    cy.get("p").contains("Left Header")
      .click()
    
    cy.get(ConditionTableSelector.variablesContainer)
      .find(DefaultSelectors.codeEditor)
      .should('have.length', 4)
  } catch (error) {
    cy.log(error);
  }
});