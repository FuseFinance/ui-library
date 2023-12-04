import { localStorageKeys } from '@/src/utils/types/localstorageKeys';

Cypress.Commands.add('loginWithUi', (applicationUrl?: string) => {
  try {
    const username = Cypress.env('auth0_username');
    const password = Cypress.env('auth0_password');
    const application_url = applicationUrl || Cypress.env('application_url');

    cy.session(
      `login`,
      () => {
        cy.visit(application_url);
        cy.origin(
          Cypress.env('auth0_domain'),
          { args: { username, password } },
          ({ username, password }) => {
            const { LoginSelectors } = Cypress.require('../../utils/selectors');

            cy.get(LoginSelectors.userNameInput).type(username);
            cy.get(LoginSelectors.passwordInput).type(password, { log: false });
            cy.contains(LoginSelectors.continueBtn, 'Continue').click({ force: true });

            cy.task('generateOTP', Cypress.env('2fa_secret')).then((token: any) => {
              cy.log(token);
              cy.get(LoginSelectors.rememberBrowser).click({ force: true });
              cy.get(LoginSelectors.token2FaInput).type(token);
            });

            cy.contains(LoginSelectors.continueBtn, 'Continue').click({ force: true });
          },
        );
        cy.waitForLoading();
        cy.url().should('include', `${application_url}/workflows/v.`);
      },
      {
        validate: () => {
          cy.wrap(localStorage).invoke('getItem', localStorageKeys.ACCESS_TOKEN).should('exist');
        },
        cacheAcrossSpecs: true,
      },
    );
  } catch (error) {
    cy.log(error);
  }
});
