/**
 * Todo o conteúdo editorial e comercial da landing page.
 *
 * Regra deste arquivo: só entra informação verificada do dossiê corporativo.
 * Nenhum número de produção, certificação, cliente ou capacidade foi inventado.
 * Os pontos que dependem de confirmação do comercial estão marcados com "REVISAR"
 * e estão listados no README, na seção "Revisar antes de publicar".
 */

export const site = {
  name: "Plaswill",
  legalName: "Plaswill Indústria de Embalagens Plásticas Ltda.",
  tagline: "Filmes técnicos e embalagens industriais sustentáveis",
  foundedYear: 2007,
  cnpj: "08.718.368/0001-08",
  address: {
    street: "Av. dos Imigrantes, 1260",
    district: "Distrito Industrial",
    city: "Panambi",
    state: "RS",
    postalCode: "98280-000",
    country: "BR",
  },
  phone: { label: "(55) 3375-8522", href: "tel:+555533758522" },
  whatsapp: {
    label: "(55) 98427-5963",
    // área 55 + número 98427-5963
    href: "https://wa.me/5555984275963",
  },
  emails: {
    commercial: "comercial@plaswill.com.br",
    general: "contato@plaswill.com.br",
  },
} as const;

export const contact = {
  whatsappMessage:
    "Olá! Vim pelo site da Plaswill e gostaria de falar sobre fornecimento de filmes e embalagens.",
  responseNote:
    "Atendimento direto com o setor comercial em Panambi/RS, de segunda a sexta.",
} as const;

/* ------------------------------------------------------------------ */
/* Navegação                                                          */
/* ------------------------------------------------------------------ */

export const nav = [
  { id: "sobre", label: "A Plaswill", href: "#sobre" },
  { id: "produtos", label: "Produtos", href: "#produtos" },
  { id: "diferenciais", label: "Diferenciais", href: "#diferenciais" },
  { id: "estrutura", label: "Estrutura", href: "#estrutura" },
  { id: "segmentos", label: "Segmentos", href: "#segmentos" },
  { id: "orcamento", label: "Orçamento", href: "#orcamento" },
] as const;

/* ------------------------------------------------------------------ */
/* Hero                                                               */
/* ------------------------------------------------------------------ */

