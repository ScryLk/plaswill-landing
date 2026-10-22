/**
 * Os dois ícones da abertura, desenhados aqui em vez de instalar `lucide-react`.
 *
 * A referência pede três ícones do lucide: ChevronDown, ArrowRight e Triangle.
 * Os traços são os mesmos — o desenho abaixo é o do lucide (licença ISC), com
 * os atributos de traço que ele usa —, mas vêm em linha porque o projeto não
 * tem nenhuma outra dependência de interface e dois traços não justificam um
 * pacote. O Triangle não entra: a marca da Plaswill é a assinatura central, não
 * um triângulo.
 *
 * O tamanho vem de fora (`className`), como no lucide: `h-3.5 w-3.5` etc.
 */

type IconProps = {
  className?: string;
  strokeWidth?: number;
};

export function ChevronDown({ className, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ArrowRight({ className, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
