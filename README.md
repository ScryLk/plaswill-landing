# Plaswill — landing page

Landing page institucional e comercial da Plaswill, construída sobre a mecânica do sistema de design extraído da antimetal.com (documentado em `referencias/antimetal-design-system.md`) e sobre os dados verificados do dossiê corporativo (`dossie_contexto_plaswill.md`).

**Status: versão aprovada no protótipo implementada; projeto não publicado.** A página do Next.js foi convergida para a versão aprovada em 19/10 (`design/prototipo-plaswill.html`): abertura em duas colunas no desktop — título à esquerda, campo de grânulos à direita sangrando até a borda da janela — e empilhada no mobile, catálogo em tabela/lista com ficha que abre na própria linha, estrutura em prancha técnica ao lado das etapas, segmentos em coluna e barra fixa de conversão no mobile.

**Build executado com sucesso em 21/10**, offline: 9 rotas estáticas, página inicial com 214 B e 120 kB de JS no primeiro carregamento. As três famílias tipográficas são servidas pelo próprio projeto (`src/app/fonts/`), então o build não depende de rede. O servidor de produção foi iniciado e todas as rotas, fontes, CSS e JS responderam 200.

**A abertura virou a home em 21/10.** A home agora é a abertura — navbar de vidro, hero de tela cheia, faixa de clientes — seguida do corpo comercial aprovado. A landing anterior está inteira em `/institucional`, com `noindex`, como referência e caminho de volta; a abertura isolada continua em `/abertura`, também `noindex`, para revisão. As duas rotas têm seção própria neste documento.

---

## Publicação — prévia na VPS

A landing está no ar em **https://site.plaswill.tech**, como prévia. O domínio `plaswill.com.br` **não** foi tocado: o site atual continua onde estava.

**Onde ela roda.** VPS da Hostinger, `179.199.151.3` (`srv2045098`), Ubuntu 26.04, 4 vCPU e 15 GB. Essa máquina **não** é uma caixa limpa de nginx e Node: é um host Docker com o back-office da Plaswill rodando em `/opt/plaswill` — Nextcloud/GED, indicadores, MariaDB, Redis, Elasticsearch, treze containers. Quem responde em 80/443 é o **Caddy** desse projeto, e não há nginx nem Node instalados no host.

Por isso a landing não foi instalada "junto": ela é um **projeto Compose separado**, em `/opt/plaswill-site`, que se conecta à rede externa `plaswill_plaswill-net` para o Caddy alcançá-la pelo nome. O único ponto de contato com a stack existente é uma entrada acrescentada no fim do `Caddyfile` — nada mais do back-office foi alterado, e `ged.plaswill.tech` e `indicadores.plaswill.tech` seguem respondendo.

**A imagem.** `Dockerfile` em três estágios (dependências → build → execução), com `output: "standalone"` no `next.config.ts`: a imagem final não leva pnpm, código-fonte nem ferramenta de build, roda como usuário sem privilégio e com o sistema de arquivos somente leitura. Nada escuta no host — o único caminho é `Caddy → plaswill-site:3000`.

**O detalhe que ia quebrar o build.** `pnpm-workspace.yaml` listava só `arm64` em `supportedArchitectures`, herança de um projeto nascido no Mac e cujo sandbox de build também é arm64. A VPS é **x64**, e sem x64 na lista o `pnpm install` baixa o binário nativo errado do SWC — o `next build` então falha no meio da compilação com um erro que não parece ser de arquitetura. Corrigido; o lockfile já registrava as duas, então o `--frozen-lockfile` continua válido.

**Publicar uma alteração.**

```bash
# da máquina local, com acesso por chave
tar --exclude=node_modules --exclude=.next --exclude=.git -czf /tmp/site.tgz .
scp /tmp/site.tgz root@179.199.151.3:/tmp/
ssh root@179.199.151.3 'tar -xzf /tmp/site.tgz -C /opt/plaswill-site \
  && cd /opt/plaswill-site/deploy && docker compose up -d --build'
```

**Rollback.** `cd /opt/plaswill-site/deploy && docker compose down` tira o site do ar; no Caddy, comentar o bloco `site.plaswill.tech` e recarregar (`docker exec -w /etc/caddy plaswill-caddy-1 caddy reload --config /etc/caddy/Caddyfile`). O backup do Caddyfile anterior à mudança está em `/opt/plaswill/caddy/Caddyfile.bak-20261022-080402`.

**O que não está resolvido nesta prévia.** O certificado é emitido por HTTP-01 do próprio Caddy, o que funciona porque o DNS de `*.plaswill.tech` já aponta para a VPS — um wildcard, o que também significa que **qualquer** subdomínio novo resolve para lá e ganha certificado. Não há firewall do sistema ativo (`ufw` está inativo); a proteção é a do provedor. E não há pipeline: a publicação é manual, pelos comandos acima.

---

## Como rodar

Requisitos: **Node 20.9 ou superior** (o projeto pede isso em `engines`). Internet só é necessária na instalação; o build roda offline, porque as fontes estão versionadas em `src/app/fonts/` e carregadas com `next/font/local`.

```bash
pnpm install      # instala tudo — inclusive o Tailwind, que já está no package.json
pnpm dev          # sobe em http://localhost:3000
pnpm build        # build de produção
pnpm start        # serve o build
pnpm typecheck    # tsc --noEmit, confere os tipos sem gerar arquivo
pnpm dev:clean    # limpa .next e sobe o dev — use quando o dev reclamar de manifesto
```

> **O Tailwind deixou de ser pendência em 21/10.** `tailwindcss@^3.4`, `postcss` e `autoprefixer` estão em `devDependencies` e no `pnpm-lock.yaml`, então `pnpm install` resolve tudo e **não existe mais passo manual**. A versão fica travada no 3.x de propósito: o `tailwind.config.ts` do projeto é do formato v3, e um `pnpm add tailwindcss` sem versão puxaria a v4, que não lê esse arquivo — a abertura sairia sem utilitárias.
>
> **Se um dia precisar rodar o build sem o Tailwind instalado** (para isolar um problema), tire o `postcss.config.mjs` do caminho — renomeie para `postcss.config.mjs.off` — e comente as três diretivas `@tailwind` no topo de `src/app/abertura/abertura.css`. A abertura fica sem estilo, mas o resto do site builda. Era assim que se validava o build antes do install.
>
> **Atenção ao `-w`.** O projeto tem `pnpm-workspace.yaml`, ou seja, é a raiz de um workspace — e o pnpm recusa `pnpm add` sem a flag: pede `pnpm add -w -D`. Foi assim que as três dependências entraram.

**Gerenciador de pacotes.** O projeto hoje é instalado com pnpm (`pnpm-lock.yaml` presente). Os scripts funcionam igual nos dois, mas não misture: `npm install` e `pnpm install` disputam `node_modules` e chegam a mover uma instalação inteira para `node_modules/.ignored_next` sem avisar. Enquanto houver um dev server rodando, não rode instalação nenhuma — o processo fica com um manifesto de cliente que já não corresponde aos módulos em disco.

**Se o dev acusar erro de React Client Manifest** (`could not find the module … in the React Client Manifest`), o estado está inconsistente, não o código. Na ordem: pare o dev (Ctrl+C), confirme que a porta está livre (`lsof -i :3000`), `npm run clean`, garanta que o `pnpm install` terminou e suba `pnpm dev` (ou `npm run dev`) de novo. Depois recarregue a aba com cache limpo. Se persistir, o log útil é o do terminal onde o dev roda — a sobreposição do navegador esconde o rastro real.

O `.next/` é específico da máquina e do sistema que compilou: um build gerado no contêiner Linux **não** deve ser reaproveitado no Mac (o sintoma é o erro *could not find the module … in the React Client Manifest*). Se isso acontecer, `npm run clean` e suba de novo. Os binários do SWC (`swc-darwin-arm64` e `swc-linux-arm64-gnu`) convivem em `node_modules/@next/` sem interferência.

As fontes são declaradas uma vez em `src/app/layout.tsx` com `next/font/local`: `Archivo-Variable.woff2` (variável 100–900), `SourceSerif4-Variable.woff2` (variável 200–900) e `IBMPlexMono-Regular/Medium.woff2` (400 e 500). Os três nomes de variável CSS (`--font-sans`, `--font-display`, `--font-mono`) são o contrato com o resto da folha de estilo; trocar a fonte sem quebrar o layout é substituir o arquivo em `src/app/fonts/`.

---

## Onde editar cada coisa

| Quero mudar | Arquivo |
| --- | --- |
| Texto, produto, especificação, FAQ, clientes, contatos | `src/content/site.ts` — **todo o conteúdo comercial está aqui** |
| Cor, tipografia, espaçamento, forma | `src/app/globals.css` — bloco `:root`, no topo |
| Estrutura de uma seção | `src/components/<Seção>.tsx` |
| Ordem das seções na home | `src/app/page.tsx` |
| A landing anterior (referência e rollback) | `src/app/(site)/institucional/page.tsx` |
| Desenhos técnicos | `src/components/drawings.tsx` |
| Logotipo oficial | basta copiar o arquivo em `/public/brand/` — ver `public/brand/LEIA-ME.md` |
| Protótipo e wireframes aprovados | `design/` (referência visual, não entra no build) |
| Conferir o cabeçalho | `design/cabecalho.html` (rota compilada) e `design/prototipo.html` (protótipo) — as cópias saem de `design/snapshot.py` e `design/prototipo-estado.py`, cada um com `--compacto` e `--hover`; o protótipo tem ainda `--minimizado`, que confere a saída das laterais |
| Título, descrição e Open Graph | `src/content/site.ts` (objeto `seo`) e `src/app/layout.tsx` |
| Dados estruturados (JSON-LD) | `src/lib/structured-data.ts`, função `structuredData()` — usada pela home e por `/institucional` |
| Texto da abertura (aviso, clientes, CTA) | `src/content/site.ts`, objetos `abertura` e `aberturaNav` |
| Estrutura e estilo da abertura | `src/components/abertura/` e `src/app/abertura/abertura.css` |
| Tokens de cor e fonte do Tailwind | `tailwind.config.ts` |

A separação é deliberada: nenhum texto comercial está dentro de componente. Editar produto ou preço nunca exige mexer em JSX.

---

## Decisões de direção e por quê

**Papel, não branco.** O fundo é `#EDF1F3` — um passo mais fundo que o `#F1F5F9` do dossiê, para o card branco destacar sem precisar de sombra. A alternativa literal do dossiê está comentada no CSS, caso queira comparar.

