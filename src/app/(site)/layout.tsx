import type { ReactNode } from "react";

import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { findBrandLogo } from "@/lib/brand";

/**
 * Casca do site institucional: navegação, conteúdo e rodapé.
 *
 * O grupo de rotas `(site)` não entra na URL — serve para dar a este conjunto
 * a casca completa, sem impô-la a rotas fechadas em si mesmas, como
 * `/abertura`, que tem navegação própria e nenhum rodapé.
 *
 * O logotipo oficial é detectado em tempo de build. Sem o arquivo, o site usa
 * a assinatura tipográfica provisória (nunca uma imitação da marca).
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  const logoSrc = findBrandLogo();

  return (
    <>
      <a className="skip-link t-caption" href="#conteudo">
        Ir para o conteúdo
      </a>
      <Nav logoSrc={logoSrc} />
      <main id="conteudo">{children}</main>
      <Footer logoSrc={logoSrc} />
    </>
  );
}
