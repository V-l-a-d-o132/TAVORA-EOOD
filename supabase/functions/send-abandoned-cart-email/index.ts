import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { Resend } from "npm:resend@4";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);
const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

function getTierLabel(tier: string): string {
  switch (tier) {
    case "systems-10": return "Пътят на коприната — Стартов пакет";
    case "koprinena-pateka":
    case "premium": return "Пътят на коприната";
    case "perfektno-video": return "Перфектното Видео";
    case "marketing-basics": return "Marketing Basics";
    case "premium-all": return "Пълен достъп — всички секции";
    case "strategic_access": return "Пълен достъп + стратегически сесии";
    default: return "Академия TAVORA";
  }
}

function getTierPrice(tier: string): string {
  switch (tier) {
    case "systems-10": return "49 EUR";
    case "koprinena-pateka":
    case "premium": return "99 EUR";
    case "perfektno-video": return "99 EUR";
    case "marketing-basics": return "129 EUR";
    case "premium-all": return "249 EUR";
    case "strategic_access": return "497 EUR";
    default: return "99 EUR";
  }
}

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

    // ── SERVER-SIDE DEDUP ──
    const { error: logInsertErr } = await supabase
      .from("email_logs")
      .insert({ user_id: userId, email_type: "abandoned_cart" });

    if (logInsertErr) {
      if (logInsertErr.code === "23505") {
        console.log("[abandoned-cart] Dedup: already claimed for user:", userId);
        return new Response(JSON.stringify({ skipped: "already_sent", reason: "dedup" }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
      console.error("[abandoned-cart] email_logs insert error:", JSON.stringify(logInsertErr));
      return new Response(JSON.stringify({ error: "Failed to record email log", detail: logInsertErr.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const { data: authUser, error: authLookupErr } = await supabase.auth.admin.getUserById(userId);
    if (authLookupErr || !authUser?.user?.email) {
      console.error("[abandoned-cart] User lookup failed:", userId, authLookupErr?.message);
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
      .select("abandoned_checkout_at, abandoned_checkout_tier, abandoned_cart_email_sent, has_full_access, unlocked_modules")
      .eq("id", userId)
      .maybeSingle();

    if (!profile) {
      console.log("[abandoned-cart] No profile:", userEmail);
      return new Response(JSON.stringify({ skipped: "no_profile" }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    if (profile.has_full_access || (profile.unlocked_modules && (Array.isArray(profile.unlocked_modules) ? profile.unlocked_modules.length > 0 : false))) {
      console.log("[abandoned-cart] Has access, skipping:", userEmail);
      return new Response(JSON.stringify({ skipped: "has_access" }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    if (profile.abandoned_cart_email_sent) {
      console.log("[abandoned-cart] Already sent:", userEmail);
      return new Response(JSON.stringify({ skipped: "already_sent" }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    if (!profile.abandoned_checkout_at) {
      console.log("[abandoned-cart] No abandoned checkout:", userEmail);
      return new Response(JSON.stringify({ skipped: "no_abandoned_checkout" }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const abandonedTime = new Date(profile.abandoned_checkout_at).getTime();
    const twentyFourH = 24 * 60 * 60 * 1000;
    if (Date.now() - abandonedTime < twentyFourH) {
      console.log("[abandoned-cart] Too early for:", userEmail);
      return new Response(JSON.stringify({ skipped: "too_early" }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const tier = profile.abandoned_checkout_tier || "koprinena-pateka";
    const tierLabel = getTierLabel(tier);
    const tierPrice = getTierPrice(tier);
    const checkoutUrl = `https://imashnujnoto.com/kurs/checkout?tier=${tier}`;

    console.log("[abandoned-cart] Sending to:", userEmail, "tier:", tier);

    const { data: emailData, error: emailErr } = await resend.emails.send({
      from: "Tavora Digital <noreply@imashnujnoto.com>",
      to: [userEmail],
      subject: `${firstName}, продължаваш ли откъдето спря?`,
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

        <!-- ── LOGO ── -->
        <tr><td style="padding: 44px 0 0; text-align: center;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;">
            <tr><td style="padding:12px 28px; border:1px solid #e53e3e; text-align:center;">
              <span style="color:#e53e3e; font-size:16px; font-weight:800; letter-spacing:7px;">TAVORA</span>
            </td></tr>
          </table>
          <p style="color:#555; font-size:10px; letter-spacing:5px; text-transform:uppercase; margin-top:10px;">Академия</p>
        </td></tr>

        <!-- ── BADGE ── -->
        <tr><td style="padding: 32px 0 0; text-align:center;">
          <span style="display:inline-block; padding:4px 14px; border:1px solid #2a2a2a; color:#888; font-size:11px; letter-spacing:1px;">ЗАПАЗИХМЕ МЯСТОТО ТИ</span>
        </td></tr>

        <!-- ── HEADLINE ── -->
        <tr><td style="padding: 24px 0 0; text-align:center;" class="section-pad">
          <h1 style="color:#f0f0f0; font-size:30px; font-weight:300; line-height:1.3; letter-spacing:-0.5px;">
            Продължаваш ли откъдето спря?
          </h1>
          <p style="color:#999; font-size:15px; line-height:1.7; margin-top:12px; max-width:440px; margin-left:auto; margin-right:auto;">
            Видяхме, че разглеждаше <strong style="color:#fff;">${tierLabel}</strong>. Животът се случва — разбираме. Мястото ти е запазено и можеш да продължиш с един клик.
          </p>
        </td></tr>

        <!-- ── ORDER CARD ── -->
        <tr><td style="padding: 28px 0 0;" class="section-pad">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#161616; border:1px solid #1e1e1e;">
            <tr><td style="padding:28px; text-align:center;">

              <p style="color:#777; font-size:10px; letter-spacing:2px; text-transform:uppercase; margin-bottom:8px;">Твоята селекция</p>
              <h2 style="color:#f0f0f0; font-size:20px; font-weight:600; margin-bottom:22px;">${tierLabel}</h2>

              <!-- Price row -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;">
                <tr>
                  <td style="vertical-align:middle;">
                    <span class="price-large">${tierPrice}</span>
                  </td>
                </tr>
              </table>

              <p style="color:#666; font-size:12px; margin:14px 0 22px;">
                Еднократно плащане · Доживотен достъп · 30 дни гаранция
              </p>

              <!-- CTA -->
              <a href="${checkoutUrl}" style="display:inline-block; background:#e53e3e; color:#fff; padding:15px 34px; text-decoration:none; font-size:13px; font-weight:600; letter-spacing:0.5px;">КЪМ ПОРЪЧКАТА</a>

            </td></tr>
          </table>
        </td></tr>

        <!-- ── TRUST BAR ── -->
        <tr><td style="padding: 22px 0 0; text-align:center;" class="section-pad">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;">
            <tr>
              <td style="padding:0 14px; text-align:center;">
                <span style="color:#666; font-size:11px;">🔒 SSL криптирано</span>
              </td>
              <td style="padding:0 14px; text-align:center;">
                <span style="color:#666; font-size:11px;">↩ 30 дни гаранция</span>
              </td>
              <td style="padding:0 14px; text-align:center;">
                <span style="color:#666; font-size:11px;">★ 4.9 от 247+ студенти</span>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- ── DIVIDER ── -->
        <tr><td style="padding: 30px 0 0;" class="section-pad"><div class="divider"></div></td></tr>

        <!-- ── WHAT YOU GET ── -->
        <tr><td style="padding: 24px 0 0; text-align:center;" class="section-pad">
          <p style="color:#777; font-size:10px; letter-spacing:3px; text-transform:uppercase; margin-bottom:14px;">Какво получаваш</p>
        </td></tr>
        <tr><td style="padding: 0;" class="section-pad">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#161616; border:1px solid #1e1e1e;">
            <tr><td style="padding:20px 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr><td style="padding:6px 0; color:#aaa; font-size:13px;"><span style="color:#e53e3e; margin-right:8px;">✦</span> Интерактивни уроци с тестове</td></tr>
                <tr><td style="padding:6px 0; color:#aaa; font-size:13px;"><span style="color:#e53e3e; margin-right:8px;">✦</span> Практически материали и системи</td></tr>
                <tr><td style="padding:6px 0; color:#aaa; font-size:13px;"><span style="color:#e53e3e; margin-right:8px;">✦</span> Revenue Blueprint — система за доход</td></tr>
                <tr><td style="padding:6px 0; color:#aaa; font-size:13px;"><span style="color:#e53e3e; margin-right:8px;">✦</span> Доживотен достъп + обновления</td></tr>
              </table>
            </td></tr>
          </table>
        </td></tr>

        <!-- ── FOOTER ── -->
        <tr><td style="padding: 36px 0 44px; text-align:center;" class="section-pad">
          <div class="divider" style="margin-bottom:20px;"></div>
          <p style="color:#444; font-size:11px; margin-bottom:3px;">Tavora Digital · Велико Търново · България</p>
          <p style="color:#333; font-size:10px;">Ако не си правил/а тази поръчка, игнорирай това съобщение.</p>
        </td></tr>

      </table>

    </td></tr>
  </table>
</body>
</html>`,
    });

    if (emailErr) {
      console.error("[abandoned-cart] Resend error:", JSON.stringify(emailErr));
      return new Response(JSON.stringify({ error: "Failed to send email", detail: emailErr }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    console.log("[abandoned-cart] Email sent! ID:", emailData?.id);

    const now = new Date().toISOString();
    await supabase
      .from("profiles")
      .upsert({
        id: userId,
        abandoned_cart_email_sent: true,
        abandoned_cart_email_sent_at: now,
      }, { onConflict: "id" });

    return new Response(JSON.stringify({ sent: true, email_id: emailData?.id, tier }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[abandoned-cart] Fatal:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});