**A separação entre voz e ferramenta.** Serif para título (Source Serif 4) e sans para interface e leitura (Archivo), com mono para ficha técnica e numeração (IBM Plex Mono). É o eixo tipográfico do sistema de referência, replicado com fontes abertas: nada de licença de teste.

**O amarelo só vive no escuro.** Esta é a regra mais importante do sistema e ela é medida, não opinativa. `#FFDE00` sobre o fundo claro dá **1,18:1** — ilegível. Sobre o azul petróleo `#09506A` dá **6,63:1**; sobre o slate `#0F172A`, **13,35:1**; e com tinta slate por cima, **13,35:1**. Por isso o amarelo aparece em exatamente três papéis: fundo de botão com texto escuro, tinta de link sobre o petróleo e elemento gráfico sobre o escuro. Nunca como texto sobre claro.

**Hierarquia por traço, não por sombra.** Hairline tracejada como estrutura, canto vivo nos blocos, raio de cápsula só em botão e controle. A única sombra do sistema de referência (um `0 1px 2px` de 4%) nem foi usada.

**Marcas de registro próprias.** O detalhe-assinatura das quinas foi desenhado de novo, não copiado: um nó sólido na quina e dois fios com vão em volta. Está em `src/components/marks.tsx` com a geometria comentada, se quiser ajustar o desenho.

**Um único gesto de movimento.** Reveal de 12px e 700ms no scroll, aplicado por `IntersectionObserver`, respeitando `prefers-reduced-motion`. Sem JavaScript o conteúdo fica visível (classe `.no-js`).

**Formulário sem backend.** O pedido de orçamento valida no cliente e entrega tudo pronto no WhatsApp comercial, com alternativa por e-mail. Nenhuma credencial no navegador, nenhum serviço externo. Quando houver necessidade comprovada de registro, o caminho é uma rota `/api/orcamento` com envio transacional e CRM — o formulário já está estruturado para isso.

---

## A home: a abertura mais o corpo comercial

**O que mudou em 21/10.** A abertura era uma rota fechada em si mesma e a home era a landing inteira. Agora a abertura abre o site e o corpo comercial aprovado vem logo abaixo, nesta ordem:

```
navbar de vidro · hero de tela cheia · faixa de clientes (dentro do hero)
faixa de conversão
produtos · sobre · diferenciais · estrutura · segmentos · FAQ · contato
rodapé
```

**A conta do lugar de cada rota.**

| rota | o que é | indexação |
| --- | --- | --- |
| `/` | a abertura seguida do corpo comercial — `src/app/page.tsx` | indexada, canônica |
| `/institucional` | a landing anterior, inteira — rollback e comparação | `noindex, nofollow` |
| `/abertura` | a abertura sozinha, sem o corpo abaixo — revisão | `noindex, nofollow`, canônica aponta para `/` |
| `/politica-de-privacidade` | inalterada | indexada |

**A home mora fora de `(site)`.** O grupo `(site)` aplica uma casca fixa — a navbar da landing, o `<main>` e o rodapé — a tudo que está dentro dele. A abertura tem navegação própria, então a home monta a própria casca: `<a class="skip-link">`, `AberturaNav`, `<main id="conteudo">` e `Footer`. `/institucional` e a política continuam no grupo, com a casca antiga. Consequência prática: se um dia a navbar da landing voltar a ser a única navegação do site, é só mover `page.tsx` de volta para dentro do grupo e apagar a casca explícita.

**Três blocos da landing não entraram na home**, cada um por um motivo:

- `Hero` — repetiria título e foto que a abertura já apresenta na primeira tela;
- `Clients` — os quinze nomes já correm na faixa dentro do hero da abertura. Duas listas de clientes na mesma página era redundância, não reforço;
- `StickyCta` — existia porque a landing antiga não tinha nenhum CTA fixo. A pílula da abertura fica na tela em todos os estados de rolagem, com o botão comercial dentro dela, e a faixa de conversão vem antes dos produtos. Uma terceira chamada fixa competiria com a navbar em vez de ajudar.

**O `preflight` do Tailwind foi desligado.** Era o único ponto de atrito real da fusão. Enquanto `abertura.css` só era carregada em `/abertura`, o reset do Tailwind não alcançava nada além da abertura; trazida a folha para a home, ele passaria a valer também para as seções da landing, que sempre viveram do reset escrito à mão em `globals.css`. `tailwind.config.ts` agora tem `corePlugins: { preflight: false }`. A única dependência real do preflight era `border-style: solid` em todo elemento, que as utilitárias `border-*` pressupõem — o único elemento afetado (a cápsula do aviso comercial, em `AberturaHero`) passou a declarar `border-solid` explicitamente.

**A prova de que a landing não mudou.** O bundle de CSS da landing saiu **byte a byte idêntico** antes e depois (`4c8a74819d78309c.css`, 24.227 bytes nos dois lados). No bundle da abertura saíram os 36 seletores do preflight e entrou um: `.border-solid`. Além disso, as 46 classes de `abertura.css` e as 167 de `globals.css` não têm **nenhum** nome em comum — medido, não estimado — então mesmo com as duas folhas carregadas juntas não há regra que se cruze.

**A emenda visual.** A faixa de conversão é branca (`--surface`) sobre o `#EDF1F3` da página, com fio no topo: a troca de tom é o que separa a abertura do corpo comercial, e por isso não há `<hr>` depois dela. Da faixa em diante a página segue o ritmo da landing, com as hairline tracejadas entre as seções.

**Ganho de navegação que veio junto.** Os links da navbar da abertura sempre apontaram para `/#produtos`, `/#estrutura`, `/#segmentos` e `/#orcamento`. Enquanto a abertura era uma rota isolada, eles saíam da página; agora que o corpo comercial está em `/`, eles resolvem na própria home.

**Como conferir sem navegador.** `design/snapshot.py 4326 --home` gera `design/home-rodando.html`, uma captura autocontida da home compilada (CSS, fontes e imagens embutidos, sem JavaScript) — o mesmo mecanismo dos estados do cabeçalho, agora com a rota escolhida por argumento. O `scroll-padding-top: 6rem` de `globals.css` foi herdado pela home, então os quatro âncoras param abaixo da navbar fixa em vez de atrás dela.

**Rollback.** Desfazer a fusão são três passos: mover `src/app/(site)/institucional/page.tsx` de volta para `src/app/(site)/page.tsx`, apagar `src/app/page.tsx` e restaurar o bloco de metadados antigo em `src/app/abertura/layout.tsx`. Nada em `src/content/site.ts` mudou, então o conteúdo comercial não corre risco nenhum no caminho de volta.

---

## A rota `/abertura`

A abertura em `http://localhost:3000/abertura`, hoje só como revisão isolada — ela é a primeira tela da home desde 21/10, e esta rota existe para olhá-la sozinha. Nasceu de um spec de referência (a landing do Palomar Labs) que pede três coisas e mais nada: **navbar fixa, abertura de tela cheia e faixa de clientes**, sem rodapé, sem segunda seção, sem botão no corpo do hero. Tudo o que está descrito nesta seção vale igual para a home, que importa os mesmos componentes.

**Estrutura.** Três cápsulas de vidro flutuando sobre o conteúdo, na construção da referência do Antimetal (lida do arquivo salvo em `referencias/antimetal/Antimetal.html`, não de memória): navegação à esquerda, assinatura no eixo da página, contato à direita. No celular as duas laterais somem e sobra a assinatura mais um hambúrguer dentro de outra cápsula, que vira X e abre um painel de tela cheia. O corpo traz o aviso comercial em cápsula, o título e, na coluna da direita a partir de `md`, a **fachada da sede**. A faixa `Fornecedor homologado de` traz **quinze nomes** de cliente em carrossel.

**O que se aproveitou da referência, e o que não.** Aproveitou-se a *construção* — três grupos flutuantes em vez de uma faixa de ponta a ponta, cápsula dentro de cápsula, um realce único que desliza até o item sob o ponteiro — e a *receita do material*: superfície translúcida com `backdrop-filter`, um brilho diagonal em `linear-gradient(122deg)` e, principalmente, uma **aresta de 0,5px** em gradiente recortada com `mask` no modo `content-box exclude`. É essa aresta que separa "vidro" de "retângulo fosco"; sem ela o resto não lê. Nada da identidade deles foi copiado: nem o limão, nem a serifa licenciada, nem a marca de pontos (regra 9 do projeto).

**A pílula central, e o que não deu para fazer.** O efeito pedido era o do Antimetal: primeiro o ícone, depois o nome desenrola ao lado. O mecanismo é literalmente um `gap` de 0→8px, um `max-width` de 0→160px e a opacidade, os três animando juntos em 600ms com `cubic-bezier(0.65, 0, 0.35, 1)`; o `max-width` com `overflow: hidden` é o que faz *desenrolar* em vez de aparecer.

Isso exige que ícone e nome sejam **duas peças soltas** — e não são. Em 21/10 o Lucas enviou o logotipo para destravar o efeito e o arquivo era **byte a byte idêntico** ao que já estava no projeto (mesmo md5 `f407a461c4…`, 246×106); o mostruário trazia o mesmo arquivo oito vezes, em escalas diferentes. A anatomia confirma: o campo amarelo cobre 59% dos pixels e a tinta atravessa x=32..224, ou seja, as palavras estão *dentro* da forma, de ponta a ponta. Não há região que seja um grafismo separado do nome.

Fazer "primeiro o ícone" exigiria inventar uma marca que a identidade não tem. Então a pílula revela o **logotipo oficial inteiro** por uma janela de `max-width` que cresce — mesmo movimento, mesmos 600ms, mesma curva; o que não dá para separar é o conteúdo. O caminho literal continua pronto no código: basta um `plaswill-simbolo.svg` em `public/brand/` e a pílula passa a mostrar símbolo + nome, sem tocar em componente nenhum.

**O cabeçalho encolhe ao rolar.** Em 21/10 o Lucas mandou um vídeo do cabeçalho do Antimetal e perguntou se dava para replicar. Vídeo não se assiste aqui — mas o código deles está salvo em `referencias/antimetal/`, e é dele que sai o comportamento, o que é melhor que o vídeo porque vem com os números. O módulo `Nav` recebe um `condenseOnScroll` e, ligado, faz isto: passando de **220px** de rolagem a cápsula central encolhe de `min(385px, 100vw - 32px)` até a largura do conteúdo, em **600ms** com `cubic-bezier(0.65, 0, 0.35, 1)` — a mesma curva da revelação do nome; voltando para antes de **110px** ela cresce de novo; e a menos de **160px** do fim do documento ela **nunca** encolhe, porque o rodapé já tem a assinatura grande.

