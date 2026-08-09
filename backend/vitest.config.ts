import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: [
      'src/deployment.test.ts',
      'src/routes/documents.test.ts',
      'src/routes/marketplace.test.ts',
      'src/routes/membershipBilling.test.ts',
    ],
  },
});
