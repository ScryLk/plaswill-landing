import type { Metadata } from "next";

import { About } from "@/components/About";
import { Clients } from "@/components/Clients";
import { Contact } from "@/components/Contact";
import { Differentials } from "@/components/Differentials";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { Products } from "@/components/Products";
import { Segments } from "@/components/Segments";
import { StickyCta } from "@/components/StickyCta";
import { Structure } from "@/components/Structure";
import { structuredData } from "@/lib/structured-data";

/**
 * Landing anterior, preservada como referência.
 *
 * Até 21/10 esta era a home. Quando a abertura passou a abrir o site, o corpo
 * comercial inteiro continuou aqui, com o `Hero` de então e o `StickyCta`, para
 * servir de comparação lado a lado com a home nova e de caminho de volta caso
 * a composição nova precise ser desfeita — a página está inteira, só saiu da
 * raiz. Por isso ela é `noindex`: o conteúdo é o mesmo da home, e duas URLs
 * indexadas com o mesmo texto só dividem autoridade.
 */
export const metadata: Metadata = {
  title: "Versão institucional",
  description:
    "Versão anterior da home, mantida para comparação interna e rollback. Não é indexada.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/institucional" },
};

export default function InstitucionalPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // O conteúdo vem de um objeto tipado do próprio projeto, sem entrada de usuário.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
      />
      <Hero />
      <hr className="rule" />
      <About />
      <hr className="rule" />
      <Products />
      <hr className="rule" />
      <Differentials />
      <hr className="rule" />
      <Structure />
      <hr className="rule" />
      <Segments />
      <hr className="rule" />
      <Clients />
      <hr className="rule" />
      <Faq />
      <Contact />
      <StickyCta />
    </>
  );
}
