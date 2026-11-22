import { NextResponse } from "next/server";
import { Resend } from "resend";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  message?: string;
};

const interestLabels: Record<string, string> = {
  "dx-web": "DX Web",
  webposto: "WebPosto",
  outro: "Outro assunto",
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const interest = body.interest?.trim() ?? "outro";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Nome, e-mail e mensagem são obrigatórios." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "DuplexSoft Site <onboarding@resend.dev>";

  if (!apiKey || !toEmail) {
    return NextResponse.json(
      {
        error:
          "Envio de e-mail não configurado. Defina RESEND_API_KEY e CONTACT_TO_EMAIL.",
      },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);
  const interestLabel = interestLabels[interest] ?? interest;

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: [toEmail],
    replyTo: email,
    subject: `[Site DuplexSoft] Contato — ${interestLabel}`,
    text: [
      `Nome: ${name}`,
      `E-mail: ${email}`,
      `Telefone: ${phone || "—"}`,
      `Interesse: ${interestLabel}`,
      "",
      "Mensagem:",
      message,
    ].join("\n"),
  });

  if (error) {
    return NextResponse.json(
      { error: "Não foi possível enviar o e-mail. Tente novamente." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
