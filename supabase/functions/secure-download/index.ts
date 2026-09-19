import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Rate limiting — 10 downloads per IP per minute
const ipAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 60_000;

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

  // Rate limiting
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
  const now = Date.now();
  let record = ipAttempts.get(ip);
  if (!record || now > record.resetAt) {
    record = { count: 0, resetAt: now + WINDOW_MS };
    ipAttempts.set(ip, record);
  }
  record.count++;
  if (record.count > MAX_ATTEMPTS) {
    return new Response(
      JSON.stringify({ error: "Too many download attempts. Please try again in a minute." }),
      {
        status: 429,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      }
    );
  }

  try {
    const { access_code, file_id } = await req.json();

    if (!access_code || file_id === undefined || file_id === null) {
      return new Response(
        JSON.stringify({ error: "Липсва код за достъп или номер на файл." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    // Validate access_code format
    if (typeof access_code !== "string" || access_code.length < 4 || access_code.length > 64) {
      return new Response(
        JSON.stringify({ error: "Невалиден формат на код за достъп." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    // Validate file_id is a safe integer
    if (!Number.isInteger(file_id) || file_id < 1 || file_id > 20) {
      return new Response(
        JSON.stringify({ error: "Невалиден номер на файл." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    // Verify access
    const { data: customer, error: dbError } = await supabase
      .from("checklist_customers")
      .select("id, tier, selected_modules, is_active")
      .eq("access_code", access_code.trim())
      .maybeSingle();

    if (dbError || !customer) {
      return new Response(
        JSON.stringify({ error: "Невалиден код за достъп." }),
        {
          status: 403,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    if (!customer.is_active) {
      return new Response(
        JSON.stringify({ error: "Достъпът е деактивиран." }),
        {
          status: 403,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    const tier = customer.tier || "single";
    const selectedModules: number[] = Array.isArray(customer.selected_modules)
      ? customer.selected_modules
      : [];

    if (tier !== "complete") {
      if (!selectedModules.includes(file_id)) {
        return new Response(
          JSON.stringify({ error: "Нямате достъп до този файл." }),
          {
            status: 403,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          }
        );
      }
    }

    // Build file name: sistema-01.html, sistema-02.html, etc.
    const fileName = `sistema-${String(file_id).padStart(2, "0")}.html`;

    // Download from storage bucket "checklist-files"
    const { data: fileData, error: storageError } = await supabase
      .storage
      .from("checklist-files")
      .download(fileName);

    if (storageError || !fileData) {
      console.error("Storage download error:", storageError);
      return new Response(
        JSON.stringify({ error: "Файлът не е намерен в хранилището. Свържете се с поддръжка." }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    // Serve the file directly as a download
    return new Response(fileData, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Content-Disposition": `attachment; filename="SISTEMA_${String(file_id).padStart(2, "0")}.html"`,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("Download error:", err);
    return new Response(
      JSON.stringify({ error: "Грешка при генериране на файла за сваляне." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      }
    );
  }
});