Os dois limiares diferentes são **histerese**, e não um detalhe: com um limiar só, parar a rolagem em cima do número faria a cápsula piscar entre os dois estados a cada tremor de trackpad. É justamente a parte do comportamento que não dá para conferir numa captura — então virou teste. `node scripts/verificar-cabecalho.mjs` roda 22 verificações sobre a decisão de encolher, a geometria do anel e a curva do retorno ao topo, sem framework e sem dependência nova: ele transpila os dois módulos puros com o `typescript` que já está nas dependências e importa de um `data:` URL.

**O anel de progresso.** Enquanto está encolhida, um arco traça o progresso da página inteira no contorno do vidro: nasce no meio da aresta de cima, corre para a direita e fecha onde começou quando a página chega ao fim, com um ponto na ponta. Onde ele é branco sobre escuro na referência, aqui é o ardósio da marca sobre claro — e o halo atrás do ponto é amarelo institucional, porque branco sobre claro não acende nada. O ponto não é posicionado por trigonometria: quem sabe onde a ponta do arco está, inclusive nos cantos arredondados, é o próprio caminho, via `getPointAtLength`. E `pathLength` ficou de fora de propósito — a referência normaliza o caminho em 1 e escreve `dashoffset: 1 − progresso`, o que se apoia em `getTotalLength()` ignorar `pathLength`; os navegadores fazem isso, mas a especificação deixou ambíguo por anos, e aqui o comprimento real é medido a cada quadro e usado tanto no tracejado quanto no ponto.

**Uma decisão que a marca obrigou.** Na referência a cápsula encolhida é um **círculo de 56px com o símbolo isolado**, e o nome some. O Plaswill não tem símbolo isolado — o logotipo é o lettering dentro do retângulo amarelo, com tinta em todas as colunas — então nada pode sair de dentro da marca. O encolhimento é feito só pela cápsula: 385px viram **94px**, e a marca fica inteira e legível nos dois estados. Os 94px são conta, não chute: a marca tem 30px dentro de uma cápsula de 54px, ou seja 12px de respiro em cima e embaixo, e 94px devolvem **os mesmos 12px de cada lado**. A primeira tentativa foram 84px — a janela da marca mais o vidro de cada lado — e a captura mostrou o que a conta não mostrava: a marca saía apertada entre as bordas, com 7,2px de um lado e 12px do outro. Abaixo de `lg` a cápsula já abraça o conteúdo, não há vazio a recolher, e só o anel se move.

**O terceiro estado: o hover.** Em 21/10 o Lucas pediu os três estados da referência — no topo a assinatura inteira, ao rolar só a marca, e no hover ela volta. Os dois primeiros já existiam; o hover, não. Agora, com a cápsula encolhida, `:hover` e `:focus-within` a devolvem aos 385px, e ela recolhe quando o ponteiro sai. É **só CSS**, sem cópia em `useState`: o estado de hover do navegador é o mesmo que o CSS lê, então não há como os dois discordarem. O `:focus-within` faz o mesmo acontecer com Tab, e é o que mantém o alvo de foco do link da assinatura do tamanho cheio enquanto ele está focado, em vez do tamanho de um selo de 94px.

**O quarto estado: o nome escrito ao lado da marca.** Em 21/10 o Lucas completou o pedido: *"ao colocar o mouse em cima do header, expandisse para logo + plaswill embalagens, para não ficar apenas ocioso"*. A reclamação era justa e tinha número: a cápsula cheia tem 385px e a marca 69,6px, ou seja **157px de vidro vazio de cada lado** — o hover devolvia essa largura sem mostrar nada de novo. Agora o nome entra no vão, em Archivo caixa-alta com 0,12em de entreletra, que é a mesma voz dos nomes de cliente no carrossel; a janela que o revela é `max-width: 0 → 190px` e o vão vai de 0 a 8px, os dois em 600ms com a curva da referência.

**E o nome não aparece de imediato — ele esmaece.** Foi o segundo pedido, no mesmo dia: *"não seja imediato que apareça o nome da plaswill embalagens e tivesse um efeito de esmaecer ou coisa do tipo"*. A primeira versão tinha opacidade de 0 a 1 em 300ms junto com a janela, e o resultado era o texto sendo **escrito letra a letra** pelo `max-width` que cresce — efeito de máquina de escrever, não de nome que aparece. O nome passou a entrar pelo **gesto de revelação da biblioteca de componentes** (`referencias/antimetal-design-system.md`, §5 e §6.6): `opacity 0 → 1` com `translate3d(0, 12px, 0) → 0`, **700ms**, `cubic-bezier(.22, 1, .36, 1)`, mais `will-change` no estado que dispara. É o único gesto não solicitado do sistema de referência, e ele é o mesmo em toda a página dela — não há fade-and-slide diferente por seção —, então vale a mesma disciplina aqui.

O atraso é o que a biblioteca não tem, e é o que atende ao pedido: **300ms, metade dos 600ms do vidro**. O nome começa a aparecer quando a janela já abriu espaço, e não no primeiro quadro do hover. A saída é o contrário — **240ms, sem atraso** —, porque na biblioteca o que responde a uma ação leva 150–300ms e só a entrada é lenta; assim o nome some antes de o vidro começar a fechar e nunca é visto recortado por uma janela em movimento. O tempo total de entrada é 300 + 700 = 1s, mas a curva é fortemente desacelerada: metade do caminho acontece nos primeiros 150ms, e o nome já está legível quando o vidro termina de abrir.

Duas notas sobre o deslocamento. Ele fica no **eixo Y**, como na biblioteca: um `transform` desloca a caixa inteira, e a janela que recorta o texto na horizontal não corta o que está deslocado — e 12px cabem nos 54px da cápsula, que tem 12px de folga acima e abaixo da marca de 30px. E o `transition` do estado de hover teve de ser declarado **inteiro**, com os quatro tempos: só assim a entrada é lenta e a saída é rápida. Consequência de cascata que quase passou: o bloco de `prefers-reduced-motion` desligava `transition` no seletor base, e o seletor de `:hover` tem peso maior — com movimento reduzido o gesto de 700ms continuaria correndo. Os três seletores estão lá agora (ver abaixo).

**De onde saiu o 190, e de onde não saiu.** O texto mede **188px** — medido em navegador, numa cópia de conferência, não estimado — e a janela leva 2px de folga para o arredondamento de subpixel não cortar a última letra: a mesma lógica dos 72px da marca, que são 69,6px mais 2,4. Com o vão de 8px, o conteúdo todo soma **264,9px dentro dos 385px**: 60px de vidro de cada lado, e a altura da cápsula continua **54px**, porque 13px de texto não passa dos 30px da marca. O número está em dois arquivos — o protótipo e `abertura.css` —, e por isso a sonda da moldura imprime a largura natural do texto ao lado da largura declarada na regra: se o texto passar da janela, a última letra corta, e é a comparação entre esses dois números que denuncia.

**Consequência assumida: a marca desliza para a esquerda enquanto o nome abre.** O conteúdo é centrado dentro da cápsula, e a cápsula está no eixo da página — foi o que o Lucas aprovou na correção de alinhamento. Com o nome fora, o grupo é a marca sozinha; com o nome dentro, o grupo são marca, vão e nome, e o centro do grupo muda. A marca anda cerca de 94px para a esquerda, e é o preço de manter a assinatura no eixo. As alternativas foram descartadas por motivo: alinhar o conteúdo à esquerda da cápsula pararia a marca, mas jogaria a assinatura 157px fora do eixo em repouso; crescer a cápsula só para a direita tiraria a cápsula do eixo. É também o movimento da referência, onde o nome desenrola ao lado do símbolo.

**Só a partir de `md`.** Abaixo de 768px a revelação não acontece, e não é esquecimento: nessa largura a cápsula abraça o conteúdo e o botão do menu está na ponta direita, então num celular — onde não há hover — nada muda, e numa janela estreita com mouse o nome chegaria por baixo do hambúrguer. Em `prefers-reduced-motion` o nome continua aparecendo, porque ele diz o nome da empresa: o que sai é o gesto, e o texto entra inteiro no mesmo instante em que a cápsula troca de largura. Para isso o bloco precisa desligar a transição nos **três** seletores — base, `:hover` e `:focus-within` —, porque o de `:hover` tem peso maior que o da base e, sozinho, deixaria os 700ms correndo justamente para quem pediu menos movimento.

**O texto repete o que já está na arte — por decisão de quem pediu.** A bandeira oficial já traz "Plaswill" e "Embalagens" desenhados dentro dela, então o texto ao lado repete as duas palavras. Foi a opção escolhida entre três: a segunda era escrever só "EMBALAGENS" (que completa o nome sem repetir) e a terceira, nenhum texto — só a marca maior no hover. Ficou registrado porque é o tipo de detalhe que o próximo a mexer vai querer "corrigir"; não é engano, é a escolha.

**O que não deu para fazer, e a decisão.** O estado do meio — "apenas logo" — **não existe nesta marca**: o logotipo é o nome dentro da bandeira amarela, com tinta em todas as 246 colunas, então não há o que mostrar sem o nome. Em 21/10 o Lucas escolheu **manter o logotipo completo nos dois estados** em vez de recortar uma peça do arquivo oficial; a alternativa era recortar o "P" da bandeira como selo, e isso muda a identidade. A consequência está assumida: o nome nunca some, e o que muda entre os estados é o tamanho da cápsula, não o conteúdo. Se um dia a marca tiver um símbolo, `symbolSrc` já está ligado e o estado compacto passa a mostrá-lo sozinho (ver item 16 de *Revisar antes de publicar*).

**O peso do anel foi afrouxado e voltou — e a tentativa fica registrada.** Em 21/10, vendo o estado encolhido, o Lucas pediu *"pode deixar a cor um pouquinho mais fraca?"*. O anel não é uma camada só: são **duas** em ardósio cheio — a linha de 2px e uma cópia borrada por cima, que existe para amaciar a aresta —, mais o ponto. A versão suave deu pesos distintos a cada uma: ponto 0,9, linha 0,8, brilho borrado 0,5 (o trilho ficou em 0,1). Medida sobre `#f8fafc`, a linha ia a **9,3:1**, o brilho a **3,4:1** e o ponto a **13,0:1** — acima dos 3:1 que a WCAG pede para indicador não textual. Visto na tela, porém, ele pediu para voltar: *"volte como estava antes"*. **As três camadas estão de novo em ardósio cheio**, e o contraste é **17,1:1** na linha, no brilho e no ponto.

