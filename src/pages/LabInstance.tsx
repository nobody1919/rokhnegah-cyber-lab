import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Flag, Lightbulb, Eye, EyeOff, CheckCircle2, XCircle, ArrowLeft, Clock, Rocket } from "lucide-react";
import LabEnvironment from "@/components/LabEnvironment";

interface Lab {
  id: string;
  title: string;
  title_fa: string | null;
  description: string | null;
  objective: string | null;
  difficulty: string;
  points: number;
  hint: string | null;
  solution: string | null;
  lab_type: string | null;
  category_id: string;
}

interface Instance {
  id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  lab_id: string;
  user_id: string;
}

const diffBadge: Record<string, string> = {
  beginner: "bg-cyber-green/10 text-cyber-green border-cyber-green/30",
  intermediate: "bg-cyber-yellow/10 text-cyber-yellow border-cyber-yellow/30",
  advanced: "bg-cyber-red/10 text-cyber-red border-cyber-red/30",
};

const diffLabel: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function LabInstance() {
  const { labId, instanceId } = useParams();
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lab, setLab] = useState<Lab | null>(null);
  const [instance, setInstance] = useState<Instance | null>(null);
  const [flagInput, setFlagInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (!labId || !instanceId || !user) return;

    const load = async () => {
      setLoading(true);

      // Load instance first - verify ownership
      const { data: inst } = await supabase
        .from("lab_instances")
        .select("*")
        .eq("id", instanceId)
        .eq("lab_id", labId)
        .single();

      if (!inst || inst.user_id !== user.id) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }
      setInstance(inst as Instance);

      // Load lab (without flag - RLS prevents flag exposure if set up, but we also clear it)
      const { data: labData } = await supabase
        .from("labs")
        .select("id, title, title_fa, description, objective, difficulty, points, hint, solution, lab_type, category_id")
        .eq("id", labId)
        .single();

      if (labData) setLab(labData as Lab);

      // Update last_seen_at
      await supabase
        .from("lab_instances")
        .update({ last_seen_at: new Date().toISOString() })
        .eq("id", instanceId);

      setLoading(false);
    };

    load();
  }, [labId, instanceId, user]);

  const submitFlag = async () => {
    if (!user || !instance || !labId || !flagInput.trim()) return;
    setSubmitting(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("submit-flag", {
        body: {
          instance_id: instance.id,
          lab_id: labId,
          submitted_flag: flagInput.trim(),
        },
      });

      if (error) {
        toast({ title: "Error", description: "Failed to submit flag.", variant: "destructive" });
      } else if (data?.correct) {
        setResult("correct");
        setInstance({ ...instance, status: "completed" });
        await refreshProfile();
        toast({ title: "🎉 Congratulations!", description: data.message });
      } else {
        setResult("wrong");
        toast({ title: "❌ Wrong Flag", description: data?.message || "Try again.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Network error.", variant: "destructive" });
    }
    setSubmitting(false);
  };

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

  if (unauthorized || !lab || !instance) {
    return (
      <div className="min-h-screen cyber-gradient cyber-grid">
        <Navbar />
        <div className="container mx-auto max-w-3xl px-4 py-10 text-center">
          <p className="text-muted-foreground mb-4">Instance not found or access denied.</p>
          <Button variant="outline" onClick={() => navigate("/labs")}>Back to Labs</Button>
        </div>
      </div>
    );
  }

  const isCompleted = instance.status === "completed";

  return (
    <div className="min-h-screen cyber-gradient cyber-grid">
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Back link */}
          <Button variant="ghost" size="sm" onClick={() => navigate(`/lab/${labId}`)} className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Lab
          </Button>

          {/* Header */}
          <div className="cyber-card p-6 mb-6">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold">{lab.title}</h1>
                {lab.title_fa && <p className="text-muted-foreground">{lab.title_fa}</p>}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className={diffBadge[lab.difficulty]}>
                  {diffLabel[lab.difficulty] ?? lab.difficulty}
                </Badge>
                <Badge variant="outline" className="border-primary/30 text-primary font-mono">
                  {lab.points} pts
                </Badge>
                {isCompleted ? (
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                    ✓ Solved
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-cyber-yellow/30 text-cyber-yellow">
                    <Clock className="h-3 w-3 mr-1" /> Active
                  </Badge>
                )}
              </div>
            </div>
            {lab.description && <p className="text-muted-foreground text-sm">{lab.description}</p>}
          </div>

          {/* Objective */}
          {lab.objective && (
            <div className="cyber-card p-5 mb-4">
              <h2 className="mb-2 text-sm font-bold text-primary flex items-center gap-2">
                <Flag className="h-4 w-4" /> Objective
              </h2>
              <p className="text-sm text-foreground">{lab.objective}</p>
            </div>
          )}

          {/* Submit Flag */}
          <div className="cyber-card p-6 mb-4">
            {isCompleted ? (
              <div className="flex items-center gap-3 text-accent">
                <CheckCircle2 className="h-6 w-6" />
                <div>
                  <p className="font-bold">You have successfully solved this lab!</p>
                  <p className="text-sm text-muted-foreground">You can view the solution below.</p>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="mb-3 text-sm font-bold text-primary flex items-center gap-2">
                  <Flag className="h-4 w-4" /> Submit Flag
                </h2>
                <div className="flex gap-2">
                  <Input
                    value={flagInput}
                    onChange={(e) => setFlagInput(e.target.value)}
                    placeholder="FLAG{...}"
                    className="font-mono bg-background/50 border-border/50 focus:border-primary"
                    dir="ltr"
                    onKeyDown={(e) => e.key === "Enter" && submitFlag()}
                  />
                  <Button onClick={submitFlag} disabled={submitting || !flagInput.trim()} className="glow-primary shrink-0">
                    {submitting ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </div>
                {result === "wrong" && (
                  <div className="mt-3 flex items-center gap-2 text-destructive text-sm">
                    <XCircle className="h-4 w-4" />
                    Incorrect flag. Try again.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Lab Environment */}
          {!isCompleted && (
            <div className="mb-4">
              <LabEnvironment
                labType={lab.lab_type}
                onFlagFound={(flag) => setFlagInput(flag)}
              />
            </div>
          )}

          {/* Hint */}
          {lab.hint && (
            <div className="cyber-card p-5 mb-4">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex w-full items-center justify-between text-sm font-bold text-cyber-yellow"
              >
                <span className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Hint
                </span>
                {showHint ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              {showHint && <p className="mt-3 text-sm text-foreground/80 font-mono">{lab.hint}</p>}
            </div>
          )}

          {/* Solution */}
          {lab.solution && isCompleted && (
            <div className="cyber-card p-5">
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="flex w-full items-center justify-between text-sm font-bold text-accent"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Solution
                </span>
                {showSolution ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              {showSolution && <p className="mt-3 text-sm text-foreground/80 font-mono">{lab.solution}</p>}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
