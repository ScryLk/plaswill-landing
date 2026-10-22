#!/usr/bin/env python3
"""
Gera as cópias de conferência do protótipo — os estados do cabeçalho que uma
captura parada não alcança.

    python3 design/prototipo-estado.py --compacto   → prototipo-compacto.html
    python3 design/prototipo-estado.py --hover      → prototipo-hover.html

O PORQUÊ DE CADA UM
-------------------
`--compacto` — o estado encolhido depende de onde a página está rolada, e o
painel de pré-visualização fotografa a página parada no topo, sem rolar. Aqui
não se força CSS nenhum: a cópia **rola** e deixa o próprio script do protótipo
decidir: acima de 220px de rolagem ele põe `is-compact` na cápsula, e a largura
de 94px e o anel de progresso vêm das regras que já estão no arquivo. Se o anel
não aparecer na captura, o defeito é do protótipo, não desta cópia.
`snapshot.py --compacto` resolve o mesmo problema na rota compilada.

`--hover` — o quarto estado é o ponteiro em cima da cápsula, e ponteiro não se
fotografa. Este modo **não força mais as três declarações com `!important`**:
ele copia o bloco de `@media (min-width: 768px)` do próprio `abertura.html`,
rebaixa o gatilho para `min-width: 0` e prefixa os seletores com `#forcado`. O
identificador entra na cápsula **depois** da carga, pelo script da sonda, e é
isso que faz a transição correr de verdade em vez de o estado já nascer pronto.
As declarações são as do arquivo, sem uma linha reescrita; o que muda é só quem
dispara.

A janela do texto **não** entra mais forçada como `none`: o que se quer ver é o
estado como o visitante o vê, e a adequação do número da janela é assunto da
sonda, logo abaixo.

O QUE A SONDA IMPRIME
---------------------
Dentro do iframe não há console nem DevTools, e o painel não rola — então a
cópia escreve os números na própria página, num retângulo fixo no canto superior
esquerdo. É a mesma técnica de `design/medir.py`: o que não se pode inspecionar,
imprime-se grande.

    rolagem   y=…  max=…      o alvo da rolagem e o quanto a página tem
    caixa     …×…             `offsetWidth` × `offsetHeight` da cápsula
    encolhida SIM/não         se a classe `is-compact` está posta
    rolagem   travada         se `scrollTo` não moveu nada
    piso      +1400px         se a página era curta e ganhou comprimento extra

No modo `--hover`, a **curva do gesto** — uma linha por instante, contada a
partir do momento em que o estado é disparado:

    t=300ms  op=0.00  w=0px  topo=30.0px

`op` é a opacidade computada do nome e `topo` é a distância do topo dele ao topo
da cápsula. Serve para provar duas coisas que uma imagem parada não mostra: que
o nome **não aparece de imediato** (nos primeiros instantes `op` fica em 0.00,
que é o atraso declarado) e que os 12px de deslocamento do gesto **cabem dentro
dos 54px da cápsula** (`topo` nunca sai de 0–54). E, depois da poeira baixar, a
conta do estado:

    marca     …px             a largura da marca, para a soma fechar
    nome      …px             a largura natural do texto, medida **sem janela**
    nome agora …px            a largura com a janela do protótipo aplicada
    vao       …px             o vão entre marca e nome
    link      …px             a caixa que o flex do link mede
    soma      …px             marca + vão + nome, que tem de dar o `link`
    janela    …px             a largura que o protótipo declara no hover
    gesto     …               a transição que o protótipo declara no hover

A `janela` e o `gesto` são lidos de `abertura.html` **por este gerador**, em
Python, e escritos na sonda: número copiado à mão é número que fica velho em
silêncio, e se a regra mudar de forma a captura diz "não encontrada" em vez de
mostrar um número velho. Se `nome` passar de `janela`, a última letra fica
cortada no hover de verdade — e é esta comparação que denuncia, na captura.

O piso de comprimento existe porque a janela útil do estado encolhido é estreita:
é preciso passar de 220px e ficar a mais de 160px do fim (o protótipo cresce de
novo perto do rodapé, de propósito). Numa página curta essa janela pode não
existir dentro do iframe, e o comprimento extra a abre sem mexer em nada do
cabeçalho.
"""

import pathlib
import re
import sys

AQUI = pathlib.Path(__file__).resolve().parent
ORIGEM = AQUI / "abertura.html"

