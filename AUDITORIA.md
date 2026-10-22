# Auditoria — site atual × nova landing

Comparativo entre **https://plaswill.com.br/** (site institucional em produção) e
**https://site.plaswill.tech/** (nova landing, hoje em prévia), com o que foi
decidido e o que foi alterado no repositório.

Data da auditoria: **22/10/2026**. Branch do trabalho: `dev/catalogo-completo`.

Método: leitura do código do repositório, requisição HTTP às duas páginas em
produção e leitura integral do `README.md` do projeto. Nenhuma afirmação abaixo
sobre elemento visual foi inferida de código sem conferência no HTML servido; o
que **não** pôde ser observado está marcado como tal, no fim do documento.

---

## 1. Resumo executivo

A nova landing é tecnicamente superior ao site atual em praticamente todos os
critérios: cabeçalho, tipografia, acessibilidade, semântica, metadados e
organização editorial. O que ela perdeu não foi qualidade — foi **cobertura**.

O site atual publica **quatorze produtos**, cada um com endereço próprio. A nova
landing apresentava **cinco linhas**, o que é uma boa simplificação visual e uma
péssima arquitetura de catálogo: nove produtos comercializados deixaram de ter
qualquer menção na página. Quem procurava "saco para pedra", "lençol plástico
descartável" ou "lona preta" não encontrava nada.

Também se perdeu, na reconstrução, a dimensão institucional leve: catálogo em
PDF, notícias, redes sociais no rodapé e a lista de diferenciais que o site
antigo publicava em linguagem simples.

O trabalho desta branch corrige a lacuna de catálogo e o desvio de tom, e
documenta o que depende de decisão da empresa — contato, clientes e fotografia,
que não são problemas de código.

---

## 2. Matriz comparativa por critério

| Critério | Site atual | Nova landing | Situação |
| --- | --- | --- | --- |
| Identidade visual | Marcas mistas, banner de cookies em destaque, ícones decorativos | Sistema coerente: petróleo, amarelo só no escuro, serif/sans/mono com papéis definidos | Nova, superior — preservar |
| Tipografia | Sem hierarquia declarada | Archivo + Source Serif 4 + IBM Plex Mono, servidas localmente | Nova, superior — preservar |
| Cabeçalho | Faixa fixa, menu horizontal com submenu de produtos | Três cápsulas de vidro, com animação e colapso na rolagem | Nova, superior em acabamento; ver §7.3 |
| Navegação para produtos | 14 itens em submenu, acesso direto | 5 linhas, sem submenu | **Atual, superior em cobertura** — corrigido |
| Notícias | Página `/noticias/` com posts datados | Ausente | Atual, superior — pendência |
| Catálogo PDF | Botão "Baixe Aqui" (Google Drive) | Ausente | Atual, superior — pendência |
| Redes sociais | Facebook, Instagram, LinkedIn, WhatsApp no rodapé | Ausentes | Atual, superior — pendência |
| Clientes | Faixa de logotipos | 15 nomes em carrossel | Empate; ambas dependem de autorização |
| Formulário | Envia por e-mail, com CAPTCHA e seleção de departamento | Valida no cliente e abre WhatsApp pronto | Nova, superior em UX; ver §7.4 |
| Acessibilidade | Não verificada | Skip-link, `inert`, `aria-expanded`, um `h1`, contrastes calculados | Nova, superior |
| SEO técnico | `<title>` com erro de grafia ("Embagens") | Title, description, canonical, OG e JSON-LD | Nova, superior |
| Mobile | Não verificado em detalhe | Testado em 443px e 1440px pelo projeto | Nova, provavelmente superior |
| Performance | Não medida | 123 kB no primeiro carregamento, 9 rotas estáticas | Nova, provavelmente superior |

---

## 3. Portfólio — a divergência central

**Site atual: 14 produtos, cada um com página própria.**

Capas de fardos · Filme stretch · Filme stretch rolinho · Lençol plástico
descartável · Lona preta · Plástico bolha · Sacos coloridos para coleta seletiva
· Sacos para lenha · Sacos para lixo · Sacos para lixo infectante · Sacos para
lixo tóxico · Sacos para pedra · Sacos para silagem · Sacos plásticos sob medida.

**Nova landing, antes desta branch: 5 linhas.**

Filme stretch · Plástico bolha · Sacaria e linha agrícola · Linha hospitalar ·
Polietileno reciclado pós-consumo (PCR).

