describe('Login', () => {
  beforeEach(() => {
    // Clear session storage and cookies before each test
    // to ensure a clean slate, especially important for authentication.
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('should allow a user to log in successfully and then log out', () => {
    // Visit the base URL of the application
    cy.visit('/');

    // Ensure the application has loaded and initial elements are present
    cy.url().should('include', '/'); // Verify we are on the home page

    // Click on the account menu dropdown
    cy.get('[data-cy="accountMenu"]').click();
    // Click on the login link within the account menu
    cy.get('[data-cy="login"]').click();

    // Verify that the login page is displayed
    cy.url().should('include', '/login');
    cy.get('[data-cy="loginTitle"]').should('be.visible');

    // Fill in the login form with default JHipster admin credentials
    cy.get('[data-cy="username"]').type('admin');
    cy.get('[data-cy="password"]').type('admin');
    cy.get('[data-cy="rememberMe"]').check(); // Check "Remember me"

    // Click the submit button
    cy.get('[data-cy="submit"]').click();

    // Verify successful login:
    // User should be redirected to the home page ('/')
    cy.url().should('include', '/');
    // Open account menu again to check for logout link
    cy.get('[data-cy="accountMenu"]').click();
    cy.get('[data-cy="logout"]').should('be.visible'); // Check for logout link presence
    cy.get('[data-cy="login"]').should('not.exist'); // Ensure login link is no longer present

    // Now, log out to clean up the session
    cy.get('[data-cy="logout"]').click(); // Click logout

    // Verify successful logout:
    // User should be redirected to the home page ('/')
    cy.url().should('include', '/');
    // Open account menu again to check for login link
    cy.get('[data-cy="accountMenu"]').click();
    cy.get('[data-cy="login"]').should('be.visible'); // Check for login link presence
    cy.get('[data-cy="logout"]').should('not.exist'); // Ensure logout link is no longer present
  });

  it('should display an error message for invalid credentials', () => {
    // Visit the base URL
    cy.visit('/');

    // Navigate to the login page
    cy.get('[data-cy="accountMenu"]').click();
    cy.get('[data-cy="login"]').click();

    cy.url().should('include', '/login');

    // Fill with invalid credentials
    cy.get('[data-cy="username"]').type('invaliduser');
    cy.get('[data-cy="password"]').type('invalidpass');

    // Click the submit button
    cy.get('[data-cy="submit"]').click();

    // Verify that an error message is displayed
    cy.get('[data-cy="errorMessage"]').should('be.visible').and('contain', 'Failed to sign in!');
    // The URL should still be on the login page as login failed
    cy.url().should('include', '/login');
  });
});