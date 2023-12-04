import { BlockTypes } from '@/cypress/utils/blockTypes';
import { DefaultSelectors, S3UploadSelector } from '@/cypress/utils/selectors';

Cypress.Commands.add(
  'createS3Block',
  (blockName: string) => {
    try {
      cy.startBlockCreation(BlockTypes.S3_UPLOAD, blockName);

      cy.get(DefaultSelectors.modalContent)
        .find(S3UploadSelector.fileContentsInput)
        .find(".cm-line")
        .click()
        .type("fileContentsInput");

      cy.get(DefaultSelectors.modalContent)
        .find(S3UploadSelector.awsRegionInput)
        .find(".cm-line")
        .click()
        .type("awsRegionInput");
        
      cy.get(DefaultSelectors.modalContent)
        .find(S3UploadSelector.bucketNameInput)
        .find(".cm-line")
        .click()
        .type("bucketNameInput");
      
      cy.get(DefaultSelectors.modalContent)
        .find(S3UploadSelector.objectKeyInput)
        .find(".cm-line")
        .click()
        .type("objectKeyInput");

      cy.get(DefaultSelectors.modalContent)
        .find(S3UploadSelector.accessKeyInput)
        .find(".cm-line")
        .click()
        .type("accessKeyInput");

      cy.get(DefaultSelectors.modalContent)
        .find(S3UploadSelector.secretAccessKeyInput)
        .find(".cm-line")
        .click()
        .type("secretAccessKeyInput");

      cy.get(DefaultSelectors.modalContent)
        .find(S3UploadSelector.outputVariableInput)
        .find(".cm-line")
        .click()
        .type("outputVariableInput");

      cy.saveBlock();
    } catch (error) {
      cy.log(error);
    }
  },
);
