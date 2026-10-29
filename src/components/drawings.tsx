/**
 * Desenhos técnicos em SVG — o repertório gráfico da Plaswill.
 *
 * Em vez de ilustração decorativa, cada produto é desenhado como prancha de
 * engenharia: vista, corte, linha de cota com traço em 45°, chamada para o
 * detalhe e micro-rótulo em mono. É o idioma visual de quem fabrica embalagem.
 *
 * Estas pranchas são provisórias por natureza: quando as fotos reais da fábrica
 * e dos produtos estiverem em /public/images, o card passa a exibir a foto e a
 * prancha vira elemento de apoio (ver ProductCard).
 *
 * Os rótulos são ilustrativos. Nenhuma medida foi inventada: as cotas que
 * aparecem são as que existem no dossiê (micragens, norma, formato sob medida).
 */

import type { ReactElement, ReactNode } from "react";

import type { DrawingId } from "@/content/site";

/* ------------------------------------------------------------------ */
/* Auxiliares de desenho                                             */
/* ------------------------------------------------------------------ */

/** Linha de cota horizontal com traços em 45° nas extremidades. */
function DimH({
  x1,
  x2,
  y,
  label,
}: {
  x1: number;
  x2: number;
  y: number;
  label?: string;
}) {
  return (
    <g>
      <line className="draft-line" x1={x1} y1={y} x2={x2} y2={y} />
      <line className="draft-line" x1={x1 - 3} y1={y + 3} x2={x1 + 3} y2={y - 3} />
      <line className="draft-line" x1={x2 - 3} y1={y + 3} x2={x2 + 3} y2={y - 3} />
      {label ? (
        <text className="draft-label" x={(x1 + x2) / 2} y={y - 6} textAnchor="middle">
          {label}
        </text>
      ) : null}
    </g>
  );
}

/** Linha de cota vertical com traços em 45° nas extremidades. */
function DimV({
  y1,
  y2,
  x,
  label,
}: {
  y1: number;
  y2: number;
  x: number;
  label?: string;
}) {
  return (
    <g>
      <line className="draft-line" x1={x} y1={y1} x2={x} y2={y2} />
      <line className="draft-line" x1={x - 3} y1={y1 + 3} x2={x + 3} y2={y1 - 3} />
      <line className="draft-line" x1={x - 3} y1={y2 + 3} x2={x + 3} y2={y2 - 3} />
      {label ? (
        <text
          className="draft-label"
          x={x + 8}
          y={(y1 + y2) / 2}
          dominantBaseline="middle"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

/** Linha de chamada: sai do detalhe, corre na diagonal e encontra o rótulo. */
function Callout({
  x1,
  y1,
  x2,
  y2,
  label,
  anchor = "start",
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  anchor?: "start" | "end" | "middle";
}) {
  const elbow = 26;
  const dir = x2 > x1 ? 1 : -1;
  const midX = x2 - dir * elbow;

  return (
    <g>
      <circle className="draft-node" cx={x1} cy={y1} r={2} />
      <path
        className="draft-line-dashed"
        d={`M ${x1} ${y1} L ${midX} ${y2} L ${x2} ${y2}`}
      />
      <text
        className="draft-label"
        x={x2 + dir * 4}
        y={y2 - 4}
        textAnchor={anchor}
      >
        {label}
      </text>
    </g>
  );
}

/** Hachura de corte: traços curtos inclinados ao longo de um segmento. */
function Hatch({
  x,
  y,
  width,
  step = 9,
  height = 7,
}: {
  x: number;
  y: number;
  width: number;
  step?: number;
  height?: number;
}) {
  const count = Math.floor(width / step);
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const px = x + i * step;
        return (
          <line
            key={px}
            className="draft-line"
            x1={px}
            y1={y + height / 2}
            x2={px + height / 2}
            y2={y - height / 2}
          />
        );
      })}
    </g>
  );
}

