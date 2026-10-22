# Arquivos de marca

## Logotipo — basta copiar o arquivo

O build detecta automaticamente um destes arquivos (nesta ordem), resolvidos em
`src/lib/brand.ts`:

1. `plaswill-logo.svg`
2. `plaswill-logo.png`
3. `plaswill-logotipo.png` ← **o oficial está aqui hoje**

Ao encontrar o arquivo, a navegação, o rodapé e a abertura passam a exibi-lo no
lugar da assinatura tipográfica provisória. Nenhuma alteração de código é
necessária; depois de copiar ou trocar o arquivo, basta reiniciar o servidor de
desenvolvimento (ou refazer o build).

Enquanto não houver arquivo, o site usa o componente
`src/components/Wordmark.tsx`, que escreve o nome em tipografia — sem imitar a
marca, conforme a regra do projeto de não recriar logotipo aproximado.

### Sobre o arquivo em uso

O oficial é um **campo amarelo fechado** com "Plaswill" e "Embalagens" em tinta
escura por dentro, mais um filete branco de 3px contornando a forma. Duas
consequências práticas:

- **Não precisa de placa.** Uma versão anterior deste documento pedia placa
  branca no rodapé, por precaução enquanto a arte era desconhecida. O logotipo
  real já traz o próprio fundo: sobre o slate do rodapé o amarelo entrega
  13,35:1 sozinho, e uma placa branca em volta só criaria um retângulo claro com
  um adesivo amarelo dentro. Por isso o `Wordmark` não põe placa em lugar
  nenhum.
- **O filete branco é de projeto, não defeito de recorte.** Ele aparece como um
  contorno fino sobre fundos escuros. É para isso que serve: separar a marca de
  qualquer fundo. Não remova.

**Resolução.** O arquivo tem 246×106 px, o que atende a exibição de 32px de
altura até telas 3x — no limite. Se aparecer o vetor (`.ai`, `.eps`, `.svg`) ou
um PNG maior, troque o arquivo mantendo o nome: nada mais precisa mudar, e a
marca ganha nitidez em telas densas.

**Proporção.** O componente não fixa largura justamente para aceitar um arquivo
de proporção diferente sem deformar a marca. Se o manual da marca publicar uma
versão específica para fundo escuro, ela deve ter prioridade no resolvedor.

### O símbolo isolado não existe — verificado em 21/10

A pílula central da abertura queria o efeito do Antimetal (primeiro o ícone,
depois o nome desenrola ao lado), e ele exige **duas peças soltas**. Não há.

O Lucas enviou o logotipo de novo em 21/10 para destravar o efeito; o arquivo
era **byte a byte idêntico** ao que já estava aqui — mesmo md5 `f407a461c4…`,
mesmos 9.362 bytes, mesmas 246×106 — e o mostruário trazia esse mesmo arquivo
oito vezes, só em escalas diferentes. A anatomia confirma: o campo amarelo
cobre 59% dos pixels e a tinta escura atravessa x=32..224, ou seja, "Plaswill"
e "Embalagens" estão **dentro** da forma, de ponta a ponta. As 62 colunas que
têm só amarelo são as folgas entre letras, não um grafismo à parte.

Sem símbolo, a pílula central revela o **logotipo inteiro** por uma janela de
largura que cresce — mesmo movimento, mesmos 600ms, mesma curva. Para ativar o
efeito literal, basta copiar o símbolo aqui com um destes nomes:

1. `plaswill-simbolo.svg`
2. `plaswill-simbolo.png`
3. `plaswill-simbolo.webp`

`src/lib/brand.ts` detecta sozinho e a pílula passa a mostrar símbolo + nome
em tipografia, sem tocar em componente nenhum. **Não fabrique um símbolo**
recortando a letra P ou a forma amarela: seria criar uma marca que a identidade
não tem, e a regra do projeto proíbe recriar a marca. Se a Plaswill quiser um
símbolo, ele tem de vir de quem fez a identidade.

## Demais arquivos

- `plaswill-simbolo.svg` — símbolo isolado, se houver (ainda não usado)
- favicon: `src/app/favicon.ico` (o Next detecta automaticamente) ou `icon.svg` na mesma pasta
- fotografias da fábrica, equipamentos e produtos: pasta `public/photos/`
  (a abertura espera `plaswill-aerea.jpg`; enquanto não houver, ela mostra o
  campo de grânulos)
