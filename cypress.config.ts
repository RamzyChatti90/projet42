import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // Example: For code coverage, uncomment the following line and install @cypress/code-coverage
      // require('@cypress/code-coverage/task')(on, config);

      return config;
    },
  },
  // Global configuration options for all types of tests (e.g., E2E, Component)
  // These can be overridden within the `e2e` or `component` blocks if needed.
  viewportWidth: 1280,
  viewportHeight: 720,
  video: false, // Disable video recording by default to save disk space and CI time
  screenshotOnRunFailure: true, // Take screenshots only on failure in CI
  defaultCommandTimeout: 10000, // Increase default timeout for potentially slower operations
  requestTimeout: 10000,
  responseTimeout: 10000,
});