O registro serve para a próxima vez que o anel parecer pesado — e a informação útil é que **o peso vem da passada borrada, não da linha**: ela é a única camada que *soma* escuridão em volta do traço. Se um dia a suavização voltar, o caminho é mexer nela (0,5, ou até 0,35) e deixar linha e ponto cheios, o que diminui a aura sem apagar o contorno. A sonda `anel-peso.py` lê os atributos do protótipo e imprime o contraste de cada camada, em vez de alguém estimá-los de olho; com os atributos removidos, ela imprime "alfa não encontrado" e o valor do próprio ardósio, que é a resposta honesta.

**Rolada, a barra fica só com a marca.** Pedido do Lucas em 21/10: *"pode ajustar para que no scroll, minimize e fique apenas a logomarca daí?"*. O encolhimento da cápsula já existia, mas as duas laterais continuavam no lugar — a barra rolada mostrava três pílulas, uma delas menor. Agora, no mesmo instante em que a cápsula encolhe (acima de 220px de rolagem, com histerese de 110px), a navegação e o contato **saem de cena**: apagam em 300ms, andam 10px para fora, viram `visibility: hidden` e `pointer-events: none`. O que fica é a bandeira amarela no eixo, com o anel de progresso em volta.

O que fecha o desenho e o que ele custa. **A marca é também a volta**: o link da assinatura sobe a página em 1100ms, e as laterais reaparecem quando o topo volta — o mecanismo já existia para o retorno ao topo. Esconder a navegação custa, e é bom que o custo esteja dito: rolado, o visitante perde os links e o botão de orçamento da barra. Ele ganha o caminho de volta (a marca) e, para o comercial, a **faixa de conversão** no fim da página — que passou a existir no mesmo dia e por outro motivo, e que aqui faz diferença. Por isso o comportamento é **só de `lg` para cima**: abaixo disso as laterais nem existem (a barra é marca + hambúrguer), e esconder o hambúrguer deixaria a página sem navegação nenhuma.

Duas decisões técnicas que valem registro. A primeira: o afastamento usa a propriedade **`translate`**, e não `transform`, porque as duas laterais já dependem de `transform: translateY(-50%)` — a utilitária `-translate-y-1/2` — para centrar, e uma regra de `transform` nesta folha seria descartada pela utilitária. É o defeito de cascata que já apareceu duas vezes neste arquivo; `translate` compõe com `transform` e as duas convivem. A segunda: 300ms com `cubic-bezier(.4, 0, .2, 1)`, não os 600ms do vidro — é o que responde a uma ação, e rolagem é ação do visitante; na biblioteca, o que responde ao usuário leva 150–300ms e só a entrada é lenta. Em `prefers-reduced-motion` as laterais continuam saindo, porque isso é informação (o topo voltou a ser o único destino), mas sem o trajeto.

**As três cápsulas dividem um eixo, e não só uma linha de topo.** Até 21/10 as três eram posicionadas com `top-0` e tinham alturas diferentes — a navegação **47,1px**, o contato **52px** e a assinatura **54px** —, porque a altura de cada uma é ditada pelo próprio conteúdo: o logotipo tem 30px, os links têm uma linha de texto. Alinhadas pelo topo, as três terminavam em pontos diferentes e os eixos caíam em **53,5 · 57,0 · 56,0**. A barra não tinha uma linha horizontal, tinha três — e foi isso que o Lucas viu e pediu para ajustar.

A correção não foi empurrar nada com números: os três grupos passaram a `top-1/2 -translate-y-1/2` e as três cápsulas ganharam `h-[54px]`, a altura da mais alta. Medido depois: **topo 30,0 · base 84,0 · altura 54,0 · eixo 57,0 nas três**. O 54 não foi escolhido, saiu do layout — é o que a marca exige (30px de logotipo mais 6px de respiro do link e 6px de vidro de cada lado) —, e agora é a altura que as outras duas adotam. Com os três grupos centrados, a faixa se mantém alinhada mesmo que a altura de um deles mude.

**A faixa de clientes.** Quinze nomes em carrossel contínuo, uma linha só, saindo pela direita e voltando pela esquerda sem emenda. A ordem do array em `site.ts` agrupa por segmento (`03-comercial.md` §4): metalmecânica (Saur, Fockink, Tromink, Oxbo, Lange), agropecuária e cooperativas (Cotripal, Cisbra, Qualyagro, Ijuí, Cerélus) e saúde mais serviços (HCI, Hospital São Peregrino, Dose Express, Grupo Rio Grande, Global Filtros).

Como o laço fecha: o trilho tem **duas cópias** da lista e anda `-50%`, ou seja, exatamente uma cópia. Cada cópia leva `padding-right` igual ao vão entre nomes, então o vão da emenda é igual aos outros e não há salto a cada volta. A segunda cópia é `aria-hidden` — o leitor de tela ouve quinze nomes, não trinta. As bordas se dissolvem com máscara (não com gradiente pintado por cima), para o nome que sai não parecer cortado. O carrossel **pausa no hover e no foco**, que é o que dá tempo de ler um nome que passou rápido. Em `prefers-reduced-motion` ele para de vez, a segunda cópia some e a faixa passa a ser rolável na mão.

**Por que nomes, e não os logotipos.** Os quinze recortes de marca existem e continuam em `public/clients/` (com um LEIA-ME explicando como reativar), mas num fundo creme quinze logotipos coloridos viravam o elemento mais forte da tela e disputavam com o título, que é o que a abertura precisa vender primeiro. Em tipografia Archivo, caixa alta e espaçada, a faixa lê como textura e sustenta o "fornecedor homologado de" sem roubar o primeiro plano. Decisão do Lucas em 20/10.

**A fachada.** A sede ocupa a coluna direita a partir de `md`, em altura cheia e sangrando até a borda da janela; no celular ela desce para baixo do carrossel como uma faixa de borda a borda, com 32vh.

O que se move é só o enquadramento: uma deriva de zoom e deslocamento de 34s, para lá e para cá. **Nada dentro da imagem se mexe** — nenhuma janela se deforma, nenhum carro aparece. É a mesma ideia prevista para a foto aérea, em outra escala, e a razão de ter sido escolhida no lugar de uma ilustração animada ou de um vídeo gerado por IA: animação generativa em cima de arquitetura real mexe em janelas, deforma o letreiro e "derrete" a estrutura — num cliente industrial que reconhece o próprio prédio, é o detalhe que quebra a confiança.

**Duas máscaras, uma em cada caixa**, porque `mask-image` não compõe duas direções sozinha. A de fora dissolve o topo: o céu entra no papel e a barra fixa continua sobre papel limpo em vez de sobre fotografia. A de dentro dissolve a esquerda (só a partir de `md`): a foto encosta na coluna de texto sem uma linha vertical dura. No celular não há dissolve à esquerda — a faixa é de borda a borda e não existe texto do outro lado para justificar.

O recorte vem do `object-position`, não de um corte no arquivo: a caixa é mais estreita que a fotografia (0,77 contra 1,33), então o `cover` corta **na horizontal** e o segundo valor do `object-position` não tem efeito nenhum. O que sai do quadro é céu vazio — justamente o que a máscara de cima já apagaria.

**Sobre o arquivo.** É a foto do prédio que o Lucas enviou em 20/10, 1024×768. O site usa `public/photos/plaswill-fachada.jpg` (99 KB, JPEG progressivo) com **um único ajuste**: contraste 1,07 e cor 1,02, para cortar a névoa de contraluz. Nada de recorte, nada de retoque, nada de conteúdo inventado. O original sem tratamento está em `design/originais/fachada-plaswill-original.png` e fora do build — se a correção de cor for questionada, é dele que se refaz.

**A resolução é o limite.** 1024 px de largura atende uma coluna de ~520 px em telas 2x; em 3x fica macio. O arquivo de câmera, quando aparecer, entra com o mesmo nome.

**Como a casca foi isolada.** A casca do site institucional saiu de `src/app/layout.tsx` e foi para `src/app/(site)/layout.tsx` — o grupo de rotas não aparece na URL, então `/` e `/politica-de-privacidade` continuam idênticas. O layout raiz ficou só com o documento: `<html>`, `<body>`, as fontes e os metadados herdados. Assim a abertura tem a casca dela sem herdar navegação e rodapé alheios. O CSS do Tailwind também só carrega nesta rota, então o preflight não toca na landing aprovada.

**Cores.** Os tokens da referência foram traduzidos para os nomes de papel do dossiê:

| referência | aqui | valor | papel |
| --- | --- | --- | --- |
| `brand-dark` | `brand-slate` | `#0F172A` | tinta, fundo do botão |
| `brand-green` | `brand-petrol` | `#09506A` | azul petróleo, hover do CTA |
| `brand-light` | `brand-ice` | `#F1F5F9` | superfície alternativa |
| `brand-cream` | `brand-surface` | `#F8FAFC` | fundo da abertura |

O **amarelo institucional não é usado como tinta nesta página**, e é decisão medida: `#FFDE00` sobre `#F8FAFC` dá 1,18:1, ilegível. Ele entra no fundo do logotipo — com a tinta escura da marca por cima, que é o uso correto — e não em nenhum texto da página.

> Correção de 20/10: até o logotipo chegar, esta página não tinha nenhum amarelo. Com a marca no lugar, o amarelo institucional passa a ser a primeira cor que o visitante vê na barra, e isso é bom: a regra nunca foi "evitar o amarelo", foi "nunca usar amarelo como texto sobre claro".

**O contraste do vidro é medido, não estimado.** No Antimetal a página inteira é um cinza claro uniforme, então 67% de opacidade na cápsula basta. Aqui não: a barra é fixa e passa por cima da fotografia da fachada ao rolar, e essa foto tem preto de verdade — o 1% mais escuro mede `(4, 3, 3)`. Com o vidro a 72% e o texto a 62%, o menu media **3,75:1** sobre essa região, abaixo dos 4,5:1 da WCAG 2.2 AA. Com **84%** de opacidade e o texto a **78%**, o pior caso (vidro sobre preto puro) sobe para **6,86:1**. Ficou registrado aqui porque é o tipo de número que se perde: da próxima vez que alguém quiser "deixar o vidro mais transparente", é esta conta que responde.