/** Moldura de prancha: cantos com marcas de corte, como num desenho técnico. */
function Plate({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg
      viewBox="0 0 500 300"
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid meet"
    >
      <line className="draft-line" x1={24} y1={26} x2={24} y2={274} />
      <line className="draft-line" x1={476} y1={26} x2={476} y2={274} />
      <line className="draft-line-dashed" x1={24} y1={26} x2={476} y2={26} />
      <line className="draft-line-dashed" x1={24} y1={274} x2={476} y2={274} />
      <rect className="draft-node" x={21} y={23} width={6} height={6} />
      <rect className="draft-node" x={473} y={23} width={6} height={6} />
      <rect className="draft-node" x={21} y={271} width={6} height={6} />
      <rect className="draft-node" x={473} y={271} width={6} height={6} />
      {children}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* PR-01 — filme stretch                                              */
/* ------------------------------------------------------------------ */

function StretchDrawing() {
  return (
    <Plate label="Vista lateral de carga paletizada envolvida em filme stretch, com corte da bobina ao lado">
      {/* bobina em corte */}
      <circle className="draft-line-strong" cx={92} cy={168} r={56} />
      <circle className="draft-line" cx={92} cy={168} r={44} />
      <circle className="draft-line" cx={92} cy={168} r={32} />
      <circle className="draft-line-dashed" cx={92} cy={168} r={12} />
      <line className="draft-line-dashed" x1={92} y1={112} x2={92} y2={224} />
      <line className="draft-line-dashed" x1={36} y1={168} x2={148} y2={168} />
      <DimV y1={112} y2={224} x={30} label="largura" />

      {/* véu de filme saindo da bobina até a carga */}
      <path className="draft-line-dashed" d="M 148 152 L 200 132" />
      <path className="draft-line-dashed" d="M 148 184 L 200 204" />

      {/* carga envolvida: camadas sobrepostas sugerem a espiral do stretch */}
      {[0, 1, 2, 3].map((layer) => (
        <rect
          key={layer}
          className={layer === 0 ? "draft-line-strong" : "draft-line"}
          x={204 + layer * 4}
          y={84 + layer * 41}
          width={124}
          height={41}
        />
      ))}

      {/* palete */}
      <line className="draft-line-strong" x1={196} y1={248} x2={340} y2={248} />
      <line className="draft-line-strong" x1={196} y1={262} x2={340} y2={262} />
      {[210, 262, 314].map((x) => (
        <rect
          key={x}
          className="draft-line"
          x={x}
          y={248}
          width={14}
          height={14}
        />
      ))}

      <DimV y1={84} y2={248} x={368} label="carga" />
      <Hatch x={196} y={276} width={144} step={10} />

      <Callout x1={330} y1={120} x2={392} y2={96} label="memória elástica" anchor="end" />
      <Callout x1={92} y1={140} x2={40} y2={88} label="25µ · 0,50 × 300 m" />
    </Plate>
  );
}

/* ------------------------------------------------------------------ */
/* PR-03 — plástico bolha                                             */
/* ------------------------------------------------------------------ */

function BubbleDrawing() {
  return (
    <Plate label="Corte transversal de plástico bolha, com bolhas entre duas camadas e indicação de aditivo anti-UV">
      {/* camadas */}
      <line className="draft-line-strong" x1={70} y1={104} x2={430} y2={104} />
      <line className="draft-line-strong" x1={70} y1={196} x2={430} y2={196} />

      {/* bolhas */}
      {[126, 182, 238, 294, 350, 406].map((cx) => (
        <circle key={cx} className="draft-line" cx={cx} cy={150} r={21} />
      ))}

      {/* hachura nas bordas do corte */}
      <Hatch x={74} y={150} width={16} step={7} height={34} />
      <Hatch x={412} y={150} width={16} step={7} height={34} />

      {/* incidência de UV */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <line
            className="draft-line"
            x1={92 + i * 22}
            y1={44}
            x2={112 + i * 22}
            y2={64}
          />
          <polygon
            className="draft-node"
            points={`${112 + i * 22},64 ${104 + i * 22},62 ${110 + i * 22},56`}
          />
        </g>
      ))}

      <DimV y1={104} y2={196} x={452} label="30µ a 120µ" />
      <Callout x1={294} y1={171} x2={330} y2={238} label="1,30 × 100 m" anchor="end" />
      <Callout x1={100} y1={104} x2={40} y2={34} label="aditivo anti-UV" />
      <Hatch x={70} y={116} width={16} step={7} height={14} />
    </Plate>
  );
}

/* ------------------------------------------------------------------ */
/* PR-12 — sacos para silagem                                   */
/* ------------------------------------------------------------------ */