# A regra de hover do protótipo, para tirar dela a janela do nome. O `[^}]*?`
# não-guloso pára no primeiro `max-width` do bloco — é o da regra, e não o da
# base, porque o `{` procurado é o que vem depois do seletor de `:hover`.
JANELA_RE = re.compile(
    r"\.centerpill:hover\s+\.centerpill__lockup-name[^{]*\{[^}]*?max-width:\s*([^;}]+)",
    re.S,
)

# O gesto declarado: a transição da opacidade na regra de hover — duração, curva
# e atraso. Lida do arquivo para a captura poder provar que o nome não aparece de
# imediato sem que ninguém precise acreditar na palavra do comentário.
GESTO_RE = re.compile(
    r"\.centerpill:hover\s+\.centerpill__lockup-name[^{]*\{[^}]*?"
    r"opacity\s+([\d.]+s)\s+(cubic-bezier\([^)]*\))(?:\s+([\d.]+s))?",
    re.S,
)

# O bloco `@media (min-width: 768px)` que contém a revelação do nome. O padrão
# aceita **um** nível de chaves aninhadas, que é o que o bloco tem: a regra de
# hover com as declarações dela. Comentário com `{` ou `}` quebraria isto — não
# há nenhum, e é por isso que ele não entra nos comentários daquele bloco.
BLOCO_RE = re.compile(r"@media \(min-width:\s*768px\)\s*\{(?:[^{}]|\{[^{}]*\})*\}", re.S)

MODOS = {
    "--compacto": ("compacto", "prototipo-compacto.html"),
    "--hover": ("hover", "prototipo-hover.html"),
    "--minimizado": ("minimizado", "prototipo-minimizado.html"),
}

# O bloco de `lg` do cabeçalho é o que revela as duas laterais (`display:block` e
# `display:flex`) e dá à cápsula a largura cheia. O painel não chega aos 1024px,
# então nesta cópia o gatilho **deste bloco** desce a zero: as laterais passam a
# existir na largura do painel e podem ser medidas. É a única reescrita da cópia,
# e o aperto que ela produz no desenho é do painel, não do protótipo.
GATE_DAS_LATERAIS = "@media (min-width:1024px){"

# Só no modo `--hover`, e montado em tempo de geração: o bloco real do protótipo,
# com o gatilho rebaixado e o seletor preso a `#forcado`. Fora de `@media` de
# verdade (o `min-width` desce a zero) para valer na largura do painel, que não
# chega aos 768px.
ESTADO_FORCADO = """<style>
/* Estado de hover da cópia de conferência: o painel não tem como pairar o
   ponteiro. As declarações abaixo são as do bloco de 768px de `abertura.html`,
   copiadas sem reescrita; o que muda é o gatilho (`min-width: 0`) e o seletor,
   preso a `#forcado` — um identificador que a sonda põe na cápsula depois da
   carga, para a transição correr em vez de o estado já nascer pronto. */
%(bloco)s

/* E a entrada da marca não corre nesta cópia. Numa imagem parada ela fica presa
   no quadro inicial — a janela de 72px passa 520ms em zero —, e a sonda chegou a
   ler esse instante: a marca e o nome apareciam sobrepostos por 61,6px, um
   layout que não existe em nenhum lugar. O estado final é o que está declarado
   na regra base, a mesma garantia do bloco de movimento reduzido. */
.centerpill__reveal{animation:none}
</style>
""" % {"bloco": "%%BLOCO%%"}

