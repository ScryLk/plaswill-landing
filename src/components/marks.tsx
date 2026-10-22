export type Corner = "tl" | "tr" | "bl" | "br";

/**
 * Marcas de registro de canto — assinatura gráfica da Plaswill.
 *
 * Desenho próprio: um nó sólido na quina e dois fios que correm ao longo das
 * bordas deixando um vão em volta do nó. Lê como marca de corte e de dobra de
 * chapa — referência de pré-impressão e de corte de embalagem, que é o
 * repertório da própria empresa.
 *
 * Geometria em caixa de 12×12, com traço de 1px e renderização nítida.
 */
const GEOMETRY: Record<
  Corner,
  { node: { x: number; y: number }; lines: Array<[number, number, number, number]> }
> = {
  tl: {
    node: { x: 0, y: 0 },
    lines: [
      [6, 0.5, 12, 0.5],
      [0.5, 6, 0.5, 12],
    ],
  },
  tr: {
    node: { x: 9.5, y: 0 },
    lines: [
      [0, 0.5, 6, 0.5],
      [11.5, 6, 11.5, 12],
    ],
  },
  bl: {
    node: { x: 0, y: 9.5 },
    lines: [
      [6, 11.5, 12, 11.5],
      [0.5, 0, 0.5, 6],
    ],
  },
  br: {
    node: { x: 9.5, y: 9.5 },
    lines: [
      [0, 11.5, 6, 11.5],
      [11.5, 0, 11.5, 6],
    ],
  },
};

function Mark({ corner }: { corner: Corner }) {
  const { node, lines } = GEOMETRY[corner];

  return (
    <svg
      className={`mark mark-${corner}`}
      viewBox="0 0 12 12"
      width={12}
      height={12}
      aria-hidden="true"
      focusable="false"
    >
      {lines.map(([x1, y1, x2, y2]) => (
        <line key={`${x1}-${y1}-${x2}-${y2}`} x1={x1} y1={y1} x2={x2} y2={y2} />
      ))}
      <rect x={node.x} y={node.y} width={2.5} height={2.5} />
    </svg>
  );
}

export function RegistrationMarks({
  corners = ["tl", "tr", "bl", "br"],
}: {
  corners?: Corner[];
}) {
  return (
    <>
      {corners.map((corner) => (
        <Mark key={corner} corner={corner} />
      ))}
    </>
  );
}
