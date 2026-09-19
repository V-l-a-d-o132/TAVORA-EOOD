import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const BUCKET_NAME = 'course-pdfs';

// Rate limiting — per IP
const ipAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 30;
const WINDOW_MS = 60_000;

interface PDFRequest {
  action: 'getReadUrl' | 'getUploadUrl' | 'list' | 'delete';
  moduleId?: string;
  lessonId?: string;
  filename?: string;
}

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET_NAME);
  if (!exists) {
    await supabase.storage.createBucket(BUCKET_NAME, {
      public: false,
      allowedMimeTypes: ['application/pdf'],
      fileSizeLimit: 52428800, // 50MB
    });
  }
}

async function getReadUrl(moduleId: string, lessonId: string) {
  const path = `${moduleId}/${lessonId}.pdf`;
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(path, 3600); // 1 hour

  if (error) {
    return { error: error.message };
  }
  return { url: data?.signedUrl };
}

async function getUploadUrl(moduleId: string, lessonId: string) {
  const path = `${moduleId}/${lessonId}.pdf`;
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUploadUrl(path);

  if (error) {
    return { error: error.message };
  }
  return { url: data?.signedUrl, token: data?.token, path };
}

async function listPdfs(moduleId?: string) {
  const prefix = moduleId ? `${moduleId}/` : '';
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(prefix, { limit: 500 });

  if (error) {
    return { error: error.message };
  }
  return { files: data };
}

async function deletePdf(moduleId: string, lessonId: string) {
  const path = `${moduleId}/${lessonId}.pdf`;
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path]);

  if (error) {
    return { error: error.message };
  }
  return { success: true };
}

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Rate limiting
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';
  const now = Date.now();
  let record = ipAttempts.get(ip);
  if (!record || now > record.resetAt) {
    record = { count: 0, resetAt: now + WINDOW_MS };
    ipAttempts.set(ip, record);
  }
  record.count++;
  if (record.count > MAX_ATTEMPTS) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
      status: 429,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 🔒 MANDATORY: JWT auth — admin only
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized — missing token' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized — invalid token' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Check admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || profile.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Forbidden — admin access required' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    await ensureBucket();

    const body: PDFRequest = await req.json();
    const { action, moduleId, lessonId } = body;

    let result;

    switch (action) {
      case 'getReadUrl': {
        if (!moduleId || !lessonId) {
          result = { error: 'moduleId and lessonId required' };
          break;
        }
        result = await getReadUrl(moduleId, lessonId);
        break;
      }
      case 'getUploadUrl': {
        if (!moduleId || !lessonId) {
          result = { error: 'moduleId and lessonId required' };
          break;
        }
        result = await getUploadUrl(moduleId, lessonId);
        break;
      }
      case 'list': {
        result = await listPdfs(moduleId);
        break;
      }
      case 'delete': {
        if (!moduleId || !lessonId) {
          result = { error: 'moduleId and lessonId required' };
          break;
        }
        result = await deletePdf(moduleId, lessonId);
        break;
      }
      default:
        result = { error: 'Unknown action' };
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
