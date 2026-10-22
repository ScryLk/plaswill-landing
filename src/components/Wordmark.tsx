/**
 * ASSINATURA DA MARCA — logotipo oficial quando existe, tipografia quando não.
 *
 * O arquivo oficial é detectado em tempo de build por `src/lib/brand.ts`. Para
 * ativá-lo basta copiá-lo em `/public/brand/` com um dos nomes de lá; este
 * componente não muda.
 *
 * **Sobre a placa branca.** Uma versão anterior deste componente punha o
 * logotipo sobre uma placa branca no fundo escuro. Era uma precaução tomada
 * quando o arquivo ainda não existia e não se sabia se a marca teria tinta
 * escura transparente — que desapareceria no petróleo do rodapé.
 *
 * O logotipo real dispensou a precaução: ele é um campo amarelo fechado, com
 * "Plaswill" e "Embalagens" em tinta escura por dentro e um filete branco de
 * projeto contornando a forma. Sobre o slate (`#0F172A`) o amarelo entrega
 * 13,35:1 sozinho. Uma placa branca em volta viraria um retângulo claro com um
 * adesivo amarelo dentro — pior que o problema que resolveria. Por isso não há
 * mais placa: o arquivo entra como é.
 *
 * Enquanto o arquivo oficial não estiver presente, o nome é escrito em
 * tipografia — sem imitar a marca, conforme a regra do projeto.
 */

const ALT = "Plaswill — indústria de embalagens plásticas";

export function Wordmark({
  tone = "default",
  className,
  src,
  height,
}: {
  tone?: "default" | "onDark";
  className?: string;
  src?: string | null;
  /**
   * Altura em px. O padrão é 30 na barra e 26 no rodapé; a abertura passa 34.
   * A largura vem da proporção do arquivo (o oficial é 246×106, ≈2,32:1).
   *
   * Não há `width`/`height` fixos de propósito: o arquivo pode ser trocado por
   * outro de proporção diferente sem tocar em código, e a marca não pode ser
   * deformada. O custo é um deslocamento de layout no rodapé enquanto a imagem
   * carrega — desprezível para um PNG local de 9 kB.
   */
  height?: number;
}) {
  if (src) {
    return (
      <span className={className} style={{ display: "inline-flex", alignItems: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- arquivo enviado pelo cliente, proporção desconhecida em tempo de build */}
        <img
          src={src}
          alt={ALT}
          decoding="async"
          style={{
            height: height ?? (tone === "onDark" ? 26 : 30),
            width: "auto",
            display: "block",
          }}
        />
      </span>
    );
  }

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: "0.5rem",
        color: tone === "onDark" ? "var(--ice)" : "var(--fg)",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 8,
          height: 8,
          background: "var(--accent)",
          transform: "translateY(-1px)",
          display: "inline-block",
          flex: "none",
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-display), Georgia, serif",
          fontSize: "1.375rem",
          letterSpacing: "-0.01em",
          lineHeight: 1,
        }}
      >
        Plaswill
      </span>
      <span className="sr-only">— indústria de embalagens plásticas</span>
    </span>
  );
}
