/**
 * Arquivo de notícias, migrado do site institucional.
 *
 * São os doze posts que estavam publicados em plaswill.com.br. O texto é o mesmo
 * que está no ar, sem reescrita: mudar a redação de uma notícia antiga seria
 * reescrever o que a empresa publicou. O que foi ajustado está anotado em `note`,
 * e são só duas coisas — a caixa alta de um título e uma palavra faltando em
 * outro, ambas falhas de digitação e não de conteúdo.
 *
 * **As datas são as de publicação no WordPress.** Nenhuma foi arredondada para
 * parecer recente, e a lista está em ordem decrescente de data. Um arquivo que
 * finge que tudo é novo perde a única coisa que uma seção de notícias prova:
 * que a empresa continua existindo há tempo.
 *
 * **Fotos internas dos posts não vieram.** Cada notícia tinha de três a cinco
 * imagens no corpo, quase sempre o mesmo evento da capa. Migrar todas somaria
 * dezenas de arquivos grandes para repetir a mesma informação que a capa já dá.
 * Os originais continuam no WordPress e podem entrar numa segunda passada.
 *
 * **A capa é a imagem destacada do WordPress**, com uma exceção registrada em
 * `note`: o post sobre saúde mental usa como destaque uma foto dos 19 anos, que
 * não tem relação com o assunto. Ali a capa foi omitida de propósito.
 */

export type NewsCover = {
  src: string;
  alt: string;
  /** Dimensões do arquivo servido. Necessárias para o `next/image` não pular. */
  width: number;
  height: number;
};

export type NewsPost = {
  slug: string;
  title: string;
  /** Data real de publicação, AAAA-MM-DD. */
  date: string;
  /** URL de origem, no WordPress. Base do mapa de redirecionamentos. */
  sourceUrl: string;
  paragraphs: string[];
  cover: NewsCover | null;
  /** O que foi ajustado ou está pendente neste post. */
  note?: string;
};

