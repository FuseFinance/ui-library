import { BlockTypes } from '@/cypress/utils/blockTypes';
import { DBConnectionNodeSelector, DefaultSelectors } from '@/cypress/utils/selectors';

Cypress.Commands.add('createDBConnectionBlock', (blockName: string) => {
  const myVariable = Cypress.env('env.VITE_BE_URL');
  try {
    cy.startBlockCreation(BlockTypes.DB_CONNECTION, blockName).intercept(
      `${myVariable}/db-connection`,
      [],
    );

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(DBConnectionNodeSelector.query)
      .find('.cm-line')
      .click()
      .type('SELECT * FROM users;');

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(DBConnectionNodeSelector.selectSchema)
      .click();

    cy.get(DefaultSelectors.modal)
      .find(DefaultSelectors.modalContent)
      .find(DBConnectionNodeSelector.outputVariable)
      .type('outputUsers');

    cy.saveBlock();
  } catch (error) {
    cy.log(`Error creating DB CONNECTION block CY ${error}`);
  }
});
