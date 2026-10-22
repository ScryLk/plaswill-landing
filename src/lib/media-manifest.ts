/**
 * Manifesto do acervo visual de produtos.
 *
 * Cada imagem que saiu do WordPress para cá passou por inspeção visual antes de
 * ser aceita. O nome do arquivo não foi usado como prova de nada: `admin-ajax.png`
 * é o plástico bolha, `10.png` são as capas de fardo, e o arquivo com nome de
 * WhatsApp é o lençol descartável. Associar pelo nome teria trocado produtos.
 *
 * O registro guarda, para cada arquivo: de onde veio, onde está a cópia do
 * original, qual é o arquivo servido, as dimensões antes e depois, o hash do
 * original, o que a imagem realmente mostra, se pode ser publicada e com que
 * texto alternativo. Sem esse registro, a próxima pessoa a mexer no acervo
 * repete a auditoria do zero — ou pior, publica o que não devia.
 *
 * Três estados, e a diferença entre eles importa:
 *
 * - `aprovada` — a imagem mostra o produto certo e pode ir ao ar.
 * - `aprovada-com-ressalva` — serve, mas tem um problema que a empresa precisa
 *   resolver: marca de terceiro na foto, ou falta de identificação Plaswill.
 *   Publicar é decisão da empresa, não do código.
 * - `reprovada` — não entra. Hoje é o caso do saco para pedra: o único arquivo
 *   disponível é uma provável imagem sintética, e apresentá-la como fotografia
 *   real do produto seria afirmar algo que não é verdade.
 *
 * Os originais ficam em `acervo/originais/produtos`, fora de `/public`, para não
 * serem servidos por acidente. O que o site serve está em
 * `public/images/produtos`, em AVIF, sem ampliação: nenhuma imagem foi
 * redimensionada para cima, porque ampliar não cria detalhe — só inventa
 * pixels e mente sobre a resolução do arquivo.
 */

export type ProductMediaId =
  | "filme-stretch"
  | "filme-stretch-rolinho"
  | "plastico-bolha"
  | "capas-de-fardos"
  | "sacos-sob-medida"
  | "sacos-para-pedra"
  | "sacos-para-lenha"
  | "sacos-para-lixo"
  | "sacos-coleta-seletiva"
  | "sacos-lixo-infectante"
  | "sacos-lixo-toxico"
  | "sacos-para-silagem"
  | "lona-preta"
  | "lencol-descartavel";

/** O que a imagem é, não o que o nome do arquivo sugere. */
export type MediaKind = "foto-produto" | "foto-aplicacao" | "ilustracao-sintetica";

export type MediaStatus = "aprovada" | "aprovada-com-ressalva" | "reprovada";

export type ProductMedia = {
  product: ProductMediaId;
  /** URL de origem, no WordPress atual. */
  source: string;
  /** Cópia do original, fora de /public. */
  original: string;
  /** Arquivo servido, caminho absoluto a partir da raiz do site. */
  file: string | null;
  format: "avif" | null;
  /** Largura e altura do original. */
  originalSize: readonly [number, number];
  /** Largura e altura do arquivo servido. Nunca maior que o original. */
  storedSize: readonly [number, number] | null;
  bytes: number | null;
  /** SHA-256 do arquivo original, para detectar substituição silenciosa. */
  sha256: string;
  kind: MediaKind;
  status: MediaStatus;
  /** Texto alternativo. Descreve o que se vê; não vende e não supõe. */
  alt: string | null;
  note: string;
};

const ORIGINALS = "acervo/originais/produtos";
const SERVED = "/images/produtos";