SONDA = """<script>
/* ---------------------------------------------------------------------------
   Cópia de conferência (gerada por `prototipo-estado.py`). Não faz parte do
   site: é o protótipo mais uma rolagem, um estado disparado à mão e uma sonda.
--------------------------------------------------------------------------- */
(function () {
  "use strict";

  var pill = document.querySelector("[data-pill]");
  if (!pill) return;

  var modo = document.body.getAttribute("data-copia") || "";
  var nome = pill.querySelector(".centerpill__lockup-name");
  var link = pill.querySelector(".centerpill__link");
  var marca = pill.querySelector(".brand-logo, .centerpill__lockup");

  /* A janela e o gesto que o protótipo declara no hover. Vêm escritos pelo
     gerador, que os lê do próprio `abertura.html` — número copiado à mão é
     número que fica velho em silêncio. */
  var JANELA = "%%JANELA%%";
  var ENTRADA = "%%ENTRADA%%";
  var CURVA = "%%CURVA%%";
  var ATRASO = "%%ATRASO%%";

  var caixa = document.createElement("div");
  caixa.style.cssText = "position:fixed;top:0;left:0;z-index:9999;width:430px;" +
    "background:#fff;color:#000;border:2px solid #000;padding:6px 8px;" +
    "font:700 13px/1.45 ui-monospace,monospace;white-space:pre";
  document.body.appendChild(caixa);

  var notas = [];
  var curva = [];
  var lados = [];

  /* As duas laterais, no topo e depois de rolar. O modo `--minimizado` existe
     para provar a relação de causa: com a página no topo elas estão visíveis, e
     rolada a barra fica só com a marca. Uma linha por lateral e por momento. */
  function medirLaterais(quando) {
    var alvos = document.querySelectorAll(".nav-left, .nav-right");
    Array.prototype.forEach.call(alvos, function (el, i) {
      var cs = getComputedStyle(el);
      var r = el.getBoundingClientRect();
      lados.push(
        (i === 0 ? "nav " : "cont") +
        "  " + quando +
        "  " + (Math.round(parseFloat(cs.opacity) * 100) / 100).toFixed(2) +
        " " + cs.visibility +
        "  " + cs.display +
        "  x" + Math.round(r.left)
      );
    });
  }

  function medidaDoNome() {
    var anterior = nome.style.maxWidth;
    nome.style.maxWidth = "none";
    var natural = Math.ceil(nome.getBoundingClientRect().width);
    nome.style.maxWidth = anterior;
    return natural;
  }

  /* `comMedidas` é falso enquanto a curva está sendo amostrada. O motivo é
     concreto: `medidaDoNome()` põe `max-width: none` e devolve em seguida para
     ler a largura natural do texto, e fazer isso no meio da transição estraga
     justamente o que se quer medir — a janela salta para o valor final e a
     coluna `w` da curva passa a mostrar 187px desde o primeiro instante. A
     geometria é lida uma vez só, depois de a poeira baixar. */
  function mostrar(comMedidas) {
    var de = document.documentElement;
    var max = Math.max(0, de.scrollHeight - innerHeight);

    var linhas = [
      notas.join("  "),
      "rolagem   y=" + Math.round(scrollY) + "  max=" + Math.round(max),
      "caixa     " + pill.offsetWidth + "\\u00d7" + pill.offsetHeight,
      "encolhida " + (pill.classList.contains("is-compact") ? "SIM" : "n\\u00e3o")
    ];

    if (modo === "hover" && nome && link && comMedidas !== false) {
      var natural = medidaDoNome();
      var caixaMarca = marca ? marca.getBoundingClientRect().width : 0;
      var caixaNome = nome.getBoundingClientRect().width;
      var caixaLink = link.getBoundingClientRect().width;
      var vao = Math.round((nome.getBoundingClientRect().left -
        (marca ? marca.getBoundingClientRect().right : 0)) * 10) / 10;

      linhas.push("marca     " + Math.round(caixaMarca * 10) / 10 + "px");
      linhas.push("nome      " + natural + "px");
      linhas.push("nome agora " + Math.round(caixaNome * 10) / 10 + "px");
      linhas.push("vao       " + vao + "px");
      linhas.push("link      " + Math.round(caixaLink * 10) / 10 + "px");
      linhas.push("soma      " + Math.round((caixaMarca + vao + caixaNome) * 10) / 10 + "px");
      linhas.push("janela    " + JANELA);
      linhas.push("entrada   " + ENTRADA);
      linhas.push("curva     " + CURVA);
      linhas.push("atraso    " + ATRASO);
    }

    caixa.textContent = linhas.concat(lados).concat(curva).join("\\n");
  }

  function rolar() {
    var de = document.documentElement;
    var max = Math.max(0, de.scrollHeight - innerHeight);

    /* Página curta demais para conter a janela do estado encolhido: ganha
       comprimento no fim, que não desloca nada do cabeçalho. */
    if (max < 900) {
      document.body.style.minHeight = (innerHeight + 1400) + "px";
      notas.push("piso +1400px");
      max = Math.max(0, de.scrollHeight - innerHeight);
    }

    var alvo = Math.max(0, Math.min(Math.round(max * 0.6), max - 200));
    scrollTo(0, alvo);
    notas.push("alvo " + alvo);
    mostrar();

    setTimeout(function () {
      if (alvo > 0 && Math.round(scrollY) === 0) notas.push("rolagem travada");
      mostrar();
    }, 600);

    /* Leitura final. As duas primeiras saem com a largura da cápsula ainda
       mudando — a rolagem é suave e a transição de largura leva 600ms —, então
       elas servem para saber se a rolagem andou, não para medir. Aos 1600ms a
       poeira baixou e o número é o que fica na tela — e é aí que as laterais
       são lidas no estado de repouso do fim, depois de a transição de 300ms ter
       terminado. */
    if (modo === "minimizado") {
      setTimeout(function () {
        medirLaterais("rolada");
        mostrar();
      }, 1400);
    }

    setTimeout(mostrar, 1600);
  }

  /* A curva do gesto. O estado é disparado pelo identificador (a regra forçada
     da cópia só casa com `#forcado`), e não por uma classe posta no HTML: assim
     a transição tem de onde partir e os instantes abaixo medem movimento de
     verdade. `1200ms` é depois do fim declarado (300ms de atraso mais 700ms de
     transição), e é aí que a geometria passa a ser lida. */
  function disparar() {
    var pilula = pill.classList.contains("centerpill")
      ? pill
      : pill.querySelector(".centerpill");
    if (!pilula || !nome) return;

    var instantes = [0, 120, 300, 380, 500, 700, 900, 1200];
    pilula.id = "forcado";

    instantes.forEach(function (ms) {
      setTimeout(function () {
        var rn = nome.getBoundingClientRect();
        var rp = pilula.getBoundingClientRect();
        curva.push(
          "t=" + ms + "ms" +
          "  op=" + (Math.round(parseFloat(getComputedStyle(nome).opacity) * 100) / 100).toFixed(2) +
          "  w=" + Math.round(rn.width) + "px" +
          "  topo=" + (Math.round((rn.top - rp.top) * 10) / 10) + "px"
        );
        /* Sem medidas: ler a largura natural aqui no meio do gesto mudaria a
           janela e falsearia a própria curva (ver `mostrar`). */
        mostrar(false);
      }, ms + 1);
    });

    setTimeout(function () {
      mostrar(true);
    }, 1500);
  }

  /* `document.fonts.ready` antes de medir: com a fonte de rede ainda chegando,
     o texto seria medido na fonte de reserva — e a largura sairia errada, que é
     justamente o número que interessa aqui. */
  function comecar() {
    var pronto = document.fonts && document.fonts.ready
      ? document.fonts.ready
      : Promise.resolve();
    pronto.then(function () {
      /* Rolar só nos modos que dependem de rolagem: `--compacto` e
         `--minimizado`. No hover a cápsula cheia já é o estado, e rolar mudaria
         o que se quer ver. */
      if (modo === "compacto" || modo === "minimizado") {
        /* A leitura do topo, **antes** de rolar: é a metade "causa" da prova
           das laterais — visíveis com a página no topo, recolhidas depois. Tem
           de ser síncrona, porque a rolagem é suave e a 300ms a página já
           passou do limiar de 220px. */
        if (modo === "minimizado") {
          medirLaterais("topo");
          mostrar(false);
        }
        rolar();
      } else {
        /* Uma folga depois das fontes: medir no mesmo quadro em que a fonte
           entra ainda pega a largura antiga. */
        setTimeout(function () {
          /* Antes de disparar, sem medidas: medir aqui deixaria a janela em
             `none` no instante em que o gesto começa, e a transição do
             `max-width` partiria de um valor não interpolável. */
          mostrar(false);
          disparar();
        }, 300);
      }
    });
  }

  /* `load`, e não execução imediata: o protótipo mede a cápsula no próprio
     carregamento, e rolar antes disso deixaria o anel com a medida antiga. */
  addEventListener("load", comecar);
  addEventListener("scroll", mostrar, { passive: true });
})();
</script>
</body>"""


