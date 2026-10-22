# Migração do acervo visual e institucional

Registro da passada que trouxe para a landing as imagens de produto e as doze
notícias publicadas em `plaswill.com.br`. O que vale guardar deste documento não
é a lista de arquivos — é **por que cada imagem foi aceita, aceita com ressalva
ou recusada**. Sem isso, a próxima pessoa refaz a auditoria do zero.

O manifesto executável fica em [`src/lib/media-manifest.ts`](src/lib/media-manifest.ts):
é de lá que o site lê o texto alternativo e o veredito. Este arquivo é a versão
para leitura humana.

---

## 1. Regras que valeram para tudo

- **Nada foi associado pelo nome do arquivo.** `admin-ajax.png` é plástico
  bolha, `10.png` são capas de fardo, `WhatsApp_Image…` é lençol descartável.
  Duas imagens do lote quase trocaram de produto na leitura em lote: a de
  coleta seletiva e a de lençol descartável voltaram fora de ordem do
  visualizador. Só a conferência de dimensão (450×450 quadrada contra 433×577
  retrato) separou as duas.
- **Nenhuma imagem foi ampliada.** Redimensionar para cima não cria detalhe:
  inventa pixels e mente sobre a resolução do arquivo. Só `sacos-para-lenha`
  precisou de redução (1080 → 900), e as capas de notícia, de 2560 → 1400.
- **Originais preservados fora de `/public`**, em `acervo/originais/`. O que o
  site serve está em `public/images/`, em AVIF. Nada do acervo antigo foi
  apagado do WordPress.
- **Imagem sem texto alternativo não entra.** `approvedImage()` devolve `null`
  quando falta o alt, então o caso não acontece por esquecimento.

## 2. Imagens de produto — 15 arquivos, 13 aproveitados

| Produto | Arquivo de origem | Veredito | O que a imagem mostra |
|---|---|---|---|
| Filme stretch | `filme-stretch.png` | Aprovada | Três bobinas com núcleo de papelão, fundo transparente |
| Filme stretch rolinho | `filme-stretch-rolinho.png` | Aprovada | Três rolinhos manuais com suporte preto |
| Plástico bolha | `admin-ajax.png` | Aprovada | Rolos branco e azul + recorte ampliado da bolha |
| Capas de fardo | `10.png` | **Ressalva** | Palete de fardos envolvidos em filme |
| Sacos sob medida | `sacos-plasticos-sob-medida.png` | Aprovada | Três sacos coloridos com fundo triangular |
| Sacos para pedra | `ChatGPT_Image_8_de_abr…removebg-preview.png` | **Recusada** | Saco transparente com pedra — provável imagem gerada |
| Sacos para lenha | `Design-sem-nome-47.png` | Aprovada | Saco transparente cheio de lenha |
| Sacos de lixo | `sacos-para-lixo.png` | Aprovada | Embalagens Plaswill de 30, 50 e 100 L |
| Coleta seletiva | `coleta-seletiva.png` | Aprovada | Sacos coloridos abertos em leque |
| Resíduo infectante | `sacos-para-lixo-infectante.png` | **Ressalva** | Saco branco 50 L, símbolo biológico, classe 6.2 |
| Resíduo tóxico | `sacos-para-lixo-toxico.png` | **Ressalva** | Saco laranja, classe 6.1 |
| Sacos para silagem | `WhatsApp_Image_2025-04-07…removebg-preview.png` | Aprovada | Três sacos pretos: fechado, aberto e enrolado |
| Lona preta | `lona-preta.png` | Aprovada | Rolo de lona preta |
| Lençol descartável | `WhatsApp_Image_2025-04-10…removebg-preview.png` | Aprovada | Lençol branco cobrindo uma maca |
| — | `platico-bolha-120-micras.jpg` | **Descartada** | Banner promocional de 500 × 170 px |

### As três ressalvas, uma por uma

**Capas de fardo.** A foto é real e mostra o produto fazendo o trabalho. O
problema é outro: a embalagem fotografada traz a marca de um cliente (**AVENA**)
em destaque, o que pode ser lido como aval de quem não avalizou. Publicar
depende de autorização da empresa.

**Resíduo infectante e resíduo tóxico.** Produto correto, mas sem identificação
Plaswill visível. No saco infectante a frente é tomada pela impressão de risco,
que é exigência legal — é esperado. No tóxico há um bloco de CNPJ de **outro
fabricante** impresso na base. Confirmar a autoria das peças antes de publicar
como foto de produto.

### A recusa, e por que ela é a decisão certa

O único arquivo disponível para o saco para pedra chama-se
`ChatGPT_Image_8_de_abr._de_2025__16_56_50-removebg-preview.png`. O conteúdo é
plausível — um saco transparente com pedra britada —, mas é uma **ilustração
sintética**, não uma fotografia do produto nem da linha de produção.

Publicá-la como foto afirmaria algo falso sobre a origem da imagem. O card do
saco para pedra fica com a **prancha técnica em SVG**, que já existia e é
honesta. **Pendente:** foto autorizada do saco com pedra. Enquanto não houver,
o produto continua na página — só não finge ter foto.

### Dois nomes de arquivo que parecem erro e não são

`admin-ajax.png` é o nome que o WordPress dá a uploads feitos por AJAX. O
conteúdo foi conferido: é o plástico bolha. `10.png` é nome genérico de upload;
o conteúdo são as capas de fardo. Nome ruim não é defeito da imagem — mas os
dois foram renomeados no acervo novo, para o id do produto.

