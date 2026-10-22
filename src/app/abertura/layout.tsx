import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./abertura.css";

/**
 * Casca de `/abertura` — hoje apenas a revisão isolada da primeira tela.
 *
 * Desde 21/10 a abertura é a home (`src/app/page.tsx`), que importa esta mesma
 * folha. A rota continua no ar para revisar a abertura sozinha, sem o corpo
 * comercial abaixo, e por isso segue `noindex`.
 *
 * O `preflight` do Tailwind está desligado em `tailwind.config.ts`: enquanto a
 * folha era exclusiva desta rota, o reset dele não incomodava; ao chegar à
 * home, ele alcançaria as seções da landing. Nesta rota, o reset que vale é o
 * de `globals.css`, o mesmo do site inteiro.
 *
 * O canônico aponta para `/`, e não para si mesma: o conteúdo é o mesmo da
 * primeira tela da home, e uma URL secundária não deve reivindicar o conteúdo.
 */
export const metadata: Metadata = {
  title: "Abertura — revisão",
  description:
    "Revisão isolada da abertura de tela cheia da Plaswill. Esta rota não é indexada.",
  alternates: { canonical: "/" },
  openGraph: {
    url: "/abertura",
    title: "Abertura — revisão",
    description:
      "Revisão isolada da abertura de tela cheia da Plaswill. Esta rota não é indexada.",
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f8fafc",
  colorScheme: "light",
};

export default function AberturaLayout({ children }: { children: ReactNode }) {
  return children;
}