**Quatro efeitos da biblioteca naocodei**, escolhidos pelo Lucas em 21/10 e reescritos em CSS (a biblioteca é JavaScript puro sobre elementos que ela mesma cria; esta página é React com renderização no servidor, então o que se aproveita é o movimento, não o código):

| efeito | onde | por que assim |
| --- | --- | --- |
| **16** — revelar palavra por palavra | o título | usa `clip-path: inset()`, e **não** `overflow: hidden`: o título tem "que", "paga" e "chega" com `line-height: 1.04`, apertado de propósito, e a caixa de linha fica mais baixa que a fonte — o rabo do "q" e do "g" sumiria. O `inset()` aceita valor negativo, então o estado final não recorta nada e o corte só existe durante o movimento |
| **05** — máscara que revela | a fachada e a faixa aérea | é `clip-path`, não `mask-image`, porque as duas caixas de foto **já têm** máscara de dissolução e `mask-image` não compõe duas direções — uma terceira máscara apagaria as duas. `clip-path` é propriedade independente e compõe. A fachada entra da direita, a faixa aérea da esquerda |
| **14** — botão elástico | os CTAs | pressão no clique com volta em curva de ultrapassagem, no próprio botão, sem deslocar nada em volta |
| **12** — luz que segue o cursor | as cápsulas de vidro | brilho especular. Aqui, e não numa seção escura, porque a abertura é toda em papel claro. Na landing institucional ele vai para o rodapé. As coordenadas são escritas direto no nó como variável CSS, sem passar por estado do React — um `setState` por evento de movimento custaria uma renderização por quadro para desenhar um brilho |

**Licença.** A naocodei se apresenta como código livre, mas **não foi encontrado nenhum texto de licença** no HTML da página. Confirmar os termos antes de publicar — é o tipo de detalhe que só dá problema depois de estar no ar.

**Desvios do spec, cada um com motivo:**

1. **Mídia.** A referência usa vídeo. Não existe vídeo institucional da Plaswill — o `/branding` da API publica quatro chaves e nenhuma é vídeo, e a ficha proíbe usar peça fora das quatro em nome da empresa. No lugar entram duas fotografias reais, cada uma com deriva lenta de câmera: a **fachada da sede** na coluna direita (existe desde 20/10) e a **foto aérea** da planta na faixa sob o texto (ainda não existe).
2. **A mídia não fica atrás do texto.** O spec pede `inset-0` com o texto por cima e **nenhum** véu ou scrim. Com uma fotografia industrial isso não sustenta AA — num celular o texto ocupa quase a tela inteira, e palavra sobre foto derruba o contraste. A seção virou uma coluna: o texto recebe o que precisa e a faixa de mídia recebe o resto, com o encontro dissolvido por máscara. Máscara não é véu: não há cinza sobre a foto, ela simplesmente não está onde o texto está.
3. **Voz tipográfica.** O título sai em Source Serif 4, a voz de display do site, e não na grotesca leve da referência. Tamanhos e alinhamento são os do spec.
4. **Nomes em uma família só, e em carrossel.** A referência troca a fonte de display a cada wordmark (Playfair, Oswald, Montserrat, Roboto Slab, Raleway — fontes dela, não da Plaswill), ou seja, imita marcas de terceiros com tipografia — o projeto não faz isso. Aqui os quinze nomes saem todos em Archivo, caixa alta, letra espaçada, e a faixa rola em laço contínuo em vez de ficar em duas ou três fileiras estáticas.
5. **Movimento reduzido.** O spec não trata do assunto; o briefing exige. As animações de entrada usam `both`, ou seja começam em `opacity: 0` — desligá-las devolve o estado final, senão o conteúdo some.

**Para ativar os arquivos oficiais, basta copiar** (o build detecta, sem tocar em código — ver `src/lib/brand.ts`):

| arquivo | onde | o que muda |
| --- | --- | --- |
| logotipo | `public/brand/plaswill-logo.svg`, `.png` ou `plaswill-logotipo.png` | a assinatura tipográfica vira o logotipo, aqui e no site inteiro — **já ativo em `plaswill-logotipo.png`** |
| símbolo | `public/brand/plaswill-simbolo.svg`, `.png` ou `.webp` | a pílula central passa a mostrar **símbolo + nome** com o desenrolar do Antimetal, no lugar do logotipo inteiro revelado por janela. **Não existe hoje** — a marca é um bloco fechado |
| fachada | `public/photos/plaswill-fachada.jpg` | a coluna direita passa a mostrá-la, com deriva de câmera — **já ativo** |
| foto aérea | `public/photos/plaswill-aerea.jpg` | a faixa sob o texto, dentro da coluna da esquerda, com deriva de câmera |

Sem a fachada, a coluna direita simplesmente não existe e a abertura fica em uma coluna só. Sem a aérea, nada é desenhado abaixo do carrossel. Nenhuma das duas é substituída por desenho genérico: o campo de grânulos (`RawMaterialField`), que fazia esse papel, foi retirado a pedido em 20/10 — "vamos deixar limpo por enquanto".

**Como conferir o desenho.** `design/abertura.html` é o protótipo visual da rota, com a mesma marcação em CSS puro, e `design/abertura-desktop.html` enquadra esse protótipo em 1440px para conferir o layout de desktop (o painel de pré-visualização do editor não chega lá: em 21/10 ele mediu **304px de largura útil**, e não os 443px anotados antes — a largura do painel mudou entre versões do editor, então **meça antes de confiar no número**). `design/cabecalho.html` e `design/prototipo.html` fazem a mesma coisa com a **rota compilada** e com o **protótipo**, um arquivo para cada: recortam a barra em faixas de 432px em escala 1:1 — esquerda, centro e direita —, porque a 0,3× as cápsulas ficam com 14px de altura e não dá para julgar aresta de meio pixel nesse tamanho. Nenhum dos quatro entra no build. Quando o estado a conferir depende de uma **media query** mais larga que o painel, a saída não é o `:hover` forçado e sim um **palco**: monta-se o componente numa caixa da largura real que a regra supõe e reduz-se a caixa inteira com `transform: scale()`, o que encolhe a foto sem mentir sobre o desenho — foi assim que a faixa de conversão foi conferida em 1024px dentro de um painel de 304px. `transform` não mexe no layout, mas **multiplica o `getBoundingClientRect`**: número medido dentro de um palco sai escalado e precisa ser dividido pela escala.

Três coisas do cabeçalho **não aparecem em captura comum**, e a moldura tem uma faixa para cada. O **estado encolhido** é estado de cliente — o servidor não sabe onde a página está rolada, então a marcação sai sempre com a cápsula cheia — e por isso sai de `python3 design/snapshot.py 4326 --compacto`, que força a largura em CSS e escreve `design/abertura-compacto.html`. O **nome revelado** depende do ponteiro em cima da cápsula, e ponteiro também não se fotografa: sai de `python3 design/snapshot.py 4326 --hover`, que força **só a revelação** — as três declarações de `:hover` — e escreve `design/abertura-hover.html`; a largura da cápsula não é forçada porque no estado cheio ela já é o padrão do servidor, e pairar a cápsula encolhida a devolve justamente a ele, então a mesma imagem serve para os dois casos. E o **anel de progresso** só existe depois da hidratação, porque depende de medir a cápsula: a última faixa da moldura é uma sonda sintética que desenha o contorno com a saída real de `pillRingPath()` e posiciona arco e ponto com a mesma conta do componente, executada por um navegador de verdade. Nas faixas equivalentes de `prototipo.html` nada disso é forçado: quem encolhe a cápsula e acende o anel é o **próprio script do protótipo**, e é essa a diferença que o par de molduras mede — a rota prova o desenho, o protótipo prova o comportamento.

**O protótipo passou a ter o mesmo cabeçalho, e por isso ganhou moldura própria.** Em 21/10 o porte foi feito: as três cápsulas de 54px no mesmo eixo, a assinatura no eixo da página, o encolhimento por rolagem com os mesmos **220/110/160** e o anel de progresso. Vale o trabalho porque `design/abertura.html` é a peça de revisão — é nele que se julga o desenho antes de virar componente —, e um desenho que só existisse na rota não serviria para revisar nada.

Conferir isso não podia ser "abrir e olhar": o painel de pré-visualização tem ~780px de altura, **não rola**, e fotografa a página sempre no topo, que é justamente onde o cabeçalho está no primeiro estado. O estado encolhido é uma posição de rolagem, e não há captura que chegue lá. A saída foi `design/prototipo-estado.py`, irmão do `snapshot.py`, com um modo por estado: `--compacto` rola até 60% da página e deixa o próprio script do protótipo encolher a cápsula; `--hover` copia o bloco de 768px do protótipo, rebaixa o gatilho e dispara o estado por um identificador posto depois da carga — o que faz a transição correr em vez de o estado nascer pronto —, e não rola, porque o estado cheio já é o de repouso. `--minimizado` rola como o `--compacto` e baixa o gatilho do bloco de `lg` **daquele cabeçalho** para zero, porque abaixo de 1024px as duas laterais são `display: none` e não haveria o que medir; a sonda então lê as duas no topo e depois de rolar, que é a prova de causa: `1.00 visible` antes, `0.00 hidden` depois. Nos dois a cópia injeta uma **sonda** que **escreve os números dentro da página**, em monospace de 13px, no canto superior. O que a captura do primeiro mostra é isto:

```
piso +1400px  alvo 840
rolagem   y=840  max=1400
caixa     94x54
encolhida SIM
```

A cápsula encolhida do protótipo mede **94×54** — exatamente o 94px de largura que a rota recebe forçada por CSS no `snapshot.py --compacto`, com a mesma altura de 54px. Nos dois casos o 94 é a mesma decisão de desenho, a de *Uma decisão que a marca obrigou*: a marca de 30px já tem 12px de respiro em cima e embaixo, e a largura dá os **mesmos 12px de cada lado** (69,6px de marca mais 12,2 e 12,2) em vez dos 6px que o vidro sozinho devolveria. O que a sonda prova é que o **protótipo chega nesse estado sozinho**, pelo próprio script, e não por CSS forçado de fora. Duas leituras intermediárias valem registro, porque nas duas primeiras vezes a sonda pareceu acusar um defeito que não existia. Uma deu **99×54**: a rolagem é suave e a transição de largura leva 600ms, então a medida saiu com a cápsula ainda fechando — acrescentou-se uma terceira leitura aos 1600ms, porque **ler cedo demais um estado animado é uma forma de inventar um defeito**. A outra foi `piso +1400px`: dentro do `<iframe>` de 1000px de altura o documento do protótipo é **curto demais para conter a janela do estado encolhido** (`220 < y < max − 160`), então não havia como encolher; não era o CSS, era a página. A cópia ganha comprimento no fim quando precisa, e nada no cabeçalho se desloca por isso. **A regra que fica: para conferir um estado que depende de rolagem, a moldura precisa de rolagem suficiente para conter esse estado.**

