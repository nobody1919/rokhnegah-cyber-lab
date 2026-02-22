import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No auth" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify the caller is admin
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: roleCheck } = await adminClient.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin");
    if (!roleCheck || roleCheck.length === 0) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (action === "list") {
      // Get all auth users
      const { data: { users }, error } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
      if (error) throw error;

      // Get profiles and roles
      const [{ data: profiles }, { data: roles }] = await Promise.all([
        adminClient.from("profiles").select("*"),
        adminClient.from("user_roles").select("user_id, role"),
      ]);

      const profileMap = new Map((profiles ?? []).map((p: any) => [p.user_id, p]));
      const roleMap = new Map<string, string[]>();
      (roles ?? []).forEach((r: any) => {
        const existing = roleMap.get(r.user_id) ?? [];
        existing.push(r.role);
        roleMap.set(r.user_id, existing);
      });

      const result = users.map((u: any) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        username: profileMap.get(u.id)?.username ?? null,
        points: profileMap.get(u.id)?.points ?? 0,
        level: profileMap.get(u.id)?.level ?? "Novice",
        avatar_url: profileMap.get(u.id)?.avatar_url ?? null,
        roles: roleMap.get(u.id) ?? ["user"],
      }));

      return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "toggle-admin") {
      const body = await req.json();
      const targetUserId = body.user_id;
      const { data: existing } = await adminClient.from("user_roles").select("id").eq("user_id", targetUserId).eq("role", "admin");
      
      if (existing && existing.length > 0) {
        await adminClient.from("user_roles").delete().eq("user_id", targetUserId).eq("role", "admin");
        return new Response(JSON.stringify({ action: "removed" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } else {
        await adminClient.from("user_roles").insert({ user_id: targetUserId, role: "admin" });
        return new Response(JSON.stringify({ action: "granted" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    if (action === "reset-points") {
      const body = await req.json();
      await adminClient.from("profiles").update({ points: 0 }).eq("user_id", body.user_id);
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "delete-user") {
      const body = await req.json();
      const { error } = await adminClient.auth.admin.deleteUser(body.user_id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "ban-user") {
      const body = await req.json();
      const { error } = await adminClient.auth.admin.updateUserById(body.user_id, { ban_duration: body.ban ? "876000h" : "none" });
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