export const newsPosts: NewsPost[] = [
  {
    slug: "festa-junina-24-06",
    title: "Festa Junina 24/06",
    date: "2026-07-03",
    sourceUrl: "https://plaswill.com.br/festa-junina-24-06/",
    paragraphs: [
      "Na tarde do dia 24, quarta-feira, a Plaswill reuniu os funcionários para uma confraternização de festa junina.",
      "Foi um momento de descontração em que todos participaram das brincadeiras propostas e dos comes e bebes juninos.",
      "Alguns colaboradores entraram no clima e também se vestiram com roupas típicas da celebração, interagindo com a decoração arranjada.",
      "A festa foi realizada com o objetivo principal de incentivar a interação entre os colaboradores e de permitir uma mudança descontraída na rotina de trabalho."
    ],
    cover: {
      src: "/images/noticias/festa-junina-24-06.avif",
      alt: "Colaboradores reunidos no salão da fábrica durante a confraternização junina, sob bandeirinhas coloridas.",
      width: 640,
      height: 436
    },
    note: "A capa saiu do GIF publicado no post (primeiro quadro), porque não há imagem destacada. É a única capa do acervo em resolução menor (640 px)."
  },
  {
    slug: "07-de-marco-plaswill-celebra-19-anos-de-historia-crescimento-e-transformacao",
    title: "07 de Março: Plaswill celebra 19 anos de história, crescimento e transformação",
    date: "2026-06-01",
    sourceUrl: "https://plaswill.com.br/07-de-marco-plaswill-celebra-19-anos-de-historia-crescimento-e-transformacao/",
    paragraphs: [
      "No dia 07 de março, a Plaswill celebra 19 anos de uma trajetória construída com dedicação, inovação e compromisso com a excelência. São quase duas décadas de crescimento, conquistas e evolução constante, sempre guiadas pelo propósito de fazer a diferença na vida de clientes, colaboradores e parceiros.",
      "Ao longo dessa caminhada, a empresa consolidou sua presença no mercado por meio da qualidade de seus produtos e serviços, do atendimento responsável e da busca permanente por melhorias. Cada passo dado até aqui foi possível graças ao empenho de uma equipe comprometida, que diariamente contribui para o desenvolvimento e o fortalecimento da Plaswill.",
      "Celebrar 19 anos é reconhecer a importância de cada colaborador que fez e faz parte dessa história, de cada cliente que depositou sua confiança em nosso trabalho e de cada parceiro que caminhou ao nosso lado. Juntos, construímos uma empresa sólida, preparada para os desafios do presente e para as oportunidades do futuro.",
      "Mais do que crescer, a Plaswill busca evoluir continuamente, investindo em pessoas, tecnologia e inovação para oferecer sempre o melhor. Este aniversário representa não apenas a celebração de uma história de sucesso, mas também a renovação do compromisso com a qualidade, o desenvolvimento e a excelência.",
      "Parabéns à Plaswill pelos seus 19 anos! Que esta data especial marque o início de um novo ciclo de conquistas, crescimento e transformação."
    ],
    cover: {
      src: "/images/noticias/07-de-marco-plaswill-celebra-19-anos-de-historia-crescimento-e-transformacao.avif",
      alt: "Colaboradores posando em frente a um painel com bexigas e o número 19.",
      width: 960,
      height: 1280
    }
  },
  {
    slug: "dia-internacional-das-mulheres-na-plaswill",
    title: "Dia Internacional das Mulheres na Plaswill",
    date: "2026-04-28",
    sourceUrl: "https://plaswill.com.br/dia-internacional-das-mulheres-na-plaswill/",
    paragraphs: [
      "No Dia Internacional da Mulher, a Plaswill promoveu um jantar especial de confraternização, reunindo suas colaboradoras em um momento de celebração, reconhecimento e integração. A ocasião foi marcada não apenas pela valorização das mulheres que fazem parte da empresa, mas também por uma iniciativa simbólica e significativa: o lançamento da Cápsula do Tempo.",
      "Durante o evento, cada participante foi convidada a escrever um bilhete descrevendo seus sonhos, metas e objetivos pessoais e profissionais, com perspectivas para os próximos 5 anos.",
      "A proposta teve como objetivo incentivar a reflexão sobre o futuro, o crescimento individual e a construção de novas conquistas ao longo do tempo.",
      "Após esse momento de reflexão, todos os bilhetes foram cuidadosamente guardados na cápsula, que foi instalada em frente à empresa como um marco desse encontro especial.",
      "A abertura da Cápsula do Tempo está prevista para o Dia Internacional da Mulher de 2031, quando será possível revisitar esses sonhos e celebrar as jornadas, conquistas e transformações vividas ao longo dos anos.",
      "Mais do que um registro, a iniciativa representa o compromisso da Plaswill com o desenvolvimento, a valorização e o protagonismo das mulheres dentro e fora do ambiente de trabalho."
    ],
    cover: {
      src: "/images/noticias/dia-internacional-das-mulheres-na-plaswill.avif",
      alt: "Colaboradoras reunidas à mesa durante o jantar de confraternização.",
      width: 1079,
      height: 1373
    },
    note: "O título estava todo em caixa alta no WordPress; normalizado para a tipografia da página."
  },
  {
    slug: "saude-mental-ansiedade-e-depressao",
    title: "Saúde Mental: Ansiedade e Depressão",
    date: "2026-04-06",
    sourceUrl: "https://plaswill.com.br/saude-mental-ansiedade-e-depressao/",
    paragraphs: [
      "Alusivo aos 19 anos da empresa tivemos algumas atividades, dentre elas, uma palestra – Saúde mental: ansiedade e depressão, ministrada pela psicóloga Patrícia Chieza Montagner da Medic’s de Panambi."
    ],
    cover: null,
    note: "Sem capa: a imagem destacada no WordPress para este post é uma foto da comemoração dos 19 anos, que não corresponde ao tema. Publicar capa de outro assunto seria pior que não ter capa. Pendente: escolher a imagem correta no WordPress."
  },
  {
    slug: "viagem-de-confraternizacao-06-09-25encantado-cristo-protetor",
    title: "Viagem de confraternização 06/09/25 — Encantado, Cristo Protetor",
    date: "2025-09-25",
    sourceUrl: "https://plaswill.com.br/viagem-de-confraternizacao-06-09-25encantado-cristo-protetor/",
    paragraphs: [
      "No dia 06 de setembro de 2025 a Plaswill realizou uma viagem de confraternização juntamente com os familiares dos colaboradores, para conhecer o Cristo Protetor na cidade de Encantado. Gratidão a todos!"
    ],
    cover: {
      src: "/images/noticias/viagem-de-confraternizacao-06-09-25encantado-cristo-protetor.avif",
      alt: "Grupo de colaboradores e familiares posando ao ar livre, em meio à vegetação.",
      width: 1400,
      height: 1050
    },
    note: "O título publicado tem uma falha de digitação (falta espaço antes de “Encantado”); corrigido aqui, sem mexer no original."
  },
  {
    slug: "evento-de-dia-das-criancas-plaswill",
    title: "Evento de dia das Crianças Plaswill",
    date: "2024-10-25",
    sourceUrl: "https://plaswill.com.br/evento-de-dia-das-criancas-plaswill/",
    paragraphs: [
      "No dia 23 de setembro, a Plaswill realizou um evento especial para o Dia das Crianças, trazendo alegria e conscientização para os pequenos. As crianças tiveram a oportunidade de conhecer de perto a fábrica, explorar os maquinários e entender os processos de produção de embalagens plásticas. Durante a visita, também aprenderam sobre ética e ecologia, ressaltando a importância do cuidado com o meio ambiente.",
      "A programação incluiu muita diversão, com direito a comida típica de festa infantil, como doces e salgadinhos, além de um animado pula-pula e sorvetes para refrescar a tarde. Para encerrar, cada criança recebeu uma muda de árvore, reforçando o compromisso da Plaswill com um futuro mais verde. Foi um dia de aprendizado, alegria e celebração do cuidado com o planeta!"
    ],
    cover: {
      src: "/images/noticias/evento-de-dia-das-criancas-plaswill.avif",
      alt: "Faixa da Plaswill presa a um gradil, com o prédio da fábrica ao fundo.",
      width: 1400,
      height: 933
    }
  },
  {
    slug: "compromisso-com-a-sustentabilidade-e-inovacao-no-setor-de-embalagens",
    title: "Compromisso com a Sustentabilidade e Inovação no Setor de Embalagens",
    date: "2024-09-23",
    sourceUrl: "https://plaswill.com.br/compromisso-com-a-sustentabilidade-e-inovacao-no-setor-de-embalagens/",
    paragraphs: [
      "Desde 2007, a Plaswill Embalagens, localizada em Panambi/RS, destaca-se no mercado oferecendo soluções personalizadas para diversos setores da economia, incluindo indústria, agricultura, pecuária, comércio e prestação de serviços. A empresa se consolidou como referência em qualidade e eficiência, atendendo às demandas específicas de cada cliente com produtos feitos sob medida.",
      "Sustentabilidade como Pilar Central",
      "Um dos diferenciais da Plaswill é o seu compromisso com a sustentabilidade, promovendo práticas que beneficiam a economia, a sociedade e o meio ambiente. A empresa utiliza tanto polietileno virgem quanto reciclado, garantindo que cada solução seja adaptada conforme a necessidade do cliente, sem abrir mão da responsabilidade ambiental.",
      "A Plaswill investe fortemente na reciclagem de materiais, incorporando a sucata de plásticos ao processo de fabricação de seus sacos plásticos. Ao fazer isso, a empresa não só contribui para a redução do impacto ambiental, mas também dá uma nova vida a materiais que seriam descartados, transformando-os em matéria-prima de qualidade. Essa sucata é recebida em diversas cores e, ao final do processo, resulta em um produto mesclado que passa por uma pigmentação final para garantir um acabamento homogêneo.",
      "Inovação e Qualidade",
      "A missão da Plaswill vai além da sustentabilidade. A empresa busca oferecer soluções com excelente custo-benefício, unindo inovação e eficiência no desenvolvimento de embalagens que atendam às mais altas exigências do mercado. Isso torna a Plaswill uma parceira estratégica para empresas que buscam não apenas embalagens, mas soluções que contribuam para o sucesso de seus negócios.",
      "A Plaswill Embalagens segue comprometida com a conservação ambiental, ao mesmo tempo em que entrega produtos de qualidade e acessíveis, oferecendo aos clientes a melhor relação entre custo e benefício."
    ],
    cover: {
      src: "/images/noticias/compromisso-com-a-sustentabilidade-e-inovacao-no-setor-de-embalagens.avif",
      alt: "Vista externa do prédio industrial da Plaswill.",
      width: 1400,
      height: 1050
    }
  },
  {
    slug: "protecao-extra-e-durabilidade-conheca-o-novo-plastico-bolha-com-protecao-uv",
    title: "Proteção Extra e Durabilidade: Conheça o Novo Plástico Bolha com Proteção UV",
    date: "2024-08-26",
    sourceUrl: "https://plaswill.com.br/protecao-extra-e-durabilidade-conheca-o-novo-plastico-bolha-com-protecao-uv/",
    paragraphs: [
      "Em um mercado onde a segurança dos produtos durante o transporte é crucial, encontrar soluções de embalagens que garantam proteção máxima é essencial. Apresentamos o nosso mais novo produto: um plástico bolha mais grosso e resistente, agora com proteção UV.",
      "Por que escolher nosso plástico bolha?",
      "Proteção Superior: Com camadas reforçadas, nosso plástico bolha oferece uma proteção extra contra impactos, garantindo que seus produtos cheguem ao destino final em perfeito estado.",
      "Resistência ao Tempo: Além de ser mais grosso, nosso plástico bolha foi desenvolvido para resistir às condições mais extremas. Ele não se rompe facilmente, proporcionando uma camada de proteção duradoura.",
      "Proteção UV Integrada: Uma das maiores inovações desse produto é a proteção contra raios ultravioleta (UV). Isso significa que seus produtos estão protegidos não apenas contra impactos, mas também contra os danos causados pela exposição ao sol, como desbotamento ou degradação de materiais sensíveis à luz.",
      "Versatilidade: Ideal para embalar uma ampla gama de produtos, desde eletrônicos sensíveis até móveis e objetos de arte. Com o nosso plástico bolha, você garante a segurança dos seus produtos, independentemente do tamanho ou da fragilidade.",
      "Aplicações e Benefícios",
      "Este novo plástico bolha é perfeito para empresas que desejam elevar o padrão de suas embalagens, oferecendo uma proteção completa e de qualidade. Se você trabalha com produtos sensíveis à luz ou que requerem um cuidado extra durante o transporte, esta é a solução ideal.",
      "Conclusão",
      "Investir em embalagens de qualidade não é apenas uma questão de proteção, mas também de profissionalismo e cuidado com o cliente. Com nosso novo plástico bolha mais grosso, resistente e com proteção UV, você está garantindo que seus produtos cheguem ao destino com a máxima segurança, independentemente das condições externas. Experimente a diferença e leve a proteção dos seus produtos para o próximo nível."
    ],
    cover: {
      src: "/images/noticias/protecao-extra-e-durabilidade-conheca-o-novo-plastico-bolha-com-protecao-uv.avif",
      alt: "Rolos de filme plástico escuro armazenados em prateleira na produção.",
      width: 960,
      height: 1280
    }
  },
  {
    slug: "parceria-com-avocap-fortalecimento-do-compromisso-social-atraves-de-doacoes-mensais",
    title: "Parceria com AVOCAP: Fortalecimento do Compromisso Social através de Doações Mensais",
    date: "2024-06-18",
    sourceUrl: "https://plaswill.com.br/parceria-com-avocap-fortalecimento-do-compromisso-social-atraves-de-doacoes-mensais/",
    paragraphs: [
      "Temos o orgulho de anunciar nossa aliança estratégica com a Associação de Voluntários Casa de Passagem (AVOCAP). Em linha com nosso compromisso inabalável com a responsabilidade social corporativa, nossa empresa agora contribui mensalmente com produtos essenciais para apoiar essa causa crucial.",
      "📦 Doações Mensais Nossa iniciativa inclui a doação regular de produtos que são vitais para a organização e armazenamento de itens essenciais na AVOCAP. Estas doações são parte de nossos esforços contínuos para apoiar a infraestrutura operacional da associação, garantindo que eles possam atender às suas necessidades diárias de maneira eficaz.",
      "💙 Compromisso Social Estamos firmemente convencidos do impacto positivo que a solidariedade pode ter em nossa comunidade. Esta parceria com a AVOCAP é uma expressão clara de nosso compromisso em contribuir para o bem-estar social, ajudando aqueles que estão em situação de vulnerabilidade.",
      "🌟 Apoio à AVOCAP A AVOCAP desempenha um papel fundamental ao oferecer acolhimento e assistência a pessoas em situações de vulnerabilidade. Estamos honrados em apoiar os dedicados voluntários da associação, contribuindo significativamente para a continuidade e a eficácia de suas operações.",
      "Queremos expressar nossa profunda gratidão à AVOCAP por esta parceria valiosa e pela oportunidade de colaborar em um projeto tão significativo. Juntos, estamos trabalhando para construir um futuro mais solidário e equitativo para todos.",
      "Acompanhe nosso blog para mais informações sobre nossas iniciativas de responsabilidade social e veja como estamos comprometidos em fazer a diferença em nossa comunidade."
    ],
    cover: {
      src: "/images/noticias/parceria-com-avocap-fortalecimento-do-compromisso-social-atraves-de-doacoes-mensais.avif",
      alt: "Arte da campanha “Parceria de Sucesso”, com duas pessoas segurando uma embalagem azul da Plaswill.",
      width: 1080,
      height: 1350
    }
  },
  {
    slug: "uma-parceria-sustentavel-na-industria-de-embalagens-plasticas",
    title: "Uma parceria sustentável na indústria de embalagens plásticas",
    date: "2024-04-24",
    sourceUrl: "https://plaswill.com.br/uma-parceria-sustentavel-na-industria-de-embalagens-plasticas/",
    paragraphs: [
      "Na busca por soluções ambientalmente responsáveis, a indústria de embalagens plásticas tem encontrado na parceria entre empresas como a Plaswill Embalagens e a Juntapel uma via promissora. A Juntapel destaca-se como uma empresa comprometida com a utilização de recursos naturais renováveis e a promoção da economia circular, fornecendo matéria-prima de qualidade à Plaswill Embalagens para a produção de diversos produtos plásticos.",
      "A Juntapel é reconhecida pelo seu compromisso com a sustentabilidade ambiental. A empresa opera com a utilização de recursos naturais renováveis, priorizando fontes sustentáveis em sua cadeia de suprimentos. Ao investir em tecnologias e processos que minimizam o impacto ambiental, a Juntapel reforça seu compromisso com a preservação dos ecossistemas e a mitigação das mudanças climáticas.",
      "A parceria entre a Juntapel e a Plaswill Embalagens é um exemplo de cooperação estratégica na indústria de embalagens plásticas. Enquanto a Juntapel fornece matéria-prima proveniente de fontes renováveis, a Plaswill Embalagens realiza o processo de reciclagem e utiliza o plástico reciclado na fabricação de seus produtos. Essa sinergia permite que ambas as empresas contribuam para a redução do consumo de recursos não renováveis e a minimização do descarte inadequado de resíduos plásticos.",
      "A parceria entre a Juntapel e a Plaswill Embalagens traz benefícios significativos tanto para o meio ambiente quanto para o mercado. Ao utilizar plástico proveniente de fontes renováveis e reciclado, as empresas reduzem sua dependência de recursos fósseis e contribuem para a diminuição da pegada de carbono associada à produção de embalagens plásticas. Além disso, a utilização de matéria-prima reciclada possibilita a redução de custos de produção, tornando os produtos finais mais competitivos no mercado.",
      "A parceria entre a Juntapel e a Plaswill Embalagens exemplifica o potencial de colaboração entre empresas comprometidas com a sustentabilidade e a inovação. Ao unir esforços na utilização de recursos naturais renováveis e na promoção da economia circular, essas empresas demonstram que é possível conciliar o desenvolvimento econômico com a preservação ambiental. Com uma visão voltada para o futuro, a Juntapel e a Plaswill Embalagens reafirmam seu papel como agentes de transformação na indústria de embalagens plásticas, inspirando outras organizações a seguirem o mesmo caminho rumo a um futuro mais sustentável."
    ],
    cover: {
      src: "/images/noticias/uma-parceria-sustentavel-na-industria-de-embalagens-plasticas.avif",
      alt: "Caminhão verde no pátio de carga da fábrica.",
      width: 1050,
      height: 1400
    }
  },
  {
    slug: "projeto-tampa-e-lacre-contribuindo-para-um-futuro-sustentavel",
    title: "Projeto “Tampa e Lacre”: Contribuindo para um Futuro Sustentável",
    date: "2024-02-14",
    sourceUrl: "https://plaswill.com.br/projeto-tampa-e-lacre-contribuindo-para-um-futuro-sustentavel/",
    paragraphs: [
      "A Plaswill está comprometida com a preservação do meio ambiente e com a adoção de práticas sustentáveis em todas as etapas de sua produção. Recentemente, encerramos com sucesso o projeto “Tampa e Lacre”, uma campanha que visava arrecadar tampas e lacres plásticos para reciclagem e reutilização como matéria-prima em nossos produtos.",
      "A ideia por trás do projeto era simples, mas extremamente impactante. Incentivamos nossos clientes, colaboradores e a comunidade em geral a coletar tampas e lacres plásticos e entregá-los em nossas instalações. Esses materiais foram então separados, triturados e processados para se tornarem matéria-prima reciclada, que será utilizada na fabricação de novos produtos plásticos.",
      "Empresas locais, como a Fênix e a ONG Amar Panambi, também participaram ativamente dessa campanha, ampliando o alcance e o impacto do projeto na comunidade.",
      "Apesar de a campanha ter chegado ao fim, seus resultados foram significativos. Além de promover a reciclagem e reduzir o impacto ambiental causado pelo descarte inadequado de plásticos, o projeto “Tampa e Lacre” também ajudou a conscientizar as pessoas sobre a importância da sustentabilidade e do consumo responsável.",
      "A Plaswill agradece a todos que participaram dessa iniciativa e reafirma seu compromisso contínuo com práticas sustentáveis e a preservação do meio ambiente. Juntos, podemos construir um futuro mais limpo e sustentável para todos!"
    ],
    cover: {
      src: "/images/noticias/projeto-tampa-e-lacre-contribuindo-para-um-futuro-sustentavel.avif",
      alt: "Colaboradoras sentadas no chão separando tampinhas plásticas em sacos.",
      width: 1400,
      height: 1050
    }
  },
  {
    slug: "inovacao-em-plasticos-desde-2007",
    title: "Inovação em Plásticos desde 2007",
    date: "2024-02-14",
    sourceUrl: "https://plaswill.com.br/inovacao-em-plasticos-desde-2007/",
    paragraphs: [
      "Há mais de uma década, a Plaswill tem sido uma referência em soluções de plástico para uma ampla variedade de setores. Desde indústrias até hotéis, hospitais e escolas, nossos produtos estão presentes em diversos locais, contribuindo para a praticidade e eficiência em diferentes ambientes.",
      "Nosso compromisso com a qualidade e a inovação nos permitiu estabelecer uma posição de destaque no mercado, oferecendo produtos que atendem às necessidades específicas de nossos clientes.",
      "Quer saber mais sobre como nossos produtos são fabricados? Então não perca tempo e assista ao nosso vídeo! Nele, você terá a oportunidade de conhecer mais de perto os processos de fabricação que garantem a excelência e a durabilidade de nossos produtos.",
      "Localizada em Panambi no Rio Grande do Sul, atendemos a todo o estado, proporcionando soluções em plástico que agregam valor aos nossos clientes. Acompanhe nossas redes sociais para ficar por dentro das últimas novidades e promoções. Estamos ansiosos para atendê-lo e ajudá-lo a encontrar a solução perfeita para suas necessidades!"
    ],
    cover: {
      src: "/images/noticias/inovacao-em-plasticos-desde-2007.avif",
      alt: "Fachada da indústria Plaswill, com o letreiro da marca sobre a parede.",
      width: 1400,
      height: 583
    }
  }
];

/**
 * Os três posts mais recentes — os que aparecem na home.
 *
 * A lista já está em ordem decrescente de data, então basta cortar. Não há
 * curadoria manual aqui de propósito: destaque escolhido a dedo vira destaque
 * desatualizado assim que alguém esquece de trocar.
 */
export const featuredNews = newsPosts.slice(0, 3);

/** Data por extenso, em português, sem depender do locale do servidor. */
export function formatNewsDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  const months = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
  ];
  return `${Number(day)} de ${months[Number(month) - 1]} de ${year}`;
}