### O que ficou de fora

| Produto do site atual | Onde estava na nova landing |
| --- | --- |
| Capas de fardos | em lugar nenhum |
| Filme stretch rolinho | só como capacidade, no texto de "corte, solda e rebobinamento" |
| Lençol plástico descartável | em lugar nenhum |
| Lona preta | em lugar nenhum |
| Sacos coloridos para coleta seletiva | em lugar nenhum |
| Sacos para lenha | em lugar nenhum |
| Sacos para lixo (comum) | em lugar nenhum |
| Sacos para lixo tóxico | em lugar nenhum |
| Sacos para pedra | em lugar nenhum |
| Sacos plásticos sob medida | diluído em "sacos e lonas sob medida", dentro da silagem |

**Nove de quatorze produtos não tinham endereço na página.**

### O caso do PCR

A nova landing tratava "polietileno reciclado pós-consumo" como a quinta linha
comercial, com código `FT-05`, ficha técnica e chamada de venda.

O site atual **não vende PCR como produto**: nenhuma das quatorze páginas o
lista, e a descrição da empresa diz que a Plaswill "trabalha com polietileno
virgem e reciclado conforme a necessidade do cliente" e "reaproveita sucata
plástica na fabricação dos sacos". O reciclado é matéria-prima de parte do
portfólio, não um item que se pede pelo nome.

**Decisão:** PCR sai do catálogo e vira a seção `06 — Materiais e meio ambiente`,
com o processo descrito (triagem por polímero, lavagem, micronização, blenda com
aditivação) e uma lista explícita do que a empresa ainda não pode afirmar.

Correção de escopo, não de gosto: um item de catálogo que o comercial não cota é
um item de catálogo quebrado.

### Nova arquitetura implementada

```
C1 · Proteção e transporte        PR-01 Filme stretch
                                  PR-02 Filme stretch rolinho
                                  PR-03 Plástico bolha
                                  PR-04 Capas de fardos

C2 · Embalagens industriais       PR-05 Sacos plásticos sob medida
                                  PR-06 Sacos para pedra
                                  PR-07 Sacos para lenha

C3 · Resíduos e coleta            PR-08 Sacos para lixo
                                  PR-09 Sacos coloridos para coleta seletiva
                                  PR-10 Sacos para lixo infectante
                                  PR-11 Sacos para lixo tóxico

C4 · Agronegócio                  PR-12 Sacos para silagem
                                  PR-13 Lona preta

C5 · Higiene e aplicações         PR-14 Lençol plástico descartável
```

**REVISAR —** a categoria de cada item é proposta nossa. O caso discutível é
"Lona preta": o site atual a descreve como "uso geral", e ela está em Agronegócio
porque o dossiê a trata como aplicação rural. Se o comercial classificar
diferente, é mover uma linha em `src/content/site.ts`.

---

## 4. Divergências de contato que impedem a publicação

Esta é a parte da auditoria que **não** foi alterada no código, porque muda
informação oficial e depende de confirmação da empresa.

| Dado | Site atual (plaswill.com.br) | Nova landing (site.plaswill.tech) |
| --- | --- | --- |
| WhatsApp | **(55) 99603-4140** — `wa.me/5555996034140` | **(55) 98427-5963** — `wa.me/5555984275963` |
| Telefone fixo | (55) 3375-8522 | (55) 3375-8522 — igual |
| Bairro | **Esperança** | **Distrito Industrial** |
| CEP | não publicado | 98280-000 |
| E-mail | não publicado (só formulário) | comercial@ e contato@plaswill.com.br |

O número de WhatsApp é **diferente**. Os dois não podem estar certos. Publicar o
número errado numa landing institucional significa perder o contato comercial
inteiro, e é o tipo de erro que só aparece semanas depois.

Os links de WhatsApp estão centralizados em `site.whatsapp` em
`src/content/site.ts`; corrigir é uma linha. **Nenhuma alteração foi feita aqui**
justamente porque a escolha do número correto é da empresa.

---

## 5. O que se perdeu na reconstrução

Nada disso é falha de implementação — é escopo que ficou de fora e que vale
decidir, porque o site novo vai substituir o antigo:

1. **Catálogo em PDF.** O site atual tem botão "Baixe Aqui" apontando para um
   PDF no Google Drive. Se esse documento está atualizado, ele importa mais que
   qualquer coisa nesta auditoria: é a peça que o comprador repassa internamente.
