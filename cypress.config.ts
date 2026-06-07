import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: true,

  e2e: {
    baseUrl: "http://localhost:4200",
    specPattern: "cypress/e2e/3-my-tests/**/*.cy.{js,jsx,ts,tsx}",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
