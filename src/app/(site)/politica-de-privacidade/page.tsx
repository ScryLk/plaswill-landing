import type { Metadata } from "next";

import { site } from "@/content/site";

/**
 * REVISAR ANTES DE PUBLICAR
 * Este texto é um rascunho estrutural, escrito a partir das obrigações usuais
 * da LGPD para um site institucional com formulário de contato. Ele NÃO passou
 * por revisão jurídica. Antes de entrar no ar:
 *   1. revisar com o jurídico ou o encarregado de dados da Plaswill;
 *   2. confirmar o contato do encarregado (DPO) e o prazo de retenção;
 *   3. incluir a lista real de operadores que recebem os dados enviados.
 */
export const metadata: Metadata = {
  title: "Política de privacidade",
  description: `Como a ${site.legalName} trata os dados pessoais enviados pelo site.`,
  alternates: { canonical: "/politica-de-privacidade" },
  robots: { index: true, follow: true },
};

type Section = { title: string; body: string[] };

const sections: Section[] = [
  {
    title: "Quem é o controlador",
    body: [
      `${site.legalName}, inscrita no CNPJ ${site.cnpj}, com sede na ${site.address.street}, ${site.address.district}, ${site.address.city}/${site.address.state}, CEP ${site.address.postalCode}, é a controladora dos dados pessoais tratados neste site.`,
    ],
  },
  {
    title: "Quais dados coletamos",
    body: [
      "Coletamos apenas os dados que você informa voluntariamente nos canais de contato e no formulário de orçamento: nome, empresa, e-mail, telefone, segmento de atuação, produto de interesse, volume estimado e o detalhe técnico que você escrever.",
      "Não coletamos dados sensíveis nem dados de crianças e adolescentes. Não pedimos informações de pagamento por este site.",
    ],
  },
  {
    title: "Para que usamos",
    body: [
      "Usamos os dados exclusivamente para responder à sua solicitação comercial: elaborar e enviar a cotação, esclarecer dúvidas técnicas, providenciar amostras e dar seguimento ao atendimento.",
      "Não usamos os dados para envio de publicidade sem o seu consentimento, e não os vendemos ou cedemos a terceiros para fins próprios deles.",
    ],
  },
  {
    title: "Base legal",
    body: [
      "O tratamento se apoia no legítimo interesse e nos procedimentos preliminares de contrato (art. 7º, incisos V e IX, da Lei nº 13.709/2018 — LGPD), conforme a natureza da sua solicitação.",
    ],
  },
  {
    title: "Com quem compartilhamos",
    body: [
      "O compartilhamento se limita ao necessário para atender o seu pedido, com prestadores que operam a infraestrutura do site e o e-mail corporativo, sempre sob obrigação de confidencialidade.",
      "Quando a conversa segue por WhatsApp, aplicam-se também as políticas do próprio serviço, que é operado por terceiro.",
    ],
  },
  {
    title: "Por quanto tempo guardamos",
    body: [
      "Mantemos os dados da solicitação pelo tempo necessário ao atendimento comercial e ao cumprimento de obrigações legais, fiscais e contratuais aplicáveis. Depois desse prazo, os registros são eliminados ou anonimizados.",
    ],
  },
  {
    title: "Seus direitos",
    body: [
      "Você pode solicitar confirmação de tratamento, acesso, correção, anonimização, portabilidade, eliminação de dados desnecessários e informação sobre compartilhamento, além de revogar o consentimento quando a base legal for o consentimento.",
      `Para exercer qualquer desses direitos, escreva para ${site.emails.general}.`,
    ],
  },
  {
    title: "Cookies e medição",
    body: [
      "Esta versão do site não ativa cookies de publicidade nem rastreadores de terceiros. Quando ferramentas de medição forem habilitadas, esta política será atualizada com a lista de ferramentas, a finalidade e a forma de recusar, e a coleta dependerá do seu consentimento prévio quando exigido.",
    ],
  },
  {
    title: "Alterações desta política",
    body: [
      "Podemos atualizar este documento para refletir mudanças no site ou na legislação. A data da última revisão aparece no topo da página.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <article className="section" style={{ paddingTop: "8rem" }}>
      <div className="wrap legal">
        <p className="eyebrow-row t-eyebrow">
          <span className="node" aria-hidden="true" />
          Documento legal
        </p>
        <h1 className="t-heading" style={{ marginTop: "1rem" }}>
          Política de privacidade
        </h1>
        <p className="t-caption c-muted" style={{ marginTop: "0.75rem" }}>
          Última revisão: a definir na publicação.
        </p>

        <div className="legal-body">
          {sections.map((section) => (
            <section className="legal-section" key={section.title}>
              <h2 className="t-subhead">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p className="t-body c-muted" key={paragraph.slice(0, 24)}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <p className="t-small c-muted legal-contact">
          Dúvidas sobre este documento: {site.emails.general} · {site.phone.label}
        </p>
      </div>
    </article>
  );
}
