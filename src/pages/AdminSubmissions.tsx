import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { FileCheck, ArrowLeft, CheckCircle2, XCircle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Submission {
  id: string;
  created_at: string;
  is_correct: boolean;
  submitted_flag: string;
  user_id: string;
  lab_id: string;
}

interface Profile {
  user_id: string;
  username: string | null;
}

interface Lab {
  id: string;
  title: string;
}

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [profiles, setProfiles] = useState<Map<string, string>>(new Map());
  const [labs, setLabs] = useState<Map<string, string>>(new Map());
  const [filter, setFilter] = useState<"all" | "correct" | "wrong">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [{ data: subs }, { data: profs }, { data: labData }] = await Promise.all([
      supabase.from("submissions").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("profiles").select("user_id, username"),
      supabase.from("labs").select("id, title"),
    ]);

    setSubmissions((subs as Submission[]) ?? []);

    const pMap = new Map<string, string>();
    ((profs as Profile[]) ?? []).forEach((p) => pMap.set(p.user_id, p.username ?? "Anonymous"));
    setProfiles(pMap);

    const lMap = new Map<string, string>();
    ((labData as Lab[]) ?? []).forEach((l) => lMap.set(l.id, l.title));
    setLabs(lMap);

    setLoading(false);
  };

  const filtered = filter === "all"
    ? submissions
    : filter === "correct"
    ? submissions.filter((s) => s.is_correct)
    : submissions.filter((s) => !s.is_correct);

  if (loading) {
    return (
      <div className="min-h-screen cyber-gradient cyber-grid">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cyber-gradient cyber-grid">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/admin" className="text-sm text-primary hover:underline mb-4 inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Back to Admin
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
            <FileCheck className="h-6 w-6 text-cyber-yellow" />
            Submissions
            <span className="text-sm font-normal text-muted-foreground ml-2">({filtered.length})</span>
          </h1>
        </motion.div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {(["all", "correct", "wrong"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className={`text-xs gap-1 ${filter === f ? "glow-primary" : "border-border/50"}`}
            >
              {f === "correct" && <CheckCircle2 className="h-3 w-3" />}
              {f === "wrong" && <XCircle className="h-3 w-3" />}
              {f === "all" && <Filter className="h-3 w-3" />}
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        <div className="cyber-card overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-border/50 bg-secondary/20 text-xs font-bold text-muted-foreground">
            <div className="col-span-1">Status</div>
            <div className="col-span-2">User</div>
            <div className="col-span-3">Lab</div>
            <div className="col-span-3">Flag</div>
            <div className="col-span-3">Time</div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {filtered.map((sub, i) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-border/30 last:border-0 hover:bg-secondary/10 transition-colors text-xs"
              >
                <div className="col-span-1">
                  {sub.is_correct ? (
                    <CheckCircle2 className="h-4 w-4 text-cyber-green" />
                  ) : (
                    <XCircle className="h-4 w-4 text-cyber-red" />
                  )}
                </div>
                <div className="col-span-2 truncate font-medium">{profiles.get(sub.user_id) ?? "Unknown"}</div>
                <div className="col-span-3 truncate text-muted-foreground">{labs.get(sub.lab_id) ?? "Unknown"}</div>
                <div className="col-span-3 truncate font-mono text-foreground/80">{sub.submitted_flag}</div>
                <div className="col-span-3 text-muted-foreground">{new Date(sub.created_at).toLocaleString()}</div>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-12">No submissions found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
