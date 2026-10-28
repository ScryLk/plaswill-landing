"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { track } from "@/lib/analytics";

import { contact, quoteForm, site } from "@/content/site";

import { PillButton } from "./PillButton";
import { RegistrationMarks } from "./marks";

type Values = {
  name: string;
  company: string;
  email: string;
  phone: string;
  segment: string;
  product: string;
  volume: string;
  message: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = {
  name: "",
  company: "",
  email: "",
  phone: "",
  segment: "",
  product: "",
  volume: "",
  message: "",
};

function buildMessage(values: Values) {
  const lines = [
    "Pedido de orçamento — site Plaswill",
    "",
    `Nome: ${values.name}`,
    `Empresa: ${values.company}`,
    values.email ? `E-mail: ${values.email}` : null,
    `Telefone: ${values.phone}`,
    values.segment ? `Segmento: ${values.segment}` : null,
    values.product ? `Produto: ${values.product}` : null,
    values.volume ? `Volume estimado: ${values.volume}` : null,
    values.message ? "" : null,
    values.message ? `Detalhe técnico: ${values.message}` : null,
  ].filter((line): line is string => line !== null);

  return lines.join("\n");
}

/**
 * Pedido de orçamento sem backend.
 *
 * O formulário valida no cliente e entrega o pedido pronto no WhatsApp comercial
 * (canal que a empresa já usa), com alternativa por e-mail. Nenhuma credencial
 * no navegador e nenhum serviço externo nesta fase.
 *
 * Próximo passo, quando houver necessidade comprovada: uma rota /api/orcamento
 * com envio por e-mail transacional e registro em CRM.
 */
export function QuoteForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [waHref, setWaHref] = useState<string | null>(null);
  const started = useRef(false);

  /**
   * O catálogo avisa aqui qual produto gerou o "Pedir amostra".
   *
   * O botão da ficha dispara `plaswill:produto` com o nome do item, e o select
   * já chega preenchido. A alternativa era mandar o produto na URL e reler no
   * formulário: funciona, mas quebraria o salto de âncora em navegação de
   * página inteira para um movimento que é dentro da mesma tela.
   *
   * `CustomEvent` e não contexto do React porque os dois componentes vivem em
   * ramos diferentes da árvore da página, e criar um provider acima do `<main>`
   * para transportar uma string seria mais estrutura do que o problema pede.
   */
  useEffect(() => {
    const onProduct = (event: Event) => {
      const name = (event as CustomEvent<string>).detail;
      if (typeof name !== "string") return;

      setValues((current) => ({ ...current, product: name }));
      setErrors((current) => ({ ...current, product: undefined }));
    };

    window.addEventListener("plaswill:produto", onProduct);
    return () => window.removeEventListener("plaswill:produto", onProduct);
  }, []);

  function update<K extends keyof Values>(key: K, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Errors = {};

    if (!values.name.trim()) next.name = "Informe o nome de contato.";
    if (!values.company.trim()) next.company = "Informe a empresa.";
    if (!values.phone.trim()) next.phone = "Informe um telefone ou WhatsApp.";
    if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
      next.email = "Confira o formato do e-mail.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const valid = validate();
    track("quote_validation_attempted", { section: "orcamento", product: values.product, valid });
    if (!valid) return;

    const href = `${site.whatsapp.href}?text=${encodeURIComponent(buildMessage(values))}`;
    setWaHref(href);
    setSent(true);
    track("quote_whatsapp_open_attempted", { section: "orcamento", product: values.product });
    window.open(href, "_blank", "noopener,noreferrer");
  }

  const mailtoHref = `mailto:${site.emails.commercial}?subject=${encodeURIComponent(
    "Pedido de orçamento — site Plaswill",
  )}&body=${encodeURIComponent(buildMessage(values))}`;

  if (sent) {
    return (
      <div className="form-success">
        <h3 className="t-subhead">{quoteForm.success.title}</h3>
        <p className="t-small c-muted">{quoteForm.success.body}</p>

        <div className="cluster">
          {waHref ? (
            <PillButton href={waHref} variant="primary">
              Abrir no WhatsApp
            </PillButton>
          ) : null}
          <PillButton href={mailtoHref} variant="onBand" marks={["tl", "br"]}>
            Enviar por e-mail
          </PillButton>
        </div>

        <button
          type="button"
          className="t-caption c-muted link-underline"
          onClick={() => setSent(false)}
        >
          Revisar os dados preenchidos
        </button>
      </div>
    );
  }

  return (
    <form className="quote-form" onSubmit={handleSubmit} noValidate onFocus={() => {
      if (!started.current) {
        started.current = true;
        track("quote_form_started", { section: "orcamento", product: values.product });
      }
    }}>
      <div className="form-grid">
        <div className="field">
          <label className="t-eyebrow" htmlFor="f-name">
            {quoteForm.fields.name.label}
          </label>
          <input
            id="f-name"
            className="input t-small"
            autoComplete="name"
            placeholder={quoteForm.fields.name.placeholder}
            value={values.name}
            aria-invalid={errors.name ? "true" : undefined}
            aria-describedby={errors.name ? "f-name-error" : undefined}
            onChange={(event) => update("name", event.target.value)}
          />
          {errors.name ? (
            <p className="t-caption field-error" id="f-name-error">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label className="t-eyebrow" htmlFor="f-company">
            {quoteForm.fields.company.label}
          </label>
          <input
            id="f-company"
            className="input t-small"
            autoComplete="organization"
            placeholder={quoteForm.fields.company.placeholder}
            value={values.company}
            aria-invalid={errors.company ? "true" : undefined}
            aria-describedby={errors.company ? "f-company-error" : undefined}
            onChange={(event) => update("company", event.target.value)}
          />
          {errors.company ? (
            <p className="t-caption field-error" id="f-company-error">
              {errors.company}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label className="t-eyebrow" htmlFor="f-email">
            {quoteForm.fields.email.label}
          </label>
          <input
            id="f-email"
            className="input t-small"
            type="email"
            autoComplete="email"
            placeholder={quoteForm.fields.email.placeholder}
            value={values.email}
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={errors.email ? "f-email-error" : undefined}
            onChange={(event) => update("email", event.target.value)}
          />
          {errors.email ? (
            <p className="t-caption field-error" id="f-email-error">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label className="t-eyebrow" htmlFor="f-phone">
            {quoteForm.fields.phone.label}
          </label>
          <input
            id="f-phone"
            className="input t-small"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder={quoteForm.fields.phone.placeholder}
            value={values.phone}
            aria-invalid={errors.phone ? "true" : undefined}
            aria-describedby={errors.phone ? "f-phone-error" : undefined}
            onChange={(event) => update("phone", event.target.value)}
          />
          {errors.phone ? (
            <p className="t-caption field-error" id="f-phone-error">
              {errors.phone}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label className="t-eyebrow" htmlFor="f-segment">
            {quoteForm.fields.segment.label}
          </label>
          <select
            id="f-segment"
            className="select t-small"
            value={values.segment}
            onChange={(event) => update("segment", event.target.value)}
          >
            <option value="">{quoteForm.fields.segment.placeholder}</option>
            {quoteForm.segmentOptions.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="t-eyebrow" htmlFor="f-product">
            {quoteForm.fields.product.label}
          </label>
          <select
            id="f-product"
            className="select t-small"
            value={values.product}
            onChange={(event) => update("product", event.target.value)}
          >
            <option value="">{quoteForm.fields.product.placeholder}</option>
            {quoteForm.productOptions.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="field form-span">
          <label className="t-eyebrow" htmlFor="f-volume">
            {quoteForm.fields.volume.label}
          </label>
          <input
            id="f-volume"
            className="input t-small"
            placeholder={quoteForm.fields.volume.placeholder}
            value={values.volume}
            onChange={(event) => update("volume", event.target.value)}
          />
        </div>

        <div className="field form-span">
          <label className="t-eyebrow" htmlFor="f-message">
            {quoteForm.fields.message.label}
          </label>
          <textarea
            id="f-message"
            className="textarea t-small"
            placeholder={quoteForm.fields.message.placeholder}
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
          />
        </div>
      </div>

      <div className="quote-actions">
        <button type="submit" className="pill pill-primary t-button">
          <span>{quoteForm.submitLabel}</span>
          <RegistrationMarks />
        </button>

        <p className="t-caption c-muted quote-consent">{quoteForm.consent}</p>
        <p className="t-caption c-muted">{contact.responseNote}</p>
      </div>
    </form>
  );
}
