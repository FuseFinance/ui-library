/*TODO: 
  This is the solution to login without the Auth0Ui, it's not working completely. 
  We are able to get the accessToken, but we need to set the right cookies to validade the session
  More info in the E2E Cypress Doc 
*/
Cypress.Commands.add(
    'loginByAuth0Api',
    (username: string, password: string) => {
      cy.log(`Logging in as ${username}`)
      const client_id = Cypress.env('auth0_client_id')
      const client_secret = Cypress.env('auth0_client_secret')
      const audience = Cypress.env('auth0_audience')
      const scope = ``
  
      cy.request({
        method: 'POST',
        url: `https://${Cypress.env('auth0_domain')}/oauth/token`,
        body: {
          grant_type: 'client_credentials',
          username,
          password,
          audience,
          scope,
          client_id,
          client_secret,
        },
      })
    }
  )