## 3. Notícias — 12 posts, 11 capas

| Data | Título | Capa |
|---|---|---|
| 03/07/2026 | Festa Junina 24/06 | Sim (do GIF do post) |
| 01/06/2026 | 07 de Março: Plaswill celebra 19 anos | Sim |
| 28/04/2026 | Dia Internacional das Mulheres na Plaswill | Sim |
| 06/04/2026 | Saúde Mental: Ansiedade e Depressão | **Não** — ver abaixo |
| 25/09/2025 | Viagem de confraternização — Encantado | Sim |
| 25/10/2024 | Evento de dia das Crianças Plaswill | Sim |
| 23/09/2024 | Compromisso com a Sustentabilidade | Sim |
| 26/08/2024 | Novo Plástico Bolha com Proteção UV | Sim |
| 18/06/2024 | Parceria com AVOCAP | Sim |
| 24/04/2024 | Uma parceria sustentável | Sim |
| 14/02/2024 | Projeto "Tampa e Lacre" | Sim |
| 14/02/2024 | Inovação em Plásticos desde 2007 | Sim |

**As datas são as de publicação no WordPress.** Nenhuma foi arredondada para
parecer recente. O post mais antigo é de fevereiro de 2024 e continua datado de
fevereiro de 2024 — é isso que faz o arquivo valer alguma coisa.

### A capa que não entrou

A imagem destacada do post sobre **saúde mental** é uma foto da comemoração dos
**19 anos**, com bexigas e o número na parede. Não tem relação com o assunto.
Uma capa de outro tema é pior que capa nenhuma: afirma uma coisa que a notícia
não diz. O cartão resolve sem buraco.

**Pendente:** escolher a imagem correta no WordPress (ou enviar uma) e
descomentar a capa em `src/content/news.ts`.

### O que foi ajustado no texto

Só duas coisas, ambas de digitação, e as duas anotadas no próprio post:

- *"Viagem de confraternização- 06/09/25Encantado – Cristo Protetor"* → faltava
  espaço antes de "Encantado".
- *"DIA INTERNACIONAL DAS MULHERES NA PLASWILL"* → estava todo em caixa alta;
  normalizado para a tipografia da página.

Nenhum texto foi reescrito. Mudar a redação de uma notícia antiga seria
reescrever o que a empresa publicou.

### O que ficou de fora, de propósito

**As fotos internas dos posts.** Cada notícia tinha de três a cinco imagens no
corpo, quase sempre o mesmo evento da capa. Migrar todas somaria dezenas de
arquivos grandes para repetir a informação que a capa já dá. Os originais
continuam no WordPress — que não foi alterado — e podem entrar numa segunda
passada, se a empresa quiser o arquivo completo.

**A capa do post da festa junina** saiu do primeiro quadro do GIF publicado no
post, porque não há imagem destacada. É a única capa em resolução menor
(640 px).

## 4. O que foi construído

| Peça | Arquivo |
|---|---|
| Manifesto com veredito, hash e alt de cada imagem | `src/lib/media-manifest.ts` |
| Foto de produto com prancha como complemento | `src/components/ProductImage.tsx` |
| Seção "Nossa história em movimento" | `src/components/News.tsx` |
| Arquivo completo | `src/app/(site)/noticias/page.tsx` |
| Página da notícia, com canonical, OG e `NewsArticle` | `src/app/(site)/noticias/[slug]/page.tsx` |
| Conteúdo das doze notícias | `src/content/news.ts` |
| Sitemap com as doze URLs e data real | `src/app/sitemap.ts` |

## 5. Pendências

1. **Autorização da marca de terceiro** na foto das capas de fardo (AVENA).
2. **Autoria das peças** de resíduo infectante e tóxico — não têm marca Plaswill.
3. **Foto autorizada do saco para pedra.** Hoje o card usa só a prancha.
4. **Capa do post de saúde mental**, que no WordPress é uma foto dos 19 anos.
5. **Fotos internas das notícias**, se a empresa quiser o arquivo completo.
6. **Link "Notícias" no menu.** A seção está na home e o arquivo tem URL
   própria, mas não entrou na navegação principal: sete itens em 1024 px
   arriscam quebrar a barra, e não houve como conferir visualmente neste
   ambiente.
7. **Mapa de URLs (301)** — a tabela está em `AUDITORIA.md` §7. Só entra em uso
   quando `plaswill.com.br` apontar para cá, o que é decisão da empresa, não do
   código.

## 6. Verificado

- `npm run typecheck` sem erros.
- `npm run build` concluído: 22 páginas estáticas, as 12 notícias geradas por
  `generateStaticParams`.
- Servidor de produção em porta local: `/`, `/noticias` e
  `/noticias/festa-junina-24-06` respondendo 200; `/_next/image` entregando as
  AVIF do acervo (produto a 640 px sai em 6 KB, capa em 15 KB).
- `sitemap.xml` com 15 URLs: home, arquivo, doze notícias e política.
- **Não verificado:** aparência em navegador. O ambiente desta sessão não
  conseguiu abrir prévia visual, então larguras de 390/768/1024/1440,
  quebra de linha dos títulos e o recorte das capas nos cartões precisam de uma
  conferência a olho antes de publicar.
