/** @type {import('lint-staged').Config} */
const config = {
  '**/*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  '**/*.{js,jsx,mjs}': ['eslint --fix', 'prettier --write'],
  '**/*.{json,md,yaml,yml}': ['prettier --write'],
};

module.exports = config;
