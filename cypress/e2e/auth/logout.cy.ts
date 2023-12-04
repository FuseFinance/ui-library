/// <reference types="cypress" />

describe('Logout', { testIsolation: false }, () => {

  before(() => {
    Cypress.session.clearAllSavedSessions();
  })

  it('should successfully logout', () => {
    cy.loginWithUi();
    cy.visit('/versions');
    cy.waitForLoading();
    cy.logout();
  });
});
