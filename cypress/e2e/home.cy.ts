describe('Home Page after Login', () => {
  beforeEach(() => {
    // Use the custom login command defined in cypress/support/commands.ts
    // Assuming it logs in with default 'user' credentials and redirects to the home page.
    cy.login('user', 'user');

    // Ensure we are on the home page after login.
    // The cy.login() command typically handles the initial redirection to '/',
    // but an explicit visit here provides robustness and clarity.
    cy.visit('/');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should display the welcome message, user information, and main navigation links', () => {
    // Verify the main welcome title commonly found on JHipster home pages
    cy.get('h1').should('contain', 'Welcome, Java Hipster!');

    // Verify the message indicating the currently logged-in user
    cy.get('h2').should('contain', 'You are logged in as user.');

    // Verify the presence of key navigation links for a standard authenticated user.
    // Using data-cy attributes for robust E2E selectors, as per best practices.
    cy.get('[data-cy="entity-menu"]').should('be.visible'); // Example: Link to entity management
    cy.get('[data-cy="account-menu"]').should('be.visible'); // Example: Account dropdown menu

    // Open the account menu to verify its contents, like the logout option and username display
    cy.get('[data-cy="account-menu"]').click();

    // Verify that the logged-in username is displayed within the account menu
    cy.get('[data-cy="account-menu-item-user"]').should('contain', 'user');

    // Verify the presence of the logout link
    cy.get('[data-cy="logout"]').should('be.visible');

    // Close the account menu dropdown to prevent it from overlapping other elements if needed
    // This is often done by clicking outside the dropdown or on another static element.
    cy.get('body').click(0, 0); // Click at top-left corner of the body
  });

  // Additional E2E tests for the home page could include:
  // - Verifying specific content or widgets displayed on the dashboard.
  // - Checking responsiveness of the home page elements.
  // - Testing navigation to other key pages directly from the home page.
});