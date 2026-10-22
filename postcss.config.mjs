/**
 * PostCSS — necessário para o Tailwind da rota `/abertura`.
 *
 * O Next não traz o Tailwind por padrão; este arquivo é o que liga o plugin.
 * Ele é lido pelo Next para **todo** CSS do projeto, mas o plugin só transforma
 * os arquivos que declaram `@tailwind` — ou seja, apenas `abertura.css`.
 *
 * Requer `tailwindcss` e `autoprefixer` instalados:
 *   pnpm add -D tailwindcss@^3.4 postcss autoprefixer
 */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
