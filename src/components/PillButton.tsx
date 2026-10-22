import type { ReactNode } from "react";

import { RegistrationMarks, type Corner } from "@/components/marks";

type Variant = "default" | "primary" | "onBand";

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  block?: boolean;
  className?: string;
  marks?: Corner[];
};

type AnchorProps = CommonProps & {
  href: string;
  type?: never;
  onClick?: never;
  disabled?: never;
};

type ButtonProps = CommonProps & {
  href?: undefined;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

function classes(variant: Variant, block: boolean, className?: string) {
  return [
    "pill",
    "t-button",
    variant === "primary" ? "pill-primary" : "",
    variant === "onBand" ? "pill-on-band" : "",
    block ? "pill-block" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Botão-pílula com marcas de registro nas quinas.
 * Renderiza <a> quando recebe href e <button> quando não recebe —
 * nenhuma das duas variantes depende de JavaScript no cliente.
 */
export function PillButton(props: AnchorProps | ButtonProps) {
  const { children, variant = "default", block = false, className, marks } = props;

  if (props.href !== undefined) {
    const external = /^(https?:|mailto:|tel:)/.test(props.href);
    return (
      <a
        className={classes(variant, block, className)}
        href={props.href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        <span>{children}</span>
        <RegistrationMarks corners={marks} />
      </a>
    );
  }

  return (
    <button
      className={classes(variant, block, className)}
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <span>{children}</span>
      <RegistrationMarks corners={marks} />
    </button>
  );
}