2. **Notícias.** O site atual mantém `/noticias/` com posts datados (Festa
   Junina, 19 anos da empresa em 7 de março, Dia Internacional das Mulheres).
   É a única prova pública de que a empresa está ativa.
3. **Redes sociais.** Facebook, Instagram e LinkedIn estão no rodapé atual e não
   existem na nova landing.
4. **Diferenciais em linguagem simples.** "Responsabilidade Ambiental",
   "Qualidade e Inovação", "Entrega Ágil e Agendada" — nomes diretos que o
   visitante entende sem esforço. Foram substituídos por formulações mais
   elaboradas, e a troca nem sempre é ganho.
5. **Departamentos de contato.** O formulário atual separa Comercial, Recursos
   Humanos e Faturamento. A nova landing só tem comercial — o que é coerente com
   uma landing, mas perde o canal de RH.

---

## 6. O que a nova versão melhorou (preservar)

1. **Sistema de design com regra declarada.** O amarelo `#FFDE00` sobre o fundo
   claro dá 1,18:1, ou seja, ilegível; o projeto mediu isso e restringiu o
   amarelo a três papéis (fundo de botão, tinta sobre petróleo, elemento sobre
   escuro). É o tipo de decisão que costuma ser feita por gosto e aqui foi feita
   por conta.
2. **Tipografia com papéis separados.** Serif para voz editorial, sans para
   interface, mono para dado técnico. Servidas pelo próprio projeto, sem rede.
3. **Ficha técnica que abre na linha.** Mantém a pessoa na página e resolve o
   problema real de não haver página de produto ainda.
4. **Prévia isolada.** `site.plaswill.tech` como homologação, com `plaswill.com.br`
   intocado, Docker em projeto Compose separado e rollback documentado.
5. **Acessibilidade estrutural.** Skip-link, `inert` em painel fechado,
   `aria-expanded`/`aria-controls`, `prefers-reduced-motion` respeitado, um único
   `h1`, contrastes calculados sobre os valores reais.
6. **Conteúdo separado do componente.** Todo texto comercial vive em
   `src/content/site.ts`; editar produto nunca exige mexer em JSX.

---

## 7. Decisões tomadas nesta branch

### 7.1 Hero — título institucional

**Antes:** "A micragem que você paga é a que chega na esteira."

**Agora:** "Embalagens que protegem produtos e acompanham o ritmo do seu negócio."

Razão: a frase técnica é a melhor chamada que a empresa tem. Ela **não foi
descartada**: a substância dela virou o terceiro diferencial, "Micragem nominal
que se confirma na bobina", e o rodapé mantém a nota de micragem nominal. O que
mudou é o papel. Como `h1`, ela falhava em duas frentes:

- quem chegava sem conhecer a empresa não descobria que se trata de uma
  indústria de embalagens plásticas — o critério de aceite nº 2 do brief;
- a frase afirma uma garantia operacional ("a que chega na esteira") que só o
  comercial pode sustentar, e o critério nº 7 proíbe promessa não comprovada.

Os dois botões passaram a ser "Conhecer produtos" (âncora para o catálogo) e
"Falar com o comercial" (WhatsApp). O rótulo anterior do primário era "Solicitar
orçamento" apontando para um formulário mais abaixo na página; com o catálogo
aberto logo depois da abertura, fazer o primeiro botão levar ao produto é o
caminho mais curto para o que o visitante veio ver.

### 7.2 Diferenciais — de denúncia para apresentação

A seção comparava "o que o mercado faz" com "o que a Plaswill faz", em títulos
como *Pedido mínimo abusivo*, *Micragem enganosa*, *Sustentabilidade de fachada*
e *Atendimento desumanizado*. Três problemas: afirma coisas sobre concorrentes
que não temos como provar, compara prazos e custos sem dado público, e transfere
ao visitante um tom de denúncia que não combina com quem quer ser fornecedor
homologado de hospital e de tribunal.

A estrutura de três campos foi mantida porque a leitura funciona. O campo da
esquerda passou a nomear o **diferencial** em vez da falha alheia, e o rótulo da
direita deixou de ser "Como a Plaswill responde" — não há mais objeção a
responder.

### 7.3 Cabeçalho — diagnóstico, sem alteração

