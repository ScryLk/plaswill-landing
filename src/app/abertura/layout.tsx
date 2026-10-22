import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./abertura.css";

/**
 * Casca da abertura. Ela é importada aqui — e não no layout raiz — justamente
 * para o Tailwind e o preflight ficarem presos a esta rota: a landing aprovada
 * continua no sistema de tokens de `globals.css`.
 *
 * `robots: noindex` enquanto a página for um estudo: ela não é linkada de
 * lugar nenhum e não deve competir com a home nos mecanismos de busca. Quando
 * a abertura virar a página inicial, é este bloco que muda.
 */
export const metadata: Metadata = {
  title: "Abertura",
  description:
    "Estudo de abertura de tela cheia para a Plaswill — página em avaliação, ainda não publicada.",
  alternates: { canonical: "/abertura" },
  openGraph: {
    url: "/abertura",
    title: "Abertura",
    description:
      "Estudo de abertura de tela cheia para a Plaswill — página em avaliação, ainda não publicada.",
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