function SilageDrawing() {
  return (
    <Plate label="Vista lateral de saco de silagem com a boca aberta à esquerda e o amarrio à direita">
      {/* corpo do saco, afunilando até o amarrio */}
      <path
        className="draft-line-strong"
        d="M 96 106 L 380 138 L 404 142 L 404 158 L 380 162 L 96 194"
      />
      {/* boca */}
      <path className="draft-line-strong" d="M 96 106 A 10 44 0 0 0 96 194" />
      <line className="draft-line-dashed" x1={96} y1={106} x2={96} y2={194} />

      {/* amarrio */}
      <line className="draft-line-strong" x1={380} y1={138} x2={380} y2={162} />
      <path className="draft-line" d="M 404 142 L 428 132" />
      <path className="draft-line" d="M 404 158 L 428 168" />

      {/* carga interna indicada por hachura */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line
          key={i}
          className="draft-line"
          x1={140 + i * 40}
          y1={168 - i * 5}
          x2={162 + i * 40}
          y2={132 - i * 5}
        />
      ))}

      <DimH x1={96} x2={404} y={60} label="comprimento sob medida" />
      <DimV y1={106} y2={194} x={60} label="boca" />
      <Callout x1={300} y1={144} x2={336} y2={232} label="sem microfuros" anchor="end" />
      <Callout x1={120} y1={112} x2={46} y2={34} label="vedação anaeróbica" />
    </Plate>
  );
}

/* ------------------------------------------------------------------ */
/* PR-10 e PR-11 — lixo infectante e lixo tóxico                                           */
/* ------------------------------------------------------------------ */

function HospitalDrawing() {
  return (
    <Plate label="Vista frontal de saco hospitalar para resíduo infectante, com bloco de identificação e faixa hachurada">
      {/* corpo do saco */}
      <path
        className="draft-line-strong"
        d="M 168 84 L 332 84 L 316 250 L 184 250 Z"
      />
      {/* alças e amarrio */}
      <path className="draft-line" d="M 226 84 L 226 60" />
      <path className="draft-line" d="M 274 84 L 274 60" />
      <line className="draft-line-dashed" x1={168} y1={84} x2={332} y2={84} />

      {/* bloco de identificação */}
      <rect className="draft-line-strong" x={204} y={112} width={92} height={56} />
      <line className="draft-line" x1={214} y1={130} x2={286} y2={130} />
      <line className="draft-line" x1={214} y1={146} x2={262} y2={146} />
      <text className="draft-label" x={250} y={192} textAnchor="middle">
        ABNT NBR 9191
      </text>

      {/* faixa hachurada de resíduo */}
      <Hatch x={196} y={224} width={112} step={9} height={16} />

      {/* amostras de acabamento */}
      <rect className="draft-line" x={366} y={112} width={54} height={30} />
      <Hatch x={370} y={127} width={46} step={6} height={10} />
      <text className="draft-label" x={366} y={156}>
        leitosa
      </text>
      <rect className="draft-line" x={366} y={176} width={54} height={30} />
      {Array.from({ length: 9 }, (_, i) => (
        <line
          key={i}
          className="draft-line"
          x1={366 + i * 6}
          y1={206}
          x2={366 + i * 6}
          y2={176}
        />
      ))}
      <text className="draft-label" x={366} y={220}>
        pigmentada
      </text>

      <DimV y1={84} y2={250} x={150} label="sob medida" />
    </Plate>
  );
}

/* ------------------------------------------------------------------ */
/* PCR — seção 06, materiais e meio ambiente                                */
/* ------------------------------------------------------------------ */

