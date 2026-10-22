# Sistema de design — Antimetal (antimetal.com)

**Documento de referência extraído do código real da página.**
Data da extração: 19/10/2026 · Uso: estudo de referência para o projeto Plaswill (não é identidade a copiar).

---

## 0. Procedência do material — leia antes dos tokens

O material que você salvou na pasta `referencias/antimetal/` **é a home (`https://antimetal.com/`), não a listagem `/blog`**. O comentário `saved from url=(0022)https://antimetal.com/` está na primeira linha do HTML. Isso muda pouco do ponto de vista de sistema (as duas rotas compartilham o mesmo CSS global e a mesma biblioteca de componentes — a home inclusive contém o componente de card de post do blog, na seção "From the research log"), mas significa que **a tipografia específica de página de artigo (leitura longa) não está neste material**, porque essa rota não foi capturada.

Duas folhas de estilo referenciadas com URL absoluta (`/_next/static/chunks/02ijsjxp1r_gf.css` e `0ffaejt~9w7vc.css`) não foram baixadas pelo salvamento. Fiz uma verificação de cobertura: das 386 classes usadas no HTML, as três folhas locais (89 KB + 15 KB + 2,8 KB) definem praticamente todas — as que não encontrei são variantes de hover em `@media (hover:hover)` e duas classes do módulo do gráfico. **Não há indício de lacuna relevante de tokens**, mas registro como limite: se o blog usar um chunk próprio, essa parte não está na minha fonte.

Arquivos-fonte da extração:

| Arquivo | O que traz |
| --- | --- |
| `Antimetal_files/0a97zt6gwkoiv.css` (89 KB) | tema Tailwind v4 (`@layer theme/base/utilities`), `:root`, `@font-face`, todos os utilitários de tipografia |
| `Antimetal_files/0_khadsks7you.css` (15 KB) | CSS Modules dos componentes (nav, form de demo, diagrama, gráfico, footer) |
| `Antimetal_files/0~-pst~a9btyl.css` (2,8 KB) | módulo do gráfico "repgap" com sua própria sub-paleta |
| `Antimetal.html` (202 KB) | marcação, atributos de acessibilidade, estados e estilos inline do reveal |

Stack identificada: Next.js com Turbopack, Tailwind v4 (`--tw-*`, `@layer theme`), CSS Modules, container queries, Three.js no hero.

---

## 1. Cor

### 1.1 Núcleo declarado (`:root`)

| Token | Valor | Papel no sistema |
| --- | --- | --- |
| `--color-bg` | `#d7d7d0` | fundo da página — cinza-esverdeado quente, "papel sujo" |
| `--color-fg` | `#1a1614` | texto e traços — marrom-preto quente, não preto puro |
| `--color-cream` | `#f4f4e7` | superfície clara e cor de texto sobre `fg` |
| `--color-card` | `#fdfcfa` | superfície de card (branco-papel) |
| `--color-accent` | `#e2e67d` | lime ácido — **marcador, só sobre fundo escuro** |
| `--color-border` | `#1a16141a` | borda = `fg` a 10% |
| `--color-nav-bg` | `#cfcfc8bd` | vidro da navegação (74% de opacidade) |

A paleta é de cinco valores e um acento. Não existe preto, não existe branco puro na interface (o `#fff` aparece só em sobreposições translúcidas), e o cinza-esverdeado do fundo é a assinatura cromática do sistema — todas as fotografias e ilustrações são medidas contra ele.

### 1.2 Camada "alt" — superfícies claras sobrescrevíveis

O sistema define uma segunda camada de superfície, clara, controlada por variáveis com valor padrão. Isso permite que uma seção ou página inteira mude de "papel sujo" para "branco de produto" sem trocar de tema, apenas redefinindo as variáveis no container.

