import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { Resend } from "npm:resend@4";
import Stripe from "npm:stripe@17";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);
const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);

async function getOrCreateDownsellPrice(): Promise<string> {
  const PRODUCT_NAME = "Пътят на коприната — AI Business Blueprint | Академия TAVORA";
  const PRICE_CENTS = 4900;

  const allProducts = await stripe.products.list({ active: true, limit: 100 });
  let product = allProducts.data.find((p) => p.name === PRODUCT_NAME);

  if (!product) {
    product = await stripe.products.create({
      name: PRODUCT_NAME,
      description: "10 модула от Пътят на коприната. Доживотен достъп.",
    });
  }

  const prices = await stripe.prices.list({ product: product.id, active: true, limit: 5 });
  const match = prices.data.find((p) => p.unit_amount === PRICE_CENTS && p.currency === "eur");
  if (match) return match.id;

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: PRICE_CENTS,
    currency: "eur",
  });
  return price.id;
}

function formatBgDate(date: Date): string {
  const months = [
    "януари", "февруари", "март", "април", "май", "юни",
    "юли", "август", "септември", "октомври", "ноември", "декември"
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

// ВАЖНО: Downsell email за 49 EUR показва само 10 модула (БЕЗ модул 11 — Revenue Blueprint)
// Модул 11 е само в пакета за 99 EUR
const MODULES_10 = [
  { num: "01", title: "AI Advantage", desc: "Работа с AI инструменти на професионално ниво" },
  { num: "02", title: "Дизайн в Readdy AI", desc: "Сайт без дизайнерски умения" },
  { num: "03", title: "SEO и GEO оптимизация", desc: "Класиране в Google и AI търсачките" },
  { num: "04", title: "Съдържание и Копирайтинг", desc: "Текстове, които превръщат читатели в клиенти" },
  { num: "05", title: "Audience Engine", desc: "Изгради аудитория, която купува" },
  { num: "06", title: "The Conversion System", desc: "Превърни интерес в платени проекти" },
  { num: "07", title: "Professional Stack", desc: "Настрой бизнеса като истинска агенция" },
  { num: "08", title: "Digital Protection", desc: "Защити всичко, което си изградил" },
  { num: "09", title: "Growth Analytics", desc: "Решения, базирани на данни" },
  { num: "10", title: "Scale with AI", desc: "Автоматизация и свобода на времето" },
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const userId = body.user_id;
    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing user_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const oldLastLoginAt = body.old_last_login_at;
    if (!oldLastLoginAt) {
      return new Response(JSON.stringify({ error: "Missing old_last_login_at" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const parsedOldLogin = new Date(oldLastLoginAt);
    if (isNaN(parsedOldLogin.getTime())) {
      return new Response(JSON.stringify({ error: "Invalid old_last_login_at format" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const twoHours = 2 * 60 * 60 * 1000;
    if (Date.now() - parsedOldLogin.getTime() < twoHours) {
      console.log("[downsell] Too early:", oldLastLoginAt);
      return new Response(JSON.stringify({ skipped: "too_early" }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const { error: logInsertErr } = await supabase
      .from("email_logs")
      .insert({ user_id: userId, email_type: "downsell" });

    if (logInsertErr) {
      if (logInsertErr.code === "23505") {
        console.log("[downsell] Dedup: already claimed for user:", userId);
        return new Response(JSON.stringify({ skipped: "already_sent", reason: "dedup" }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
      console.error("[downsell] email_logs insert error:", JSON.stringify(logInsertErr));
      return new Response(JSON.stringify({ error: "Failed to record email log" }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const { data: authUser, error: authLookupErr } = await supabase.auth.admin.getUserById(userId);
    if (authLookupErr || !authUser?.user?.email) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const userEmail = authUser.user.email;
    const userName = authUser.user.user_metadata?.full_name || "";
    const firstName = userName ? userName.split(" ")[0] : userEmail.split("@")[0];

    const { data: profile } = await supabase
      .from("profiles")
      .select("has_full_access, unlocked_modules, downsell_email_sent")
      .eq("id", userId)
      .maybeSingle();

    if (!profile) {
      console.log("[downsell] No profile:", userEmail);
      return new Response(JSON.stringify({ skipped: "no_profile" }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const hasAnyAccess = profile.has_full_access ||
      (Array.isArray(profile.unlocked_modules) && profile.unlocked_modules.length > 0);

    if (hasAnyAccess) {
      console.log("[downsell] Has access, skipping:", userEmail);
      return new Response(JSON.stringify({ skipped: "has_access" }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    if (profile.downsell_email_sent) {
      console.log("[downsell] Already sent:", userEmail);
      return new Response(JSON.stringify({ skipped: "already_sent" }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    console.log("[downsell] Creating checkout for:", userEmail);

    // Stripe session за systems-10 (49 EUR → отключва 10 модула)
    let checkoutUrl = "https://imashnujnoto.com/kurs/checkout?tier=systems-10";

    try {
      const priceId = await getOrCreateDownsellPrice();
      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "payment",
        success_url: "https://imashnujnoto.com/kurs/potvardjenie?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "https://imashnujnoto.com/kurs/checkout?tier=systems-10",
        metadata: { tier: "systems-10", source: "downsell-email", user_id: userId },
      });
      if (session.url) checkoutUrl = session.url;
    } catch (stripeErr) {
      console.error("[downsell] Stripe error:", stripeErr);
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 72 * 60 * 60 * 1000);
    const expiresFormatted = formatBgDate(expiresAt);

    console.log("[downsell] Sending to:", userEmail);

    const { data: emailData, error: emailErr } = await resend.emails.send({
      from: "Tavora Digital <noreply@imashnujnoto.com>",
      to: [userEmail],
      subject: `${firstName}, специална възможност за теб`,
      html: `<!DOCTYPE html>
<html lang="bg">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  * { margin: 0; padding: 0; }
  body { background: #0e0e0e; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; }
  .wrap { max-width: 600px; background: #121212; border: 1px solid #1e1e1e; }
  .section-pad { padding-left: 36px; padding-right: 36px; }
  .divider { height: 1px; background: linear-gradient(90deg, transparent, #222, transparent); }
  .price-large { color:#e53e3e; font-size:48px; font-weight:800; line-height:1; }
  .module-row td { padding: 8px 0; border-bottom: 1px solid #1a1a1a; vertical-align: middle; }
  @media only screen and (max-width: 600px) {
    .wrap { border: none !important; }
    .section-pad { padding-left: 22px !important; padding-right: 22px !important; }
    .price-large { font-size: 38px !important; }
  }
</style>
</head>
<body>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr><td align="center" style="padding: 56px 0;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="wrap">

        <!-- LOGO -->
        <tr><td style="padding: 44px 0 0; text-align: center;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;">
            <tr><td style="padding:12px 28px; border:1px solid #e53e3e; text-align:center;">
              <span style="color:#e53e3e; font-size:16px; font-weight:800; letter-spacing:7px;">TAVORA</span>
            </td></tr>
          </table>
          <p style="color:#555; font-size:10px; letter-spacing:5px; text-transform:uppercase; margin-top:10px;">Академия</p>
        </td></tr>

        <!-- BADGE -->
        <tr><td style="padding: 32px 0 0; text-align:center;">
          <span style="display:inline-block; padding:4px 14px; border:1px solid #2a1818; color:#e53e3e; font-size:11px; letter-spacing:1px;">ЗАПОЧНИ С ОСНОВИТЕ</span>
        </td></tr>

        <!-- HEADLINE -->
        <tr><td style="padding: 24px 0 0; text-align:center;" class="section-pad">
          <h1 style="color:#f0f0f0; font-size:28px; font-weight:300; line-height:1.3; letter-spacing:-0.5px;">
            Искаме да ти помогнем да започнеш
          </h1>
          <p style="color:#999; font-size:15px; line-height:1.7; margin-top:12px; max-width:440px; margin-left:auto; margin-right:auto;">
            Разбираме, че добрата инвестиция изисква правилния момент. Затова ти предлагаме <strong style="color:#fff;">Пътят на коприната (10 модула)</strong> като начален пакет — без модул 11 (Revenue Blueprint), само за да започнеш.
          </p>
        </td></tr>

        <!-- OFFER CARD -->
        <tr><td style="padding: 28px 0 0;" class="section-pad">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#161616; border:1px solid #1e1e1e;">
            <tr><td style="padding:28px; text-align:center;">
              <p style="color:#e53e3e; font-size:10px; letter-spacing:2px; text-transform:uppercase; margin-bottom:8px;">Пътят на коприната — 10 модула</p>
              <h2 style="color:#f0f0f0; font-size:20px; font-weight:600; margin-bottom:22px;">AI Business Blueprint</h2>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;">
                <tr>
                  <td style="vertical-align:middle; padding-right:14px;">
                    <span style="color:#555; font-size:15px; text-decoration:line-through;">99 EUR</span>
                  </td>
                  <td style="vertical-align:middle;">
                    <span class="price-large">49 EUR</span>
                  </td>
                </tr>
              </table>

              <p style="color:#666; font-size:12px; margin:14px 0 22px;">
                Еднократно плащане · Доживотен достъп · 30 дни гаранция
              </p>

              <a href="${checkoutUrl}" style="display:inline-block; background:#e53e3e; color:#fff; padding:15px 34px; text-decoration:none; font-size:13px; font-weight:600; letter-spacing:0.5px;">ЗАПОЧНИ ЗА 49 EUR</a>

              <p style="color:#666; font-size:11px; margin-top:18px;">Валидно до ${expiresFormatted}</p>
            </td></tr>
          </table>
        </td></tr>

        <!-- MODULES LIST (10 only) -->
        <tr><td style="padding: 22px 0 0; text-align:center;" class="section-pad">
          <p style="color:#777; font-size:10px; letter-spacing:3px; text-transform:uppercase; margin-bottom:14px;">10 модула в пакета</p>
        </td></tr>
        <tr><td style="padding: 0;" class="section-pad">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#161616; border:1px solid #1e1e1e;">
            <tr><td style="padding:16px 20px;">
              ${MODULES_10.map((m) => `
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="module-row">
                <tr>
                  <td width="30" style="vertical-align:middle;">
                    <span style="color:#e53e3e; font-size:11px; font-weight:700; letter-spacing:1px;">${m.num}</span>
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="color:#ccc; font-size:13px; font-weight:500;">${m.title}</span>
                    <span style="display:block; color:#666; font-size:11px; margin-top:1px;">${m.desc}</span>
                  </td>
                </tr>
              </table>`).join("")}
            </td></tr>
          </table>
        </td></tr>

        <!-- NOTE about module 11 -->
        <tr><td style="padding: 16px 0 0;" class="section-pad">
          <p style="color:#555; font-size:11px; text-align:center; font-style:italic;">
            * Модул 11 (Revenue Blueprint) е достъпен само в пълния пакет за 99 EUR.
          </p>
        </td></tr>

        <!-- TRUST -->
        <tr><td style="padding: 22px 0 0; text-align:center;" class="section-pad">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;">
            <tr>
              <td style="padding:0 14px; text-align:center;"><span style="color:#666; font-size:11px;">🔒 SSL криптирано</span></td>
              <td style="padding:0 14px; text-align:center;"><span style="color:#666; font-size:11px;">↩ 30 дни гаранция</span></td>
              <td style="padding:0 14px; text-align:center;"><span style="color:#666; font-size:11px;">★ 4.9 от 247+ студенти</span></td>
            </tr>
          </table>
        </td></tr>

        <!-- SOFT NOTE -->
        <tr><td style="padding: 24px 0 0; text-align:center;" class="section-pad">
          <p style="color:#555; font-size:12px; line-height:1.6; max-width:420px; margin:0 auto;">
            Това е еднократно съобщение. Няма да получаваш повторни оферти. Без риск — 30 дни гаранция за връщане на парите.
          </p>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="padding: 36px 0 44px; text-align:center;" class="section-pad">
          <div class="divider" style="margin-bottom:20px;"></div>
          <p style="color:#444; font-size:11px; margin-bottom:3px;">Tavora Digital · Велико Търново · България</p>
          <p style="color:#333; font-size:10px;">Това е еднократно съобщение. Няма да получаваш повторни оферти.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });

    if (emailErr) {
      console.error("[downsell] Resend error:", JSON.stringify(emailErr));
      return new Response(JSON.stringify({ error: "Failed to send email", detail: emailErr }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    console.log("[downsell] Email sent! ID:", emailData?.id);

    await supabase
      .from("profiles")
      .upsert({
        id: userId,
        downsell_email_sent: true,
        downsell_email_sent_at: now.toISOString(),
      }, { onConflict: "id" });

    return new Response(JSON.stringify({ sent: true, email_id: emailData?.id }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[downsell] Fatal:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});