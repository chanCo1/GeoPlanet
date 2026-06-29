module.exports = {
  'apps/web/**/*.{ts,tsx,js,jsx}': () => [
    'pnpm --filter @geoplanet/web type-check',
  ],
  'apps/server/**/*.ts': () => [
    'pnpm --filter @geoplanet/server type-check',
  ],
};
