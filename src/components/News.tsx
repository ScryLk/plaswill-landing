import { newsPosts } from "@/content/news";
import { news } from "@/content/site";

import { NewsCarousel } from "./NewsCarousel";
import { SectionHeader } from "./SectionHeader";

/**
 * "Nossa história em movimento" — o arquivo de notícias na home.
 *
 * Este bloco já foi contra o carrossel: a versão anterior recusava a ideia
 * porque rotação automática tira do leitor a decisão de quando avançar. O
 * problema era o autoplay, não o formato. Agora o carrossel é manual — nada
 * anda sozinho, o fim é o fim e a rolagem é do leitor (setas, swipe, trackpad
 * ou teclado) —, e a lista completa ganhou um lugar só, aqui, em vez de uma
 * página de arquivo separada que repetia os mesmos doze cartões.
 *
 * Duas coisas continuam valendo da versão anterior: a data visível em cada
 * cartão, porque é o que separa arquivo de publicidade, e a capa opcional —
 * um dos doze posts não tem imagem aproveitável, e o cartão resolve isso sem
 * buraco e sem foto de outro assunto no lugar.
 */
export function News() {
  return (
    <section className="section" id="noticias">
      <div className="wrap">
        <SectionHeader
          number={news.eyebrow}
          label={news.eyebrowLabel}
          title={news.title}
          lead={news.lead}
        />

        <NewsCarousel posts={newsPosts} />
      </div>
    </section>
  );
}