function PcrDrawing() {
  const nodes = [
    { x: 250, y: 62, label: "triagem", anchor: "middle" as const, lx: 250, ly: 46 },
    { x: 372, y: 150, label: "lavagem", anchor: "start" as const, lx: 392, ly: 154 },
    { x: 250, y: 238, label: "micronização", anchor: "middle" as const, lx: 250, ly: 262 },
    { x: 128, y: 150, label: "extrusão", anchor: "end" as const, lx: 108, ly: 154 },
  ];

  return (
    <Plate label="Diagrama de ciclo fechado do polietileno pós-consumo: triagem, lavagem, micronização e extrusão">
      <circle className="draft-line-dashed" cx={250} cy={150} r={88} />

      {/* arcos de rotação com ponta de seta */}
      {[
        "M 302 96 A 88 88 0 0 1 342 132",
        "M 342 168 A 88 88 0 0 1 302 204",
        "M 198 204 A 88 88 0 0 1 158 168",
        "M 158 132 A 88 88 0 0 1 198 96",
      ].map((d, i) => (
        <g key={d}>
          <path className="draft-line-strong" d={d} />
          <polygon
            className="draft-node"
            points={
              [
                "342,132 348,140 336,140",
                "302,204 296,196 310,196",
                "158,168 152,160 164,160",
                "198,96 204,104 190,104",
              ][i]
            }
          />
        </g>
      ))}

      {nodes.map((node) => (
        <g key={node.label}>
          <rect
            className="draft-node"
            x={node.x - 5}
            y={node.y - 5}
            width={10}
            height={10}
          />
          <text
            className="draft-label"
            x={node.lx}
            y={node.ly}
            textAnchor={node.anchor}
          >
            {node.label}
          </text>
        </g>
      ))}

      <text className="draft-label" x={250} y={142} textAnchor="middle">
        PCR
      </text>
      <text className="draft-label" x={250} y={160} textAnchor="middle">
        logística reversa
      </text>
    </Plate>
  );
}

/* ------------------------------------------------------------------ */
/* PR-02 — filme stretch rolinho                                      */
/* ------------------------------------------------------------------ */

function RollDrawing() {
  /* quatro eixos de seção, para a bobina ler como corte e não como círculo */
  const spokes = [0, 45, 90, 135].map((deg) => {
    const rad = (deg * Math.PI) / 180;
    return {
      deg,
      x1: 132 + Math.cos(rad) * 26,
      y1: 152 + Math.sin(rad) * 26,
      x2: 132 + Math.cos(rad) * 58,
      y2: 152 + Math.sin(rad) * 58,
    };
  });

  return (
    <Plate label="Bobina de filme stretch rolinho em corte, com o núcleo de papelão ao centro e a lâmina de filme saindo tangente">
      {/* núcleo de papelão */}
      <circle className="draft-line-strong" cx={132} cy={152} r={72} />
      <circle className="draft-line" cx={132} cy={152} r={58} />
      <circle className="draft-line" cx={132} cy={152} r={26} />
      <circle className="draft-line-dashed" cx={132} cy={152} r={17} />
      {spokes.map((s) => (
        <line
          key={s.deg}
          className="draft-line-dashed"
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
        />
      ))}
      <Hatch x={56} y={152} width={14} step={7} height={30} />
      <Hatch x={194} y={152} width={14} step={7} height={30} />

      {/* lâmina saindo tangente ao topo da bobina */}
      <path className="draft-line-strong" d="M 194 116 L 420 82" />
      <path className="draft-line" d="M 194 128 L 420 94" />
      <Callout x1={352} y1={77} x2={392} y2={44} label="aplicação manual" anchor="end" />

      <DimV y1={80} y2={224} x={28} label="bobina" />
      <Callout x1={132} y1={152} x2={96} y2={248} label="núcleo" />
    </Plate>
  );
}

/* ------------------------------------------------------------------ */
/* PR-04 — capas de fardos                                            */
/* ------------------------------------------------------------------ */

function FardoDrawing() {
  return (
    <Plate label="Fardo enfardado visto em perspectiva, com a capa plástica envolvendo o volume e as amarrações no sentido longitudinal">
      {/* volume do fardo: frente e topo, em perspectiva isométrica simples */}
      <path
        className="draft-line-strong"
        d="M 120 194 L 120 122 L 340 122 L 340 194 Z"
      />
      <path className="draft-line-strong" d="M 120 122 L 162 88 L 382 88 L 340 122" />
      <path className="draft-line-strong" d="M 382 88 L 382 160 L 340 194" />

      {/* capa: contorno deslocado, indicando o filme por fora do volume */}
      <path className="draft-line-dashed" d="M 112 200 L 112 116 L 340 116" />
      <path className="draft-line-dashed" d="M 348 190 L 348 116 L 390 82" />

      {/* amarrações longitudinais */}
      {[170, 232, 294].map((x) => (
        <line
          key={x}
          className="draft-line"
          x1={x}
          y1={122}
          x2={x}
          y2={194}
        />
      ))}

      <DimH x1={120} x2={340} y={226} label="sob medida" />
      <Callout x1={382} y1={88} x2={414} y2={50} label="capa soldada" anchor="end" />
      <Callout x1={232} y1={194} x2={204} y2={256} label="incolor ou canela" />
      <Hatch x={120} y={194} width={16} step={7} height={14} />
    </Plate>
  );
}

