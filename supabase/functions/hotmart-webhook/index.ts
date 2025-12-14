import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  const requestId = Math.random().toString(36).substring(7);
  
  console.log(`[${requestId}] === NOVA REQUISIÇÃO ===`);
  
  try {
    // OPTIONS
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Verificar variáveis de ambiente
    const HOTMART_WEBHOOK_TOKEN = Deno.env.get("HOTMART_WEBHOOK_TOKEN");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!HOTMART_WEBHOOK_TOKEN || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error(`[${requestId}] Missing environment variables`);
      return new Response(JSON.stringify({ 
        error: "Missing environment variables",
        request_id: requestId
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Ler e parsear body
    const rawBody = await req.text();
    console.log(`[${requestId}] Raw body length: ${rawBody.length}`);
    
    let body;
    try {
      body = JSON.parse(rawBody);
      console.log(`[${requestId}] JSON parsed successfully`);
    } catch (parseError) {
      console.error(`[${requestId}] JSON parse error:`, parseError);
      return new Response(JSON.stringify({ 
        error: `Invalid JSON: ${parseError.message}`,
        request_id: requestId
      }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Buscar token
    let receivedHottok = null;
    let tokenSource = 'not_found';
    
    const headers = {};
    for (const [key, value] of req.headers.entries()) {
      headers[key] = value;
    }
    
    if (body && body.hottok) {
      receivedHottok = body.hottok;
      tokenSource = 'body.hottok';
    } else if (body && body.token) {
      receivedHottok = body.token;
      tokenSource = 'body.token';
    } else if (headers.authorization) {
      receivedHottok = headers.authorization.replace('Bearer ', '').replace('Token ', '');
      tokenSource = 'header.authorization';
    } else if (headers['x-hotmart-hottok']) {
      receivedHottok = headers['x-hotmart-hottok'];
      tokenSource = 'header.x-hotmart-hottok';
    } else {
      for (const [key, value] of Object.entries(body || {})) {
        if (key.toLowerCase().includes('token') || key.toLowerCase().includes('hottok')) {
          receivedHottok = value;
          tokenSource = `body.${key}`;
          break;
        }
      }
    }

    console.log(`[${requestId}] Token source: ${tokenSource}`);

    if (!receivedHottok) {
      console.error(`[${requestId}] Token not found in request`);
      return new Response(JSON.stringify({ 
        error: "Missing hottok in request",
        request_id: requestId
      }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Validar token
    const trimmedToken = HOTMART_WEBHOOK_TOKEN.trim();
    const trimmedReceived = receivedHottok.trim();
    
    if (trimmedReceived !== trimmedToken) {
      console.error(`[${requestId}] Invalid token`);
      return new Response(JSON.stringify({ 
        error: "Invalid hottok",
        request_id: requestId
      }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    console.log(`[${requestId}] Token validated successfully`);

    // Verificar evento
    const eventType = body?.event;
    const customerEmail = body?.data?.buyer?.email;
    const customerName = body?.data?.buyer?.name;
    
    console.log(`[${requestId}] Event: ${eventType}`);
    console.log(`[${requestId}] Email: ${customerEmail}`);
    console.log(`[${requestId}] Name: ${customerName}`);

    if (eventType !== 'PURCHASE_APPROVED') {
      console.log(`[${requestId}] Ignoring event: ${eventType}`);
      return new Response(JSON.stringify({ 
        received: true, 
        message: `Ignored event: ${eventType}`,
        request_id: requestId
      }), { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    if (!customerEmail) {
      console.error(`[${requestId}] Missing customer email`);
      return new Response(JSON.stringify({ 
        error: "Missing customer email",
        request_id: requestId
      }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Inicializar Supabase
    console.log(`[${requestId}] Initializing Supabase...`);
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Processar usuário
    console.log(`[${requestId}] Processing user: ${customerEmail}`);
    let user = null;

    try {
      // 1. Tentar encontrar usuário existente usando listUsers
      console.log(`[${requestId}] Searching for existing user...`);
      
      const { data: usersList, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (listError) {
        console.error(`[${requestId}] Error listing users:`, listError);
        throw listError;
      }

      // Procurar usuário pelo email
      const existingUser = usersList.users.find(u => u.email === customerEmail);
      
      if (existingUser) {
        user = existingUser;
        console.log(`[${requestId}] Existing user found: ${user.id}`);
      } else {
        console.log(`[${requestId}] User not found in existing users list`);
      }

      // 2. Se usuário não existe, criar convite
      if (!user) {
        console.log(`[${requestId}] Creating invite for new user...`);
        
        const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(customerEmail, {
          data: { 
            full_name: customerName || '',
            invited_by: 'hotmart_webhook'
          }
        });
        
        if (inviteError) {
          console.log(`[${requestId}] Invite error:`, inviteError.message);
          
          // Se usuário já existe, tentar buscar novamente
          if (inviteError.message.includes('already registered') || 
              inviteError.message.includes('User already registered') ||
              inviteError.message.includes('already been invited')) {
            
            console.log(`[${requestId}] User already exists, searching again...`);
            
            // Buscar novamente na lista de usuários
            const { data: retryUsersList, error: retryListError } = await supabaseAdmin.auth.admin.listUsers();
            
            if (retryListError) {
              console.error(`[${requestId}] Retry list users failed:`, retryListError);
              throw retryListError;
            }
            
            const retryUser = retryUsersList.users.find(u => u.email === customerEmail);
            
            if (retryUser) {
              user = retryUser;
              console.log(`[${requestId}] User found on retry: ${user.id}`);
            } else {
              throw new Error('User should exist but not found in retry');
            }
          } else {
            console.error(`[${requestId}] Fatal invite error:`, inviteError);
            throw inviteError;
          }
        } else {
          user = inviteData.user;
          console.log(`[${requestId}] Invite created successfully for user: ${user?.id}`);
        }
      }

      if (!user) {
        throw new Error('Failed to find or create user');
      }

      // 3. Verificar estrutura da tabela profiles primeiro
      console.log(`[${requestId}] Checking profiles table structure...`);
      
      const { data: existingProfile, error: getProfileError } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (getProfileError && !getProfileError.message.includes('No rows')) {
        console.log(`[${requestId}] Profile check error (may be normal):`, getProfileError.message);
      }

      console.log(`[${requestId}] Existing profile:`, existingProfile);

      // 4. Atualizar perfil apenas com campos que sabemos que existem
      console.log(`[${requestId}] Updating user profile: ${user.id}`);
      
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .upsert({ 
          id: user.id, 
          has_access: true,
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'id' 
        });

      if (profileError) {
        console.error(`[${requestId}] Profile update error:`, profileError);
        throw profileError;
      }

      console.log(`[${requestId}] Profile updated successfully`);

      // 5. Resposta de sucesso
      const successResponse = {
        received: true,
        user_id: user.id,
        email: user.email,
        access_granted: true,
        event_type: eventType,
        processed_at: new Date().toISOString(),
        request_id: requestId
      };

      console.log(`[${requestId}] === PROCESSING COMPLETED SUCCESSFULLY ===`);
      console.log(`[${requestId}] User ${user.email} now has access`);

      return new Response(JSON.stringify(successResponse), { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });

    } catch (processingError) {
      console.error(`[${requestId}] User processing error:`, processingError);
      return new Response(JSON.stringify({ 
        error: `Processing failed: ${processingError.message}`,
        request_id: requestId
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

  } catch (globalError) {
    console.error(`[${requestId}] Global error:`, globalError);
    return new Response(JSON.stringify({ 
      error: `Global error: ${globalError.message}`,
      request_id: requestId
    }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});

console.log("=== HOTMART WEBHOOK PRODUCTION READY ===");