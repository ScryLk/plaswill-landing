#!/usr/bin/env python3
"""
Gera `design/abertura-rodando.html`: uma captura autocontida da rota
`/abertura` **compilada**, para abrir sem servidor e sem JavaScript.

Por que existe: o painel de pré-visualização não roda o Next, e o `next start`
só serve em `localhost` na máquina em que está rodando. Este script pega o HTML
que o build realmente produziu, embute CSS, fontes e imagens, e devolve um
arquivo só — o que dá para mostrar a alguém (ou arquivar) sem instalar nada.

O que ele NÃO é: fonte da verdade. Se o código mudar, o arquivo fica velho até
alguém rodar isto de novo. A verdade é `src/` e o protótipo `abertura.html`.

Uso, com o servidor de produção no ar:

    npx next build
    npx next start -p 4326 &
    python3 design/snapshot.py 4326
    # gera design/abertura-rodando.html

Dois estados do cabeçalho não existem em repouso e saem por modo próprio:

    python3 design/snapshot.py 4326 --compacto   # cápsula central encolhida
    python3 design/snapshot.py 4326 --hover      # o nome ao lado da marca

E a home — a abertura seguida do corpo comercial — sai com `--home`, em
`design/home-rodando.html`. É o que permite olhar para a emenda entre a faixa
de conversão e as seções da landing sem um navegador à mão:

    python3 design/snapshot.py 4326 --home

Requer Tailwind instalado (`pnpm add -D tailwindcss@^3.4 postcss autoprefixer`),
senão o CSS sai sem utilitárias e a captura mostra a página sem layout.

Detalhe que já mordeu: ao reescrever `src="..."` para data URI é preciso
**fechar a aspa** no valor de retorno. Sem isso o atributo fica truncado e as
imagens aparecem quebradas — o arquivo continua abrindo, o que torna o erro
fácil de não notar.
"""

import base64
import pathlib
import re
import sys
import urllib.request

PORT = sys.argv[1] if len(sys.argv) > 1 else "4326"
BASE = f"http://127.0.0.1:{PORT}"

# Dois estados do cabeçalho não existem numa captura parada, e cada um tem o seu
# modo (ver o passo 5). O nome do arquivo muda para não sobrescrever a captura
# normal:
#
#   --compacto  a cápsula central encolhida (depende de onde a página está rolada)
#   --hover     o nome revelado ao lado da marca (depende do ponteiro em cima)
COMPACTO = "--compacto" in sys.argv
HOVER = "--hover" in sys.argv
HOME = "--home" in sys.argv

# A rota capturada. `/abertura` é a abertura isolada; `/` é a home, que desde
# 21/10 é a abertura com o corpo comercial embaixo.
ROTA = "/" if HOME else "/abertura"

SAIDA = pathlib.Path(
    "design/home-rodando.html"
    if HOME
    else "design/abertura-hover.html"
    if HOVER
    else "design/abertura-compacto.html"
    if COMPACTO
    else "design/abertura-rodando.html"
)


def get(url: str) -> bytes:
    with urllib.request.urlopen(BASE + url, timeout=30) as r:
        return r.read()


