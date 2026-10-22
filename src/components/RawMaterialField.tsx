/**
 * Campo de matéria-prima — o visual de abertura.
 *
 * No lugar da rede de nós da referência, aqui são grânulos de polietileno:
 * lentilhas e discos soltos, em três profundidades, caindo do topo para o
 * centro como resina entrando na moega, com alguns grânulos grandes cortados
 * pela borda para dar close-up. Nada se liga a nada — material, não rede.
 * A prancha é larga (1240 × 520) porque o campo agora sangra sob o texto,
 * de borda a borda, em vez de ocupar uma coluna ao lado do título.
 *
 * Tudo é gerado em tempo de render com semente fixa: a composição é sempre a
 * mesma, sem imagem, sem canvas e sem JavaScript no cliente. Só três camadas
 * animam, por transform, e o movimento respeita prefers-reduced-motion.
 *
 * Se mexer nos números de buildPellets, a composição muda — confira o desenho
 * antes de subir. A semente 20070307 é a data de fundação da Plaswill.
 */

type Layer = "back" | "mid" | "front";

type Pellet = {
  x: number;
  y: number;
  r: number;
  /** Lentilha (elipse girada) ou disco visto de frente (círculo). */
  lens: boolean;
  angle: number;
  filled: boolean;
  opacity: number;
  layer: Layer;
};

const VIEW_W = 1240;
const VIEW_H = 520;

/** PRNG determinístico — a mesma semente gera sempre o mesmo campo. */
function mulberry32(seed: number) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Distribuição normal a partir de duas uniformes (Box–Muller). */
function gaussian(rand: () => number) {
  const u = Math.max(rand(), 1e-9);
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function buildPellets(count: number): Pellet[] {
  const rand = mulberry32(20070307); // data de fundação como semente
  const pellets: Pellet[] = [];

  for (let i = 0; i < count; i += 1) {
    const tipo = rand();

    let x: number;
    let y: number;

    if (tipo < 0.64) {
      // núcleo: aglomerado central, mais denso no meio da prancha
      x = (0.5 + gaussian(rand) * 0.225) * VIEW_W;
      y = (0.5 + gaussian(rand) * 0.265) * VIEW_H;
    } else if (tipo < 0.86) {
      // queda: resina entrando pelo topo e alargando ao descer
      const t = rand();
      x = (0.5 + gaussian(rand) * (0.07 + t * 0.17)) * VIEW_W;
      y = (0.02 + t * 0.78) * VIEW_H;
    } else {
      // grânulos soltos, pequenos, nas bordas
      x = rand() * VIEW_W;
      y = rand() * VIEW_H;
    }

    const sizeSeed = rand();
    const r = 1.5 + Math.pow(sizeSeed, 2.35) * 24;
    const lens = rand() > 0.45;
    const angle = Math.round(rand() * 180 - 90);
    const filled = rand() > 0.42; // ~58% cheios, o resto em contorno
    const opacity = 0.5 + rand() * 0.5;

    const layer: Layer = r > 12 ? "front" : r > 5.5 ? "mid" : "back";

    pellets.push({
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      r: Math.round(r * 10) / 10,
      lens,
      angle,
      filled,
      opacity: Math.round(opacity * 100) / 100,
      layer,
    });
  }

  return pellets.sort((a, b) => a.r - b.r);
}

const PELLETS = buildPellets(280);

const LAYERS: Layer[] = ["back", "mid", "front"];

export function RawMaterialField() {
  return (
    <svg
      className="field-svg"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      {LAYERS.map((layer) => (
        <g key={layer} className={`field-layer field-${layer}`}>
          {PELLETS.filter((pellet) => pellet.layer === layer).map((pellet, index) => {
            const key = `${layer}-${index}`;
            const className = pellet.filled ? "pellet pellet-fill" : "pellet";

            return (
              <g key={key} opacity={pellet.opacity}>
                {pellet.lens ? (
                  <ellipse
                    className={className}
                    cx={pellet.x}
                    cy={pellet.y}
                    rx={pellet.r}
                    ry={pellet.r * 0.72}
                    transform={`rotate(${pellet.angle} ${pellet.x} ${pellet.y})`}
                  />
                ) : (
                  <circle
                    className={className}
                    cx={pellet.x}
                    cy={pellet.y}
                    r={pellet.r}
                  />
                )}
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}
