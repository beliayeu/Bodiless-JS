module.exports = {
    mode: 'modules',
    out: 'docs',
    exclude: [
        '**/node_modules/**',
        '**/*.spec.ts',
        '**/tests/**/*.ts',
        '**/__tests__/**/*.ts',
        'examples/**',
        '**/lib/**'
    ],
    lernaExclude: ['@bodiless/test-site', '@bodiless/starter'],
    name: 'bodilessjs',
    excludePrivate: true,
};