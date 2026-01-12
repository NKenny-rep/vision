import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
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
})