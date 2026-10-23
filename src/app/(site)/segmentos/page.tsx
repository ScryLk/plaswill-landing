import type { Metadata } from "next";
import Link from "next/link";

import { Segments } from "@/components/Segments";

export const metadata: Metadata = {
  title: "Segmentos atendidos",
  description: "Conheça os setores e aplicações atendidos pelas soluções em embalagens plásticas da Plaswill.",
  alternates: { canonical: "/segmentos" },
};

export default function SegmentosPage() {
  return (
    <>
      <div className="wrap" style={{ paddingTop: "8rem" }}>
        <Link className="t-caption c-petrol" href="/">← Voltar ao início</Link>
        <h1 className="t-display" style={{ marginTop: "1.5rem" }}>Segmentos atendidos</h1>
        <p className="t-lead c-muted max-measure" style={{ marginTop: "1rem" }}>
          Descubra as principais áreas que utilizam as soluções em embalagens da Plaswill.
        </p>
      </div>
      <Segments />
      <div className="wrap" style={{ paddingBottom: "5rem" }}>
        <Link className="t-caption c-petrol" href="/#produtos">Conhecer nossos produtos →</Link>
      </div>
    </>
  );
}
