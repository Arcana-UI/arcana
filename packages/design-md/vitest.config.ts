import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@arcana-ui/design-md',
    globals: false,
    include: ['src/**/*.test.ts'],
  },
});
