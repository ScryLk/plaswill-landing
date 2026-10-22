import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Differentials } from "@/components/Differentials";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Products } from "@/components/Products";
import { Segments } from "@/components/Segments";
import { Structure } from "@/components/Structure";
import { AberturaContato } from "@/components/abertura/AberturaContato";
import { AberturaHero } from "@/components/abertura/AberturaHero";
import { AberturaNav } from "@/components/abertura/AberturaNav";
import {
  findAerialPhoto,
  findBrandLogo,
  findBrandSymbol,
  findFacadePhoto,
} from "@/lib/brand";
import { structuredData } from "@/lib/structured-data";

// A folha da abertura vale para a home inteira. Ela entra com `preflight`
// desligado (ver `tailwind.config.ts`), então as seções da landing continuam
// vivendo do reset escrito à mão em `globals.css` — nenhuma regra das duas
// folhas se cruza: as 46 classes da abertura e as 167 da landing têm zero
// nomes em comum.
import "./abertura/abertura.css";

/**
 * Home — a abertura cinematográfica seguida do corpo comercial aprovado.
 *
 * **Por que esta rota existe fora de `(site)`.** O grupo `(site)` aplica uma
 * casca fixa (a navbar da landing, o `<main>` e o rodapé) a tudo o que está
 * dentro dele. A abertura tem navegação própria — a pílula de vidro com os
 * quatro estados —, então a home não pode herdar aquela casca: ela monta a
 * própria navegação, o próprio `<main>` e o rodapé. `/politica-de-privacidade`
 * e `/institucional` continuam no grupo, com a casca antiga.
 *
 * **O que mudou em 21/10.** A abertura era uma rota fechada (`/abertura`) e a
 * home era a landing inteira. Agora a abertura é a primeira tela da home e a
 * landing anterior fica em `/institucional`, com `noindex`, como referência e
 * caminho de volta. `/abertura` continua no ar pelo mesmo motivo, também com
 * `noindex`, para revisão do estado isolado.
 *
 * **Três blocos da landing não entraram**, e cada um por um motivo:
 * · `Hero` — repetiria o título e a foto que a abertura já apresenta;
 * · `Clients` — os quinze nomes já correm na faixa dentro da abertura;
 * · `StickyCta` — existia porque a landing antiga não tinha CTA fixo; agora a
 *   pílula da abertura fica na tela em todos os estados de rolagem.
 *
 * Os ícones de marca são resolvidos em tempo de build (`src/lib/brand.ts`).
 * Sem um arquivo em `public/brand/` ou `public/photos/`, o espaço correspondente
 * simplesmente não é desenhado — nunca é preenchido com um desenho genérico.
 */
export default function HomePage() {
  const logoSrc = findBrandLogo();
  const symbolSrc = findBrandSymbol();
  const photoSrc = findAerialPhoto();
  const facadeSrc = findFacadePhoto();

  return (
    <>
      <script
        type="application/ld+json"
        // O conteúdo vem de um objeto tipado do próprio projeto, sem entrada de usuário.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
      />

      <a className="skip-link t-caption" href="#conteudo">
        Ir para o conteúdo
      </a>

      <AberturaNav logoSrc={logoSrc} symbolSrc={symbolSrc} />

      <main id="conteudo">
        <AberturaHero photoSrc={photoSrc} facadeSrc={facadeSrc} />

        {/* Faixa de conversão. Ela é branca sobre o `--bg` (#edf1f3) da página:
            a troca de tom, mais o fio no topo da faixa, é o que separa a
            abertura do corpo comercial — por isso não há `<hr>` aqui. */}
        <AberturaContato />

        <Products />
        <hr className="rule" />
        <About />
        <hr className="rule" />
        <Differentials />
        <hr className="rule" />
        <Structure />
        <hr className="rule" />
        <Segments />
        <hr className="rule" />
        <Faq />
        <Contact />
      </main>

      <Footer logoSrc={logoSrc} />
    </>
  );
}