**Este é o item que eu não implementei de propósito.** Ao rolar 220px no
desktop, as duas cápsulas laterais recebem `nav-lateral--fora` e desaparecem por
completo: sobram a marca e o anel de progresso. Navegação (Produtos, Estrutura,
Segmentos) e contato (WhatsApp, Orçamento) ficam inacessíveis até o visitante
voltar ao topo.

Isso contraria a diretriz "um visitante deve conseguir acessar Produtos e
Contato imediatamente", e é o único ponto do brief em que a implementação atual
vai contra o pedido.

Não alterei porque o cabeçalho é a peça mais elaborada e mais frágil do projeto
(quatro estados, histerese de limiar, anel de progresso, `prefers-reduced-motion`
na cascata) e porque **não há como verificar visualmente acima de 768px neste
ambiente**. Mexer nele sem poder olhar seria trocar um defeito conhecido por um
desconhecido.

Três caminhos, em ordem de risco:

1. **Menor risco:** manter as duas cápsulas visíveis no estado condensado,
   apenas com tipografia menor. É trocar a classe do estado, sem tocar no resto.
2. **Risco médio:** manter só a cápsula de contato (WhatsApp + Orçamento) e
   deixar a de navegação sair — resolve a conversão, não o acesso a produtos.
3. **Maior risco:** transformar a cápsula central condensada em gatilho de um
   painel de navegação. Resolve de verdade, mas é redesenho.

### 7.4 Formulário — produto de origem preenchido

Quem clica em "Pedir amostra" na ficha de um produto chega ao formulário com o
campo "Produto de interesse" **já preenchido**. Antes, o visitante tinha de
reencontrar o item num select de quinze opções — que é exatamente onde a pessoa
desiste.

Implementação: um `CustomEvent` (`plaswill:produto`) disparado pelo catálogo e
escutado pelo formulário. Nenhuma navegação nova, nenhum parâmetro de URL,
nenhum backend.

Também foi corrigido o texto de confirmação: ele já dizia "Pedido pronto para
seguir. Abrimos o WhatsApp com o resumo preenchido." e não "enviado com
sucesso" — estava correto e foi mantido.

### 7.5 Numeração das seções

A página renderizava **02, 01, 03, 04, 05, 07, 08**: a seção "Quem somos"
aparecia depois da de produtos carregando o número 01, e o 06 não existia — era
o número da faixa de clientes, que saiu da home. Numa página que usa o número
como âncora de leitura, isso é um defeito visível.

A numeração agora acompanha a ordem renderizada, sem salto:

```
01 · abertura (sem número)
02 · produtos e soluções
03 · diferenciais
04 · a Plaswill
05 · estrutura e processo
06 · materiais e meio ambiente
07 · segmentos
08 · perguntas frequentes
09 · orçamento
```

### 7.6 Ordem das seções

`Produtos` → `Diferenciais` → `A Plaswill` → `Estrutura` → `Materiais` →
`Segmentos` → `FAQ` → `Contato`.

"Quem somos" desceu de segunda para quarto lugar. Numa landing industrial, o
visitante precisa primeiro saber **o que é feito** e **por que importa** para
depois se interessar por **quem faz**. A seção institucional continua inteira e
é a única que fala da história — ela não perdeu nada por estar três telas abaixo.

### 7.7 Tom do FAQ