def main() -> None:
    html = get(ROTA).decode("utf-8")

    # 1. CSS inline, com as fontes embutidas
    fontes = 0
    blocos = []
    for url in sorted(set(re.findall(r'/_next/static/css/[^"]*\.css', html))):
        css = get(url).decode("utf-8")
        for fonte in sorted(set(re.findall(r'/_next/static/media/[^)"]*\.woff2', css))):
            css = css.replace(fonte, "data:font/woff2;base64," + base64.b64encode(get(fonte)).decode())
            fontes += 1
        blocos.append(css)

    # 2. imagens embutidas (a aspa final importa — ver docstring)
    imagens = 0

    def embutir(m: re.Match) -> str:
        nonlocal imagens
        prefixo, src = m.group(1), m.group(2)
        if src.startswith("data:"):
            return m.group(0)
        caminho = pathlib.Path("public") / src.lstrip("/")
        if not caminho.exists():
            return m.group(0)
        tipo = "image/jpeg" if caminho.suffix in (".jpg", ".jpeg") else "image/png"
        imagens += 1
        dados = base64.b64encode(caminho.read_bytes()).decode()
        return f'{prefixo}data:{tipo};base64,{dados}"'

    html = re.sub(r'(src=")([^"]+)"', embutir, html)

    # 3. sem JavaScript: é uma captura, não uma app
    html = re.sub(r"<script\b[^>]*>.*?</script>", "", html, flags=re.S)
    html = re.sub(r"<script\b[^>]*/?>", "", html)
    for rel in ("stylesheet", "preload", "modulepreload"):
        html = re.sub(r'<link[^>]*rel="%s"[^>]*>' % rel, "", html)
    html = re.sub(r'<link[^>]*as="font"[^>]*>', "", html)
    html = html.replace("</head>", "<style>\n%s\n</style>\n</head>" % "\n".join(blocos), 1)

    # 4. Animações assentadas no estado final.
    #
    # Numa captura estática, toda animação de entrada fica presa no **quadro
    # inicial** enquanto o `animation-fill-mode: both` segura o atraso: a
    # pílula central sai vazia por 520ms, o título invisível por 360ms, as
    # fotografias recortadas até 320ms. Numa imagem parada isso se lê como
    # defeito de layout, não como movimento.
    #
    # Desligar as animações resolve os três casos de uma vez — e resolve
    # porque as regras base já são o estado final, que é a mesma garantia que
    # o bloco `prefers-reduced-motion` de `abertura.css` usa. Sem atraso e sem
    # preenchimento, sobra o que interessa conferir aqui: desenho, hierarquia e
    # alinhamento. Movimento não se confere em imagem parada de qualquer forma.
    html = html.replace(
        "</head>",
        "<style>\n*,*::before,*::after{animation:none!important;transition:none!important}\n"
        "</style>\n</head>",
        1,
    )

    # 5. Estado encolhido, só com `--compacto`.
    #
    # O encolhimento é estado de cliente: o servidor não sabe onde a página está
    # rolada, então a marcação sai sempre com a cápsula cheia. Numa imagem parada,
    # o jeito de olhar para o outro estado é forçar a largura que o React poria —
    # e é justamente essa largura que se quer conferir: se o logotipo cabe nos
    # 94px com a mesma folga que ele já tem em cima e embaixo.
    #
    # Fica **fora** de `@layer`: o CSS do projeto inteiro está em
    # `@layer components`, e regra sem camada vence qualquer camada. É o degrau
    # mais alto da cascata, e é o que se quer aqui.
    #
    # O anel de progresso **não** aparece nesta captura. Ele depende de medir a
    # cápsula, então só existe depois da hidratação — e é o que a moldura
    # `design/cabecalho.html` mostra à parte.
    if COMPACTO:
        html = html.replace(
            "</head>",
            "<style>\n@media (min-width:1024px){.centerpill{width:94px!important}}\n"
            "</style>\n</head>",
            1,
        )

    # 5b. Estado de hover, só com `--hover`.
    #
    # O nome ao lado da marca aparece com o ponteiro em cima da cápsula, e
    # ponteiro não se fotografa. Força-se **só a revelação** — as três
    # declarações da regra de `:hover` —, com a janela aberta de propósito: o que
    # se quer ver aqui é o desenho do nome inteiro, e não o texto recortado por um
    # número. Quem confere se a janela declarada basta é a sonda da moldura do
    # protótipo, que imprime a largura natural do texto e o número da regra lado
    # a lado.
    #
    # A largura da cápsula não entra: no estado cheio ela já é o padrão do
    # servidor, e pairar a cápsula encolhida a devolve justamente a ele — a
    # imagem serve para os dois casos.
    #
    # Também aqui fora de `@layer`, pelo mesmo motivo do `--compacto`.
    if HOVER:
        html = html.replace(
            "</head>",
            "<style>\n"
            "@media (min-width:768px){"
            ".centerpill .centerpill__lockup-name{"
            "max-width:none!important;margin-left:.5rem!important;opacity:1!important}}\n"
            "</style>\n</head>",
            1,
        )

    estado = (
        "cápsula central encolhida"
        if COMPACTO
        else "cabeçalho com o ponteiro em cima"
        if HOVER
        else "animações assentadas"
    )
    aviso = (
        '<p style="position:fixed;left:12px;bottom:12px;z-index:9999;margin:0;'
        "font:11px/1.4 ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase;"
        "color:#334155;background:rgba(255,255,255,.9);border:1px dashed rgba(51,65,85,.35);"
        f'padding:6px 10px">rota {ROTA} compilada · sem javascript · {estado}</p>'
    )
    html = html.replace("</body>", aviso + "</body>", 1)

    SAIDA.write_text(html, encoding="utf-8")
    print(f"{SAIDA} — {len(html)//1024} KB, {fontes} fontes, {imagens} imagens")


if __name__ == "__main__":
    main()
