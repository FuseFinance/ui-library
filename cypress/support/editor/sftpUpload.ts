import { BlockTypes } from '@/cypress/utils/blockTypes';
import { DefaultSelectors, SftpUploadSelector } from '@/cypress/utils/selectors';

Cypress.Commands.add(
  'createSftpBlock',
  (blockName: string) => {
    try {
      cy.startBlockCreation(BlockTypes.SFTP_UPLOAD, blockName);

      cy.get(DefaultSelectors.modalContent)
        .find(SftpUploadSelector.fileContentsInput)
        .find(".cm-line")
        .click()
        .type("fileContentsInput");

      cy.get(DefaultSelectors.modalContent)
        .find(SftpUploadSelector.pathForFileInput)
        .find(".cm-line")
        .click()
        .type("pathForFileInput");

      cy.get(DefaultSelectors.modalContent)
        .find(SftpUploadSelector.userNameInput)
        .find(".cm-line")
        .click()
        .type("userNameInput");

      cy.get(DefaultSelectors.modalContent)
        .find(SftpUploadSelector.passwordInput)
        .find(".cm-line")
        .click()
        .type("passwordInput");

      cy.get(DefaultSelectors.modalContent)
        .find(SftpUploadSelector.serverAddressInput)
        .find(".cm-line")
        .click()
        .type("serverAddressInput");

      cy.get(DefaultSelectors.modalContent)
        .find(SftpUploadSelector.portNumberInput)
        .find(".cm-line")
        .click()
        .type("portNumberInput");

      cy.get(DefaultSelectors.modalContent)
        .find(SftpUploadSelector.outputVariableInput)
        .find(".cm-line")
        .click()
        .type("outputVariableInput");

      cy.saveBlock();
    } catch (error) {
      cy.log(error);
    }
  },
);