/**
 * Verificação do cabeçalho da abertura.
 *
 * ```
 * node scripts/verificar-cabecalho.mjs
 * ```
 *
 * Sem framework e sem dependência nova: usa o `typescript` que já está nas
 * dependências de desenvolvimento para transpilar os dois módulos puros na hora
 * e importá-los de um `data:` URL. Nada é escrito em disco.
 *
 * **Por que estes testes existem.** O comportamento do cabeçalho é a parte do
 * projeto que a captura de tela não mostra e que o olho não pega: histerese
 * errada não deixa nada feio na tela, deixa a cápsula piscando quando a rolagem
 * para em cima do limiar — e isso só aparece com trackpad na mão. A geometria do
 * anel é a mesma história: um raio maior que a altura da cápsula desenha uma
 * curva impossível, e o `getPointAtLength` seguinte devolve `NaN` sem avisar.
 * São as duas coisas que podem estar quebradas parecendo certas.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import ts from "typescript";

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Transpila um `.ts` do projeto e importa o resultado sem tocar no disco. */
async function importar(relativo) {
  const fonte = readFileSync(resolve(raiz, relativo), "utf8");
  const js = ts.transpileModule(fonte, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: relativo,
  }).outputText;

  const url = `data:text/javascript;base64,${Buffer.from(js).toString("base64")}`;
  return import(url);
}

const header = await importar("src/lib/scrollHeader.ts");
const glide = await importar("src/lib/glideToTop.ts");

let passos = 0;
let falhas = 0;

function teste(nome, corpo) {
  passos += 1;
  try {
    corpo();
    console.log(`  ok   ${nome}`);
  } catch (erro) {
    falhas += 1;
    console.log(`  FALHA ${nome}`);
    console.log(`        ${erro.message.split("\n")[0]}`);
  }
}

function grupo(titulo) {
  console.log(`\n${titulo}`);
}

/* ── progresso do documento ─────────────────────────────────────────────── */

grupo("documentProgress — fração rolada do documento");

teste("sem rolagem possível, é 0 (e não NaN)", () => {
  assert.equal(header.documentProgress(0, 0), 0);
  assert.equal(header.documentProgress(500, 0), 0);
  assert.equal(header.documentProgress(500, -10), 0);
  assert.ok(Number.isFinite(header.documentProgress(500, 0)));
});

teste("nas pontas, é 0 e 1", () => {
  assert.equal(header.documentProgress(0, 1000), 0);
  assert.equal(header.documentProgress(1000, 1000), 1);
});

teste("no meio, é a fração", () => {
  assert.equal(header.documentProgress(250, 1000), 0.25);
  assert.equal(header.documentProgress(500, 1000), 0.5);
});

teste("é limitado dos dois lados (rolagem elástica do iOS)", () => {
  assert.equal(header.documentProgress(-120, 1000), 0);
  assert.equal(header.documentProgress(1400, 1000), 1);
});

/* ── histerese ──────────────────────────────────────────────────────────── */

grupo("shouldCondense — os dois limiares");

teste("no topo, não encolhe", () => {
  assert.equal(header.shouldCondense(false, 0, 5000), false);
});

teste("encolhe acima de 220, e só acima", () => {
  assert.equal(header.shouldCondense(false, 219, 5000), false);
  assert.equal(header.shouldCondense(false, 220, 5000), false);
  assert.equal(header.shouldCondense(false, 221, 5000), true);
});

teste("cresce de volta abaixo de 110, e só abaixo", () => {
  assert.equal(header.shouldCondense(true, 111, 5000), true);
  assert.equal(header.shouldCondense(true, 110, 5000), false);
  assert.equal(header.shouldCondense(true, 40, 5000), false);
});

teste("não pisca com a rolagem parada entre os dois limiares", () => {
  /* A propriedade que importa: entre 110 e 220 o estado é o que já era. Sem
     isso, parar a rolagem em 219 e tremer um pixel faria a cápsula bater
     encolhida/cheia a cada tremor. */
  let estado = header.shouldCondense(false, 300, 5000);
  assert.equal(estado, true, "depois de rolar até 300, tem de estar encolhida");

  let trocas = 0;
  for (const y of [219, 218, 219, 217, 220, 216, 219, 215, 214]) {
    const proximo = header.shouldCondense(estado, y, 5000);
    if (proximo !== estado) trocas += 1;
    estado = proximo;
  }

  assert.equal(trocas, 0, `trocou de estado ${trocas} vezes parada na faixa`);
  assert.equal(estado, true, "tem de continuar encolhida entre 110 e 220");
});

