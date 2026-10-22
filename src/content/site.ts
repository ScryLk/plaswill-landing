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
  headline: "A micragem que você paga é a que chega na esteira.",
  /** Quebras editoriais da abertura: cada linha entra por máscara no CSS. */
  headlineLines: ["A micragem que", "você paga é a que", "chega na esteira."],
  lead:
    "Indústria de transformação de filmes técnicos e embalagens plásticas, com extrusão balão própria, reciclagem de polietileno pós-consumo e pronta-entrega fracionada para o Sul do país.",
  primaryCta: { label: "Solicitar orçamento", href: "#orcamento" },
  secondaryCta: { label: "Falar no WhatsApp", href: site.whatsapp.href },
  facts: [
    { label: "Fundação", value: "2007" },
    { label: "Extrusão balão", value: "própria" },
    { label: "Reciclagem PCR", value: "com triagem" },
    { label: "Pedido mínimo", value: "fracionado" },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Sobre                                                              */
/* ------------------------------------------------------------------ */

export const about = {
  eyebrow: "01",
  eyebrowLabel: "Quem somos",
  title: "Indústria de transformação, não distribuidor de terceiros.",
  paragraphs: [
    "A Plaswill foi fundada em 2007 em Panambi, no noroeste do Rio Grande do Sul — um dos polos metalmecânicos, agroindustriais e de implementos agrícolas mais expressivos do Sul do país.",
    "Diferente de distribuidores que apenas intermediam mercadoria de terceiros, extrudamos o próprio filme, calibramos a própria bobina e recuperamos a própria resina. Isso significa controle sobre três coisas que decidem o resultado na sua linha: a espessura que sai do cabeçote, a resistência da solda e o prazo de reposição.",
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
export type DrawingId = "stretch" | "bubble" | "silage" | "hospital" | "pcr";

export type Product = {
  id: string;
  code: string;
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
  {
    id: "filme-stretch",
    code: "FT-01",
    name: "Filme stretch de alta performance",
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
    id: "plastico-bolha",
    code: "FT-02",
    name: "Plástico bolha industrial com proteção UV",
    short: "Armazenagem externa e peças pintadas",
    benefit: "Protege o que fica no pátio: não resseca com o sol nem rasga com o vento.",
    specs: [
      { label: "Espessura", value: "até 120µ" },
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
    id: "sacaria-agricola",
    code: "FT-03",
    name: "Sacaria e linha agrícola",
    short: "Silagem, sementes, rações e fertilizantes",
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
    id: "linha-hospitalar",
    code: "FT-04",
    name: "Linha hospitalar e resíduos sanitários",
    short: "Descarte regulamentado de resíduo infectante",
    benefit: "Solda de fundo estanque que não rompe no manuseio nem no transporte interno.",
    specs: [
      { label: "Norma", value: "ABNT NBR 9191" },
      { label: "Exigências", value: "ANVISA" },
      { label: "Solda", value: "fundo estanque de alta resistência" },
      { label: "Acabamento", value: "leitosa e pigmentada" },
    ],
    applications: [
      "Resíduo infectante hospitalar",
      "Resíduo ambulatorial e químico",
      "Perfurocortantes acondicionados",
      "Redes de atendimento e laboratórios",
    ],
    drawing: "hospital",
  },
  {
    id: "pcr-reciclado",
    code: "FT-05",
    name: "Polietileno reciclado pós-consumo (PCR)",
    short: "Embalagem secundária com economia",
    benefit: "Reduz o custo da embalagem secundária sem abrir mão da resistência à tração.",
    specs: [
      { label: "Origem", value: "triagem por polímero" },
      { label: "Processo", value: "lavagem e micronização" },
      { label: "Blenda", value: "aditivação estabilizante" },
      { label: "Conformidade", value: "PNRS e diretrizes ESG" },
    ],
    applications: [
      "Embalagens secundárias",
      "Sacos de fardo industrial",
      "Filmes de proteção superficial",
      "Sacos de descarte",
    ],
    drawing: "pcr",
  },
];

/* ------------------------------------------------------------------ */
/* Diferenciais                                                       */
/* ------------------------------------------------------------------ */

export type Differential = {
  pain: string;
  market: string;
  plaswill: string;
};

export const differentials: Differential[] = [
  {
    pain: "Pedido mínimo abusivo",
    market: "Petroquímicas e grandes convertedores exigem de 3 a 5 toneladas por pedido.",
    plaswill:
      "Estoque à pronta-entrega a partir de 1 palete, com lotes fracionados ao longo do ano.",
  },
  {
    pain: "Prazo de faturamento",
    market: "De 25 a 45 dias para programar e faturar lotes customizados.",
    plaswill:
      "Faturamento ágil, com entregas emergenciais no noroeste gaúcho e nos polos do RS.",
  },
  {
    pain: "Micragem enganosa",
    market: "Vendem 18 micras cobrando por 25, e a bobina estoura na quina do palete.",
    plaswill:
      "Espessura calibrada real: 25 micras nominais entregam 25 micras constantes em toda a bobina.",
  },
  {
    pain: "Sustentabilidade de fachada",
    market: "Plástico reciclado sem triagem, que cheira mal, quebra e trava a máquina.",
    plaswill:
      "PCR com triagem por polímero e aditivação térmica, com desempenho mecânico de resina virgem.",
  },
  {
    pain: "Atendimento desumanizado",
    market: "Call center de capital distante, tratando a compra como número de pedido.",
    plaswill:
      "Visita ao chão de fábrica, amostra técnica gratuita e suporte direto por WhatsApp com o comercial.",
  },
];

/* ------------------------------------------------------------------ */
/* Estrutura e processo                                               */
/* ------------------------------------------------------------------ */

export type ProcessStep = { code: string; title: string; body: string };

export const structure = {
  eyebrow: "04",
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
/* Segmentos atendidos                                                */
/* ------------------------------------------------------------------ */

export type Segment = { code: string; name: string; body: string };

export const segments = {
  eyebrow: "05",
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
  eyebrow: "07",
  eyebrowLabel: "Perguntas frequentes",
  title: "As objeções que ouvimos toda semana.",
  items: [
    {
      question: "Plástico reciclado é fraco e vai arrebentar na esteira?",
      answer: [
        "A desconfiança faz sentido, porque muito reciclado informal no mercado é feito sem triagem e sem controle de densidade.",
        "Na Plaswill, a blenda PCR passa por triagem por polímero, aditivação térmica e controle de densidade. O resultado mecânico em estiramento e retenção é equivalente ao da resina virgem.",
        "Antes de qualquer pedido, enviamos amostra técnica gratuita para você rodar na sua própria linha.",
      ],
    },
    {
      question: "Já compro de um grande convertedor de São Paulo ou Porto Alegre.",
      answer: [
        "Convertedores distantes oferecem bom preço quando você fecha 5 toneladas e pode esperar 30 dias.",
        "O problema aparece quando a produção oscila ou surge uma demanda urgente: frete interestadual e lote mínimo travam o capital de giro.",
        "A Plaswill está em Panambi, ao lado da sua operação, com estoque de pronta-entrega e atendimento fracionado direto com o time técnico.",
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
        "Trabalhamos com estoque à pronta-entrega a partir de 1 palete e com lotes fracionados, sem exigir o mínimo de toneladas praticado por petroquímicas e grandes convertedores.",
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
  eyebrow: "08",
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
  productOptions: [
    "Filme stretch",
    "Plástico bolha",
    "Sacaria e linha agrícola",
    "Linha hospitalar",
    "Polietileno reciclado (PCR)",
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
  description:
    "Indústria de filmes stretch, plástico bolha, sacaria agrícola, linha hospitalar ABNT NBR 9191 e polietileno reciclado (PCR) em Panambi/RS. Micragem calibrada e pronta-entrega fracionada desde 2007.",
  // Ajuste para o domínio final antes de publicar.
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://plaswill.com.br",
  ogImage: "/images/og-plaswill.jpg",
} as const;
