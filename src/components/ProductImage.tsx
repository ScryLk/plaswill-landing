"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * A foto do produto, quando existe uma que pode ser publicada.
 *
 * Três decisões que valem explicação:
 *
 * 1. **`fill` em vez de largura e altura fixas.** As imagens do acervo têm
 *    proporções diferentes entre si — quadradas, retrato, quase quadradas. Com
 *    `fill` e uma moldura de proporção fixa, todas ocupam o mesmo espaço na
 *    ficha sem distorcer o produto. Distorcer embalagem é o pior defeito
 *    possível numa página de embalagem: a pessoa avalia a peça pela imagem.
 *
 * 2. **`object-fit: contain`, não `cover`.** `cover` preenche a moldura
 *    cortando as bordas, e o que fica de fora, num recorte de produto, costuma
 *    ser justamente a aba, o fundo ou a alça que identificam o item.
 *
 * 3. **Se a imagem falhar, o componente desaparece.** Um ícone de imagem
 *    quebrada no meio da ficha técnica é pior do que a ausência da foto, e o
 *    card continua legível com a prancha técnica, que já está ali ao lado. Por
 *    isso o estado de erro existe: preferimos não mostrar nada a mostrar um
 *    retângulo vazio com borda.
 *
 * O texto alternativo vem do manifesto, junto com o veredito da imagem. Não há
 * caminho em que uma foto entre sem descrição.
 */
export function ProductImage({
  src,
  alt,
  sizes = "(min-width: 1024px) 420px, (min-width: 768px) 45vw, 88vw",
}: {
  src: string;
  alt: string;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <figure className="prod-photo">
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="prod-photo__img"
        onError={() => setFailed(true)}
      />
    </figure>
  );
}
