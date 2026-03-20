declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to log in a user with given username and password.
       * Assumes a login page at `/login` and elements with `data-cy` attributes for username, password, and login button.
       * @example cy.login('admin', 'admin');
       */
      login(username: string, password: string): Chainable<AUTWindow>;
    }
  }
}

Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/login');

  cy.get('[data-cy="username"]').type(username);
  cy.get('[data-cy="password"]').type(password);
  cy.get('[data-cy="login-button"]').click();

  // Ensure the login process completes and the user is redirected away from the login page
  cy.url().should('not.include', '/login');
  cy.url().should('include', '/'); // Assuming successful login redirects to the application's root/home page
});