teste("nunca encolhe a menos de 160px do fim do documento", () => {
  const max = 2000;
  /* 2000 - 1841 = 159 → dentro da guarda. */
  assert.equal(header.shouldCondense(true, 1841, max), false);
  /* 2000 - 1839 = 161 → fora da guarda. */
  assert.equal(header.shouldCondense(true, 1839, max), true);
});

teste("a guarda do rodapé não prende o estado", () => {
  let estado = header.shouldCondense(true, 1900, 2000);
  assert.equal(estado, false, "no rodapé, cheia");
  estado = header.shouldCondense(estado, 400, 2000);
  assert.equal(estado, true, "de volta ao meio da página, encolhe outra vez");
});

teste("numa página sem rolagem, nunca encolhe", () => {
  assert.equal(header.shouldCondense(false, 0, 0), false);
  assert.equal(header.shouldCondense(true, 0, 0), false);
});

/* ── geometria do anel ──────────────────────────────────────────────────── */

grupo("pillRingPath — o contorno da cápsula");

teste("devolve null para medida não positiva", () => {
  assert.equal(header.pillRingPath(0, 0, 82), null);
  assert.equal(header.pillRingPath(100, 0, 82), null);
  assert.equal(header.pillRingPath(0, 100, 82), null);
  assert.equal(header.pillRingPath(Number.NaN, 40, 82), null);
});

teste("começa e termina no meio da aresta de cima", () => {
  const d = header.pillRingPath(100, 40, 82);
  assert.ok(d.startsWith("M 50 0"), `começa em "${d.slice(0, 10)}"`);
  assert.ok(d.endsWith("L 50 0"), `termina em "${d.slice(-8)}"`);
});

teste("tem os quatro cantos", () => {
  const d = header.pillRingPath(100, 40, 82);
  const arcos = d.match(/A /g) ?? [];
  assert.equal(arcos.length, 4);
});

teste("limita o raio pela metade da altura — cápsula, não curva impossível", () => {
  /* Altura 40 com raio declarado 82: o raio efetivo tem de ser 20, e não 82.
     Com 82 o arco não fecha e o caminho vira lixo. */
  const d = header.pillRingPath(100, 40, 82);
  assert.ok(d.includes("A 20 20 0 0 1"), `arcos com raio errado: ${d}`);
  assert.ok(!d.includes("82"), "o raio declarado não pode escapar para o caminho");
});

teste("respeita o raio quando ele é menor que a altura", () => {
  const d = header.pillRingPath(100, 40, 6);
  assert.ok(d.includes("A 6 6 0 0 1"), d);
});

teste("o recuo encurta o caminho dos dois lados", () => {
  const d = header.pillRingPath(100, 40, 82, 2);
  assert.ok(d.startsWith("M 48 0"), d);
  assert.ok(d.includes("L 96 "), "a largura tem de cair para 96");
  assert.ok(d.includes("A 18 18 0 0 1"), `raio 18 esperado: ${d}`);
});

teste("o caminho de uma cápsula real não tem NaN", () => {
  /* Medidas de verdade: 385px de largura encolhendo até 84px, com a altura que
     o `.glass` entrega. */
  for (const largura of [385, 300, 200, 120, 84]) {
    for (const altura of [42, 46, 54]) {
      const d = header.pillRingPath(largura, altura, 82);
      assert.ok(d && !d.includes("NaN"), `${largura}x${altura} sujou o caminho`);
    }
  }
});

/* ── a curva da subida ──────────────────────────────────────────────────── */

grupo("easeInOutCubic — a curva do retorno ao topo");

teste("começa em 0 e termina em 1", () => {
  assert.equal(glide.easeInOutCubic(0), 0);
  assert.equal(glide.easeInOutCubic(1), 1);
});

teste("passa pelo meio", () => {
  assert.equal(glide.easeInOutCubic(0.5), 0.5);
});

teste("nunca volta para trás", () => {
  let anterior = -1;
  for (let i = 0; i <= 100; i += 1) {
    const valor = glide.easeInOutCubic(i / 100);
    assert.ok(valor >= anterior, `desceu em t=${i / 100}`);
    assert.ok(valor >= 0 && valor <= 1, `saiu da faixa em t=${i / 100}`);
    anterior = valor;
  }
});

teste("sai devagar e chega devagar", () => {
  /* O que a curva promete: no primeiro décimo anda pouco, e no último também. */
  assert.ok(glide.easeInOutCubic(0.1) < 0.02, "a partida não é suave");
  assert.ok(1 - glide.easeInOutCubic(0.9) < 0.02, "a chegada não é suave");
});

console.log(
  `\n${passos - falhas}/${passos} verificações passaram` +
    (falhas ? ` — ${falhas} falharam` : "."),
);

process.exit(falhas ? 1 : 0);
