/**
 * Tailwind da rota `/abertura`.
 *
 * Duas decisões que valem registro:
 *
 * 1. `content` é restrito aos arquivos da abertura. O resto do site continua no
 *    sistema de tokens escrito à mão em `src/app/globals.css` — o CSS atômico
 *    gerado aqui só existe onde é usado, e nada da landing aprovada muda.
 *
 * 2. Os tokens de cor são os do `/branding` da API, com o nome do papel que
 *    exercem, e não uma cópia dos nomes da referência:
 *
 *    | referência    | aqui            | valor     | papel                                    |
 *    | ------------- | --------------- | --------- | ---------------------------------------- |
 *    | `brand-dark`  | `brand-slate`   | `#0F172A` | tinta, fundo do botão, texto sobre claro |
 *    | `brand-green` | `brand-petrol`  | `#09506A` | azul petróleo — hover e acento           |
 *    | `brand-light` | `brand-ice`     | `#F1F5F9` | superfície neutra alternativa            |
 *    | `brand-cream` | `brand-surface` | `#F8FAFC` | fundo da abertura                        |
 *    | —             | `brand-yellow`  | `#FFDE00` | amarelo institucional                    |
 *
 *    O amarelo **não aparece como texto sobre claro**: mede 1,18:1 sobre
 *    `#F8FAFC`. Ele é preenchimento com tinta escura por cima, ou tinta sobre
 *    fundo escuro — nunca texto nesta abertura. Ver
 *    `referencias/antimetal-design-system.md` §6.
 *
 * O script `pnpm add -D tailwindcss@^3.4 postcss autoprefixer` é o que ativa
 * este arquivo: sem o pacote instalado, o PostCSS não resolve `tailwindcss`.
 *
 * @type {import('tailwindcss').Config}
 */
const config = {
  content: [
    "./src/app/abertura/**/*.{ts,tsx}",
    "./src/components/abertura/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          slate: "#0F172A",
          petrol: "#09506A",
          ice: "#F1F5F9",
          surface: "#F8FAFC",
          yellow: "#FFDE00",
        },
      },
      fontFamily: {
        // As mesmas três famílias do resto do site, servidas localmente por
        // `next/font/local` em `src/app/layout.tsx`.
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
