import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";

import { seo, site } from "@/content/site";

import "./globals.css";

/**
 * As três famílias do sistema, todas abertas e servidas pelo próprio projeto:
 * · voz         — serif de display para os títulos
 * · ferramenta  — grotesca industrial para interface e leitura
 * · micro-rótulo — mono para ficha técnica, código e numeração
 */
const sans = localFont({
  src: "./fonts/Archivo-Variable.woff2",
  variable: "--font-sans",
  display: "swap",
  weight: "100 900",
});

const display = localFont({
  src: "./fonts/SourceSerif4-Variable.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "200 900",
});

const mono = localFont({
  src: [
    {
      path: "./fonts/IBMPlexMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/IBMPlexMono-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
  title: {
    default: seo.title,
    template: `%s · ${site.name}`,
  },
  description: seo.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: site.name,
    title: seo.title,
    description: seo.description,
    images: [{ url: seo.ogImage, width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: [seo.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "Indústria de embalagens plásticas",
};

export const viewport: Viewport = {
  themeColor: "#edf1f3",
  colorScheme: "light",
};

/**
 * Layout raiz: só o documento — `<html>`, `<body>`, as fontes e os metadados
 * herdados por todo o domínio.
 *
 * A casca do site (navegação, `<main>` e rodapé) vive em `(site)/layout.tsx`,
 * porque a rota `/abertura` é uma página fechada em si mesma: tem a própria
 * navegação e não tem rodapé. O grupo de rotas `(site)` não aparece na URL —
 * a home continua em `/` e a política em `/politica-de-privacidade`.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // O script abaixo adiciona a classe `js` ao <html> antes da hidratação,
    // para a animação de entrada só esconder conteúdo quando há JavaScript.
    // O atributo é intencionalmente diferente do HTML do servidor — o aviso
    // de hidratação é silenciado só neste elemento, como manda o padrão do React
    // para scripts de tema/classe que rodam antes do hydrate.
    <html
      lang="pt-BR"
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Sem este marcador, a animação de entrada esconderia o conteúdo
            para quem navega com JavaScript desativado. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        {children}
      </body>
    </html>
  );
}
