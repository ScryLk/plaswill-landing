import { abertura, contact, site } from "@/content/site";

/**
 * FAIXA DE CONVERSÃO DA ABERTURA — o pedido, no corpo da página.
 *
 * **Por que existe.** Até 21/10 a abertura inteira tinha um único caminho para o
 * comercial: a cápsula da barra. O corpo da página não pedia nada — por decisão
 * do spec de referência, que proíbe botão no hero — e o resultado era a peça
 * mais bem-acabada do projeto gerando zero contato. Esta faixa é o degrau que
 * faltava, e ela fica **abaixo da faixa de clientes**, depois que o visitante já
 * viu quem confia na Plaswill.
 *
 * **Nenhuma linha aqui é nova.** A frase de apoio é a `tagline` do site, a nota é
 * a `responseNote` do contato, e os quatro canais são os que o dossiê confirma:
 * o formulário (`abertura.cta`), o WhatsApp (`abertura.secondaryCta`), o telefone
 * e o e-mail comercial. Não há promessa, número nem prazo escrito nesta faixa —
 * o que não existe no dossiê não existe aqui.
 *
 * **Por que o botão principal sai da página.** `abertura.cta.href` é
 * `/#orcamento`, o formulário da landing institucional. Não é descuido: é o
 * formulário que já existe, e criar um segundo exigiria decidir para onde ele
 * envia — o que é assunto da integração comercial, não desta faixa. Quando a
 * abertura virar a página inicial, é este href que muda (ver README).
 *
 * **Contraste.** O botão leva `bg-brand-slate` com texto branco e troca para o
 * amarelo institucional com tinta escura no hover — 13,35:1, o par de maior
 * contraste da paleta, o mesmo do CTA da barra. O amarelo entra como
 * preenchimento, nunca como texto sobre claro.
 */
export function AberturaContato() {
  return (
    <section className="conversao" aria-label="Contato comercial">
      <div className="conversao__linha">
        <div className="conversao__texto">
          {/* A mesma voz da etiqueta da faixa de clientes: caixa alta, 13px,
              entreletra larga. Aqui ela apresenta o bloco, não conta cliente. */}
          <p className="conversao__sobretitulo">{site.tagline}</p>
          <p className="conversao__nota">{contact.responseNote}</p>

          <ul className="conversao__canais">
            <li>
              <a href={site.phone.href}>{site.phone.label}</a>
            </li>
            <li>
              <a href={`mailto:${site.emails.commercial}`}>{site.emails.commercial}</a>
            </li>
          </ul>
        </div>

        <div className="conversao__acoes">
          <a
            className="elastic relative flex items-center rounded-full bg-brand-slate px-5 py-2.5 text-sm text-white hover:bg-brand-yellow hover:text-brand-slate"
            href={abertura.cta.href}
          >
            {abertura.cta.label}
          </a>
          <a
            className="pill-link block"
            href={abertura.secondaryCta.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {abertura.secondaryCta.label}
          </a>
        </div>
      </div>
    </section>
  );
}