def main() -> int:
    modo = next((m for m in sys.argv[1:] if m in MODOS), None)
    if not modo:
        print(
            "uso: python3 design/prototipo-estado.py --compacto|--hover|--minimizado",
            file=sys.stderr,
        )
        return 1

    rotulo, arquivo = MODOS[modo]
    destino = AQUI / arquivo

    if not ORIGEM.exists():
        print(f"erro: {ORIGEM.name} não existe", file=sys.stderr)
        return 1

    html = ORIGEM.read_text(encoding="utf-8")
    antes = len(html)

    if html.count("</body>") != 1:
        print(
            f"erro: esperava um `</body>`, achei {html.count('</body>')}",
            file=sys.stderr,
        )
        return 1

    # No modo `--minimizado`, o bloco de `lg` do cabeçalho desce o gatilho a zero:
    # o painel não tem 1024px, e sem isso as duas laterais ficam `display:none` e
    # não há o que medir. Só **este** bloco é rebaixado (o que revela as laterais),
    # encontrado pelo seletor que só existe nele.
    if modo == "--minimizado":
        try:
            dentro = html.index(".nav-left{display:block}")
            inicio = html.rindex(GATE_DAS_LATERAIS, 0, dentro)
        except ValueError:
            print("erro: não achei o bloco de lg das laterais", file=sys.stderr)
            return 1
        html = (
            html[:inicio]
            + "@media (min-width:0px){"
            + html[inicio + len(GATE_DAS_LATERAIS) :]
        )
        print("ok  gatilho das laterais rebaixado para 0px (só neste modo)")

    # A janela e o gesto do nome, lidos do próprio protótipo e escritos na sonda.
    # Se a regra mudar de forma e o padrão não casar, a captura diz isso em letras
    # grandes em vez de mostrar um número velho.
    achado = JANELA_RE.search(html)
    janela = achado.group(1).strip() if achado else "não encontrada em abertura.html"

    achado = GESTO_RE.search(html)
    if achado:
        entrada, curva, atraso = achado.group(1), achado.group(2), achado.group(3) or "0s"
    else:
        entrada = curva = "não lido"
        atraso = "em abertura.html"

    # O bloco de 768px inteiro, com o gatilho rebaixado e o seletor preso ao
    # `#forcado`. As declarações saem do arquivo sem reescrita; o que muda é só
    # quem dispara o estado — e por isso a cópia não pode divergir do protótipo.
    blocos = [b for b in BLOCO_RE.findall(html) if ".centerpill__lockup-name" in b]
    if modo == "--hover" and len(blocos) != 1:
        print(
            f"erro: esperava 1 bloco de 768px com a revelação do nome, achei {len(blocos)}",
            file=sys.stderr,
        )
        return 1

    # O script do protótipo é o último do <body>; a sonda entra depois dele, para
    # o `read()` do protótipo já ter corrido quando a rolagem acontece.
    sonda = (
        SONDA.replace("%%JANELA%%", janela)
        .replace("%%ENTRADA%%", entrada)
        .replace("%%CURVA%%", curva)
        .replace("%%ATRASO%%", atraso)
    )
    html = html.replace("</body>", sonda, 1)
    html = html.replace("<body", f'<body data-copia="{rotulo}"', 1)

    if rotulo == "hover":
        bloco = sincronizado(blocos[0])
        html = html.replace(
            "</head>",
            ESTADO_FORCADO.replace("%%BLOCO%%", bloco) + "</head>",
            1,
        )

    destino.write_text(html, encoding="utf-8")
    print(
        f"ok — {destino.name}: {len(html)} bytes (antes {antes}) · "
        f"entrada {entrada} {curva} +{atraso}"
    )
    return 0


def sincronizado(bloco: str) -> str:
    """O bloco de 768px do protótipo, rebaixado e preso ao `#forcado`.

    Três passos, e os dois primeiros já foram esquecidos uma vez cada:

    1. **Tirar `:hover` e `:focus-within`.** Sem isso a regra copiada continua
       exigindo um ponteiro em cima da cápsula — que o painel não tem —, o
       identificador não muda nada e a sonda mede o repouso o tempo inteiro:
       `op=0.00` e `nome agora 0px` em todas as amostras.
    2. **Colar o `#forcado` no próprio `.centerpill`, sem espaço.** `#forcado
       .centerpill` procura um `.centerpill` *dentro* do elemento com o id, e o
       id está nele mesmo — não casa nunca. `.centerpill#forcado` casa.
    3. Como as duas cópias do seletor viram a mesma linha, sobra um `A, A { }`
       repetido, que é CSS válido.
    """
    bloco = re.sub(r"min-width:\s*768px", "min-width: 0", bloco)
    bloco = re.sub(r":hover|:focus-within", "", bloco)
    return re.sub(r"(?m)^(\s*)\.centerpill(?![\w-])", r"\1.centerpill#forcado", bloco)


if __name__ == "__main__":
    raise SystemExit(main())
