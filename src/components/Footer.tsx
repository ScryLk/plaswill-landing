import Link from "next/link";

import { nav, site } from "@/content/site";

import { Wordmark } from "./Wordmark";

export function Footer({ logoSrc }: { logoSrc?: string | null }) {
  const year = new Date().getFullYear();

  return (
    <footer className="band-slate site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="stack-sm">
            <Wordmark tone="onDark" src={logoSrc} />
            <p className="t-caption c-muted footer-tagline">{site.tagline}</p>
            <p className="t-caption c-muted">
              Indústria própria em {site.address.city}/{site.address.state} desde {site.foundedYear}.
            </p>
          </div>

          <div className="stack-sm">
            <p className="t-eyebrow c-muted">Fábrica e escritório</p>
            <address className="t-caption footer-address">
              {site.legalName}
              <br />
              {site.address.street} · {site.address.district}
              <br />
              {site.address.city}/{site.address.state} · CEP {site.address.postalCode}
              <br />
              CNPJ {site.cnpj}
            </address>
          </div>

          <div className="stack-sm">
            <p className="t-eyebrow c-muted">Comercial</p>
            <ul className="stack-sm">
              <li>
                <a
                  className="t-caption footer-link"
                  href={site.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp {site.whatsapp.label}
                </a>
              </li>
              <li>
                <a className="t-caption footer-link" href={site.phone.href}>
                  {site.phone.label}
                </a>
              </li>
              <li>
                <a className="t-caption footer-link" href={`mailto:${site.emails.commercial}`}>
                  {site.emails.commercial}
                </a>
              </li>
              <li>
                <a className="t-caption footer-link" href={`mailto:${site.emails.general}`}>
                  {site.emails.general}
                </a>
              </li>
            </ul>
          </div>

          <div className="stack-sm">
            <p className="t-eyebrow c-muted">Navegação</p>
            <ul className="stack-sm">
              {nav.map((item) => (
                <li key={item.id}>
                  <a className="t-caption footer-link" href={item.href}>
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <Link className="t-caption footer-link" href="/perguntas-frequentes">
                  Perguntas frequentes
                </Link>
              </li>
              <li>
                <Link className="t-caption footer-link" href="/politica-de-privacidade">
                  Política de privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-base">
          <p className="t-caption c-muted">
            © {year} {site.legalName}. Todos os direitos reservados.
          </p>
          <p className="t-caption c-muted footer-credit">
            Micragem nominal verificada em bobina · ABNT NBR 9191 na linha hospitalar
          </p>
        </div>
      </div>
    </footer>
  );
}