/* ------------------------------------------------------------------ */
/* PR-05 a PR-09 — prancha de saco, assunto declarado                     */
/* ------------------------------------------------------------------ */

function BagDrawing({ subject }: { subject: string }) {
  return (
    <Plate
      label={`Prancha técnica de ${subject}: saco plástico com boca aberta, corpo reto e solda de fundo`}
    >
      {/* corpo do saco */}
      <path className="draft-line-strong" d="M 152 78 L 152 214" />
      <path className="draft-line-strong" d="M 348 78 L 348 214" />

      {/* boca aberta: as duas abas viram para fora */}
      <path className="draft-line" d="M 152 78 L 138 62" />
      <path className="draft-line" d="M 348 78 L 362 62" />
      <path className="draft-line-dashed" d="M 138 62 L 362 62" />

      {/* sanfona lateral */}
      <path className="draft-line-dashed" d="M 196 96 L 196 214" />
      <path className="draft-line-dashed" d="M 304 96 L 304 214" />

      {/* solda de fundo */}
      <line className="draft-line-strong" x1={152} y1={214} x2={348} y2={214} />
      <Hatch x={168} y={214} width={164} step={9} height={9} />

      <DimH x1={152} x2={348} y={252} label="largura" />
      <DimV y1={78} y2={214} x={382} label="comprimento" />
      <Callout x1={268} y1={214} x2={300} y2={272} label="solda de fundo" anchor="end" />
      <Callout x1={348} y1={78} x2={404} y2={44} label="boca aberta" anchor="end" />
    </Plate>
  );
}

/* ------------------------------------------------------------------ */
/* PR-13 e PR-14 — lona preta e lençol descartável                       */
/* ------------------------------------------------------------------ */

function SheetDrawing({ subject }: { subject: string }) {
  return (
    <Plate
      label={`Prancha técnica de ${subject}: folha plástica estendida, com as dobras de bordo e a espessura em corte`}
    >
      {/* folha em perspectiva */}
      <path className="draft-line-strong" d="M 92 196 L 176 96 L 428 96 L 344 196 Z" />

      {/* dobras de bordo */}
      <path className="draft-line-dashed" d="M 92 196 L 110 214 L 362 214 L 344 196" />
      <path className="draft-line" d="M 176 96 L 194 114 L 446 114 L 428 96" />

      {/* ondulação do plástico sobre a folha */}
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          className="draft-line-dashed"
          d={`M ${140 + i * 62} 176 Q ${152 + i * 62} 148 ${164 + i * 62} 176`}
        />
      ))}

      {/* espessura em corte, no canto */}
      <Hatch x={110} y={214} width={16} step={7} height={12} />
      <DimH x1={176} x2={428} y={72} label="largura" />
      <DimV y1={96} y2={196} x={460} label="comprimento" />
      <Callout x1={344} y1={196} x2={300} y2={262} label="espessura" anchor="end" />
    </Plate>
  );
}

/* ------------------------------------------------------------------ */
/* Registro                                                           */
/* ------------------------------------------------------------------ */

const DRAWINGS: Record<DrawingId, (props: { subject: string }) => ReactElement> = {
  stretch: StretchDrawing,
  roll: RollDrawing,
  bubble: BubbleDrawing,
  fardo: FardoDrawing,
  bag: BagDrawing,
  sheet: SheetDrawing,
  silage: SilageDrawing,
  hospital: HospitalDrawing,
  pcr: PcrDrawing,
};

/**
 * A prancha de cada produto. `subject` é o nome do item e entra só no texto
 * alternativo: as quatro pranchas de saco compartilham o mesmo desenho, mas
 * quem lê com leitor de tela ouve o produto certo em cada linha.
 */
export function ProductDrawing({ id, subject }: { id: DrawingId; subject: string }) {
  const Drawing = DRAWINGS[id];
  return <Drawing subject={subject} />;
}

/* ------------------------------------------------------------------ */
/* Diagrama da planta — desenho de abertura                            */
/* ------------------------------------------------------------------ */

/**
 * Linha de extrusão balão, em vista lateral: extrusora, cabeçote, balão,
 * rolos de puxada e rebobinadeira. É o desenho que abre a página, no lugar
 * de uma imagem genérica de indústria.
 */
