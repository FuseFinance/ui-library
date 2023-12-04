import { AddNewBlockModalSelector, DefaultSelectors, EditableTextSelector, EditorSelector } from "@/cypress/utils/selectors"

Cypress.Commands.add(
  'startBlockCreation',(blockType: string, blockName: string) => {
    try {
      cy.get(EditorSelector.flowcanvas)
        .find(EditorSelector.addButton)
        .first()
        .click()

      cy.get(AddNewBlockModalSelector.addBlockContent)
        .find("span").contains(blockType)
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
      
    } catch (error) {
      cy.log(error)
    }
  }
)

Cypress.Commands.add(
  'saveBlock',() => {
    try {
      cy.get(DefaultSelectors.modal)
        .find(DefaultSelectors.modalFooter)
        .find("button").contains("Save")
        .click()
    } catch (error) {
      cy.log(error)
    }
  }
)
  
Cypress.Commands.add(
  'deleteBlock',(formulaBlockName: string) => {
    try {
      cy.get(EditorSelector.nodeContainer)
        .find("div")
        .contains(formulaBlockName)
        .closest(EditorSelector.nodeContainer)
        .find(EditorSelector.nodeOptionsButton)
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
  'moveBlock',(formulaBlockName: string) => {
    try {
      cy.get(EditorSelector.nodeContainer)
        .find("div")
        .contains(formulaBlockName)
        .closest(EditorSelector.nodeContainer)
        .find(EditorSelector.nodeOptionsButton)
        .click()

      cy.get(".ant-dropdown-menu")
        .find("button")
        .contains("Move")
        .click()

      cy.get(EditorSelector.placeHereButton)
        .first()
        .click()
    } catch (error) {
      cy.log(error)
    }
  }
)
  