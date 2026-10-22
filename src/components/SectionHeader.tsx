import type { ReactNode } from "react";

/**
 * Cabeçalho de seção do sistema: linha de micro-rótulo numerada
 * (número · ponto · rótulo), título de voz em serif e ação opcional à direita.
 * O número é estrutural — indica posição na página, não enfeite.
 */
export function SectionHeader({
  number,
  label,
  title,
  lead,
  action,
  id,
  tone = "light",
}: {
  number: string;
  label: string;
  title: string;
  lead?: string;
  action?: ReactNode;
  id?: string;
  tone?: "light" | "band";
}) {
  return (
    <header className="section-head">
      <div className="eyebrow-row">
        <span className="t-eyebrow" aria-hidden="true">
          {number}
        </span>
        <span className="node" aria-hidden="true" />
        <span className="t-eyebrow">{label}</span>
      </div>

      <div className="section-head-grid">
        <h2 className="t-heading" id={id}>
          {title}
        </h2>
        {action ? <div className="section-head-action">{action}</div> : null}
      </div>

      {lead ? <p className="t-lead c-muted max-measure">{lead}</p> : null}
    </header>
  );
}
