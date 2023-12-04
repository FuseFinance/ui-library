import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        generateOTP: require("cypress-otp")
      });
    },
    specPattern: [
      'cypress/e2e/auth/login.cy.ts',
      'cypress/e2e/editor/**/*.ts',
      'cypress/e2e/version/**/*.ts',
      'cypress/e2e/workflow/**/*.ts',
      'cypress/e2e/core/**/*.ts',
      'cypress/e2e/**/*.ts',
      'cypress/e2e/auth/logout.cy.ts',
    ],
    retries: 2,
    baseUrl: 'http://localhost:3000',
    experimentalOriginDependencies: true,
    defaultCommandTimeout: 10000,
    viewportWidth: 1536,
    viewportHeight: 960,
  },

  screenshotOnRunFailure: true,
  screenshotsFolder: 'cypress/downloads',
  trashAssetsBeforeRuns: true,
  video: false,

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
