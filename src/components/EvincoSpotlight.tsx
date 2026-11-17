import Image from "next/image";
import Link from "next/link";

/**
 * Destaque institucional comemorativo da presença no EVINCO 2026.
 *
 * Posicionado na home com grande visibilidade logo na primeira dobra,
 * celebrando o evento industrial, comercial e agropecuário de Panambi/RS.
 */
export function EvincoSpotlight() {
  return (
    <section id="evinco" className="section !py-8 md:!py-12 bg-gradient-to-b from-[#F8FAFC] via-[#EDF1F3] to-[#F1F5F9] border-y border-solid border-slate-200/80">
      <div className="wrap">
        <div className="relative overflow-hidden rounded-2xl bg-[#0F172A] p-6 shadow-xl sm:p-8 md:p-10 border border-solid border-slate-800">
          {/* Luz de fundo decorativa com o amarelo institucional */}
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#FFDE00]/10 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-[#09506A]/20 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
            {/* Coluna de Conteúdo */}
            <div className="flex flex-col items-start text-left">
              {/* Badge de Destaque */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-solid border-[#FFDE00]/30 bg-[#FFDE00]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#FFDE00]">
                <span className="h-2 w-2 rounded-full bg-[#FFDE00] animate-pulse"></span>
                <span>Notícia em Destaque • Panambi / RS</span>
              </div>

              {/* Logotipos: EVINCO 2026 + Plaswill */}
              <div className="mb-5 flex flex-wrap items-center gap-4 border-b border-solid border-slate-800/80 pb-5">
                <Image
                  src="/brand/evinco-logo.png"
                  alt="Logotipo Oficial EVINCO 2026"
                  width={180}
                  height={46}
                  className="h-9 w-auto object-contain brightness-110"
                />
                <span className="text-slate-600 text-lg font-light">✕</span>
                <Image
                  src="/brand/plaswill-logotipo.png"
                  alt="Logotipo Plaswill"
                  width={140}
                  height={42}
                  className="h-8 w-auto object-contain"
                />
              </div>

              {/* Título Principal */}
              <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl text-balance">
                Plaswill confirma presença no EVINCO 2026
              </h2>

              {/* Texto de Apoio */}
              <p className="mt-3.5 text-base leading-relaxed text-slate-300 md:text-lg">
                Com muito orgulho de nossas raízes, confirmamos nossa participação na maior
                feira de indústria, comércio, agronegócio e serviços de Panambi. Venha visitar
                nosso espaço de <strong>18 a 22 de novembro</strong> no Parque de Eventos e celebrar conosco a força produtiva de nossa terra!
              </p>

              {/* Pílulas de Informações do Evento */}
              <div className="mt-5 flex flex-wrap gap-2.5 sm:gap-3 text-xs md:text-sm text-slate-300">
                <div className="inline-flex items-center gap-2 rounded-lg bg-slate-800/80 px-3 py-1.5 border border-slate-700/60">
                  <svg className="h-4 w-4 text-[#FFDE00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"></line>
                    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"></line>
                    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"></line>
                  </svg>
                  <span>18 a 22 de Novembro de 2026</span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-lg bg-slate-800/80 px-3 py-1.5 border border-slate-700/60">
                  <svg className="h-4 w-4 text-[#FFDE00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>Panambi — Rio Grande do Sul</span>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/noticias/plaswill-confirma-presenca-no-evinco-2026"
                  className="inline-flex items-center gap-2 rounded-full bg-[#FFDE00] px-5 py-2.5 text-sm font-semibold text-[#0F172A] shadow-md transition-all hover:bg-[#FFE600] hover:shadow-lg hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFDE00]"
                >
                  <span>Ler notícia completa</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <a
                  href="https://www.evinco.com.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/60 px-5 py-2.5 text-sm font-medium text-slate-200 backdrop-blur-sm transition-all hover:border-slate-500 hover:bg-slate-700/60 hover:text-white"
                >
                  <span>Site oficial da feira</span>
                  <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Coluna da Imagem / Cartão Visual */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <Link
                href="/noticias/plaswill-confirma-presenca-no-evinco-2026"
                className="group block relative overflow-hidden rounded-xl border border-solid border-slate-700/80 bg-slate-900 shadow-2xl transition-all hover:border-[#FFDE00]/60 hover:shadow-[#FFDE00]/10"
              >
                <div className="aspect-square relative w-full overflow-hidden">
                  <Image
                    src="/images/evinco/montagem-quadrado.webp"
                    alt="Montagem Oficial Plaswill no EVINCO 2026"
                    fill
                    sizes="(min-width: 1024px) 460px, (min-width: 640px) 420px, 90vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-lg bg-black/60 px-3 py-2 backdrop-blur-md border border-white/10">
                  <span className="text-xs font-medium text-white">18 a 22 de Novembro • Panambi/RS</span>
                  <span className="text-xs font-semibold text-[#FFDE00] group-hover:underline">Ver detalhes →</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