| Variável | Padrão | Papel |
| --- | --- | --- |
| `--alt-card-bg` | `white` | fundo de card na camada clara |
| `--alt-card-border` | `rgba(26,22,20,.06)` | borda do card claro |
| `--alt-card-shadow` | `0 1px 2px rgba(0,0,0,.04)` | **a única sombra do sistema** |
| `--alt-chip-bg` / `--alt-chip-bg-hover` | `#F5F5F5` / `#EAEAEA` | chips e botões secundários |
| `--alt-nav-pill-bg` | `rgba(255,255,255,.75)` | pílula de navegação sobre fundo claro |
| `--alt-prompt-bg` | `rgba(255,255,255,.8)` | campos e caixas de prompt |
| `--alt-row-bg` | `#FAFAFA` | linhas de lista/tabela |

### 1.3 Sub-paleta de módulo

O gráfico da seção comparativa declara paleta própria, isolada: `--bg #d7d7d0`, `--ink #1a1614`, `--cream #f4f4e7`, `--orange #bd4a28`, `--green #6e7a34`, `--rule rgba(26,22,20,.34)`, `--mute rgba(26,22,20,.55)`. O padrão é válido: **acento de dado (terracota e oliva dessaturados) nunca entra na API de cor global** — fica escopado no componente que o usa.

### 1.4 Valores pontuais que não são sistema

`#0d1418` aparece uma única vez, como fundo de um painel de screenshot no hero (`min-h-[440px]`). As cores `#36C5F0`, `#2EB67D`, `#ECB22E`, `#E01E5A` são as marcas das integrações (Slack e afins) e `#2a2724`, `#24211e`, `#161616`, `#111` aparecem como fundos de mídia isolados. **Não são tokens.** Trate como exceções locais, não como paleta.

### 1.5 Tinta das ilustrações (medido, não declarado)

Amostrei os pixels das capas do blog: o fundo é papel (`#e5e6e1`–`#e7e8e3`) e o traço é **azul-aço dessaturado** (`#567095`, `#5b7ba6`, `#7792b6`). É a única família de cor fria do sistema e ela existe exclusivamente dentro da ilustração técnica — nunca na interface. Detalhe importante: a ilustração é o lugar onde o sistema se permite uma cor fora da paleta, e ela é escolhida para parecer desenho técnico, não decoração.

### 1.6 Tema escuro

Existe, mas **por classe e manual** — não por preferência do sistema. A folha principal traz:

```css
.dark{
  --color-bg:#1a1614;  --color-fg:#f4f4e7;  --color-cream:#1a1614;
  --color-card:#211c19; --color-border:#f4f4e71f; --color-nav-bg:#1a1614bd;
  background-color:var(--color-bg); color:var(--color-fg)
}
.dark .glyph-mark{filter:brightness(0) invert()}
```

O tema escuro é uma **inversão exata**: o que era fundo vira texto e vice-versa, com o card escurecido para `#211c19` e a borda refeita como `fg` a 12%. É por isso que o acento lime funciona tão bem: no escuro ele passa de 1,09:1 para 13,56:1 de contraste.

Três registros para precisão. Não há `prefers-color-scheme` em nenhuma das folhas (zero ocorrências) e não há variante `dark:` do Tailwind (zero ocorrências) — a troca é por classe explícita. A classe **não é usada em nenhum ponto do HTML da home capturada** (zero ocorrências), o que sugere que ela serve a outra rota ou seção que não foi salva. E mesmo com a inversão, o sistema não repete a paleta: `--color-accent` não é redefinido no escuro, porque o valor claro já é o correto sobre `fg`.

---

## 2. Tipografia

### 2.1 Famílias

| Token | Stack | Observação |
| --- | --- | --- |
| `--font-sans` | `"Geist", ui-sans-serif, system-ui, sans-serif` | Geist self-hosted (`.ttf`, pesos 400 e 500) |
| `--font-serif` | `"Test Signifier", "Noto Serif", Georgia, serif` | **"Test Signifier"** = build de teste da Signifier (Klim Type Foundry), com Regular, Italic e Medium em `.otf` |
| `--font-mono` | `"Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace` | pesos 400–700 |