> **Uma moldura por implementação.** `cabecalho.html` é a moldura da rota compilada, `prototipo.html` é a do protótipo, com as mesmas faixas e o mesmo recorte (`.ctr`, `left: -504px`) — as duas cápsulas encolhidas ficam empilhadas na mesma coluna e são comparáveis pixel a pixel. Não moram no mesmo arquivo porque o painel não rola: empilhadas, as segundas ficariam abaixo da dobra, sem como conferi-las. Se uma faixa de uma divergir da faixa correspondente na outra, uma das duas está errada.

A sonda do estado de hover imprime outra conta — a do nome —, e é dela que saiu o número da janela:

```
marca     69.6px
nome      188px      ← largura natural, medida sem janela
nome agora 187.3px   ← com a janela de 190px aplicada
vao       8px
link      264.9px
soma      264.9px    ← marca + vão + nome, que é o que a cápsula centra
janela    190px
entrada   .7s
curva     cubic-bezier(.22,1,.36,1)
atraso    .3s
```

`marca + vão + nome = link` é a igualdade que diz que a conta fecha: 264,9px de conteúdo dentro dos 385px da cápsula, e por isso 60px de vidro de cada lado. `nome` menor que `janela` é o que diz que o texto não corta. **A `janela` e o gesto não são escritos à mão na sonda**: o gerador os lê de `abertura.html`, em Python, e os injeta — número copiado à mão é número que fica velho em silêncio, e se a regra mudar de forma a sonda imprime "não encontrada" em vez de mostrar um número velho. A primeira versão lia a regra do CSSOM, dentro do navegador, e devolveu `não lida`: o caminho era mais frágil que o problema, e a leitura passou para onde o erro aparece.

**E a sonda passou a medir o tempo, não só a geometria.** Uma imagem parada não mostra que o nome não aparece de imediato, então a cópia `--hover` **dispara o estado à mão** e amostra a opacidade ao longo de 1,2s, uma linha por instante:

```
t=0ms     op=0.00  w=0px    topo=32px
t=120ms   op=0.00  w=5px    topo=32px    ← vidro começando a abrir, nome invisível
t=300ms   op=0.00  w=80px   topo=32px    ← vidro na metade, nome ainda invisível
t=380ms   op=0.38  w=146px  topo=27.4px
t=500ms   op=0.78  w=182px  topo=22.6px
t=700ms   op=0.97  w=187px  topo=20.3px
t=900ms   op=1.00  w=187px  topo=20px
t=1200ms  op=1.00  w=187px  topo=20px
```

Três coisas ficam provadas nesses números. A primeira é o **atraso**: nos primeiros 300ms a opacidade é exatamente 0 enquanto a janela já abriu 80px — o nome existe no layout e não é visto, que é o pedido ao pé da letra. A segunda é a **curva**: de 0,38 a 0,97 em 320ms, fortemente desacelerada, como o `cubic-bezier(.22,1,.36,1)` prevê. A terceira é o **deslocamento de 12px**: `topo` sai de 32 e chega a 20, e nunca sai da faixa de 0 a 54 — o texto sobe dentro da cápsula sem sair dela em nenhum quadro.

O mecanismo dessa cópia mudou junto. Antes ela forçava as declarações com `!important`, e um estado forçado por CSS **nasce pronto** — não há transição para amostrar. Agora o gerador copia o bloco de `@media (min-width: 768px)` do próprio protótipo, rebaixa o gatilho para `min-width: 0` e prende o seletor a `#forcado`; o identificador entra na cápsula **depois** da carga, pelo script da sonda, e é isso que faz o gesto correr de verdade. As declarações são as do arquivo, sem uma linha reescrita — o que muda é só quem dispara.

**Três defeitos da própria sonda, no caminho.** O primeiro: o seletor copiado mantinha o `:hover`, e sem ponteiro a regra nunca casava — a sonda imprimiu `op=0.00` e `nome agora 0px` em todas as amostras, medindo o repouso. O segundo: `#forcado .centerpill` procura um `.centerpill` **dentro** do elemento com o id, e o id está nele mesmo; tem de ser `.centerpill#forcado`, colado. O terceiro é mais sutil: a rotina que lê a largura natural do texto põe `max-width: none` e devolve em seguida, e fazer isso **no meio da transição** estraga o que se quer medir — a janela salta para o valor final e a coluna `w` da curva passa a mostrar 187px desde o primeiro instante. A geometria passou a ser lida uma vez só, depois de a poeira baixar.

**Dois estados do cabeçalho não cabem no painel.** O nome revelado ao lado da marca e o nome ao lado da marca no protótipo vivem dentro de `@media (min-width: 768px)`, e o painel tem 304px: nenhuma captura dele vai mostrar esse estado, por mais que o `--hover` force as declarações. A prova de que a rota **embarca** o quarto estado é o CSS emitido, não a imagem — `design/snapshot.py` compila, e no chunk da rota lê-se, dentro do bloco de 768px, `.centerpill:focus-within .centerpill__lockup-name,.centerpill:hover .centerpill__lockup-name{max-width:190px;margin-left:.5rem;opacity:1;transform:translateZ(0);will-change:opacity,transform;transition:…opacity .7s cubic-bezier(.22,1,.36,1) .3s,transform .7s…}` (o minificador escreve `translate3d(0,0,0)` como `translateZ(0)`, que é o mesmo), a regra base com o `translate3d(0,12px,0)` e a saída de 240ms, e no bloco de movimento reduzido os **três** seletores com `transition:none`. O desenho do estado em si continua sendo conferido no protótipo, por `design/prototipo-estado.py --hover`, cuja sonda mede a largura natural do texto, o número da janela e a curva do gesto — que é o que a captura não pode dar.

**E a sonda do hover mentiu antes de acertar.** A primeira leitura deu `vao -61,6px` e `link 195,3px` — marca e nome **sobrepostos**, um layout que não existe em lugar nenhum. A causa não era o CSS: a sonda media no mesmo quadro em que a marca ainda estava **presa no início da própria animação de entrada**, com a janela de 72px em zero por 520ms; a marca transbordava da janela, e o nome começava 8px depois de uma caixa de largura zero. A correção foi desligar a animação de entrada na cópia, como o `snapshot.py` já fazia na rota, e medir depois das fontes. É a **terceira vez** que este projeto tropeça no mesmo degrau — as duas primeiras foram os 99×54 e o `piso +1400px` —, e por isso a regra está escrita em vez de só lembrada: **estado animado não se mede no meio do movimento.**

**Um defeito de sintaxe que matava o script inteiro.** O script do protótipo fechava com `})();` sem nunca abrir a IIFE. Sintaxe inválida: o bloco `<script>` inteiro não roda, e com ele morrem a luz que segue o cursor, o hambúrguer e o encolhimento. O desenho continua na tela, parado, com cara de escolha de estilo — e não há build nem aviso do painel que denuncie. A abertura da IIFE entrou junto com o porte. É a mesma família dos dois defeitos de cascata abaixo: falha silenciosa, que só captura pega.

> O painel de pré-visualização **guarda em cache** o arquivo que carrega dentro do `<iframe>`. Nas conferências de 21/10 isso mostrou por duas rodadas um defeito já corrigido, e quase levou a "consertar" o que não estava quebrado. `design/cabecalho.html` carrega o snapshot com `?v=<timestamp>` justamente para furar o cache.

**Lições que custaram tempo, e ficam registradas.** Três, todas sobre a mesma família de armadilha — o nome de uma classe:

1. **Este arquivo de CSS é carregado depois de `@tailwind utilities`.** Toda regra escrita nele vence a utilitária de mesmo peso, e isso produziu dois defeitos sem nenhum erro de build: `.pill-link` tinha `display: block` e o `flex` do item de navegação era descartado (o chevron de "Produtos" caía para a linha de baixo); `.glass` tinha `position: relative` e o `absolute` das três cápsulas era descartado (elas paravam de flutuar nos cantos e viravam três blocos de largura total, empilhados). A correção foi envolver tudo em `@layer components`, onde a ordem é a esperada: base, componentes, utilitárias. **A regra para quem mexer aqui: não declarar nesta folha nada que uma utilitária possa querer sobrescrever** — `display`, `position`, margem e padding de componente são as armadilhas.
2. **Os dois defeitos passaram pelo build limpo.** `next build` compilou os dois sem uma linha de aviso. Defeito de cascata não é erro de compilação — só aparece em captura de tela, e foi por isso que ela pegou os dois.
3. **Nome de classe que já é utilitária do Tailwind.** O anel de progresso chamava-se `ring` — e `ring` **é** uma utilitária do Tailwind, a que desenha anel de foco com `box-shadow`. Como as utilitárias saem depois da camada de componentes, o SVG levava por cima um `box-shadow: 0 0 0 3px rgb(59 130 246 / .5)`: um anel azul quadrado do tamanho da cápsula. Ficou invisível por dias porque o anel nasce com opacidade 0 e só acende no estado encolhido — e as capturas do estado encolhido não trazem o SVG, que é renderizado no cliente. Quem mostrou foi o **CSS emitido**: `.ring{--tw-ring-offset-shadow:…}` no byte 16589, depois de todas as regras desta folha. Renomeado para `pill-ring`. **A regra:** antes de batizar uma classe, conferir se o nome já é utilitária — `ring`, `filter`, `transform`, `container` e `sr-only` são os candidatos óbvios. E o comentário que citava `` `.ring` `` também alimentava o extrator: o Tailwind varre o **texto** dos arquivos em `content`, comentário incluído, então enquanto a citação existisse a utilitária continuava sendo emitida.

**A faixa de conversão, que era o buraco comercial da abertura.** Até 21/10 a página inteira tinha **um** caminho para o comercial: a cápsula da barra. O corpo não pedia nada — o spec de referência proíbe botão no hero, e o resultado era a peça mais bem-acabada do projeto gerando zero contato. `src/components/abertura/AberturaContato.tsx` entra depois da faixa de clientes, quando o visitante já viu quem confia na Plaswill, e é o último bloco da página.