O FAQ também estava escrito como réplica a um concorrente ("convertedores
distantes fecham 5 toneladas e pedem 30 dias"). Duas afirmações saíram por
decisão técnica, não por estilo:

- **"o resultado mecânico do PCR é equivalente ao da resina virgem"** — o próprio
  `README` registra que equivalência exige ensaio. A amostra resolve isso para o
  cliente; o texto não pode resolver por ele.
- **o mínimo de toneladas atribuído a terceiros** — fala de outra empresa.

---

## 8. Pendências que dependem da empresa

Nenhum destes itens é problema de código. Todos bloqueiam a publicação.

| # | Pendência | Bloqueia | Onde resolve |
| --- | --- | --- | --- |
| 1 | Qual WhatsApp é o comercial: (55) 99603-4140 ou (55) 98427-5963 | Sim | `site.whatsapp` em `src/content/site.ts` |
| 2 | Bairro correto: Esperança ou Distrito Industrial; CEP 98280-000 confere? | Sim | `site.address` |
| 3 | Autorização de uso de marca dos clientes; Ijuí e Cerélus não estão na lista aprovada do GED | Sim | `abertura.clients` |
| 4 | Fotografias de fábrica, máquina e produto (hoje só existe a fachada) | Não, mas limita | `public/photos/` + campos `image`/`imageAlt` |
| 5 | Catálogo PDF oficial atualizado, com URL pública | Não | seção de contato |
| 6 | Textos de notícias e processo de atualização | Não | página própria |
| 7 | Percentual de reciclado por produto, certificações e destinação de resíduos | Não | seção 06 |
| 8 | Política de privacidade sem revisão jurídica | Sim, antes de publicar | `src/app/politica-de-privacidade/` |
| 9 | `NEXT_PUBLIC_SITE_URL` definido no ambiente de publicação | Sim, antes de publicar | ambiente |
| 10 | Horário de atendimento: confirmar se "segunda a sexta" está correto | Não | `contact.responseNote` |

---

## 9. Mapeamento de URLs para a migração

**Nada disso foi implementado** — não há domínio novo apontado, e criar
`redirects` agora só produziria configuração morta. O mapa fica registrado para
quando a troca for aprovada.

| URL hoje | Conteúdo | Destino proposto |
| --- | --- | --- |
| `/` | home institucional | `/` |
| `/capas-de-fardos/` | produto | `/#capas-de-fardos` |
| `/filme-stretch/` | produto | `/#filme-stretch` |
| `/filme-stretch-rolinho/` | produto | `/#filme-stretch-rolinho` |
| `/lencol-plastico-descartavel/` | produto | `/#lencol-descartavel` |
| `/lona-preta/` | produto | `/#lona-preta` |
| `/plastico-bolha/` | produto | `/#plastico-bolha` |
| `/sacos-coloridos-para-coleta-seletiva/` | produto | `/#sacos-coleta-seletiva` |
| `/sacos-para-lenha/` | produto | `/#sacos-para-lenha` |
| `/sacos-para-lixo/` | produto | `/#sacos-para-lixo` |
| `/sacos-para-lixo-infectante/` | produto | `/#sacos-lixo-infectante` |
| `/sacos-para-lixo-toxico/` | produto | `/#sacos-lixo-toxico` |
| `/sacos-para-pedra/` | produto | `/#sacos-para-pedra` |
| `/sacos-para-silagem/` | produto | `/#sacos-para-silagem` |
| `/sacos-plasticos-sob-medida/` | produto | `/#sacos-sob-medida` |
| `/noticias/` | lista de notícias | manter página própria, ou 301 para `/` se não houver substituto |
| `/home/` | duplicata da home | `301` para `/` |

**Atenção:** redirecionar produto para âncora de home perde a página como ativo
de busca. O caminho correto é criar página por produto antes da migração — a
arquitetura já está pronta para isso (`products` é a fonte, os códigos `PR-01`…
`PR-14` são as chaves), mas falta foto e texto por item.

---

## 10. O que não foi verificado

Para não afirmar o que não foi observado:

- **Experiência em navegador real.** Não houve navegador com interação nesta
  auditoria. O que foi conferido é o HTML servido pelo build de produção e o CSS
  emitido, não o comportamento em uso.
- **Telas entre 768px e 1440px.** O cabeçalho condensado e a composição do hero
  nessa faixa continuam sem conferência visual. Os tamanhos de 360, 390 e 768px
  do brief **não foram testados**.
- **Contraste medido em tela.** Os valores de contraste do projeto vêm de cálculo
  sobre os tokens, não de medição com colorímetro.
- **Performance medida.** LCP, INP e CLS não foram medidos. O único número real é
  o peso do primeiro carregamento (123 kB de JS) e o build estático.
- **Acessibilidade com leitor de tela.** Semântica e atributos foram revisados no
  HTML; não houve teste com NVDA, VoiceOver ou similares.
- **Site atual em mobile.** A análise do site atual foi feita sobre o HTML
  servido em desktop.
- **As quatorze páginas de produto do site atual, uma a uma.** O inventário foi
  montado a partir do menu e dos cards da home, que citam nome, descrição curta e
  aplicação de cada item. As descrições e fichas desta branch usam só esse
  material: onde a home não publica especificação, a ficha do produto aqui tem
  rótulos estruturais ("Material", "Fechamento", "Formato") em vez de número.
  Antes de publicar vale abrir as quatorze páginas e conferir medida por medida.