export const productMedia: Record<ProductMediaId, ProductMedia> = {
  "filme-stretch": {
    product: "filme-stretch",
    source: "https://plaswill.com.br/wp-content/uploads/filme-stretch.png",
    original: `${ORIGINALS}/filme-stretch.png`,
    file: `${SERVED}/filme-stretch.avif`,
    format: "avif",
    originalSize: [450, 450],
    storedSize: [450, 450],
    bytes: 17834,
    sha256: "94707f6dc5ee471ab3ef970cede6b60953b1b755f14f3723bb953daf7f218750",
    kind: "foto-produto",
    status: "aprovada",
    alt: "Três bobinas de filme stretch transparente com núcleo de papelão, sobre fundo neutro.",
    note: "Recorte de catálogo, fundo removido. Mostra a bobina de máquina; o rolinho manual tem arquivo próprio.",
  },
  "filme-stretch-rolinho": {
    product: "filme-stretch-rolinho",
    source: "https://plaswill.com.br/wp-content/uploads/filme-stretch-rolinho.png",
    original: `${ORIGINALS}/filme-stretch-rolinho.png`,
    file: `${SERVED}/filme-stretch-rolinho.avif`,
    format: "avif",
    originalSize: [450, 450],
    storedSize: [450, 450],
    bytes: 11174,
    sha256: "69fa57be310275b08d00d47ebac632e736818e6fc3a4bebb7b44d4735e4d42e7",
    kind: "foto-produto",
    status: "aprovada",
    alt: "Três rolinhos de filme stretch manual com suporte plástico preto.",
    note: "O suporte preto é o que distingue o rolinho manual do filme de máquina. Não confundir os dois arquivos.",
  },
  "plastico-bolha": {
    product: "plastico-bolha",
    source: "https://plaswill.com.br/wp-content/uploads/admin-ajax.png",
    original: `${ORIGINALS}/plastico-bolha-grade.png`,
    file: `${SERVED}/plastico-bolha.avif`,
    format: "avif",
    originalSize: [456, 413],
    storedSize: [456, 413],
    bytes: 23656,
    sha256: "02067883c87a6599e7cd1bf462e476523971d9e490f6d5b39158690c94d2a409",
    kind: "foto-produto",
    status: "aprovada",
    alt: "Rolos de plástico bolha, um branco e um azul, ao lado de um recorte ampliado mostrando as bolhas.",
    note: "O arquivo de origem chama-se `admin-ajax.png`, nome genérico de upload do WordPress. Conferido: o conteúdo é o plástico bolha. Nome ruim não é defeito da imagem — mas vale renomear no acervo novo, e foi renomeado.",
  },
  "capas-de-fardos": {
    product: "capas-de-fardos",
    source: "https://plaswill.com.br/wp-content/uploads/10.png",
    original: `${ORIGINALS}/capas-de-fardos.png`,
    file: `${SERVED}/capas-de-fardos.avif`,
    format: "avif",
    originalSize: [810, 727],
    storedSize: [810, 727],
    bytes: 187603,
    sha256: "cf16be57aec574b5b35ab5fdb8bb910b84d44d904545561d7f50b513a77d85e7",
    kind: "foto-aplicacao",
    status: "aprovada-com-ressalva",
    alt: "Pilha de fardos embalados em filme plástico sobre palete.",
    note: "Foto real de aplicação: mostra o filme fazendo o trabalho. Ressalva: a embalagem fotografada traz a marca de um cliente (AVENA) em destaque, o que pode ser lido como aval. Publicar só com autorização da empresa. O arquivo de origem tem nome genérico (`10.png`).",
  },
  "sacos-sob-medida": {
    product: "sacos-sob-medida",
    source: "https://plaswill.com.br/wp-content/uploads/sacos-plasticos-sob-medida.png",
    original: `${ORIGINALS}/sacos-plasticos-sob-medida.png`,
    file: `${SERVED}/sacos-sob-medida.avif`,
    format: "avif",
    originalSize: [450, 450],
    storedSize: [450, 450],
    bytes: 20285,
    sha256: "5bf99753034cb5a65c013d5ed956cea238315ec3af809853e24679669ac5831e",
    kind: "foto-produto",
    status: "aprovada",
    alt: "Três sacos plásticos coloridos — verde, vermelho e azul — com fundo triangular.",
    note: "O fundo triangular aparece nas três peças, que é justamente o que se vende em saco sob medida.",
  },
  "sacos-para-pedra": {
    product: "sacos-para-pedra",
    source:
      "https://plaswill.com.br/wp-content/uploads/ChatGPT_Image_8_de_abr._de_2025__16_56_50-removebg-preview.png",
    original: `${ORIGINALS}/sacos-para-pedra.png`,
    file: null,
    format: null,
    originalSize: [500, 500],
    storedSize: null,
    bytes: null,
    sha256: "f9b665ee4451203bf402bafc2f969b8ccaf6fa8e84f4f3a6b5d7aaf2b2a39905",
    kind: "ilustracao-sintetica",
    status: "reprovada",
    alt: null,
    note: "Provável imagem gerada (nome de origem `ChatGPT_Image…`). Mostra um saco transparente com pedra, mas não é fotografia do produto nem da linha de produção. Publicada como foto, afirmaria algo falso. O card fica com a prancha técnica. Pendente: foto autorizada do saco com pedra.",
  },
  "sacos-para-lenha": {
    product: "sacos-para-lenha",
    source: "https://plaswill.com.br/wp-content/uploads/Design-sem-nome-47.png",
    original: `${ORIGINALS}/sacos-para-lenha.png`,
    file: `${SERVED}/sacos-para-lenha.avif`,
    format: "avif",
    originalSize: [1080, 1080],
    storedSize: [900, 900],
    bytes: 36233,
    sha256: "78af3efd9de37069aa0fe439d4c9dbc21bfc68f6a8921c46d635475ff33088e2",
    kind: "foto-produto",
    status: "aprovada",
    alt: "Saco plástico transparente cheio de lenha partida.",
    note: "Única imagem do lote que precisou de redução (1080 para 900). As demais foram convertidas no tamanho original.",
  },
  "sacos-para-lixo": {
    product: "sacos-para-lixo",
    source: "https://plaswill.com.br/wp-content/uploads/sacos-para-lixo.png",
    original: `${ORIGINALS}/sacos-para-lixo.png`,
    file: `${SERVED}/sacos-para-lixo.avif`,
    format: "avif",
    originalSize: [450, 450],
    storedSize: [450, 450],
    bytes: 49528,
    sha256: "21834353740a212d40a95913131b4840c441dc696e643bc6be4b9b52d92aac66",
    kind: "foto-produto",
    status: "aprovada",
    alt: "Embalagens dos sacos de lixo Plaswill de 30, 50 e 100 litros.",
    note: "É a imagem mais útil do lote: mostra a marca, as três capacidades e a impressão do produto. Serve de referência para o padrão do acervo.",
  },
  "sacos-coleta-seletiva": {
    product: "sacos-coleta-seletiva",
    source: "https://plaswill.com.br/wp-content/uploads/coleta-seletiva.png",
    original: `${ORIGINALS}/coleta-seletiva.png`,
    file: `${SERVED}/sacos-coleta-seletiva.avif`,
    format: "avif",
    originalSize: [450, 450],
    storedSize: [450, 450],
    bytes: 34958,
    sha256: "5c617c8443e07f77722b5ec1f03f96ecb62e3046bfde99cfc50226cde371af98",
    kind: "foto-produto",
    status: "aprovada",
    alt: "Sacos plásticos coloridos abertos em leque, nas cores vermelho, azul, verde, amarelo, marrom e preto.",
    note: "As cores são o argumento do produto: cada fração da coleta tem a sua. O nome do arquivo era `coleta-seletiva`; o arquivo servido usa o id do produto.",
  },
  "sacos-lixo-infectante": {
    product: "sacos-lixo-infectante",
    source: "https://plaswill.com.br/wp-content/uploads/sacos-para-lixo-infectante.png",
    original: `${ORIGINALS}/sacos-para-lixo-infectante.png`,
    file: `${SERVED}/sacos-lixo-infectante.avif`,
    format: "avif",
    originalSize: [450, 450],
    storedSize: [450, 450],
    bytes: 17755,
    sha256: "02684130b063e99f64512d7f1c9f0770bf7c5d7d139fcf0be713902402c7732a",
    kind: "foto-produto",
    status: "aprovada-com-ressalva",
    alt: "Saco branco de 50 litros para resíduo infectante, com o símbolo de risco biológico e a classe 6.2.",
    note: "Produto correto: saco branco de 50 L com a simbologia obrigatória. Ressalva: não há identificação Plaswill visível na face fotografada — a frente é tomada pela impressão de risco, que é exigência legal. Confirmar que é produção própria antes de publicar como foto de produto.",
  },
  "sacos-lixo-toxico": {
    product: "sacos-lixo-toxico",
    source: "https://plaswill.com.br/wp-content/uploads/sacos-para-lixo-toxico.png",
    original: `${ORIGINALS}/sacos-para-lixo-toxico.png`,
    file: `${SERVED}/sacos-lixo-toxico.avif`,
    format: "avif",
    originalSize: [450, 450],
    storedSize: [450, 450],
    bytes: 29359,
    sha256: "41f5028022c713b6379ef71af842b73a439a955d11e20f709ceabee4c142f9e0",
    kind: "foto-produto",
    status: "aprovada-com-ressalva",
    alt: "Saco laranja para resíduo tóxico, com a classe de risco 6.1 impressa.",
    note: "Produto correto: saco laranja, classe 6.1. Ressalva dupla: não há marca Plaswill visível e a base traz impresso o bloco de CNPJ de outro fabricante. Confirmar a autoria da peça fotografada antes de publicar.",
  },
  "sacos-para-silagem": {
    product: "sacos-para-silagem",
    source:
      "https://plaswill.com.br/wp-content/uploads/WhatsApp_Image_2025-04-07_at_15.13.37-removebg-preview.png",
    original: `${ORIGINALS}/sacos-para-silagem.png`,
    file: `${SERVED}/sacos-para-silagem.avif`,
    format: "avif",
    originalSize: [500, 500],
    storedSize: [500, 500],
    bytes: 49629,
    sha256: "0370eb2d859fda330d282abfc6e68e4729c956af19c9873570133644aa3bbe45",
    kind: "foto-aplicacao",
    status: "aprovada",
    alt: "Três sacos de silagem pretos, um fechado, um aberto mostrando a silagem e outro enrolado sobre o bloco.",
    note: "Foto real de aplicação: os três estágios do uso (fechado, aberto, enrolado) explicam o produto melhor do que uma peça vazia.",
  },
  "lona-preta": {
    product: "lona-preta",
    source: "https://plaswill.com.br/wp-content/uploads/lona-preta.png",
    original: `${ORIGINALS}/lona-preta.png`,
    file: `${SERVED}/lona-preta.avif`,
    format: "avif",
    originalSize: [450, 450],
    storedSize: [450, 450],
    bytes: 23340,
    sha256: "5dc466fc369599348e8ac7c0ed250728d017ca21b88ddfaeb9fdf7adec042c3d",
    kind: "foto-produto",
    status: "aprovada",
    alt: "Rolo de lona preta.",
    note: "Peça única, sem escala na foto. A ficha técnica é que informa a metragem.",
  },
  "lencol-descartavel": {
    product: "lencol-descartavel",
    source:
      "https://plaswill.com.br/wp-content/uploads/WhatsApp_Image_2025-04-10_at_13.45.04-removebg-preview.png",
    original: `${ORIGINALS}/lencol-descartavel.png`,
    file: `${SERVED}/lencol-descartavel.avif`,
    format: "avif",
    originalSize: [433, 577],
    storedSize: [433, 577],
    bytes: 20216,
    sha256: "22935e625c804fd8993a3b203396f67933c2e708a613479231db7885bdb39f1a",
    kind: "foto-aplicacao",
    status: "aprovada",
    alt: "Lençol plástico branco cobrindo uma maca.",
    note: "Aplicação hospitalar, que é onde o produto se explica. Nome de origem de WhatsApp, conteúdo conferido.",
  },
};

