# Logotipos de clientes — não usados hoje

Esta pasta guarda os quinze recortes de marca que o Lucas enviou em 20/10, e
**nada no site os carrega no momento**. A faixa de clientes da `/abertura` passou
a mostrar apenas os nomes, em carrossel contínuo (decisão do mesmo dia: quinze
logotipos coloridos sobre o fundo creme viravam o elemento mais forte da tela e
disputavam com o título).

Os arquivos ficam porque o trabalho de recorte está feito e a decisão de usar
arte pode voltar — num bloco monocromático, por exemplo, ou numa página de
clientes. Nada precisa ser redesenhado: são os recortes da folha enviada.

## O que eles são

São quinze PNGs com fundo transparente, recortados da folha de 1000×400 pelo
canal alfa (branco virou transparência). **Não há vetor** — este é o teto de
qualidade de cada marca.

| arquivo | dimensões | cliente |
| --- | --- | --- |
| `saur.png` | 127×29 | Saur |
| `fockink.png` | 142×24 | Fockink |
| `tromink.png` | 139×51 | Tromink |
| `oxbo.png` | 123×34 | Oxbo |
| `lange.png` | 124×32 | Lange Termoplásticos |
| `cotripal.png` | 132×66 | Cotripal |
| `cisbra.png` | 121×52 | Cisbra Agroindustrial |
| `qualyagro.png` | 159×24 | Qualyagro |
| `ijui.png` | 126×60 | Ijuí Sistemas de Ordenha |
| `cerelus.png` | 115×66 | Cerélus Alimentos Integrais |
| `hci.png` | 119×26 | Hospital de Clínicas Ijuí |
| `hsd.png` | 60×69 | Hospital São Peregrino Laziosi |
| `dose-express.png` | 77×54 | Dose Express |
| `rio-grande.png` | 115×55 | Grupo Rio Grande |
| `globalfiltros.png` | 151×49 | Global Filtros |

## Antes de publicar qualquer um deles

- **Autorização.** Publicar marca de cliente depende de autorização contratual
  — vale para o nome e vale para o logotipo.
- **Ijuí e Cerélus.** Não constam entre os treze clientes que a API publica como
  aprovados para divulgação. Ver a nota em `src/content/site.ts` e o README,
  seção *Revisar antes de publicar*.
- **Resolução.** Nenhum passa de 159 px no lado maior. Atendem um bloco de até
  ~32 px de altura em telas 2x, no limite; em 3x ficam macios. Se houver os
  vetores (`.ai`, `.eps`, `.svg`), substitua mantendo o nome do arquivo.

## Como reativar

Basta devolver o campo `logo` ao array `abertura.clients` em
`src/content/site.ts` (os nomes dos arquivos são os desta tabela) e trocar, em
`AberturaHero.tsx`, o `<li>{client}</li>` pelo `<img>`. O histórico completo do
markup que fazia isso está na conversa de 20/10; o CSS da grade antiga
(`grid-cols-3` / `md:grid-cols-5`) também está no histórico do repositório.
