import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { Resend } from "npm:resend@4";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);
const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

const MODULES = [
  { num: "01", title: "AI Advantage", desc: "Работа с AI инструменти на професионално ниво" },
  { num: "02", title: "The Readdy Blueprint", desc: "Система за сайтове, които продават" },
  { num: "03", title: "Invisible Marketing", desc: "Клиентите започват да те намират сами" },
  { num: "04", title: "Content That Sells", desc: "Съдържание, което носи реални запитвания" },
  { num: "05", title: "Audience Engine", desc: "Изгради аудитория, която купува" },
  { num: "06", title: "The Conversion System", desc: "Превърни интерес в платени проекти" },
  { num: "07", title: "Professional Stack", desc: "Настрой бизнеса като истинска агенция" },
  { num: "08", title: "Digital Protection", desc: "Защити всичко, което си изградил" },
  { num: "09", title: "Growth Analytics", desc: "Решения, базирани на данни" },
  { num: "10", title: "Scale with AI", desc: "Автоматизация и свобода на времето" },
  { num: "11", title: "Revenue Blueprint", desc: "Система за €1,000 – 8,000/месец" },
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

    // ── SERVER-SIDE DEDUP: insert email_logs row BEFORE anything else ──
    // Unique constraint (user_id, email_type) + ON CONFLICT DO NOTHING guarantees
    // exactly-one-send even when two requests race (e.g. double onAuthStateChange).
    const { error: logInsertErr } = await supabase
      .from("email_logs")
      .insert({ user_id: userId, email_type: "welcome" });

    if (logInsertErr) {
      // 23505 = unique_violation → another request already claimed this send
      if (logInsertErr.code === "23505") {
        console.log("[welcome] Dedup: already claimed by another request for user:", userId);
        return new Response(JSON.stringify({ skipped: "already_sent", reason: "dedup" }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
      console.error("[welcome] email_logs insert error:", JSON.stringify(logInsertErr));
      return new Response(JSON.stringify({ error: "Failed to record email log", detail: logInsertErr.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const { data: authUser, error: authLookupErr } = await supabase.auth.admin.getUserById(userId);
    if (authLookupErr || !authUser?.user?.email) {
      return new Response(JSON.stringify({ error: "User not found", detail: authLookupErr?.message }), {
        status: 404,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const userEmail = authUser.user.email;
    const userName = authUser.user.user_metadata?.full_name || "";
    const firstName = userName ? userName.split(" ")[0] : userEmail.split("@")[0];

    const { data: profile } = await supabase
      .from("profiles")
      .select("welcome_email_sent, welcome_email_sent_at")
      .eq("id", userId)
      .maybeSingle();

    if (profile?.welcome_email_sent) {
      console.log("[welcome] Already sent to:", userEmail);
      return new Response(JSON.stringify({ skipped: "already_sent", sent_at: profile.welcome_email_sent_at }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    console.log("[welcome] Sending welcome email to:", userEmail);

    const { data: emailData, error: emailErr } = await resend.emails.send({
      from: "Tavora Digital <noreply@imashnujnoto.com>",
      to: [userEmail],
      subject: `Добре дошъл в Академия TAVORA${firstName ? ", " + firstName : ""}`,
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
  .module-row td { padding: 10px 0; border-bottom: 1px solid #1a1a1a; vertical-align: middle; }
  .divider { height: 1px; background: linear-gradient(90deg, transparent, #222, transparent); }
  @media only screen and (max-width: 600px) {
    .wrap { border: none !important; }
    .section-pad { padding-left: 22px !important; padding-right: 22px !important; }
  }
</style>
</head>
<body>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr><td align="center" style="padding: 56px 0;">

      <!-- ═══════ MAIN CARD ═══════ -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="wrap">

        <!-- ── LOGO ── -->
        <tr><td style="padding: 44px 0 0; text-align: center;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
            <tr><td style="padding: 12px 28px; border: 1px solid #e53e3e; text-align: center;">
              <span style="color:#e53e3e; font-size:16px; font-weight:800; letter-spacing:7px;">TAVORA</span>
            </td></tr>
          </table>
          <p style="color:#555; font-size:10px; letter-spacing:5px; text-transform:uppercase; margin-top:10px;">Академия</p>
        </td></tr>

        <!-- ── HERO LINE ── -->
        <tr><td style="padding: 32px 0 0; text-align: center;">
          <span style="display:inline-block; padding:4px 14px; border:1px solid #2a2a2a; color:#888; font-size:11px; letter-spacing:1px;">ТВОЕТО ПЪТУВАНЕ ЗАПОЧВА ТУК</span>
        </td></tr>

        <!-- ── GREETING ── -->
        <tr><td style="padding: 24px 0 0; text-align: center;" class="section-pad">
          <h1 style="color:#f0f0f0; font-size:32px; font-weight:300; line-height:1.25; letter-spacing:-0.5px;">
            Здравей${firstName ? ", " + firstName : ""}
          </h1>
          <p style="color:#999; font-size:15px; line-height:1.7; margin-top:14px; max-width:440px; margin-left:auto; margin-right:auto;">
            Благодаря ти, че се присъедини. Академия TAVORA е мястото, където изграждаш дигитален бизнес стъпка по стъпка — с ясна система и без излишен шум.
          </p>
        </td></tr>

        <!-- ── SOCIAL PROOF BAR ── -->
        <tr><td style="padding: 28px 0 0; text-align: center;" class="section-pad">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto; background:#161616; border:1px solid #1e1e1e;">
            <tr>
              <td style="padding:14px 22px; text-align:center; border-right:1px solid #1e1e1e;">
                <p style="color:#e0e0e0; font-size:20px; font-weight:700;">247+</p>
                <p style="color:#666; font-size:10px; letter-spacing:1px;">СТУДЕНТИ</p>
              </td>
              <td style="padding:14px 22px; text-align:center; border-right:1px solid #1e1e1e;">
                <p style="color:#e0e0e0; font-size:20px; font-weight:700;">4.9</p>
                <p style="color:#666; font-size:10px; letter-spacing:1px;">★ РЕЙТИНГ</p>
              </td>
              <td style="padding:14px 22px; text-align:center;">
                <p style="color:#e0e0e0; font-size:20px; font-weight:700;">11</p>
                <p style="color:#666; font-size:10px; letter-spacing:1px;">МОДУЛА</p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- ── DIVIDER ── -->
        <tr><td style="padding: 30px 0 0;" class="section-pad"><div class="divider"></div></td></tr>

        <!-- ── MODULES GRID ── -->
        <tr><td style="padding: 26px 0 0; text-align: center;" class="section-pad">
          <p style="color:#777; font-size:10px; letter-spacing:3px; text-transform:uppercase; margin-bottom:18px;">Какво ще откриеш в платформата</p>
        </td></tr>
        <tr><td style="padding: 0;" class="section-pad">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#161616; border:1px solid #1e1e1e;">
            ${MODULES.map((m, i) => `
            <tr><td class="module-row" style="padding:${i === 0 ? '20px 20px 0' : '0 20px'};">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td width="34" style="vertical-align:middle;">
                    <span style="color:#e53e3e; font-size:12px; font-weight:700; letter-spacing:1px;">${m.num}</span>
                  </td>
                  <td style="vertical-align:middle; padding:10px 0;">
                    <span style="color:#ccc; font-size:13px; font-weight:500;">${m.title}</span>
                    <span style="display:block; color:#666; font-size:11px; margin-top:2px;">${m.desc}</span>
                  </td>
                </tr>
              </table>
            </td></tr>`).join("")}
          </table>
        </td></tr>

        <!-- ── FREE MODULE CTA ── -->
        <tr><td style="padding: 24px 0 0;" class="section-pad">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#1a0f0f; border:1px solid #2a1818;">
            <tr><td style="padding:24px; text-align:center;">
              <p style="color:#ccc; font-size:13px; line-height:1.6; margin-bottom:16px;">
                <strong style="color:#fff;">AI Advantage</strong> — първият модул е напълно безплатен.<br>Започни веднага, без карти, без условия.
              </p>
              <a href="https://imashnujnoto.com/kurs" style="display:inline-block; background:#e53e3e; color:#fff; padding:15px 32px; text-decoration:none; font-size:13px; font-weight:600; letter-spacing:0.5px;">КЪМ ПЛАТФОРМАТА</a>
            </td></tr>
          </table>
        </td></tr>

        <!-- ── DIVIDER ── -->
        <tr><td style="padding: 30px 0 0;" class="section-pad"><div class="divider"></div></td></tr>

        <!-- ── GUARANTEE LINE ── -->
        <tr><td style="padding: 22px 0 0; text-align: center;" class="section-pad">
          <p style="color:#666; font-size:12px; line-height:1.6;">
            Без натиск. Без спам. Само полезна информация когато има нещо важно.
          </p>
        </td></tr>

        <!-- ── FOOTER ── -->
        <tr><td style="padding: 36px 0 44px; text-align: center;" class="section-pad">
          <p style="color:#444; font-size:11px; margin-bottom:3px;">Tavora Digital · Велико Търново · България</p>
          <p style="color:#333; font-size:10px;">Автоматично съобщение за регистрация в Академия TAVORA.</p>
        </td></tr>

      </table>

    </td></tr>
  </table>
</body>
</html>`,
    });

    if (emailErr) {
      console.error("[welcome] Resend error:", JSON.stringify(emailErr));
      return new Response(JSON.stringify({ error: "Failed to send email", detail: emailErr }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    console.log("[welcome] Email sent! ID:", emailData?.id);

    const now = new Date().toISOString();
    await supabase
      .from("profiles")
      .upsert({
        id: userId,
        welcome_email_sent: true,
        welcome_email_sent_at: now,
      }, { onConflict: "id" });

    return new Response(JSON.stringify({ sent: true, email_id: emailData?.id }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[welcome] Fatal:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
