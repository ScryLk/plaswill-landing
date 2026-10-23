import type { Metadata } from "next";
import Link from "next/link";

import { Faq } from "@/components/Faq";

export const metadata: Metadata = {
  title: "Perguntas frequentes",
  description: "Respostas às dúvidas frequentes sobre produtos, fornecimento, amostras e orçamentos da Plaswill.",
  alternates: { canonical: "/perguntas-frequentes" },
};

export default function PerguntasFrequentesPage() {
  return (
    <>
      <div className="wrap" style={{ paddingTop: "8rem" }}>
        <Link className="t-caption c-petrol" href="/">← Voltar ao início</Link>
        <h1 className="t-display" style={{ marginTop: "1.5rem" }}>Perguntas frequentes</h1>
        <p className="t-lead c-muted max-measure" style={{ marginTop: "1rem" }}>
          Informações sobre fornecimento, produtos e o atendimento comercial.
        </p>
      </div>
      <Faq />
      <div className="wrap" style={{ paddingBottom: "5rem" }}>
        <Link className="t-caption c-petrol" href="/#orcamento">Falar com o comercial →</Link>
      </div>
    </>
  );
}