Todas com `font-display: swap`, self-hosted em `/fonts/`. Ponto prático para o projeto: **a serif da Antimetal é uma licença de teste** — o fallback declarado é Noto Serif/Georgia, ou seja, o sistema não depende dela para funcionar. Para a Plaswill isso serve como argumento de cautela: uma serif de display licenciada é custo e dependência; a estrutura tipográfica funciona sem ela.

### 2.2 Utilitários de escala (os tokens reais de tipo)

Estes são os nomes que o time usa no código. Não são "h1/h2/h3", são **papéis editoriais** — e é isso que os torna reaproveitáveis.

| Classe | Família | Tracking | Tamanho | Peso | Line-height | Equivalente px |
| --- | --- | --- | --- | --- | --- | --- |
| `.text-heading` | serif | `-0.037em` | `clamp(2.5rem, 1.0417rem + 3.6458vw, 3.375rem)` | 400 | 1.1 | 40 → 54 |
| `.text-subhead` | serif | `-0.021em` | `clamp(2.125rem, .6667rem + 3.6458vw, 3rem)` | 400 | 1.1 | 34 → 48 |
| `.text-pullquote` | serif | `0` | `clamp(1.75rem, .9167rem + 2.0833vw, 2.25rem)` | 400 | 1.1 | 28 → 36 |
| `.text-body` | serif | `0` | `clamp(1.25rem, .8333rem + 1.0417vw, 1.5rem)` | 400 | 1.2 | 20 → 24 |
| `.text-body-sans` | sans | `0` | `clamp(1.0625rem, .75rem + .7813vw, 1.25rem)` | 400 | 1.5 | 17 → 20 |
| `.text-credit` | sans | `0` | `clamp(1rem, .7917rem + .5208vw, 1.125rem)` | 400 | 1.5 | 16 → 18 |
| `.text-caption` | sans | `0` | `.875rem` | 400 | 1.5 | 14 |
| `.text-button` | sans | `0` | `.875rem` | 500 | 1.5 | 14 / 500 |
| `.text-eyebrow` | mono | `+.1em` | `.625rem` + uppercase | 400 | normal | 10 mono espaçado |
| `.text-meta` | sans | `+.1em` | `.625rem` + uppercase | 400 | normal | 10 sans espaçado |

Leituras que valem para a Plaswill:

O corpo editorial é **serifado a 20–24 px com line-height 1.2** — apertado e grande, o oposto do padrão SaaS (16/1.6 sans). É a decisão que dá ao site voz de revista técnica em vez de página de produto. O texto funcional (UI, formulários, listas, legendas) é sans a 14–20 px com line-height 1.5. **A separação entre "voz" (serif, tracking negativo, entrelinha curta) e "ferramenta" (sans, tracking zero, entrelinha 1.5) é o eixo tipográfico do sistema inteiro.**

Escala de tracking observada, completa: `-0.037em` (display), `-0.021em` (subhead), `-0.02/-0.01/-0.005em` (ajustes locais), `0` (corpo), `+0.06/+0.08em` (rótulos pequenos), `+0.10em` (eyebrow/meta), `+0.14em` (um rótulo pontual). O tracking não é decorativo: ele compensa o corpo do texto — negativo onde a serif é grande, positivo onde o rótulo é mono e minúsculo.

Escala de entrelinha: 1.1 (display), 1.2 (corpo serif), 1.5 (sans/UI), 1.35 (legendas densas em diagrama), 1.

### 2.3 Nível raiz

O `body` recebe `font-size: clamp(1.25rem, .8333rem + 1.0417vw, 1.5rem)` com `line-height: 1.2`, e uma regra posterior sobrescreve a família para a sans. Ou seja: **a escala raiz é fluida e declarada no nível do elemento**, e os utilitários a reaplicam por papel. Não há salto por breakpoint em nenhum lugar da tipografia — tudo é `clamp()` contínuo sobre `vw`.