**Nenhuma linha dessa faixa é nova.** O sobretítulo é a `tagline` do site, a nota é a `responseNote` do contato, os dois canais de texto são o telefone e o e-mail comercial, o botão principal é o **mesmo** da barra (`abertura.cta`, apontando para `/#orcamento` — o formulário que já existe na landing) e o secundário é o WhatsApp (`abertura.secondaryCta`). Não há promessa, número nem prazo escrito nela: o que não existe no dossiê não existe aqui. O botão sai da página de propósito — criar um segundo formulário exigiria decidir para onde ele envia, e isso é assunto da integração comercial, não desta faixa. Quando a abertura virar a página inicial, é esse `href` que muda.

O desenho é **papel com um filete de 1px em cima**, e não uma tarja escura como a banda do CTA da landing: a abertura é toda clara e uma faixa escura aqui pesaria mais que o hero. O teto é 1512px com a mesma calha do resto da página (`clamp(1.5rem, 7.6vw, 7.5rem)`), o bloco é uma coluna até 768px e duas colunas a partir daí, com `space-between` — o argumento à esquerda, as duas ações à direita. O botão leva o amarelo institucional como **preenchimento** com tinta escura (`13,35:1`, o par de maior contraste da paleta), nunca como texto sobre claro.

Conferida por medida nas duas larguras, com a sonda descrita acima. Em 1024px de layout: faixa **1024×161,7**, `flex-direction: row`, texto e canais em uma linha cada terminando em x=534, ações em **uma** linha (302,3×40) com o botão de **150×40** começando em x=697,7 — duas colunas, sem sobreposição, vão de 163,7px no meio, fundo `rgb(255,255,255)`, filete `1px rgba(15,23,42,.08)`, recuo esquerdo 24,2px, raio do botão 9999px, e **sem rolagem horizontal**. Em 304px (a largura do painel): coluna, faixa **304×398,6**, botão 150×40 — o mesmo alvo de toque nas duas. A primeira tentativa desta conferência errou por dois motivos que valem registro: o gatilho forçado saiu em 400px, **acima** dos 304px do painel, e as duas versões saíram idênticas; e a sonda imprimia `faixa 307,2×48,5` porque media dentro do palco escalado a 0,3. A segunda versão rebaixou o gatilho para 240px e passou a dividir pela escala.

**A rota compilada, sem instalar nada.** `design/abertura-rodando.html` é uma captura autocontida do HTML que o `next build` produziu — CSS, fontes e imagens embutidos, sem JavaScript. Abre no navegador como arquivo e serve para mostrar a página a quem não tem o projeto rodando. É gerado por `design/snapshot.py` a partir de um `next start` no ar; **não é fonte da verdade** e fica velho assim que o código muda.

---

## Revisar antes de publicar

Estes pontos dependem de decisão ou autorização de vocês. Estão aqui e não no código de propósito.

1. **Uso de marca dos clientes.** A seção de clientes lista nomes reais do dossiê (Cotripal, Cisbra, Saur, Fockink, HCI, TRE-RS e outros). Publicar nome de cliente como referência costuma depender de autorização contratual — confirmar com o comercial e o jurídico. O aviso está no topo do bloco `clients` em `src/content/site.ts`.
2. **Afirmações numéricas.** O dossiê traz três números que eu deliberadamente **não** publiquei, por serem afirmações comerciais que precisam de decisão: *redução de até 30% nas voltas por palete* (filme stretch), *economia de até 20% na planilha de compras* (PCR) e *perda de até 15% de nutrientes da forragem por mofo* (sacaria). Se o comercial confirmar, cada uma é uma linha em `site.ts`.
3. **"0.20 micras" da sacaria.** O dossiê registra essa espessura para a linha agrícola, e o valor é implausível: 0,20 micra é mais fino que uma bolha de sabão. Provavelmente é `0,20 mm` ou `200 micras` mal transcrito. Não publiquei número nenhum nessa ficha — precisa de confirmação de fábrica.
4. **Logotipo — resolvido em 20/10, com uma pendência de nitidez.** O arquivo oficial está em `public/brand/plaswill-logotipo.png` e o build já o usa em toda parte: barra a 30px, rodapé a 26px, abertura a 32px. A assinatura tipográfica continua no código apenas como rede de segurança, para o caso de o arquivo faltar.

   Três observações que valem registro. **Não há mais placa branca no rodapé**: a arte é um campo amarelo fechado, então ela carrega o próprio fundo e sobre o slate entrega 13,35:1 sozinha — a placa, que existia enquanto a arte era desconhecida, só criaria um retângulo claro em volta. **O filete branco de 3px em volta do amarelo é de projeto, não defeito de recorte**: é o que separa a marca de fundos variados, e não deve ser removido. **A resolução é o limite**: 246×106 px atende 32px de altura no limite de telas 3x — se houver o vetor ou um PNG maior, trocar o arquivo mantendo o nome basta, sem tocar em código.
5. **Fotografia.** A **fachada da sede** deixou de ser pendência em 20/10: o arquivo veio pelo chat e está em `public/photos/plaswill-fachada.jpg`. Fica uma pergunta de direitos: a foto foi feita por vocês ou por um fornecedor/agência? Se for de terceiro, precisa da autorização de uso — é a mesma lógica do uso de marca de cliente. E a resolução (1024 px) atende 2x, não 3x; o arquivo de câmera resolve. Já os cards de produto usam desenhos técnicos em SVG porque não há fotos reais disponíveis. O brief pede foto de fábrica, equipamento e produto. Para ativar: ponha o arquivo em `/public/images/` e preencha `image` e `imageAlt` do produto em `site.ts`. O card já usa `next/image` com `fill` e `sizes` quando o campo existe.
6. **Política de privacidade.** `src/app/politica-de-privacidade/page.tsx` é rascunho estrutural, **sem revisão jurídica**. Precisa passar pelo jurídico ou encarregado de dados, e o contato do encarregado e o prazo de retenção precisam ser preenchidos.
7. **CNPJ e dados cadastrais.** Conferir se o CNPJ da matriz (`08.718.368/0001-08`) é o que deve aparecer no rodapé, ou se entra também a filial.
8. **Analytics e consentimento.** Nada de rastreamento está ativo. Quando entrar GA4 ou equivalente, precisa de aviso de cookies e consentimento prévio, e a política de privacidade precisa ser atualizada junto.
9. **Domínio.** `seo.siteUrl` usa `NEXT_PUBLIC_SITE_URL` e cai em `https://plaswill.com.br`. Defina a variável no ambiente de publicação para canonical, sitemap e Open Graph saírem certos.
10. **Imagem de Open Graph.** `public/images/og-plaswill.jpg` foi gerada aqui (1200×630, petróleo com moldura tracejada). Regerar quando houver logotipo e fotos oficiais.
11. **Os quinze clientes da faixa, e dois fora da lista.** A faixa mostra todos os quinze nomes que o Lucas enviou, não uma curadoria minha como antes. Dois deles — **Ijuí (Soluções para Sistemas de Ordenha)** e **Cerélus (Alimentos Integrais)** — **não constam** entre os treze "aprovados para divulgação" de `03-comercial.md` §4. Ou o GED incorpora os dois, ou eles saem de `abertura.clients` em `src/content/site.ts`. O **TRE-RS continua fora**, pelo mesmo motivo de antes (`05-lacunas.md` §3). E vale para todos: publicar nome de cliente depende de autorização contratual.
12. **A abertura está fora do índice de busca.** `src/app/abertura/layout.tsx` declara `robots: noindex` porque é um estudo que não é linkado de lugar nenhum e não deve competir com a home. Quando ela virar a página inicial, é esse bloco que muda — junto com o canônico e o Open Graph, que hoje apontam para `/abertura`.
13. **Não há CTA no hero, e o pedido ficou abaixo da faixa de clientes — resolvido em 21/10.** O spec proíbe botão no hero, então a saída foi a **faixa de conversão** descrita acima, que não é um botão solto: é um bloco com a tagline, a nota de resposta, telefone, e-mail, o botão principal e o WhatsApp. Continua valendo a pergunta que a faixa **não** resolve: o botão principal aponta para `/#orcamento`, o formulário da landing, porque criar um segundo formulário exigiria decidir para onde ele envia. Se a abertura virar a página inicial, isso passa a ser um formulário na própria abertura — e aí vale decidir se ele grava em algum lugar, o que hoje não acontece (não há backend, por decisão de projeto).
14. **O chevron de "Produtos" não abre nada.** Ele aponta para `/#produtos` e mantém o desenho da referência, que também não tem submenu. Ou o item passa a abrir um painel de categorias, ou o chevron sai.
15. **Licença dos efeitos da naocodei.** Quatro efeitos da vitrine (`naocodei.com/free-code/`) foram adotados em 21/10: revelar palavra por palavra, máscara que revela, botão elástico e luz que segue o cursor. A página se apresenta como código livre, mas **não há texto de licença no HTML** — e eles foram reescritos em CSS, não copiados. Ainda assim, confirmar os termos antes de publicar.
16. **Símbolo da marca — a pergunta é de branding, não de código.** A pílula central hoje mostra o logotipo inteiro, tanto cheia quanto encolhida. Com um símbolo isolado ela mostraria símbolo + nome, como na referência, e no estado encolhido viraria o **círculo de 56px só com o símbolo** — que é o que o Antimetal faz e o que o Plaswill não pode fazer hoje. Isso não é decisão técnica: significa que a Plaswill passaria a ter **duas assinaturas** em circulação — o bloco fechado amarelo (rodapé, landing) e a combinação símbolo + nome em tipografia (barra da abertura). Ou a marca adota um símbolo de verdade e ele vale em toda parte, ou a barra fica com o bloco fechado. Ver `public/brand/LEIA-ME.md`.

---

## Limites conhecidos

O que foi verificado em 19/10: `npm run build` concluído (7 rotas estáticas, sem rede), `npm run typecheck` sem erros, servidor de produção respondendo 200 em `/`, `/politica-de-privacidade`, `/robots.txt`, `/sitemap.xml`, nos quatro arquivos de fonte e em todos os chunks de CSS e JS; HTML servido com 42 ids únicos, todas as âncoras e todos os `aria-controls` resolvendo, um único `h1`, dois blocos JSON-LD válidos, canonical e Open Graph presentes; contrastes calculados com a fórmula da WCAG sobre os valores reais.

O que foi verificado em 20/10, sobre a `/abertura`:

