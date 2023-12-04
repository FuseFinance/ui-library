/// <reference types="cypress" />

describe('Login', { testIsolation: false }, () => {

  before(() => {
    Cypress.session.clearAllSavedSessions();
  })

  it('should successfully login', () => {
    cy.loginWithUi();
  });
});