### 2.4 Tokens de escala do tema Tailwind

`--spacing: .25rem` (base 4 px), `--text-xs: .75rem`, `--text-sm: .875rem`, `--text-lg: 1.125rem`, `--text-xl: 1.25rem`, `--text-2xl: 1.5rem`, pesos `400 / 500 / 600`. Note que a escala exposta do Tailwind é curta: **os tamanhos grandes do site não usam `text-3xl`, `text-5xl` etc. — são os utilitários editoriais com `clamp()`.** O sistema trata a escala grande como conteúdo, não como utilitário de layout.

---

## 3. Layout, grade e ritmo

| Elemento | Valor |
| --- | --- |
| Container | `max-w-[1512px]` + `mx-auto` (11 ocorrências no HTML) |
| Respiro lateral | `px-6` (24 px) no mobile → `md:px-[120px]` |
| Respiro vertical da seção | `py-[80px]` (9 ocorrências), variações `md:py-[100px]`, hero `md:pt-[180px]` + `md:pb-[200px]` |
| Gaps internos | `gap-6` (24) no mobile → `md:gap-12` (48) / `md:gap-16` (64) |
| Breakpoints | `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · um variante `min-[1440px]` |
| Grade assimétrica | `minmax(0,.56fr) minmax(0,.44fr)` |
| Colunas com rótulo fixo | 180 / 220 / 260 / 320 / 360 / 460 px + coluna fluida |
| Alinhamento à borda | `padding-left: max(120px, 50vw - 636px)` — o conteúdo alinha à margem do container, não ao centro da viewport |
| Responsividade de componente | **container queries** (`@container max-width: 760px / 560px / 500px`) com clamps em `cqw` |

Duas coisas aqui são mais valiosas que os números. A primeira é o **ritmo de 80 px com container de 1512 px e 120 px de respiro lateral**: a proporção entre respiro lateral e vertical é o que faz a página parecer generosa sem parecer vazia. A segunda é o uso de container queries dentro dos componentes — o card e o diagrama reagem à largura do próprio container, não da janela. Isso é o que permite reaproveitar o mesmo componente na grade de 3 colunas e em largura total sem duplicar CSS.

Todas as medidas são múltiplos de 4 px derivados de `--spacing`.

---

## 4. Formas, bordas e superfícies

Este é o capítulo em que o sistema mais se afasta do padrão de mercado, e vale registrar com precisão.

**Raios.** Praticamente não existem. Os valores presentes na folha inteira são `9999px`/`999px`/`50%` (pílulas e avatares), `4px`, `2px`, `1.5px`, `1px` (elementos minúsculos) e `0`. Cards, imagens, painéis, o container do diagrama e o hero têm **canto vivo**. O sistema usa raio alto **só** onde a forma é uma cápsula interativa — botão, chip, avatar. A ausência de raio nos blocos de conteúdo é o que faz a página ler como impresso e não como app.

**Bordas.** Hairline de 1 px em `color-mix(in oklab, var(--color-fg) N%, transparent)`, com N percorrendo 6, 8, 10, 12, 14, 15, 18, 20, 42%. **Borda tracejada (`dashed`) é estrutura, não enfeite**: separadores de seção, contorno de card, contorno de pílula/CTA e o `hr` da FAQ. O card de post usa `border border-dashed border-fg/10` com `border-t-0`, encaixando o corpo sob a imagem.

**Sombras.** Uma só em toda a interface clara (`--alt-card-shadow: 0 1px 2px rgba(0,0,0,.04)`). Zero elevação em cards. A hierarquia é feita por borda, fundo e espaço — nunca por profundidade.

**Vidro.** Onde o padrão de mercado usa sombra, aqui usa superfície de vidro: `backdrop-filter: blur(3.6px) saturate(142%) brightness(102%)` com borda superior em gradiente (`linear-gradient(122deg, #ffffffeb 0%, #ffffff61 40%, #ffffff08 68%, transparent 86%)`) e um realce radial a 8% do topo. Os valores de fallback declaram `--glass-surface-background: #f6f6f199` e `--glass-surface-shadow: inset 0 1px 10px #0001, inset 0 -8px 16px #ffffff09` — ou seja, **o vidro tem uma versão sem suporte a `backdrop-filter`**.

**Foco.** O sistema não desenha outline: o controle **inverte** (`:focus-visible` aplica `background: var(--color-fg)` e `color: var(--color-white)` / `transparent`), com um anel de 1 px em `currentcolor` (`--tw-ring-color: #fff6` no escuro). É uma escolha consistente com a estética, mas atenção: foco por inversão só é acessível se o alvo for inequívoco — vale estudar antes de copiar.

**Z-index** é uma escala disciplinada: 0, 1, 3, 10, 20, 30, 40, 50, 1000, 1100.

---

## 5. Movimento

| Situação | Especificação |
| --- | --- |
| Entrada de conteúdo no scroll (reveal) | `opacity 0 → 1` + `translate3d(0,12px,0) → 0`, **700 ms**, `cubic-bezier(.22, 1, .36, 1)`, com `will-change: opacity, transform` |
| Transições de UI | 150 ms padrão; 200–300 ms para cor/borda/hover; easing `cubic-bezier(.4, 0, .2, 1)` |
| Acordeão da FAQ | anima `grid-template-rows: 0fr → 1fr` em 300 ms `ease-out` (não anima altura — anima a grade) |
| Ênfase pontual | `cubic-bezier(.34, 1.55, .6, 1)` — pequeno overshoot, usado no gráfico |
| Expansão de busca na nav | `flex-1` + `px-3` + `opacity` com `group-focus-within` |
| Keyframes no site | apenas dois: um `materialize` de easter egg e um `breathe` do hero |

Três conclusões úteis. A primeira: **há um único gesto não solicitado pelo usuário** (o reveal de 12 px e 700 ms) e ele é aplicado de forma consistente em toda a página — não há fade-and-slide diferente por seção. A segunda: o movimento que responde à ação é rápido (150–300 ms) e o movimento de entrada é lento (700 ms); essa assimetria é o que faz a página parecer calma sem parecer travada. A terceira: `prefers-reduced-motion` é respeitado no módulo do gráfico via classe (`.repgap--respect-reduced-motion` zera opacidades e transições). Vale verificar se a cobertura é total na versão pública — no material salvo não consegui confirmar o reveal de página sob movimento reduzido, porque ele é aplicado por JavaScript inline.

---

## 6. Componentes

### 6.1 Navegação — pílula central flutuante

`width: min(385px, 100vw - 32px)`, fundo `--color-nav-bg` (`#cfcfc8bd`), vidro com blur, contorno tracejado, links em `text-caption`. Dentro dela, um campo de busca que se expande no foco até `w-[248px]` (`group-focus-within/search` aciona `flex-1`, `px-3` e `opacity-100`). Em viewport estreita a pílula ocupa a largura menos 32 px.

### 6.2 Botão-pílula com marcas de registro — o detalhe-assinatura

```
rounded-full · border border-dashed (fg/10) · px-[16.5px] py-[12.5px]
text-button (14 px / 500) · hover:bg-white/20 · transition 200 ms
```

Nos quatro cantos, um SVG de 7×7 px com um "L" de traço 1,5 px, `linecap: butt`, `linejoin: miter`, posicionado em `-1px` de cada extremidade. São **marcas de corte/registro de impressão** aplicadas a um botão digital. Esse é o elemento mais memorável do sistema e o que mais claramente não é template: um detalhe de pré-impressão industrial usado como ornamento funcional em toda a biblioteca de CTAs.

### 6.3 Card editorial (o componente que serve ao blog)

```
<a> max-w-[418px] · coluna flex · hover:bg-white/16
  imagem   aspect-[500/300] (5:3) · object-cover · sem raio · overflow-hidden
  corpo    border border-dashed fg/10 · border-t-0 · p-6
    linha de metadados  [eyebrow mono 10px] + ponto 2px fg/20 + [data]
    título              text-body (serif 20–24, lh 1.2)
    resumo              text-caption fg/60
    rodapé              avatar 24px redondo + nome, alinhado embaixo (mt-auto)
```

Detalhes de implementação que valem ler: a imagem é `loading="lazy"`, `decoding="async"`, com `srcset` de 640 a 3840 w gerado pelo Next Image e `sizes="(min-width: 768px) 418px, 100vw"`. A imagem de capa tem `alt` descritivo; o avatar decorativo tem `alt=""`. O título é `h3` depois do `h2` da seção — hierarquia correta.

### 6.4 Cabeçalho de seção

Grade de duas colunas com ação à direita: à esquerda o `h2` em `.text-subhead`, à direita a pílula de ação (`md:justify-end`). Acima, a linha de rótulo: número da seção em `text-eyebrow`, ponto de 2 px, rótulo em `text-eyebrow`. Os números observados no HTML são `02`, `04`, `05`, `06` — **a numeração não cobre todas as 13 seções**, o que sugere que o recurso é reservado a determinadas seções e não um carimbo automático.

### 6.5 Acordeão de FAQ — a referência de acessibilidade do sistema

Cada linha: `button` com `aria-expanded` e `aria-controls`, painel com `role="region"` e `aria-labelledby` do respectivo header. O ícone de mais é feito de dois `span` de 1 px (`h-px` horizontal e `w-px` vertical), com o vertical animando — nenhum ícone font, nenhum SVG decorativo sem `aria-hidden`. Separadores são `hr` com `border-t border-dashed`. **Este componente é o melhor material do conjunto: uma implementação correta de disclosure, sem biblioteca.**

### 6.6 Reveal de seção

Aplicado por estilo inline: `opacity: 0; transform: translate3d(0, 12px, 0)` com `transition: opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), transform 700ms cubic-bezier(0.22, 1, 0.36, 1)`.

### 6.7 Formulário de demo (do CSS Module)

Campos com `fieldMessage` e `fieldError` separados, dropdown próprio com painel e estado aberto, overlay de sucesso, botão que muda de estado (`submitButton` / `submitButtonReady`). Ou seja: **o sistema tem um formulário com estados de erro, sucesso e carregamento desenhados** — não é um `<form>` improvisado. Para a Plaswill, que precisa de pedido de orçamento, essa é a parte que mais vale estudar.

### 6.8 Painel escuro

Bloco `bg-[#0d1418]` com `min-h-[440px]`, sem raio, sem sombra, usado como área de mídia/screenshot. Na home capturada, é o único contexto escuro em que o acento lime (`#e2e67d`) aparece — o outro é o tema `.dark`, que a página não usa (ver 1.6).

---

## 7. O que é verificado e o que é leitura

Verificado por leitura direta do código e reconferido por script: todos os valores hex, clamps, trackings, entrelinhas, raios, z-index, durações, easings e nomes de utilitário das tabelas acima; a existência de `@font-face` self-hosted com `font-display: swap`; a existência do tema escuro por classe e a ausência de `prefers-color-scheme` e de variantes `dark:`; a presença de container queries; as classes de acessibilidade citadas; e todos os números de contraste da seção 8, recalculados a partir dos valores reais com a fórmula de luminância relativa da WCAG.

Leitura (interpretação minha, não fato do código): o juízo de que a borda tracejada funciona como estrutura e não como ornamento; a atribuição da "voz de revista técnica" à combinação serif 20–24 / lh 1.2; a leitura de que a ausência de raio nos blocos é o que sustenta a estética impressa. São inferências de direção, úteis para a decisão, mas revisáveis.

Não verificado: se o reveal de página respeita `prefers-reduced-motion` (aplica-se por JS inline, não deu para confirmar no material salvo); o comportamento da rota `/blog` e da leitura de artigo; e o conteúdo dos dois chunks de CSS que não foram baixados.

---

## 8. Acessibilidade — contrastes medidos

Calculado com luminância relativa WCAG 2.2 sobre os valores reais do sistema.

| Combinação | Razão | AA texto normal (4,5:1) |
| --- | --- | --- |
| `fg #1a1614` sobre `bg #d7d7d0` | **12,42:1** | passa |
| `cream #f4f4e7` sobre `fg` | **16,21:1** | passa |
| `card #fdfcfa` sobre `fg` | **17,52:1** | passa |
| `accent #e2e67d` sobre `fg` | **13,56:1** | passa |
| `accent` sobre `bg` | 1,09:1 | **falha** |
| `fg/74` sobre `bg` | 6,28:1 | passa |
| `fg/70` sobre `bg` | 5,54:1 | passa |
| `fg/60` sobre `bg` | **4,13:1** | **falha** (por pouco) |
| `fg/45` sobre `bg` | 2,73:1 | falha |
| `fg/35` sobre `bg` | 2,12:1 | falha (usado em placeholder) |
| `cream/70` sobre `fg` | 8,36:1 | passa |

Duas conclusões com consequência prática. A primeira: **o acento lime é inutilizável sobre o fundo claro (1,09:1)** — ele existe exclusivamente sobre `fg` escuro, onde entrega 13,56:1. Isso é deliberado e explica por que ele aparece só em painéis escuros. A segunda: **`text-fg/60` a 4,13:1 reprova em AA para texto normal** — e é exatamente o valor usado nos resumos dos cards e nos rótulos eyebrow de 10 px, que são texto pequeno (o caso mais exigente). O sistema tem 43 variações de opacidade de `fg`; as que passam começam em torno de `/66`–`/70`. Se a Plaswill adotar essa mecânica de "texto = fg com opacidade", a regra deve ser **nunca abaixo de 70% para texto**, deixando `/35`–`/60` só para ornamento e placeholder.

---

## 9. Leitura de conjunto: o que este sistema é

Chame de "papel técnico". Um sistema claro, quente e editorial, construído sobre quatro decisões que se reforçam:

Fundo de papel sujo em vez de branco; serif de display para a voz e sans para a ferramenta; hierarquia por hairline, traço tracejado e espaço em vez de por sombra e raio; e **um** acento, ácido, que só existe sobre o escuro. A ele se soma um repertório gráfico coerente com o assunto — ilustrações em azul de prancheta, marcas de registro nos CTAs, uma serif com tracking negativo, uma pílula de navegação que flutua sobre o conteúdo.

Nada disso é decorativo por acaso: cada escolha responde a "parecer um instrumento técnico impresso", e o sistema é disciplinado o suficiente para que o acento apareça em um só contexto e a sombra em uma só regra. É o oposto do kit SaaS — não há card arredondado com sombra suave, não há gradiente decorativo, não há hero com número grande e rótulo pequeno.

---

## 10. O que levar para a Plaswill, e o que não levar

A regra do projeto é usar referência sem copiar identidade, e aqui há um risco concreto: **o sistema da Antimetal é amarelo-ácido sobre papel quente.** A Plaswill é amarelo institucional sobre azul petróleo (`#09506A`, `#FFDE00`, `#1E293B`/`#0F172A`, `#F1F5F9`/`#F8FAFC` no dossiê). Copiar a estrutura sem trocar as decisões de cor produziria duas páginas que se parecem.

**Vale levar, com adaptação:**

A disciplina de acento único. A Plaswill já tem o problema resolvido no dossiê e ele é mais interessante que o da Antimetal: o amarelo institucional se comporta **exatamente** como o lime deles. Medido sobre a paleta Plaswill: `#FFDE00` sobre `#F8FAFC` dá **1,28:1** (invisível), sobre `#09506A` dá **6,63:1** e sobre `#0F172A` dá **13,35:1**. Ou seja: o amarelo da Plaswill é cor de fundo escuro e é cor de preenchimento com texto escuro por cima (`#0F172A` sobre `#FFDE00` = 13,35:1). Escrito como regra de sistema: **amarelo nunca como texto sobre claro; amarelo como bloco, faixa, marcador ou tinta sobre azul petróleo.**

A mecânica de "texto = cor com opacidade", com o piso de 70% que a medição exige.

A escala fluida por `clamp()` sem salto de breakpoint, e a separação explícita entre utilitários de voz (display) e de ferramenta (UI) — na Plaswill isso pode virar um par serif/sans ou um par sans de display/sans de texto, decidido na Fase 3.

O container de 1512 px com 120 px de respiro lateral e ritmo vertical de 80 px; a grade assimétrica `0.56fr / 0.44fr`; o alinhamento à borda do container (`max(120px, 50vw - 636px)`); base de espaçamento em 4 px.

O padrão de borda hairline e tracejada em vez de sombra — no caso da Plaswill, isso conversa diretamente com desenho técnico de embalagem e com a linguagem de ficha técnica que o dossiê pede. Canto vivo nos blocos e raio apenas nas cápsulas interativas.

Container queries nos componentes em vez de duplicar CSS por breakpoint.

O acordeão de FAQ e o formulário com estados de erro, sucesso e carregamento — os dois componentes que a landing page da Plaswill precisa e que já estão resolvidos de forma acessível no material.

**Recomendo não levar:**

A serif de display licenciada (a Signifier é build de teste; o sistema declara fallback para Noto Serif/Georgia — ou seja, nem eles dependem dela). A Plaswill tem identidade industrial; uma serif editorial genérica não é a voz do dossiê.

O fundo "papel sujo" `#d7d7d0`: usando amarelo institucional, um fundo quente acinzentado suja a leitura do amarelo. A base da Plaswill deve ser fria e clara (`#F8FAFC`), com o calor vindo do amarelo e não do fundo.

O lime `#e2e67d`: dois amarelos na mesma página competem e o institucional perde.

E um alerta de originalidade, porque este é o ponto em que a cópia fica visível: a linha de metadados `RÓTULO · DATA` em mono de 10 px com separador de ponto médio é justamente um dos traços que a boa prática de direção de arte identifica como padrão genérico, e o próprio material o repete em todos os cards. Se a Plaswill usar eyebrow mono, que seja por decisão de conteúdo — número de ficha técnica, micragem, norma ABNT —, não como ornamento de card. O mesmo vale para o tracejado: na Antimetal ele é sistemático; na Plaswill ele deve marcar algo (limite de lote, recorte de bobina, área de corte), senão vira textura.

As marcas de registro de canto são o detalhe mais forte do conjunto e o mais fácil de copiar de forma vazia. Se a Plaswill adotar algo nessa família, recomendo desenhar as suas próprias — marcas de registro de impressão offset, cantos de chapa de corte, referência de sangria — com desenho próprio, em vez de reproduzir o L de 7 px.

---

## 11. Como usar este documento

Os valores das seções 1, 2, 3, 4 e 5 são a matéria-prima da Fase 3 (direção visual). A seção 8 é insumo direto para a validação da Fase 6. A seção 10 é a decisão de direção que precisa da sua aprovação antes de virar token.

O arquivo `antimetal-design-system.html`, ao lado deste, é uma folha de amostras: abre no navegador e mostra a paleta, a escala tipográfica, o ritmo de espaço, as bordas e os componentes montados com os valores reais. Serve para julgar a estética com o olho em vez de pelo código.

Próximo passo sugerido: se o blog em si importa para a decisão (a leitura de artigo, que é o que a Plaswill pode querer replicar em "conteúdo técnico" no longo prazo), salve `https://antimetal.com/blog` e um artigo aberto na mesma pasta, e eu extraio o sistema de leitura — largura de medida, tamanho de corpo no artigo, tratamento de citação, código e imagem — que é a parte que este material não cobre.