- `npx tsc --noEmit` sem erros e `npx next build` concluindo **8 rotas estáticas**, com `/` e `/politica-de-privacidade` intactas depois de a casca migrar para o grupo `(site)` — a regressão era o risco real desta mudança e ela não aconteceu.
- Servidor de produção respondendo 200 em `/`, `/abertura`, `/politica-de-privacidade`, `/robots.txt` e `/sitemap.xml`. A `/abertura` serve `<title>Abertura · Plaswill</title>`, os quinze nomes de cliente (30 no HTML, porque o carrossel duplica a lista, com a segunda `aria-hidden`) e **nenhum** rodapé; a `/` continua servindo rodapé, link de salto e navegação própria. O `h-section` de 700px mínimo e o `h-screen` estão no HTML servido.
- **Desenho conferido por captura de tela**, em celular (443px) e desktop (1440px, via `design/abertura-desktop.html`). Foi esta etapa que pegou dois defeitos reais: o aviso quebrava em duas linhas dentro da cápsula, e a segunda linha da faixa de clientes caía em cima do campo de grânulos. Os dois foram corrigidos e reconferidos.
- **Logotipo oficial instalado e verificado no build** (20/10). `npx next build` serviu `/brand/plaswill-logotipo.png` com 200 e `image/png`, a `/abertura` passou a renderizar `<img class="…" style="height:32px;width:auto">` dentro da caixa de centralização, e a `/` renderizou o mesmo arquivo a 30px na barra e 26px no rodapé. A assinatura tipográfica desapareceu das duas (`>Plaswill<` = 0 ocorrências) e a placa branca do rodapé não existe mais no HTML — as duas ocorrências de `background:#fff` que sobram na página são o 404 interno do Next, não o nosso componente.
- **Um terceiro defeito, achado pela captura de tela com a marca no lugar**: a assinatura estava **meia largura à direita do eixo**. O elemento era centralizado com `translateX(-50%)`, mas a animação de entrada anima `transform` — e animação vence declaração normal na cascata, então o `translateX` era descartado. Trocado por centralização em flex (`inset-0` + `justify-center`), que não usa `transform`. A correção vale também para o componente Next.

- **Faixa de clientes em carrossel, conferida no build e na captura** (20/10, segunda versão). `next build` servindo `/abertura` com 200; o HTML traz 30 `<li>` (15 nomes em duas cópias), a segunda cópia com `aria-hidden="true"` e **zero** referências a `/clients/*.png`. A captura do protótipo mostra a faixa em uma linha, com as bordas dissolvidas e o nome centralizado na vertical com o rótulo. O laço não pôde ser visto girando em tempo real aqui — a captura pega um instante; o que garante a emenda é a aritmética descrita acima (`-50%` + `padding-right` igual ao vão na cópia), não a observação.

- **Fachada instalada e conferida (20/10).** `npx next build` servindo `/abertura` com 200; o HTML traz `<img src="/photos/plaswill-fachada.jpg" alt="Fachada da sede da Plaswill…">`, e o arquivo responde 200 com `image/jpeg` e 99.013 bytes. **Composição conferida nas duas larguras**: em 1440px a foto ocupa a coluna direita, sangra até a borda da janela, dissolve o céu no papel atrás da barra e dissolve a esquerda contra o texto; em 443px ela vira uma faixa de borda a borda sob o carrossel. Duas correções vieram dessa conferência: a sangria não funcionava com `width:100%` (margem negativa encolhe a caixa externa, não alarga o elemento — sem a largura declarada a foto não saía da calha), e a dissolução da esquerda apagava a fachada no celular sem nada do outro lado para justificar.
- **Um defeito real, achado ao mexer na fachada: `.shell` nunca foi definida.** O Herói e a barra da `/abertura` usavam `className="shell"`, mas a classe não existia em CSS nenhum do projeto — a rota saía sem teto de largura e sem calha lateral. O protótipo escondia o defeito porque define um `.shell` próprio, com o mesmo nome e as mesmas regras. A classe foi escrita em `abertura.css` (e é dela que a fachada tira o `--gutter` para sangrar) e a presença dela foi conferida **no CSS emitido pelo build**, não só no fonte: `.shell{` está no chunk da rota. É o tipo de coisa que nenhuma captura de tela do protótipo pegaria.

- **`pnpm install` / `pnpm build` / `pnpm dev` rodados de verdade (21/10).** Numa cópia do projeto em diretório temporário, para não mexer no `node_modules` local: `pnpm install --frozen-lockfile` passou em 22s (o lock commitado é válido), `pnpm add -w -D tailwindcss@^3.4 postcss autoprefixer` entrou em 16s, `pnpm build` concluiu as 8 rotas em 60s e `pnpm dev` ficou pronto em 1,7s, servindo `/abertura` com 200 em 5,5s (compilação sob demanda) — com `.pt-28`, `md\:grid` e o carrossel presentes no CSS de dev, e a foto respondendo 200. O `package.json` e o `pnpm-lock.yaml` resultantes foram copiados de volta e conferidos com um segundo `--frozen-lockfile` do zero.
- **A imagem acima saiu da rota compilada**, não do protótipo: `design/snapshot.py` embutiu CSS, fontes e imagens do `next start` num arquivo só, que o painel de pré-visualização consegue renderizar. É a primeira vez que a `/abertura` foi vista com o Tailwind gerando utilitárias de fato.

O que foi verificado em 21/10, com a faixa de conversão:

- **`pnpm install` e `pnpm build` rodados na pasta do projeto** (não numa cópia, como em 20/10): as seis dependências de desenvolvimento presentes — `tailwindcss`, `postcss`, `autoprefixer`, `typescript`, `@types/react`, `@types/node` — e `npx next build` concluindo as **8 rotas estáticas** em 24s, com `/`, `/_not-found`, `/abertura`, `/politica-de-privacidade`, `/robots.txt` e `/sitemap.xml`. O `pnpm install` chegou a purgar parte do `node_modules` local ao ser interrompido no meio, e o registro fica porque o sintoma é enganoso: o build continua rodando e falha depois, em `tailwindcss` não resolvido.
- **A faixa de conversão medida nas duas larguras** (1024px de layout e 304px), com os números no bloco acima — servida com 200 em `/abertura` e com as seis classes `conversao__*` presentes no HTML, ao lado do `centerpill__lockup-name` e do `conversao`. A prova em pixel do layout largo saiu do palco escalado, não de uma janela de 1024px.
- **O quarto estado do cabeçalho conferido no CSS emitido**, não em imagem: as três regras listadas acima estão no chunk da rota. A captura em pixel desse estado **continua pendente** e depende de uma janela com 768px ou mais — o painel não chega lá.
- **O `pnpm-workspace.yaml` existia e ninguém tinha notado que ele muda o comando.** O projeto é raiz de workspace (`packages: ['.']`, com `supportedArchitectures` darwin+linux/arm64), então `pnpm add` sem `-w` é recusado: `ERR_PNPM_ADDING_TO_ROOT`. A instrução antiga do README teria falhado na mão do Lucas com uma mensagem que não explica nada. Corrigida.

O que foi verificado em 21/10, com o esmaecer do nome:

- **A curva do gesto medida dentro da página**, instante por instante, no protótipo: `op=0.00` até 300ms com a janela já em 80px, `op=0.38` em 380ms, `op=0.97` em 700ms, `op=1.00` de 900ms em diante — e o `topo` do nome indo de 32 a 20px sem sair dos 54px da cápsula. É a prova de que o nome não aparece de imediato, que o esmaecer tem a curva declarada e que os 12px de deslocamento cabem.
- **`npx next build` limpo depois da mudança** (8 rotas, 24s) e `node scripts/verificar-cabecalho.mjs` com **22/22** — a lógica do encolhimento não foi tocada.
- **As três regras no CSS emitido**: base com `translate3d(0,12px,0)` e saída de 240ms; estado de hover com `translateZ(0)`, `will-change` e `opacity .7s … .3s`; e o bloco de movimento reduzido com os três seletores em `transition:none`.
- **As molduras tiveram o `?v=` trocado para `20261021k`**, porque as cópias de estado foram regeradas e o painel guarda em cache o arquivo que carrega — foi esse cache que já mostrou, por duas rodadas, um defeito que estava corrigido.
- **As laterais saindo com a rolagem, medidas no protótipo** (`--minimizado`): no topo `nav 1.00 visible block x30` e `cont 1.00 visible flex x30`; depois de rolar `nav 0.00 hidden block x20` e `cont 0.00 hidden flex x40`, com a cápsula em **94×54** e `encolhida SIM`. O `x` andando 10px para fora é o afastamento, e o `hidden` é o que tira as duas da ordem de foco. Na rota, `npx next build` limpo e `node scripts/verificar-cabecalho.mjs` em **22/22**; no CSS emitido estão as quatro regras (`transition` base, estado de saída, as duas direções e o desligamento em movimento reduzido), e o bloco `prefers-reduced-motion` vem **depois** do estado na cascata — conferido por índice no arquivo, porque se viesse antes o `transition-delay` do estado venceria e o trajeto continuaria para quem pediu menos movimento.

O que **não** foi verificado: comportamento em navegador de verdade com o Next servindo a página. Este ambiente não tem navegador; as capturas acima saíram do renderizador do painel de pré-visualização sobre o **protótipo**, não sobre a rota compilada com Tailwind. Continuam pendentes de conferência no seu Mac: hidratação (sem console aqui), as animações de entrada, o painel do menu mobile, a rolagem de 20px que troca o fundo da barra, e a página com o Tailwind gerando o CSS de fato. Para essa etapa, rode `pnpm dev` e abra `/` e `/abertura` lado a lado.

---

## Próximos passos sugeridos

Rodar `pnpm install` (o Tailwind já está no `package.json` — ver *Como rodar*), depois `pnpm dev`, abrir `/` e `/abertura`, e ajustar `src/content/site.ts` com o que o comercial quiser mudar. O logotipo e a foto da fachada já estão no lugar; falta a **foto aérea em `public/photos/plaswill-aerea.jpg`**, fotos de produto, revisão da política de privacidade, e só então medição e publicação.

Sobre a abertura, três decisões que dependem de você: se ela passa a ser a página inicial (aí mudam `robots`, canônico e Open Graph em `src/app/abertura/layout.tsx`), se ela ganha botão no corpo do hero, e se os quinze clientes do carrossel são os que o comercial quer destacar — em especial Ijuí e Cerélus, que não estão na lista aprovada.

A arquitetura já está preparada para catálogo de produtos, páginas de produto individuais e integração com CRM — nada disso foi implementado ainda, por decisão de escopo.