/**
 * Arquivo descartado na auditoria.
 *
 * Fica registrado para que ninguém o reimporte achando que faltou. É um banner
 * promocional de 500 × 170 px: proporção de faixa, não de produto, e sem
 * resolução para card.
 */
export const discardedMedia = [
  {
    source: "https://plaswill.com.br/wp-content/uploads/platico-bolha-120-micras.jpg",
    original: `${ORIGINALS}/plastico-bolha-banner.jpg`,
    product: "plastico-bolha" as ProductMediaId,
    size: [500, 170] as const,
    sha256: "66d60eb9c8f2bb3013c3ee22fa5fe7b93c04bd1be9e4c599c23be3aced39ea4c",
    reason:
      "Banner promocional de 500 × 170 px. Não é foto de produto: é faixa de largura, com texto de campanha e sem resolução para card.",
  },
] as const;

/**
 * A imagem que pode ser publicada, ou `null`.
 *
 * Só devolve algo quando existe arquivo **e** texto alternativo. Uma imagem
 * sem descrição é uma imagem que não existe para quem usa leitor de tela, e o
 * caminho mais barato de garantir isso é não deixar o caso acontecer.
 */
export function approvedImage(
  id: string,
): { src: string; alt: string } | null {
  const media = productMedia[id as ProductMediaId];
  if (!media) return null;
  if (media.status === "reprovada") return null;
  if (!media.file || !media.alt) return null;
  return { src: media.file, alt: media.alt };
}