export const hero = {
  eyebrow: `Indústria própria em Panambi/RS · desde ${site.foundedYear}`,
  /**
   * O título identifica a empresa antes de prometer qualquer coisa.
   *
   * A versão anterior — "A micragem que você paga é a que chega na esteira." —
   * é a chamada mais forte que a Plaswill tem, e continua no site: ela virou a
   * prova do bloco de diferenciais (item 03) e a nota final do rodapé. O que
   * mudou é o papel dela. Como H1, ela falhava em duas frentes: quem chega sem
   * conhecer a empresa não descobria que se trata de uma indústria de
   * embalagens plásticas, e a frase afirma uma garantia operacional que só o
   * comercial pode sustentar por escrito. Como prova, dentro de diferenciais,
   * ela não precisa carregar sozinha a apresentação da empresa.
   */
  headline: "Embalagens que protegem produtos e acompanham o ritmo do seu negócio.",
  /** Quebras editoriais da abertura: cada linha entra por máscara no CSS. */
  headlineLines: [
    "Embalagens que protegem",
    "produtos e acompanham",
    "o ritmo do seu negócio.",
  ],
  lead:
    "Soluções em embalagens plásticas para a indústria, o comércio e o agronegócio. Conheça nossos produtos e encontre a alternativa adequada à sua operação.",
  primaryCta: { label: "Conhecer produtos", href: "#produtos" },
  secondaryCta: { label: "Falar com o comercial", href: site.whatsapp.href },
  facts: [
    { label: "Fundação", value: "2007" },
    { label: "Extrusão balão", value: "própria" },
    { label: "Linhas de produto", value: "cinco" },
    { label: "Pedido mínimo", value: "fracionado" },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Sobre                                                              */
/* ------------------------------------------------------------------ */

export const about = {
  eyebrow: "04",
  eyebrowLabel: "A Plaswill",
  /**
   * O título era "Indústria de transformação, não distribuidor de terceiros."
   * A frase é verdadeira e diferença bem, mas abre a seção institucional
   * definindo a empresa pelo que ela *não* é — e a seção que conta a história
   * da Plaswill deve começar contando a história da Plaswill. A definição por
   * contraste desceu para o corpo do texto, onde ela é uma frase entre outras.
   */
  title: "Uma história construída com trabalho, compromisso e evolução.",
  paragraphs: [
    "Desde 2007, a Plaswill desenvolve sua trajetória na indústria de embalagens plásticas, atendendo diferentes necessidades de empresas e operações produtivas. Com sede em Panambi, no noroeste do Rio Grande do Sul, a empresa valoriza o relacionamento com seus clientes e a evolução contínua de suas soluções.",
    "Panambi está entre os polos metalmecânicos, agroindustriais e de implementos agrícolas mais expressivos do Sul do país, e foi ali que a produção se estabeleceu: extrudando o próprio filme, calibrando a própria bobina e recuperando a própria resina. Isso significa controle sobre três coisas que decidem o resultado na linha do cliente — a espessura que sai do cabeçote, a resistência da solda e o prazo de reposição.",
  ],
  capabilities: [
    {
      code: "01",
      title: "Extrusão balão própria",
      body:
        "Transformação de resinas termoplásticas virgens e recicladas em filmes tubulares de polietileno de baixa (PEBD) e alta densidade (PEAD).",
    },
    {
      code: "02",
      title: "Corte, solda e rebobinamento",
      body:
        "Calibração de bobinas stretch para aplicação manual e automática, com corte, solda e rebobinamento automatizados.",
    },
    {
      code: "03",
      title: "Reciclagem mecânica (PCR)",
      body:
        "Triagem, descontaminação, micronização e extrusão de polietileno pós-consumo, com aditivação de blendas estabilizantes.",
    },
    {
      code: "04",
      title: "Estoque e pronta-entrega",
      body:
        "Armazenagem centralizada em Panambi para atendimento fracionado ao noroeste gaúcho, Serra, região metropolitana de Porto Alegre, Santa Catarina e Paraná.",
    },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Produtos e soluções                                                */
/* ------------------------------------------------------------------ */

export type Spec = { label: string; value: string };
export type DrawingId =
  | "stretch"
  | "roll"
  | "bubble"
  | "fardo"
  | "bag"
  | "sheet"
  | "silage"
  | "hospital"
  | "pcr";

/* ------------------------------------------------------------------ */
/* Categorias do catálogo                                             */
/* ------------------------------------------------------------------ */

/**
 * A arquitetura do catálogo, reconciliada com o que o site institucional em
 * plaswill.com.br publica hoje: aquelas quatorze páginas de produto são a lista
 * efetivamente comercializada, e é ela que manda aqui. A landing anterior
 * mostrava cinco "linhas", o que é uma boa simplificação visual mas deixava
 * metade do portfólio sem endereço na página.
 *
 * Cinco categorias, quatorze produtos, nenhum inventado: cada item abaixo tem
 * página própria no site atual. O que muda é o agrupamento, que aqui segue o
 * uso do cliente (o que ele está tentando embalar) e não a ordem alfabética do
 * menu antigo.
 *
 * REVISAR — a categoria de cada item é proposta nossa, não documento da
 * empresa. "Lona preta" é o caso mais discutível: o site atual a descreve como
 * "uso geral" e ela está aqui em Agronegócio porque o dossiê a trata como
 * aplicação rural. Se o comercial classificar diferente, é mover uma linha.
 */
export type ProductCategoryId =
  | "protecao"
  | "industrial"
  | "residuos"
  | "agro"
  | "higiene";

export type ProductCategory = {
  id: ProductCategoryId;
  code: string;
  name: string;
  lead: string;
};

export const productCategories: ProductCategory[] = [
  {
    id: "protecao",
    code: "C1",
    name: "Proteção e transporte",
    lead: "O que envolve a carga e protege a peça entre a expedição e a abertura.",
  },
  {
    id: "industrial",
    code: "C2",
    name: "Embalagens industriais",
    lead: "Sacos e capas na medida da operação, não na medida do catálogo do fornecedor.",
  },
  {
    id: "residuos",
    code: "C3",
    name: "Resíduos e coleta",
    lead: "Do resíduo comum ao infectante, com a solda e a identificação que a destinação exige.",
  },
  {
    id: "agro",
    code: "C4",
    name: "Agronegócio",
    lead: "Vedação para forragem e grão, e a lona que cobre o que fica no campo.",
  },
  {
    id: "higiene",
    code: "C5",
    name: "Higiene e aplicações especiais",
    lead: "Descartáveis de uso único para ambientes que pedem barreira.",
  },
];

export type Product = {
  id: string;
  code: string;
  category: ProductCategoryId;
  name: string;
  short: string;
  /** Benefício comercial objetivo — o que muda na operação do cliente. */
  benefit: string;
  specs: Spec[];
  applications: string[];
  drawing: DrawingId;
  /**
   * Foto real do produto ou da linha de produção.
   * Enquanto estiver vazio, o card desenha a ficha técnica em SVG.
   * Para ativar: coloque o arquivo em /public/images e preencha os dois campos.
   */
  image?: string;
  imageAlt?: string;
};

export const products: Product[] = [
  /* --- C1 · Proteção e transporte ---------------------------------- */
  {
    id: "filme-stretch",
    code: "PR-01",
    category: "protecao",
    name: "Filme stretch",
    short: "Paletização manual e automática",
    benefit:
      "Bobina calibrada para travar a carga até o destino, sem afrouxar na trepidação da estrada.",
    specs: [
      { label: "Micragem nominal", value: "20µ · 25µ · 30µ" },
      { label: "Aplicação", value: "manual e automática" },
      { label: "Propriedade", value: "memória elástica ativa" },
      { label: "Resistência", value: "perfuração dinâmica e quinas vivas" },
    ],
    applications: [
      "Cargas paletizadas pesadas",
      "Eixos metálicos usinados",
      "Caixas de papelão corrugado",
      "Implementos agrícolas",
    ],
    drawing: "stretch",
  },
  {
    id: "filme-stretch-rolinho",
    code: "PR-02",
    category: "protecao",
    name: "Filme stretch rolinho",
    short: "Aplicação manual, bobina de mão",
    benefit:
      "A mesma calibração do stretch de máquina, na bobina que se leva até o palete.",
    specs: [
      { label: "Aplicação", value: "manual" },
      { label: "Formato", value: "rolinho de mão" },
      { label: "Propriedade", value: "estiramento com memória elástica" },
      { label: "Material", value: "polietileno" },
    ],
    applications: [
      "Paletização manual",
      "Depósito e expedição",
      "Fechamento de carga avulsa",
      "Reforço de carga já paletizada",
    ],
    drawing: "roll",
  },
  {
    id: "plastico-bolha",
    code: "PR-03",
    category: "protecao",
    name: "Plástico bolha",
    short: "Peças, equipamentos e pátio",
    benefit: "Protege o que fica no pátio: não resseca com o sol nem rasga com o vento.",
    specs: [
      { label: "Espessura", value: "30µ · 120µ" },
      { label: "Aditivação", value: "anti-UV" },
      { label: "Bolha", value: "indeformável de alta tração" },
      { label: "Aplicação", value: "pátios e armazenagem externa" },
    ],
    applications: [
      "Maquinários e equipamentos",
      "Chapas metálicas usinadas",
      "Implementos recém-pintados",
      "Peças em pátio aberto",
    ],
    drawing: "bubble",
  },
  {
    id: "capas-de-fardos",
    code: "PR-04",
    category: "protecao",
    name: "Capas de fardos",
    short: "Fardos e volumes, sob medida",
    benefit:
      "Capa fechada que veste o volume e substitui a cobertura improvisada sobre o fardo.",
    specs: [
      { label: "Medida", value: "sob medida" },
      { label: "Cor", value: "incolor ou canela" },
      { label: "Material", value: "polietileno" },
      { label: "Fechamento", value: "capa fechada" },
    ],
    applications: [
      "Fardos e volumes enfardados",
      "Cobertura de carga",
      "Proteção de material estocado",
      "Embalagem sob medida",
    ],
    drawing: "fardo",
  },

  /* --- C2 · Embalagens industriais ---------------------------------- */
  {
    id: "sacos-sob-medida",
    code: "PR-05",
    category: "industrial",
    name: "Sacos plásticos sob medida",
    short: "Largura, comprimento e espessura definidos",
    benefit:
      "O saco desenhado para o produto que você embala, e não o tamanho que sobrou no estoque do fornecedor.",
    specs: [
      { label: "Largura", value: "definida com o cliente" },
      { label: "Comprimento", value: "definido com o cliente" },
      { label: "Espessura", value: "definida com o cliente" },
      { label: "Fechamento", value: "solda de fundo" },
    ],
    applications: [
      "Produtos industriais",
      "Peças e componentes",
      "Insumos a granel",
      "Embalagem secundária",
    ],
    drawing: "bag",
  },
  {
    id: "sacos-para-pedra",
    code: "PR-06",
    category: "industrial",
    name: "Sacos para pedra",
    short: "Acondicionamento de pedra",
    benefit:
      "Embalagem dimensionada para pedra, com fundo fechado que segura o peso até a descarga.",
    specs: [
      { label: "Aplicação", value: "acondicionamento de pedra" },
      { label: "Material", value: "polietileno" },
      { label: "Fechamento", value: "solda de fundo" },
      { label: "Formato", value: "sob medida" },
    ],
    applications: [
      "Pedra e material granulado",
      "Carga pesada",
      "Obra e canteiro",
      "Expedição",
    ],
    drawing: "bag",
  },
  {
    id: "sacos-para-lenha",
    code: "PR-07",
    category: "industrial",
    name: "Sacos para lenha",
    short: "Acondicionamento de lenha e achas",
    benefit:
      "Volume fechado para lenha, para transportar e vender carga organizada em vez de peça solta.",
    specs: [
      { label: "Aplicação", value: "acondicionamento de lenha" },
      { label: "Material", value: "polietileno" },
      { label: "Fechamento", value: "solda de fundo" },
      { label: "Formato", value: "sob medida" },
    ],
    applications: [
      "Lenha e achas",
      "Carga a granel",
      "Comércio de lenha",
      "Expedição",
    ],
    drawing: "bag",
  },

  /* --- C3 · Resíduos e coleta --------------------------------------- */
  {
    id: "sacos-para-lixo",
    code: "PR-08",
    category: "residuos",
    name: "Sacos para lixo",
    short: "Resíduo comum",
    benefit:
      "Saco de uso diário com solda de fundo que segura o peso na coleta e no transporte interno.",
    specs: [
      { label: "Aplicação", value: "resíduo comum" },
      { label: "Material", value: "polietileno" },
      { label: "Fechamento", value: "solda de fundo" },
      { label: "Formato", value: "sob medida" },
    ],
    applications: [
      "Limpeza e manutenção",
      "Resíduo domiciliar",
      "Indústria e comércio",
      "Condomínios",
    ],
    drawing: "bag",
  },
  {
    id: "sacos-coleta-seletiva",
    code: "PR-09",
    category: "residuos",
    name: "Sacos coloridos para coleta seletiva",
    short: "Identificação por cor do material",
    benefit:
      "A cor do saco informa o tipo de resíduo antes de qualquer etiqueta, e é o que faz a separação funcionar na prática.",
    specs: [
      { label: "Cor", value: "definida com o cliente" },
      { label: "Aplicação", value: "coleta seletiva" },
      { label: "Material", value: "polietileno" },
      { label: "Fechamento", value: "solda de fundo" },
    ],
    applications: [
      "Coleta seletiva",
      "Programas internos de reciclagem",
      "Condomínios e cooperativas",
      "Campanhas de separação",
    ],
    drawing: "bag",
  },
  {
    id: "sacos-lixo-infectante",
    code: "PR-10",
    category: "residuos",
    name: "Sacos para lixo infectante",
    short: "Resíduo hospitalar e de serviços de saúde",
    benefit: "Solda de fundo estanque que não rompe no manuseio nem no transporte interno.",
    specs: [
      { label: "Norma", value: "ABNT NBR 9191" },
      { label: "Exigências", value: "ANVISA" },
      { label: "Solda", value: "fundo estanque de alta resistência" },
      { label: "Acabamento", value: "leitosa e pigmentada" },
    ],
    applications: [
      "Resíduo infectante hospitalar",
      "Clínicas médicas, odontológicas e veterinárias",
      "Perfurocortantes acondicionados",
      "Redes de atendimento e laboratórios",
    ],
    drawing: "hospital",
  },
  {
    id: "sacos-lixo-toxico",
    code: "PR-11",
    category: "residuos",
    name: "Sacos para lixo tóxico",
    short: "Resíduo químico e contaminado",
    benefit:
      "Barreira fechada para o resíduo que não pode vazar entre o descarte e a coleta especializada.",
    specs: [
      { label: "Aplicação", value: "resíduo químico e contaminado" },
      { label: "Material", value: "polietileno" },
      { label: "Fechamento", value: "solda de fundo" },
      { label: "Formato", value: "conforme a aplicação" },
    ],
    applications: [
      "Hospitais e clínicas",
      "Laboratórios",
      "Resíduo químico",
      "Indústria",
    ],
    drawing: "hospital",
  },

  /* --- C4 · Agronegócio --------------------------------------------- */
  {
    id: "sacos-para-silagem",
    code: "PR-12",
    category: "agro",
    name: "Sacos para silagem",
    short: "Forragem, grãos e cobertura de silo",
    benefit: "Vedação sem microfuros, para a forragem chegar ao cocho com o nutriente dentro.",
    specs: [
      { label: "Matéria-prima", value: "polietileno virgem e aditivado" },
      { label: "Vedação", value: "anaeróbica completa" },
      { label: "Integridade", value: "sem microfuros" },
      { label: "Formatos", value: "sacos e lonas sob medida" },
    ],
    applications: [
      "Silagem de milho e sorgo",
      "Sementes e grãos",
      "Rações e fertilizantes",
      "Cobertura de silo e forragem",
    ],
    drawing: "silage",
  },
  {
    id: "lona-preta",
    code: "PR-13",
    category: "agro",
    name: "Lona preta",
    short: "Cobertura de uso geral",
    benefit:
      "Cobertura dimensionada ao que precisa ser protegido, e não à largura que o rolo já tinha.",
    specs: [
      { label: "Aplicação", value: "cobertura de uso geral" },
      { label: "Material", value: "polietileno" },
      { label: "Cor", value: "preta" },
      { label: "Formato", value: "sob medida" },
    ],
    applications: [
      "Cobertura de material",
      "Proteção de carga",
      "Uso rural",
      "Obra e canteiro",
    ],
    drawing: "sheet",
  },

  /* --- C5 · Higiene e aplicações especiais -------------------------- */
  {
    id: "lencol-descartavel",
    code: "PR-14",
    category: "higiene",
    name: "Lençol plástico descartável",
    short: "Barreira de uso único",
    benefit:
      "Barreira de uso único para superfície que precisa de proteção limpa e descarte rápido.",
    specs: [
      { label: "Aplicação", value: "higiene e proteção de superfície" },
      { label: "Material", value: "polietileno" },
      { label: "Uso", value: "descartável" },
      { label: "Formato", value: "sob medida" },
    ],
    applications: [
      "Superfícies de atendimento",
      "Proteção de equipamento",
      "Alojamento e vestiário",
      "Descarte rápido",
    ],
    drawing: "sheet",
  },
];

/** Os produtos de uma categoria, na ordem em que aparecem no catálogo. */
export function productsByCategory(category: ProductCategoryId): Product[] {
  return products.filter((product) => product.category === category);
}

/**
 * Catálogo em PDF.
 *
 * O site institucional publica um botão "Baixe Aqui" apontando para este
 * arquivo no Google Drive, e ele é a peça que o comprador repassa internamente —
 * mais útil que qualquer tabela da página, quando está atualizado. A landing
 * anterior não tinha o link; este é o mesmo documento, não uma cópia.
 *
 * REVISAR — não foi possível abrir o PDF para conferir se a lista dele bate com
 * os quatorze produtos daqui. Se estiver desatualizado, é melhor tirar o link
 * do que publicar um catálogo divergente da página. E, se houver versão nova,
 * vale hospedar o arquivo em `public/` em vez de depender do Drive: link de
 * terceiro pode mudar de permissão sem aviso.
 */
export const catalog = {
  label: "Baixar catálogo em PDF",
  href: "https://drive.google.com/file/d/1ML59jEuTagVo_VfddZmiC-Bfuo8JTxZ9/view",
  note: "Documento oficial publicado no site institucional da Plaswill.",
} as const;

/* ------------------------------------------------------------------ */
/* Diferenciais                                                       */
/* ------------------------------------------------------------------ */

/**
 * Diferenciais — o que a Plaswill oferece, dito sem atacar ninguém.
 *
 * A versão anterior era escrita como objeção contra o mercado: "pedido mínimo
 * abusivo", "micragem enganosa", "atendimento desumanizado". Três problemas:
 * afirma coisas sobre concorrentes que não temos como provar, compara prazos e
 * custos sem dado público, e transfere ao visitante um tom de denúncia que não
 * combina com quem quer ser fornecedor homologado. A estrutura de três campos
 * foi mantida — ela funciona bem na leitura —, mas o campo da esquerda agora
 * nomeia o diferencial em vez da falha alheia.
 */
export type Differential = {
  /** O diferencial, em uma linha. */
  title: string;
  /** Por que isso aparece na conversa comercial. */
  context: string;
  /** O que a Plaswill faz, no que é verificável. */
  evidence: string;
};

export const differentials: Differential[] = [
  {
    title: "Indústria própria, não revenda",
    context:
      "Boa parte da embalagem vendida na região passa por distribuidor antes de chegar ao cliente.",
    evidence:
      "Extrusão balão, corte, solda e rebobinamento acontecem em Panambi. A bobina que sai é a que foi calibrada aqui, sem intermediário entre a formulação e o palete.",
  },
  {
    title: "Pedido fracionado, com estoque à pronta-entrega",
    context:
      "Quem compra embalagem em lote fechado trava capital de giro e fica preso à programação do fornecedor.",
    evidence:
      "Estoque em Panambi a partir de 1 palete, sem quantidade mínima fechada, e lotes fracionados ao longo do ano.",
  },
  {
    title: "Micragem nominal que se confirma na bobina",
    context:
      "A espessura é o que decide resistência, consumo por palete e custo por carga.",
    evidence:
      "A espessura que sai do cabeçote é a que está na ficha: o stretch é fornecido em 20, 25 e 30 micras nominais, conferidas ao longo da bobina.",
  },
  {
    title: "Produto sob medida para o formato da operação",
    context:
      "Fardo, pedra, lenha e carga paletizada não têm a mesma geometria, e o saco padrão não resolve os três.",
    evidence:
      "Largura, comprimento e espessura definidos junto com o cliente, com amostra técnica antes do fechamento.",
  },
  {
    title: "Atendimento direto com o comercial da fábrica",
    context:
      "Dúvida técnica de embalagem raramente se resolve em atendimento de primeiro nível.",
    evidence:
      "Contato direto com o setor comercial em Panambi, por telefone, e-mail ou WhatsApp, de segunda a sexta.",
  },
  {
    title: "Um portfólio para operações diferentes",
    context:
      "Indústria, comércio, agronegócio e saúde compram plástico pelo mesmo motivo e com exigências distintas.",
    evidence:
      "Cinco categorias de produto atendendo da metalmecânica ao hospital, com linha hospitalar dentro dos requisitos da ABNT NBR 9191.",
  },
];

/* ------------------------------------------------------------------ */
/* Estrutura e processo                                               */
/* ------------------------------------------------------------------ */

export type ProcessStep = { code: string; title: string; body: string };

export const structure = {
  eyebrow: "05",
  eyebrowLabel: "Estrutura e processo",
  title: "Da resina à bobina calibrada, na mesma planta.",
  lead:
    "A cadeia produtiva acontece inteira em Panambi. Sem intermediário entre a formulação da blenda e a bobina que sai no seu palete.",
  steps: [
    {
      code: "01",
      title: "Insumos",
      body: "Resinas PEBD e PEAD virgens e sucata plástica triada para a linha de PCR.",
    },
    {
      code: "02",
      title: "Extrusão e blenda",
      body: "Extrusoras balão, aditivação anti-UV e controle de densidade no cabeçote.",
    },
    {
      code: "03",
      title: "Corte, solda e rebobinamento",
      body: "Calibração de micragem, solda de fundo e enrolamento conforme a aplicação.",
    },
    {
      code: "04",
      title: "Estoque e expedição",
      body: "Armazenagem fracionada e expedição para RS, SC e PR.",
    },
  ] satisfies ProcessStep[],
} as const;

/* ------------------------------------------------------------------ */
/* Materiais e responsabilidade ambiental                             */
/* ------------------------------------------------------------------ */

/**
 * O PCR sai do catálogo e entra aqui — e a razão é a própria lista de produtos.
 *
 * A versão anterior tratava "polietileno reciclado pós-consumo" como a quinta
 * linha comercial, com código, ficha técnica e chamada de venda. O site
 * institucional em plaswill.com.br não vende PCR: as quatorze páginas de
 * produto dele não incluem esse item, e a descrição da empresa diz que a
 * Plaswill "trabalha com polietileno virgem e reciclado conforme a necessidade
 * do cliente" e "reaproveita sucata plástica na fabricação dos sacos". Ou seja:
 * o reciclado é matéria-prima de parte do portfólio, não um produto que se
 * pede pelo nome.
 *
 * Manter o PCR como linha comercial criava um item de catálogo que o comercial
 * não cotaria, e ao mesmo tempo jogava o assunto ambiental numa prateleira de
 * venda. Aqui ele fica onde a informação é útil: no processo.
 *
 * Nada abaixo é número, percentual ou certificação. O que existe é a descrição
 * do que a empresa faz, que é o que o dossiê sustenta.
 */
export const materials = {
  eyebrow: "06",
  eyebrowLabel: "Materiais e meio ambiente",
  title: "O plástico que volta para a linha.",
  lead:
    "A Plaswill trabalha com polietileno virgem e reciclado, e reaproveita sucata plástica na própria fabricação. O material recuperado não é vendido como linha separada: ele entra como matéria-prima de parte dos produtos deste catálogo.",
  steps: [
    {
      code: "01",
      title: "Triagem por polímero",
      body:
        "A sucata plástica é separada por tipo antes de qualquer processamento. Misturar polímeros é o que produz aquele reciclado que cheira mal e trava a máquina.",
    },
    {
      code: "02",
      title: "Lavagem e descontaminação",
      body:
        "Retirada de resíduo e contaminante do material recolhido, para a resina voltar limpa à extrusão.",
    },
    {
      code: "03",
      title: "Micronização",
      body:
        "Redução do material a flocos de granulometria regular, para alimentar a extrusora sem variação de dosagem.",
    },
    {
      code: "04",
      title: "Blenda com aditivação estabilizante",
      body:
        "O reciclado entra em blenda com aditivo térmico, e é isso que permite ao material recuperado manter desempenho mecânico previsível.",
    },
  ],
  /**
   * Esta lista existe para o tema não virar slogan. Cada item é uma coisa que
   * depende de documento, não de redação: enquanto não houver laudo, percentual
   * medido ou certificado em mãos, o site não afirma nada disso.
   */
  pending: {
    title: "O que ainda não está publicado, e por quê",
    items: [
      "Percentual de material reciclado por produto — precisa de medição de processo, não de estimativa.",
      "Certificações ambientais — nenhuma foi apresentada até hoje; se existir, entra com número e validade.",
      "Equivalência técnica entre PCR e resina virgem — a amostra roda na linha do cliente, mas a afirmação de equivalência precisa de ensaio.",
      "Destinação dos resíduos da própria fábrica — depende de documento da empresa.",
    ],
  },
  cta: { label: "Falar sobre materiais e aplicação", href: "#orcamento" },
} as const;

/* ------------------------------------------------------------------ */
/* Segmentos atendidos                                                */
/* ------------------------------------------------------------------ */

export type Segment = { code: string; name: string; body: string };

export const segments = {
  eyebrow: "07",
  eyebrowLabel: "Segmentos",
  title: "Quem compra da Plaswill.",
  lead:
    "Cinco frentes concentram o fornecimento. Se a sua operação embala carga, alimenta gado, esteriliza instrumento ou despacha caminhão, provavelmente é uma delas.",
  items: [
    {
      code: "SG-01",
      name: "Metalmecânica e máquinas agrícolas",
      body: "Fabricantes de tratores, colheitadeiras, implementos agrícolas, rodoviários e autopeças.",
    },
    {
      code: "SG-02",
      name: "Cooperativas agropecuárias e armazéns",
      body: "Cooperativas de grãos e laticínios, moinhos e revendas, com compra corporativa de safra.",
    },
    {
      code: "SG-03",
      name: "Complexo hospitalar e saúde",
      body: "Hospitais regionais, policlínicas, laboratórios de análises clínicas e redes de atendimento.",
    },
    {
      code: "SG-04",
      name: "Logística e centros de distribuição",
      body: "Operadores de frete rodoviário pesado, transportadoras e armazéns gerais.",
    },
    {
      code: "SG-05",
      name: "Setor público e licitações",
      body: "Fornecimento contínuo a tribunais, autarquias e prefeituras, com documentação em ordem.",
    },
  ] satisfies Segment[],
} as const;

/* ------------------------------------------------------------------ */
/* Clientes homologados                                               */
/* ------------------------------------------------------------------ */

export type ClientGroup = { area: string; clients: string[] };

/**
 * REVISAR — uso de marca de terceiros.
 * Publicar nome de cliente como referência comercial geralmente depende de
 * autorização contratual. Confirmar com o jurídico/comercial antes de publicar.
 */
export const clients = {
  eyebrow: "06",
  eyebrowLabel: "Clientes",
  title: "Fornecedor homologado de quem não pode parar a linha.",
  lead:
    "A Plaswill é fornecedora homologada de indústrias, cooperativas e redes de saúde no Sul do país.",
  groups: [
    {
      area: "Agronegócio e cooperativas",
      clients: ["Cotripal Agropecuária Cooperativa", "Cisbra Agroindustrial", "Qualyagro"],
    },
    {
      area: "Indústria metalmecânica e implementos",
      clients: [
        "Saur Equipamentos",
        "Fockink Indústrias de Equipamentos Elétricos",
        "Tromink",
        "Oxbo",
        "Lange Termoplásticos",
      ],
    },
    {
      area: "Saúde e hospitais",
      clients: [
        "Hospital de Clínicas Ijuí (HCI)",
        "Hospital Comunitário São Peregrino Laziosi",
        "Dose Express",
      ],
    },
    {
      area: "Setor público",
      clients: ["Tribunal Regional Eleitoral do Rio Grande do Sul (TRE-RS)"],
    },
    {
      area: "Serviços e distribuição",
      clients: ["Grupo Rio Grande", "Global Filtros"],
    },
  ] satisfies ClientGroup[],
} as const;

/* ------------------------------------------------------------------ */
/* Perguntas frequentes                                               */
/* ------------------------------------------------------------------ */

export type FaqItem = { question: string; answer: string[] };

export const faq = {
  eyebrow: "08",
  eyebrowLabel: "Perguntas frequentes",
  /*
   * O título era "As objeções que ouvimos toda semana." — e o FAQ inteiro estava
   * escrito como réplica a um concorrente: "convertedores distantes fecham 5
   * toneladas e pedem 30 dias", "reciclado informal cheira mal", "grandes
   * convertedores exigem toneladas". Nada disso é verificável e nada disso é
   * necessário para responder a pergunta que o cliente realmente faz.
   *
   * Duas afirmações técnicas saíram por decisão, não por estilo: "o resultado
   * mecânico do PCR é equivalente ao da resina virgem" e o mínimo de toneladas
   * atribuído a terceiros. A primeira é o tipo de promessa que só se publica
   * com ensaio em mãos — a amostra resolve para o cliente, o texto não pode
   * resolver por ele. A segunda fala de outra empresa.
   */
  title: "Perguntas que chegam antes do pedido.",
  items: [
    {
      question: "Plástico reciclado é fraco e vai arrebentar na esteira?",
      answer: [
        "Depende de como o material foi recuperado. Reciclado sem triagem e sem controle de densidade varia de lote para lote, e é aí que a bobina rompe.",
        "Na Plaswill, o material passa por triagem por polímero, lavagem, micronização e aditivação estabilizante antes de entrar na blenda — é esse processo que dá previsibilidade ao que sai do cabeçote.",
        "Antes de qualquer pedido, enviamos amostra técnica para você rodar na sua própria linha, com a sua carga e a sua regulagem. É o teste que vale, e ele vale mais do que qualquer afirmação nossa.",
      ],
    },
    {
      question: "Já tenho um fornecedor e a operação está rodando.",
      answer: [
        "Se o fornecimento está estável, o ganho não é trocar: é ter uma segunda fonte na região, para quando a produção oscilar ou aparecer uma demanda fora da programação.",
        "A Plaswill está em Panambi, com estoque de pronta-entrega e atendimento fracionado direto com o time comercial.",
        "A comparação é objetiva: a amostra roda na sua linha e você mede consumo por palete, estiramento e resistência antes de decidir qualquer coisa.",
      ],
    },
    {
      question: "Saco para resíduo infectante exige laudo que fabricante pequeno não tem.",
      answer: [
        "Os sacos hospitalares da Plaswill atendem aos requisitos da ABNT NBR 9191 e às exigências da ANVISA.",
        "Fazemos teste de solda de fundo e estanqueidade justamente para evitar vazamento de material biológico no manuseio e no transporte interno.",
        "Já somos fornecedores contínuos de centros hospitalares de porte, como o Hospital de Clínicas Ijuí.",
      ],
    },
    {
      question: "Qual é o pedido mínimo?",
      answer: [
        "Trabalhamos com estoque à pronta-entrega a partir de 1 palete e com lotes fracionados ao longo do ano.",
        "Para itens sob medida, o mínimo depende do formato e do material — o comercial informa na cotação.",
      ],
    },
    {
      question: "Vocês enviam amostra antes do fechamento?",
      answer: [
        "Sim. A amostra técnica é enviada sem custo para que o material seja testado na sua esteira, com a sua carga e a sua regulagem.",
        "É o jeito mais direto de comparar micragem, estiramento e consumo por palete antes de assumir um contrato.",
      ],
    },
    {
      question: "Em quanto tempo vocês faturam?",
      answer: [
        "O prazo depende do item e do volume: parte dos itens sai do estoque de pronta-entrega em Panambi, e itens sob medida entram na programação de extrusão.",
        "Como a produção é local, o faturamento é mais ágil do que o de um fornecedor interestadual — e o comercial confirma a data exata junto com a cotação.",
      ],
    },
  ] satisfies FaqItem[],
} as const;

/* ------------------------------------------------------------------ */
/* Formulário de orçamento                                            */
/* ------------------------------------------------------------------ */

export const quoteForm = {
  eyebrow: "09",
  eyebrowLabel: "Orçamento",
  title: "Peça uma cotação com amostra técnica.",
  lead:
    "Preencha os campos essenciais e o pedido segue direto para o comercial em Panambi. Se preferir, o mesmo conteúdo abre no WhatsApp pronto para enviar.",
  fields: {
    name: { label: "Nome", placeholder: "Como podemos te chamar" },
    company: { label: "Empresa", placeholder: "Razão social ou nome fantasia" },
    email: { label: "E-mail", placeholder: "nome@empresa.com.br" },
    phone: { label: "Telefone ou WhatsApp", placeholder: "(00) 00000-0000" },
    segment: { label: "Segmento", placeholder: "Selecione o segmento" },
    product: { label: "Produto de interesse", placeholder: "Selecione o produto" },
    volume: { label: "Volume estimado", placeholder: "Ex.: 4 paletes por mês (opcional)" },
    message: { label: "Detalhe técnico", placeholder: "Micragem, medida da bobina, aplicação, prazo…" },
  },
  segmentOptions: [
    "Metalmecânica e máquinas agrícolas",
    "Cooperativa ou armazém",
    "Hospital, clínica ou laboratório",
    "Transportadora ou centro de distribuição",
    "Setor público / licitação",
    "Outro",
  ],
  /**
   * A mesma lista do catálogo, na mesma ordem. Derivada de `products` em vez de
   * escrita à mão: um produto novo entra no catálogo e no formulário na mesma
   * edição, e não há como as duas listas divergirem.
   */
  productOptions: [
    ...products.map((product) => product.name),
    "Mais de um item",
  ],
  submitLabel: "Enviar pedido de orçamento",
  fallbackLabel: "Abrir no WhatsApp",
  success: {
    title: "Pedido pronto para seguir.",
    body:
      "Abrimos o WhatsApp com o resumo preenchido. Se a janela não abrir, use o botão abaixo ou escreva direto para o comercial.",
  },
  consent:
    "Ao enviar, você concorda em ser contatado pelo time comercial da Plaswill sobre esta solicitação.",
} as const;

/* ------------------------------------------------------------------ */
/* Abertura cinematográfica — rota /abertura                          */
/* ------------------------------------------------------------------ */

/**
 * Navegação da abertura: três itens, apontando para as âncoras da landing,
 * porque a abertura é uma página fechada em si mesma e não tem seções
 * abaixo do hero. O primeiro item carrega o chevron; não existe painel de
 * submenu (o spec de referência proíbe o mega-menu).
 */
export const aberturaNav = [
  { id: "produtos", label: "Produtos", href: "/#produtos", chevron: true },
  { id: "estrutura", label: "Estrutura", href: "/#estrutura", chevron: false },
  { id: "segmentos", label: "Segmentos", href: "/#segmentos", chevron: false },
] as const;

/**
 * Conteúdo da abertura. Tudo verificado no dossiê:
 * · "pronta-entrega fracionada" — 01-empresa.md, diferencial 1, e FAQ da landing
 * · "a partir de 1 palete"      — FAQ da landing, resposta sobre pedido mínimo
 * · clientes                    — 03-comercial.md, lista aprovada para divulgação
 */
export const abertura = {
  /* Aviso do topo: a promessa comercial mais concreta que o dossiê sustenta.
     Curto de propósito — o aviso tem de caber em uma linha no celular, e
     "fracionada" é o diferencial que nenhum convertedor grande oferece. */
  pill: "Pronta-entrega fracionada",
  pillHref: "/#orcamento",

  /* O título reusa a chamada já aprovada da landing, com as mesmas quebras. */
  headline: hero.headline,
  headlineLines: hero.headlineLines,

  cta: { label: "Solicitar orçamento", href: "/#orcamento" },

  /* Segunda via de contato, na mesma cápsula do CTA principal — o par
     "fale" + "peça" da referência. O endereço vem de `site.whatsapp`, que é o
     canal oficial já confirmado no dossiê; não há número inventado aqui. */
  secondaryCta: { label: "Falar no WhatsApp", href: site.whatsapp.href },

  /**
   * Clientes — nomes, não logotipos (decisão de 20/10: a arte das marcas
   * saiu da faixa; ver `public/clients/LEIA-ME.md`), e em carrossel contínuo.
   *
   * A ordem agrupa por segmento (`03-comercial.md` §4): a roda passa por
   * metalmecânica, depois agropecuária, depois saúde, depois serviços. Como o
   * carrossel não tem começo nem fim, a ordem importa menos do que numa grade
   * — mas duas marcas do mesmo segmento nunca aparecem longe uma da outra.
   *
   * REVISAR — **Ijuí (Soluções para Sistemas de Ordenha)** e **Cerélus
   * (Alimentos Integrais)** não constam entre os treze clientes "aprovados
   * para divulgação" da API. Entraram porque o Lucas enviou a arte dos quinze;
   * a lista do GED é a autoridade sobre o que pode ser publicado. Ou o GED os
   * incorpora, ou eles saem daqui. O TRE-RS também não entra: não está na
   * lista aprovada (`05-lacunas.md` §3).
   *
   * Publicar marca de cliente depende de autorização contratual — confirmar antes.
   */
  clientsLabel: "Fornecedor homologado de",
  clients: [
    "Saur",
    "Fockink",
    "Tromink",
    "Oxbo",
    "Lange Termoplásticos",
    "Cotripal",
    "Cisbra Agroindustrial",
    "Qualyagro",
    "Ijuí Sistemas de Ordenha",
    "Cerélus Alimentos Integrais",
    "Hospital de Clínicas Ijuí",
    "Hospital São Peregrino Laziosi",
    "Dose Express",
    "Grupo Rio Grande",
    "Global Filtros",
  ] as const,

  /* Texto alternativo das duas fotografias. As duas são de arquivo real —
     descrevem o que está na imagem, não o que a empresa gostaria que ela
     sugerisse. */
  mediaAlt: "Vista aérea da planta industrial da Plaswill, em Panambi/RS",
  facadeAlt:
    "Fachada da sede da Plaswill, em Panambi/RS, com o letreiro da marca sobre a grama em frente",
} as const;

/* ------------------------------------------------------------------ */
/* SEO                                                                */
/* ------------------------------------------------------------------ */

export const seo = {
  title: "Plaswill — filmes técnicos e embalagens industriais",
  /*
   * A descrição listava "polietileno reciclado (PCR)" como se fosse produto —
   * a mesma correção que tirou o PCR do catálogo vale aqui, e com mais razão:
   * é esta frase que aparece no resultado de busca e no compartilhamento.
   */
  description:
    "Indústria de embalagens plásticas em Panambi/RS: filme stretch, plástico bolha, capas de fardos, sacos sob medida, sacaria agrícola, sacos para resíduo infectante (ABNT NBR 9191) e descartáveis. Pronta-entrega fracionada desde 2007.",
  // Ajuste para o domínio final antes de publicar.
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://plaswill.com.br",
  ogImage: "/images/og-plaswill.jpg",
} as const;
