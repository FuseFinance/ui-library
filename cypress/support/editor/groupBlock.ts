import { BlockTypes } from "@/cypress/utils/blockTypes";
import { EditorSelector, AddNewBlockModalSelector, DefaultSelectors, EditableTextSelector, GroupEditorSelector } from "@/cypress/utils/selectors";

Cypress.Commands.add(
  'createGroupBlock',() => {
    try {
      cy.get(EditorSelector.flowcanvas)
        .find(EditorSelector.addButton)
        .first()
        .click()

      cy.get(AddNewBlockModalSelector.addBlockContent)
        .find("span").contains(BlockTypes.GROUP)
        .click()
    } catch (error) {
      cy.log(error)
    }
  }
)

Cypress.Commands.add(
  'renameGroupBlock',(newName: string, groupName: string) => {
    try {
      cy.get(EditorSelector.nodeContainer)
        .find("div")
        .contains(groupName)
        .click()

      cy.get(GroupEditorSelector.nodeContainer)
        .find(EditableTextSelector.editButton)
        .click()
      
      cy.get(GroupEditorSelector.nodeContainer)
        .find(EditableTextSelector.input)
        .clear()
        .type(newName)

    } catch (error) {
      cy.log(error)
    }
  }
)

Cypress.Commands.add(
  'deleteGroupBlock',(groupBlockName: string) => {
    try {
      cy.get(GroupEditorSelector.nodeContainer)
        .find("div")
        .contains(groupBlockName)
        .closest(GroupEditorSelector.nodeContainer)
        .find(".ant-dropdown-trigger")
        .click()

      cy.get(".ant-dropdown-menu")
        .find("button")
        .contains("Delete")
        .click({ force: true })

      cy.get(".ant-popover-content")
        .find("span")
        .contains("Yes")
        .click()

    } catch (error) {
      cy.log(error)
    }
  }
)

Cypress.Commands.add(
  'moveGroupBlock',(groupBlockName: string) => {
    try {
      cy.get(GroupEditorSelector.nodeContainer)
        .find("div")
        .contains(groupBlockName)
        .closest(GroupEditorSelector.nodeContainer)
        .find(".ant-dropdown-trigger")
        .click()

      cy.get(".ant-dropdown-menu")
        .find("button")
        .contains("Move")
        .click({ force: true })

      cy.get(EditorSelector.placeHereButton)
        .first()
        .click()

    } catch (error) {
      cy.log(error)
    }
  }
)


Cypress.Commands.add(
  'collapseOrExpandGroup',(groupBlockName: string, isCollapse: boolean) => {
    try {
      cy.get(GroupEditorSelector.nodeContainer)
        .find("div")
        .contains(groupBlockName)
        .closest(GroupEditorSelector.nodeContainer)
        .find(".ant-dropdown-trigger")
        .click()

      cy.get(".ant-dropdown-menu")
        .find("button")
        .contains((isCollapse) ? 'Collapse' : 'Expand')
        .click({ force: true })
    } catch (error) {
      cy.log(error)
    }
  }
)

Cypress.Commands.add(
  'createBlockInsideGroup',(blockName: string) => {
    try {
      cy.get(EditorSelector.flowcanvas)
        .find(EditorSelector.addButton)
        .eq(3)
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