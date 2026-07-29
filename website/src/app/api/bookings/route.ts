import { db } from "@/db";
import { bookings } from "@/db/schema";

export const dynamic = "force-dynamic";

type Payload = {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  preferredDate?: string;
  requirement?: string;
  notes?: string;
  source?: string;
  /** Honeypot — real people never fill this in. */
  company?: string;
};

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  // Silently accept and discard bot submissions.
  if (clean(body.company, 80)) {
    return Response.json({ ok: true, id: null }, { status: 201 });
  }

  const name = clean(body.name, 120);
  const phone = clean(body.phone, 40);
  const city = clean(body.city, 160);
  const requirement = clean(body.requirement, 160);
  const email = clean(body.email, 160);
  const preferredDate = clean(body.preferredDate, 40);
  const source = clean(body.source, 40) || "website";

  if (!name || !phone || !city || !requirement) {
    return Response.json(
      { ok: false, error: "Please complete the required fields." },
      { status: 422 },
    );
  }
  if (phone.replace(/\D/g, "").length < 7) {
    return Response.json({ ok: false, error: "Invalid phone number." }, { status: 422 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: "Invalid email address." }, { status: 422 });
  }

  // Email delivery happens in the browser via Web3Forms (their free plan only
  // accepts client-side calls). This endpoint keeps our own durable record.
  let id: number | null = null;
  try {
    const [row] = await db
      .insert(bookings)
      .values({
        name,
        phone,
        city,
        requirement,
        email: email || null,
        preferredDate: preferredDate || null,
        notes: clean(body.notes, 1000) || null,
        source,
      })
      .returning({ id: bookings.id });
    id = row?.id ?? null;
  } catch {
    return Response.json(
      { ok: false, error: "Could not record your request." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true, id }, { status: 201 });
}
