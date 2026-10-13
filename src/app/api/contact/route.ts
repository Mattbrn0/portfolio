import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { profile } from "@content/projects";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(160),
  company: z.string().trim().max(80).optional(),
  message: z.string().trim().min(12).max(4000),
  website: z.string().optional(),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const limit = rateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json({ ok: false, code: "send" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, code: "invalid" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, code: "invalid" }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || profile.email;
  if (!key || !from) {
    return NextResponse.json({ ok: false, code: "send" }, { status: 503 });
  }

  const { name, email, company, message } = parsed.data;
  const resend = new Resend(key);

  try {
    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Portfolio — ${name}`,
      text: [`Nom : ${name}`, `Email : ${email}`, company ? `Structure : ${company}` : "", "", message]
        .filter(Boolean)
        .join("\n"),
    });
  } catch {
    return NextResponse.json({ ok: false, code: "send" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
