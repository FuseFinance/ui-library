import {
  VersionsSelector,
  DefaultSelectors,
  PublishVersionSelector,
} from '@/cypress/utils/selectors';

Cypress.Commands.add(
  'publishVersion',
  (versionName: string, selectToDeploy?: string, applicationUrl?: string) => {
    const publishedName = `${versionName}_PublishName`;
    const url = applicationUrl ? `${applicationUrl}/versions` : '/versions';

    try {
      cy.visit(url);
      cy.waitForLoading();

      cy.findInVersionTable(versionName, VersionsSelector.editVersionTable).then(($row) => {
        if ($row) {
          cy.get(VersionsSelector.editVersionTable)
            .find('p')
            .contains(versionName)
            .closest(VersionsSelector.versionsTableWithMenuIdsRow)
            .find(DefaultSelectors.dropdown)
            .click();
        }
      });

      cy.get('.ant-dropdown-menu').find('p').contains('Publish').click();

      cy.get(PublishVersionSelector.publishModal)
        .find(PublishVersionSelector.input)
        .clear()
        .type(publishedName);

      cy.get(PublishVersionSelector.publishModal)
        .find(PublishVersionSelector.releaseOptions)
        .find('label[for=major]')
        .click();

      if (selectToDeploy) {
        cy.get(PublishVersionSelector.publishModal)
          .find(PublishVersionSelector.deployOptions)
          .find(`label[for=${selectToDeploy}]`)
          .click();
      }

      cy.get(PublishVersionSelector.saveBtn).click();

      cy.wait(8000).then(() => {
        cy.findInVersionTable(publishedName, VersionsSelector.publishVersionsTable).then(($row) => {
          if ($row) {
            $row.click();
          }
        });
      });
    } catch (error) {
      cy.log(error);
    }
  },
);
