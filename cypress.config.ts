// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    viewportWidth: 1360,
    viewportHeight: 768,
    video: false,
    supportFile: false, // we are not using a support file
  },
});