export function PlantDiagram() {
  const groundTicks = Array.from({ length: 22 }, (_, i) => 30 + i * 19);

  return (
    <svg
      viewBox="0 0 440 600"
      role="img"
      aria-label="Desenho técnico da linha de extrusão balão: extrusora, cabeçote, balão de filme, rolos de puxada e rebobinadeira"
      style={{ width: "100%", height: "auto" }}
    >
      {/* base da máquina */}
      <line className="draft-line-strong" x1={28} y1={560} x2={412} y2={560} />
      {groundTicks.map((x) => (
        <line
          key={x}
          className="draft-line"
          x1={x}
          y1={560}
          x2={x + 10}
          y2={570}
        />
      ))}

      {/* extrusora */}
      <rect className="draft-line-strong" x={70} y={500} width={160} height={44} />
      <rect className="draft-line" x={38} y={508} width={32} height={28} />
      <line className="draft-line" x1={54} y1={508} x2={54} y2={536} />
      {[86, 106, 126, 146, 166, 186, 206].map((x) => (
        <line key={x} className="draft-line" x1={x} y1={500} x2={x} y2={544} />
      ))}

      {/* funil de alimentação */}
      <path className="draft-line-strong" d="M 186 500 L 210 500 L 224 452 L 200 452 Z" />
      <line className="draft-line-dashed" x1={176} y1={440} x2={248} y2={440} />
      <circle className="draft-node" cx={212} cy={432} r={2} />
      <circle className="draft-node" cx={230} cy={421} r={2} />
      <circle className="draft-node" cx={196} cy={424} r={2} />

      {/* cabeçote */}
      <rect className="draft-line-strong" x={240} y={492} width={62} height={24} />
      <line className="draft-line" x1={240} y1={504} x2={302} y2={504} />

      {/* balão de filme */}
      <path
        className="draft-line-strong"
        d="M 246 492 C 228 420 208 330 206 232 L 296 232 C 294 330 274 420 256 492 Z"
      />
      <line className="draft-line-dashed" x1={251} y1={492} x2={251} y2={232} />
      <line className="draft-line-dashed" x1={232} y1={330} x2={270} y2={330} />
      <line className="draft-line-dashed" x1={222} y1={270} x2={280} y2={270} />

      {/* colapso do filme até os rolos de puxada */}
      <line className="draft-line-strong" x1={206} y1={232} x2={228} y2={190} />
      <line className="draft-line-strong" x1={296} y1={232} x2={274} y2={190} />
      <circle className="draft-line-strong" cx={234} cy={180} r={18} />
      <circle className="draft-line-strong" cx={270} cy={180} r={18} />
      <circle className="draft-node" cx={234} cy={180} r={2.5} />
      <circle className="draft-node" cx={270} cy={180} r={2.5} />

      {/* filme colapsado descendo até a rebobinadeira */}
      <line className="draft-line-strong" x1={252} y1={196} x2={252} y2={430} />
      <line className="draft-line-strong" x1={266} y1={196} x2={266} y2={430} />
      <circle className="draft-line-strong" cx={259} cy={448} r={16} />
      <line className="draft-line-strong" x1={262} y1={458} x2={352} y2={512} />

      {/* rebobinadeira */}
      <circle className="draft-line-strong" cx={368} cy={516} r={40} />
      <circle className="draft-line" cx={368} cy={516} r={30} />
      <circle className="draft-line" cx={368} cy={516} r={20} />
      <circle className="draft-line-dashed" cx={368} cy={516} r={9} />
      <Hatch x={344} y={556} width={48} step={9} />

      {/* chamadas */}
      <Callout x1={271} y1={504} x2={318} y2={470} label="cabeçote" />
      <Callout x1={251} y1={300} x2={172} y2={286} label="balão" anchor="end" />
      <Callout x1={252} y1={180} x2={180} y2={148} label="rolos de puxada" anchor="end" />
      <Callout x1={368} y1={516} x2={392} y2={452} label="rebobinadeira" anchor="end" />
      <Callout x1={150} y1={522} x2={78} y2={588} label="extrusora" />

      <DimV y1={232} y2={492} x={330} label="altura do balão" />
      <DimH x1={206} x2={296} y={214} label="diâmetro do filme" />
    </svg>
  );
}
