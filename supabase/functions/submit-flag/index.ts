import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify user via getClaims
    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await anonClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub as string;

    // Parse body
    const { instance_id, lab_id, submitted_flag } = await req.json();
    if (!instance_id || !lab_id || !submitted_flag) {
      return new Response(
        JSON.stringify({ error: "Missing instance_id, lab_id, or submitted_flag" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Service role client for privileged operations
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify instance belongs to this user and is active
    const { data: instance, error: instErr } = await adminClient
      .from("lab_instances")
      .select("id, user_id, status")
      .eq("id", instance_id)
      .eq("lab_id", lab_id)
      .single();

    if (instErr || !instance) {
      return new Response(
        JSON.stringify({ correct: false, message: "Instance not found." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (instance.user_id !== userId) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (instance.status === "completed") {
      return new Response(
        JSON.stringify({ correct: false, message: "Lab already completed." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch the real flag (server-side only)
    const { data: lab } = await adminClient
      .from("labs")
      .select("flag, points")
      .eq("id", lab_id)
      .single();

    if (!lab) {
      return new Response(
        JSON.stringify({ correct: false, message: "Lab not found." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const isCorrect = lab.flag === submitted_flag.trim();

    // Always record submission (wrong ones too)
    await adminClient.from("submissions").insert({
      user_id: userId,
      lab_id,
      lab_instance_id: instance_id,
      submitted_flag: submitted_flag.trim(),
      is_correct: isCorrect,
    });

    if (!isCorrect) {
      return new Response(
        JSON.stringify({ correct: false, message: "Incorrect flag. Try again." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mark instance completed
    await adminClient
      .from("lab_instances")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", instance_id);

    // Check if user already received points for this lab
    const { data: existingCorrect } = await adminClient
      .from("submissions")
      .select("id")
      .eq("user_id", userId)
      .eq("lab_id", lab_id)
      .eq("is_correct", true)
      .limit(2);

    // If this is the first correct submission (count === 1, the one we just inserted)
    let pointsAwarded = 0;
    if (existingCorrect && existingCorrect.length <= 1) {
      const { data: profile } = await adminClient
        .from("profiles")
        .select("points")
        .eq("user_id", userId)
        .single();

      if (profile) {
        pointsAwarded = lab.points;
        await adminClient
          .from("profiles")
          .update({ points: profile.points + pointsAwarded })
          .eq("user_id", userId);
      }
    }

    return new Response(
      JSON.stringify({
        correct: true,
        message: `Correct! ${pointsAwarded > 0 ? `You earned ${pointsAwarded} points.` : "Lab already solved previously."}`,
        points: pointsAwarded,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
