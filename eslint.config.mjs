import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    ignores: [
      '**/server/database/seed.ts',
      '**/server/database/schema.ts',
      '**/server/tasks/seed.ts',
    ],
    rules: {
      // It's a good practice, but can be noisy during development
      'vue/require-default-prop': 'off',

      // Allow unused vars prefixed with underscore
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
    },
  },
  // Relax rules for test files
  {
    files: ['**/*.test.ts', '**/*.test.js', '**/test-setup.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'import/first': 'off',
    },
  }
)
