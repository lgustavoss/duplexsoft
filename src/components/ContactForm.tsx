"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { siteConfig } from "@/lib/site";

type Status = "idle" | "loading" | "success" | "error";

type FieldErrors = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

const interests = [
  { value: "webposto", label: "WebPosto" },
  { value: "dx-web", label: "DX Web" },
  { value: "outro", label: "Outro assunto" },
] as const;

const fieldClass =
  "rounded-xl border border-line bg-white px-3 py-2.5 text-foreground caret-[var(--brand)] outline-none ring-brand/30 placeholder:text-muted focus:ring-2";

const fieldErrorClass =
  "rounded-xl border border-red-400 bg-white px-3 py-2.5 text-foreground caret-[var(--brand)] outline-none ring-red-300/40 placeholder:text-muted focus:ring-2";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPlausiblePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 13;
}

export function ContactForm() {
  const searchParams = useSearchParams();
  const initialInterest = useMemo(() => {
    const value = searchParams.get("interesse");
    return interests.some((item) => item.value === value) ? value! : "webposto";
  }, [searchParams]);

  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  function focusFirstError(nextErrors: FieldErrors) {
    const order: Array<[keyof FieldErrors, HTMLElement | null]> = [
      ["name", nameRef.current],
      ["email", emailRef.current],
      ["phone", phoneRef.current],
      ["message", messageRef.current],
    ];
    for (const [key, node] of order) {
      if (nextErrors[key] && node) {
        node.focus();
        const reduceMotion =
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        node.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "center",
        });
        break;
      }
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const interest = String(data.get("interest") ?? "");
    const body = String(data.get("message") ?? "").trim();

    const nextErrors: FieldErrors = {};
    if (!name) nextErrors.name = "Informe seu nome.";
    if (!email) nextErrors.email = "Informe um e-mail.";
    else if (!isValidEmail(email)) nextErrors.email = "Digite um e-mail válido.";
    if (phone && !isPlausiblePhone(phone)) {
      nextErrors.phone = "Use um telefone com DDD, por exemplo (34) 99706-0684.";
    }
    if (!body) nextErrors.message = "Escreva uma mensagem sobre o que você precisa.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus("error");
      setMessage("Revise os campos destacados e tente novamente.");
      queueMicrotask(() => focusFirstError(nextErrors));
      return;
    }

    setErrors({});
    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, interest, message: body }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Não foi possível enviar a mensagem.");
      }

      form.reset();
      setStatus("success");
      setMessage("Mensagem enviada. Retornaremos pelo e-mail informado.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Falha no envio. Tente novamente ou fale pelo WhatsApp.",
      );
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="surface-panel rounded-[var(--radius)] p-6 md:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="font-medium">
            Nome <span className="text-muted">(obrigatório)</span>
          </span>
          <input
            ref={nameRef}
            required
            name="name"
            aria-required="true"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "error-name" : undefined}
            className={errors.name ? fieldErrorClass : fieldClass}
            onChange={() => setErrors((current) => ({ ...current, name: undefined }))}
          />
          {errors.name ? (
            <span id="error-name" className="text-xs text-red-700">
              {errors.name}
            </span>
          ) : null}
        </label>

        <label className="grid gap-2 text-sm">
          <span className="font-medium">
            E-mail <span className="text-muted">(obrigatório)</span>
          </span>
          <input
            ref={emailRef}
            required
            type="email"
            name="email"
            aria-required="true"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "error-email" : undefined}
            className={errors.email ? fieldErrorClass : fieldClass}
            onChange={() => setErrors((current) => ({ ...current, email: undefined }))}
          />
          {errors.email ? (
            <span id="error-email" className="text-xs text-red-700">
              {errors.email}
            </span>
          ) : null}
        </label>

        <label className="grid gap-2 text-sm">
          <span className="font-medium">
            Telefone <span className="text-muted">(opcional)</span>
          </span>
          <input
            ref={phoneRef}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(34) 90000-0000"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "error-phone" : undefined}
            className={errors.phone ? fieldErrorClass : fieldClass}
            onChange={() => setErrors((current) => ({ ...current, phone: undefined }))}
          />
          {errors.phone ? (
            <span id="error-phone" className="text-xs text-red-700">
              {errors.phone}
            </span>
          ) : null}
        </label>

        <label className="grid gap-2 text-sm">
          <span className="font-medium">Interesse</span>
          <select name="interest" defaultValue={initialInterest} className={fieldClass}>
            {interests.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-5 grid gap-2 text-sm">
        <span className="font-medium">
          Mensagem <span className="text-muted">(obrigatório)</span>
        </span>
        <textarea
          ref={messageRef}
          required
          name="message"
          aria-required="true"
          rows={5}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "error-message" : undefined}
          className={`resize-y ${errors.message ? fieldErrorClass : fieldClass}`}
          placeholder="Conte um pouco sobre sua operação e o que você precisa."
          onChange={() => setErrors((current) => ({ ...current, message: undefined }))}
        />
        {errors.message ? (
          <span id="error-message" className="text-xs text-red-700">
            {errors.message}
          </span>
        ) : null}
      </label>

      <div className="mt-6 flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "loading" ? "Enviando..." : "Enviar mensagem"}
          </button>
          <a
            href={siteConfig.phone.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ou fale pelo WhatsApp ${siteConfig.phone.display} (abre em nova aba)`}
            className="text-sm font-semibold text-brand hover:text-brand-deep"
          >
            Ou fale pelo WhatsApp {siteConfig.phone.display}
          </a>
        </div>
        {message ? (
          <p
            className={`text-sm ${status === "success" ? "text-brand" : "text-red-700"}`}
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
