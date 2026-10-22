import { AberturaContato } from "@/components/abertura/AberturaContato";
import { AberturaHero } from "@/components/abertura/AberturaHero";
import { AberturaNav } from "@/components/abertura/AberturaNav";
import {
  findAerialPhoto,
  findBrandLogo,
  findBrandSymbol,
  findFacadePhoto,
} from "@/lib/brand";

/**
 * Abertura cinematográfica — navbar fixa, hero de tela cheia, faixa de clientes
 * e o pedido comercial. Nada mais abaixo disso, por decisão de projeto.
 *
 * Os quatro arquivos de marca são resolvidos em tempo de build: basta copiar o
 * logotipo e, se houver, o símbolo em `public/brand/`, mais a foto aérea e a
 * foto da fachada em `public/photos/` para a página passar a usá-los, sem
 * tocar em código. Sem qualquer um deles, o espaço correspondente não é
 * desenhado — nunca é preenchido com um desenho genérico.
 *
 * O símbolo é o único opcional: sem ele a pílula central revela o logotipo
 * inteiro, com o mesmo movimento (ver `AberturaNav`).
 */
export default function AberturaPage() {
  const logoSrc = findBrandLogo();
  const symbolSrc = findBrandSymbol();
  const photoSrc = findAerialPhoto();
  const facadeSrc = findFacadePhoto();

  return (
    <>
      <AberturaNav logoSrc={logoSrc} symbolSrc={symbolSrc} />
      <main id="conteudo">
        <AberturaHero photoSrc={photoSrc} facadeSrc={facadeSrc} />
        <AberturaContato />
      </main>
    </>
  );
}
