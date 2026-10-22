import { quoteForm, site } from "@/content/site";

import { PillButton } from "./PillButton";
import { QuoteForm } from "./QuoteForm";

const channels = [
  { label: "WhatsApp comercial", value: site.whatsapp.label, href: site.whatsapp.href },
  { label: "Telefone", value: site.phone.label, href: site.phone.href },
  { label: "E-mail comercial", value: site.emails.commercial, href: `mailto:${site.emails.commercial}` },
  { label: "E-mail geral", value: site.emails.general, href: `mailto:${site.emails.general}` },
];

/**
 * Faixa de conversão em azul petróleo — o fundo escuro onde o amarelo
 * institucional pode aparecer (6,63:1 sobre o petróleo, contra 1,18:1 sobre
 * o fundo claro). É a única faixa da página onde o amarelo carrega texto.
 */
export function Contact() {
  return (
    <section className="section band" id="orcamento">
      <div className="wrap contact-grid">
        <div className="stack">
          <div className="eyebrow-row">
            <span className="t-eyebrow" aria-hidden="true">
              {quoteForm.eyebrow}
            </span>
            <span className="node" aria-hidden="true" />
            <span className="t-eyebrow">{quoteForm.eyebrowLabel}</span>
          </div>

          <h2 className="t-heading">{quoteForm.title}</h2>
          <p className="t-lead c-muted max-measure-tight">{quoteForm.lead}</p>

          <div className="cluster contact-actions">
            <PillButton href={site.whatsapp.href} variant="onBand" marks={["tl", "br"]}>
              Falar no WhatsApp
            </PillButton>
            <PillButton href={site.phone.href} variant="onBand">
              Ligar {site.phone.label}
            </PillButton>
          </div>

          <dl className="channel-list">
            {channels.map((channel) => (
              <div className="channel" key={channel.label}>
                <dt className="t-eyebrow">{channel.label}</dt>
                <dd>
                  <a
                    className="t-spec channel-link"
                    href={channel.href}
                    {...(channel.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {channel.value}
                  </a>
                </dd>
              </div>
            ))}
            <div className="channel">
              <dt className="t-eyebrow">Endereço fabril</dt>
              <dd className="t-spec channel-static">
                {site.address.street} · {site.address.district}
                <br />
                {site.address.city}/{site.address.state} · CEP {site.address.postalCode}
              </dd>
            </div>
          </dl>
        </div>

        <div className="form-panel">
          <QuoteForm />
        </div>
      </div>
    </section>
  );
}
