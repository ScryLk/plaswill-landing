"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Reveal de entrada no scroll: opacity 0 → 1 e translateY de 12px em 700ms
 * com cubic-bezier(0.22, 1, 0.36, 1) — o mesmo gesto em toda a página.
 *
 * Sem JavaScript o conteúdo continua visível (ver .no-js em globals.css) e,
 * com prefers-reduced-motion, o bloco aparece direto, sem transição.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  /** Atraso em milissegundos, para escalonar cards dentro de uma grade. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={["reveal", className].filter(Boolean).join(" ")}
      data-visible={visible ? "true" : "false"}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
